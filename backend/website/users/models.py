from django.db import models

class Auth(models.Model):
    username = models.CharField(max_length= 40, verbose_name="Usuario")
    email = models.CharField(max_length=40, verbose_name="Correo Electrónico")
    password = models.CharField(max_length= 40, verbose_name="Contraseña")
    
    def __str__(self):
        return self.name

class SupportTicket(models.Model):
    username = models.CharField(max_length=40)
    email= models.EmailField()
    reason= models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved= models.BooleanField(default=False)

    def __str__(self):
        return f"Baja del usuario {self.username}"