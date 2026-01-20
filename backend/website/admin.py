from django.contrib import admin
from .models import Volcano

@admin.register(Volcano)
class VolcanoAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'height', 'type')
    search_fields = ('name', 'location')