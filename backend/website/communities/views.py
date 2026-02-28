from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Community, Membership
from .serializers import CommunitySerializer, MembershipSerializer

class CommunityViewSet(viewsets.ModelViewSet):
    serializer_class=CommunitySerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_superuser:
            return Community.objects.all()
        return Community.objects.filter(status='approved')

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