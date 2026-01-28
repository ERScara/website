from django.contrib import admin
from .models import Comment, Report

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'message', 'author', 'date', 'flag_count', 'reported_by')
    
    def flag_count(self, obj):
        return obj.red_flags.count()
    flag_count.short_description = "Reportes"

    def reported_by(self, obj):
        return ", ".join([user.username for user in obj.red_flags.all()])
    reported_by.short_description = "Usuarios que reportaron"