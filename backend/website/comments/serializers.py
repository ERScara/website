from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    date = serializers.DateTimeField(read_only=True)
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(),
        required=False,
        allow_null=True,
    )
    has_active_replies = serializers.ReadOnlyField()
    total_likes = serializers.ReadOnlyField()
    total_dislikes = serializers.ReadOnlyField()
    has_reported = serializers.SerializerMethodField()
    is_reported_by_anyone = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id','username', 'message', 'date', 'parent', 'is_deleted', 'has_active_replies', 'total_likes', 'total_dislikes', 'has_reported', 'is_reported_by_anyone']
        read_only_fields = ['id','date']

    def get_username(self, obj):
        if not obj.author or not obj.author.is_active:
            return "Usuario Eliminado"
        return obj.author.username
    
    def get_is_author_active(self, obj):
        return obj.author is not None or (obj.username and obj.username != "")

    def get_has_reported(self, obj):
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return obj.red_flags.filter(id=user.id).exists()
        return False 
    
    def get_is_reported_by_anyone(self, obj):
        return obj.red_flags.exists()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_deleted:
            data['message'] = "Este comentario ha sido eliminado por el usuario o bien ha sido moderado."
            data ['total_likes'] = 0
            data ['total_dislikes'] = 0
        return data

    def validate_message(self, value):
        if not value:
            return value
        words = value.split()
        if len(words) >= 500:
            raise serializers.ValidationError("El comentario no puede exceder las 500 palabras.")
        
        unique_words = len(set(p.lower() for p in words))
        if len(words) > 10 and unique_words < (len(words) / 2):
            raise serializers.ValidationError("Alerta de Spam: contenido demasiado repetitivo.")
        
        return value