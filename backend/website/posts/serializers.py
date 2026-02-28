from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_username=serializers.SerializerMethodField()
    total_likes=serializers.ReadOnlyField()
    total_dislikes=serializers.ReadOnlyField()
    user_vote=serializers.SerializerMethodField()
    has_reported=serializers.SerializerMethodField()
    is_reported_by_anyone= serializers.SerializerMethodField()
    comment_count=serializers.SerializerMethodField()

    class Meta:
        model=Post
        fields = [
            'id', 'community', 'title', 'content', 'prompt',
            'target_model', 'author_username', 'total_likes',
            'total_dislikes', 'user_vote', 'has_reported',
            'is_reported_by_anyone', 'comment_count',
            'created_at', 'updated_at', 'is_deleted'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_deleted']
    
    def get_author_username(self, obj):
        if obj.author and obj.author.is_active:
            return obj.author.username
        return "Usuario Eliminado"
    
    def get_user_vote(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            if obj.likes.filter(id=user.id).exists():
                return 'like'
            if obj.dislikes.filter(id=user.id).exists():
                return 'dislike'
        return None
    
    def get_has_reported(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return obj.red_flags.filter(id=user.id).exists()
        return False
    
    def get_is_reported_by_anyone(self, obj):
        return obj.red_flags.exists()
    
    def get_comment_count(self, obj):
        return obj.comments.filter(is_deleted=False).count()