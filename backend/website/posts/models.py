from django.db import models
from django.contrib.auth.models import User
from communities.models import Community

class Post(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts')
    author= models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title= models.CharField(max_length=200, verbose_name="Título")
    content= models.TextField(verbose_name="Descripción del prompt")
    prompt= models.TextField(verbose_name="Prompt")
    target_model=models.CharField(max_length=100, blank=True, verbose_name="Modelo de IA")
    likes= models.ManyToManyField(User, related_name='post_likes', blank=True)
    dislikes= models.ManyToManyField(User, related_name='post_dislikes', blank=True)
    is_deleted= models.BooleanField(default=False)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)
    id_deleted = models.BooleanField(default=False)
    red_flags= models.ManyToManyField(User, related_name='reported_posts')

    @property
    def is_reported_by_anyone(self):
        return self.red_flags.exists()

    @property
    def total_likes(self):
        return self.likes.count()
    
    @property
    def total_dislikes(self):
        return self.dislikes.count()
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering= ['-created_at']