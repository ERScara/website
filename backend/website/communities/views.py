from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Community, Membership
from .serializers import CommunitySerializer, MembershipSerializer

class CommunityViewSet(viewsets.ModelViewSet):
    serializer_class=CommunitySerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_queryset = Community.objects.all()

        if user.is_authenticated and user.is_superuser:
            return base_queryset
        if user.is_authenticated:
            return base_queryset.filter(Q(status='approved') | Q(owner=user)).distinct()
        return base_queryset.filter(status='approved')

    def retrieve(self, request, *args, **kwargs):
        community = Community.objects.filter(pk=kwargs.get('pk')).first()
        if not community:
            return Response({'detail': 'Comunidad no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        can_view = (
            user.is_superuser
            or community.status == 'approved'
            or community.owner_id == user.id
        )
        if not can_view:
            return Response({'detail': 'No tienes permiso para ver esta comunidad.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(community)
        return Response(serializer.data)

    def perform_create(self, serializer):
        community=serializer.save(owner=self.request.user, status='pending')
        Membership.objects.create(
            user=self.request.user,
            community=community,
            role='owner'
        )
       
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def pending(self, request):
        communities=Community.objects.filter(status='pending')
        serializer=self.get_serializer(communities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        community = self.get_object()
        membership=Membership.objects.filter(user=request.user, community=community).first()
        if not membership:
            return Response({'detail': 'No eres miembro.'}, status=status.HTTP_400_BAD_REQUEST)
        if membership.role == 'owner':
            return Response({'detail':'El creador no puede abandonar la comunidad.'}, status=status.HTTP_400_BAD_REQUEST)
        membership.delete()
        return Response ({'detail': 'Abandonaste la comunidad.'})

    @action(detail=True, methods=['patch'])
    def relocate(self, request, pk=None):
        community=self.get_object()
        new_category=request.data.get('category')
        reason=request.data.get('relocation_reason', '')
        if not new_category:
            return Response({'detail': 'Debe especificar una categoría.'}, status=status.HTTP_400_BAD_REQUEST)
        community.category=new_category
        community.status='relocated'
        community.relocation_reason=reason
        community.reviewed_by=request.user
        community.reviewed_at=timezone.now()
        community.save()
        return Response({'detail': 'Comunidad reubicada correctamente.'})    

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def review(self, request, pk=None):
        community = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['approved', 'rejected']:
            return Response(
                {'detail': 'Estado inválido. Use approved o rejected.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if community.status not in ['pending', 'relocated']:
            return Response(
                {'detail': 'Esta comunidad ya fue revisada.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        community.status = new_status
        community.reviewed_by = request.user
        community.reviewed_at = timezone.now()
        community.save()

        if new_status == 'approved':
            message = 'Comunidad aprobada correctamente.'
        else:
            message = 'Comunidad rechazada.'
        
        return Response({'detail': message})
