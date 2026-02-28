from django.db import models
from django.contrib.auth.models import User

class Community(models.Model):
    CATEGORIES= [
        ('advanced', 'Avanzado'),
        ('design', 'Diseño'),
        ('common', 'Sala Común'),
        ('modelos', 'Modelos'),
    ]
    STATUS=[
        ('pending', 'Pendiente'),
        ('approved', 'Aprobada'),
        ('rejected', 'Rechazado'),
        ('relocated', 'Reubicada'),
    ]
    name= models.CharField(max_length=100, unique=True)
    description=models.TextField()
    category=models.CharField(max_length=50,choices=CATEGORIES)
    owner=models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='owned_communities')
    created_at=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20, choices=STATUS, default='pending')
    reviewed_by=models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_communities')
    reviewed_at=models.DateTimeField(null=True, blank=True)
    relocation_reason=models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering=['-created_at']
        verbose_name_plural="Communities"

class Membership(models.Model):
    ROLES=[
        ('owner', 'Creador'),
        ('moderator', 'Moderador'),
        ('member', 'Miembro')
    ]
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    community=models.ForeignKey(Community, on_delete=models.CASCADE, related_name='memberships')
    role=models.CharField(max_length=20, choices=ROLES, default='member')
    joined_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'community']
        ordering= ['joined_at']

    def __str__(self):
        return f"{self.user.username} - {self.community.name} - ({self.role})"
