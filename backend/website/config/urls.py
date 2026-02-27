from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from drf_spectacular.views import SpectacularAPIView

router = routers.DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/', include('direct_messages.urls')),
    path('api/schema', SpectacularAPIView.as_view(), name='schema')
]