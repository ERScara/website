from django.contrib import admin
from django.contrib.auth.models import User
from .models import SupportTicket

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'created_at', 'resolved')
    list_filter = ('resolved', 'created_at')
    search_fields = ('username', 'email', 'reason')

    actions = ['eliminar_usuario_asociado']

    @admin.action(description="Eliminar usuario de este ticket")
    def eliminar_usuario_asociado(self, request, queryset):
        for ticket in queryset:
            try:
                user = User.objects.get(username=ticket.username)
                user.delete()

                ticket.resolved = True
                ticket.save()

                self.message_user(request, f"Usuario {ticket.username} eliminado correctamente.")
            except User.DoesNotExist:
                self.message_user(request, f"El ususario {ticket.username} ya no existe")