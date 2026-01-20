from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions
from .serializers import CommentSerializer
from .models import Comment

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    username = request.data.get('username')
    message = request.data.get('message')

    if not message:
        return Response({'error': 'El mensaje está vacío'}, status=400)
    
    Comment.objects.create(username=username, message=message)
    return Response({'message', 'Comentario publicado'}, status=201)

class IsAuthorOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and request.user.is_superuser:
            return True
        return obj.author == request.user
    
class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-date')
    serializer_class = CommentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, username=self.request.user.username)

    def perform_destroy(self, instance):
        instance.delete()

    def get_queryset(self):
        cap_id = self.request.query_params.get('capitulo')
        queryset = Comment.objects.all().prefetch_related('replies')
        if cap_id:
            queryset = queryset.filter(capitulo_nro=cap_id)
        return queryset.order_by('-date')
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_like(self, request, pk=None):
        try:
            comment = self.get_object()
            user = request.user
            if comment.likes.filter(id=user.id).exists():
                comment.likes.remove(user)
                action = "removed"
            else:
                comment.likes.add(user)
                comment.dislikes.remove(user)
                action="added"
            return Response({'status':'success', 'action': action, 'total_likes': comment.total_likes, 'total_dislikes': comment.total_dislikes})

        except Exception as e:
            return Response ({'error': str(e)}, status=404)
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_dislike(self, request, pk=None):
        try:
            comment = self.get_object()
            user = request.user
            if comment.dislikes.filter(id=user.id).exists():
                comment.dislikes.remove(user)
                action = "removed"
            else:
                comment.dislikes.add(user)
                comment.likes.remove(user)
                action="added"
            return Response({'status':'success', 'action': action, 'total_likes': comment.total_likes, 'total_dislikes': comment.total_dislikes})

        except Exception as e:
            return Response ({'error': str(e)}, status=404)
        



 
