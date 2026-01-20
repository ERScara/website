from django.db import models
from django.contrib.auth.models import User

class Comment(models.Model):
    username = models.CharField(max_length=40)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    capitulo_nro= models.IntegerField(default=1)
    parent= models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies',
    )
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null= True,
        blank= True,
    )
    is_deleted = models.BooleanField(default=False)
    likes = models.ManyToManyField(User, related_name='likes', blank=True)
    dislikes = models.ManyToManyField(User, related_name='dislikes', blank=True)
    
    @property
    def has_active_replies(self):
        """Retorna True si el comentario tiene respuestas que no han sido borradas."""
        return self.replies.filter(is_deleted=False).exists()
    
    @property
    def total_likes(self):
        return self.likes.count()
    
    @property
    def total_dislikes(self):
        return self.dislikes.count()

    def delete(self):
        """Sobreescribimos el borrado físico por uno lógico."""
        self.is_deleted = True
        self.save()
        Comment.objects.filter(parent=self).update(is_deleted=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return "{} - {}".format(self.username,  self.date)
