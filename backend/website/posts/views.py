from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer
from comments.models import Comment
from comments.serializers import CommentSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class=PostSerializer
    permission_classes= [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(is_deleted=False).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author is not request.user and not request.user.is_superuser:
            return Response({
                "detail": "No tienes poermiso para eliminar este post."
            }, status=status.HTTP_403_FORBIDDEN)
        post.is_deleted = True
        post.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if post.dislikes.filter(id=user.id).exists():
            post.dislikes.remove(user)
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
        else:
            post.likes.add(user)
        return Response({
            'total_likes': post.total_likes,
            'total_dislikes': post.total_dislikes
        })

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk=None):
        post = self.get_object()
        user = request.user
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
        if post.dislikes.filter(id=user.id).exists():
            post.dislikes.remove(user)
        else:
            post.dislikes.add(user)
        return Response({
            'total_likes': post.total_likes,
            'total_dislikes': post.total_dislikes
        })

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post= self.get_object()
        comments=Comment.objects.filter(post=post, is_deleted=False, parent=None)
        serializer = CommentSerializer(comments, many=True, context={"request": request})
        return Response(serializer.data)


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def report(self, request, pk=None):
        post=self.get_object()
        user_reporting= request.user
        if post.author == user_reporting:
            return Response({"detail": "No puedes reportar tu propio post."})
        
        post.red_flags.add(user_reporting)
        total_flags=post.red_flags.count()
        post.save()

        return Response({
            'status': 'reportado',
            'current_flags': total_flags
        }, status=200)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def has_reported(self, request, pk=None):
        post= self.get_object()
        user= request.user
        exists= post.red_flags.filter(id=user.id).exists()
        return Response({"has_reported": exists})


