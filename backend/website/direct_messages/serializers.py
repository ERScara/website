from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Conversation, Message

class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'is_superuser']

class MessageSerializer(serializers.ModelSerializer):
    is_me= serializers.SerializerMethodField()
    sender_name = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_name', 'text', 'created_at', 'is_me', 'is_read']

    def get_is_me(self, obj):
        scope = self.context.get('request')
        if isinstance(scope, dict):
            user = scope.get('user')
        else:
            user = getattr(scope, 'user', None)
        if user and user.is_authenticated:
            return obj.sender_id == user.id
        return False
    
class ConversationSerializer(serializers.ModelSerializer):
    participants = ChatUserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'last_message', 'updated_at', 'unread_count']

    def get_last_message(self, obj):
        last = obj.messages.last()
        return last.text if last else None
    
    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()