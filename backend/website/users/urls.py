from django.urls import path
from .views import login_view, register_classes, request_deletion, password_reset_request, password_reset_confirm, search_users

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_classes, name='register'),
    path('support/', request_deletion, name='support'),
    path('password-reset/request/', password_reset_request, name='reset_request'),
    path('password-reset/confirm/', password_reset_confirm, name='reset_confirm'),
    path('search/', search_users, name='search_users'),
]