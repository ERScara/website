from django.db import models

class Volcano(models.Model):
    name = models.CharField(max_length= 100, verbose_name="Nombre del Volcán")
    location = models.CharField(max_length=200, verbose_name="Ubicación")
    height = models.IntegerField(verbose_name = 'Altura')
    unit = models.CharField(max_length=10, default='m', verbose_name="Unidad")
    type = models.CharField(max_length=100, verbose_name='Tipo de Volcán')
    magma = models.CharField(max_length=100, verbose_name="Tipo de Magma")
    eruptions = models.TextField(verbose_name="Historial de Erupciones")
    comment = models.TextField(blank=True, null=True, verbose_name="Comentarios")

    def __str__(self):
        return self.name