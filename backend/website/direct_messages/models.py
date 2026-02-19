from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    participants= models.ManyToManyField(User, related_name='conversations')
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)
    is_active= models.ManyToManyField(User, related_name='closed_chats', blank=True)
    hidden_for= models.ManyToManyField('auth.User', related_name='stored_chats', blank=True)

    def __str__(self):
        return f"Chat {self.id}"

class Message(models.Model):
    conversation= models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender= models.ForeignKey(User, on_delete=models.CASCADE)
    text= models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read= models.BooleanField(default=False)

class ChatClear(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    cleared_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'conversation')

