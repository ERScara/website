from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    participants= models.ManyToManyField(User, related_name='conversations')
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)
class Message(models.Model):
    conversation= models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender= models.ForeignKey(User, on_delete=models.CASCADE)
    text= models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read= models.BooleanField(default=False)
