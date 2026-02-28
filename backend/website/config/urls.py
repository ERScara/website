from django.contrib import admin
from django.urls import path, include
from config.search_views import GlobalSearchView
from rest_framework import routers
from drf_spectacular.views import SpectacularAPIView

router = routers.DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/', include('direct_messages.urls')),
    path('api/', include('communities.urls')),
    path('api/', include('posts.urls')),
    path('api/search/', GlobalSearchView.as_view(), name='global_search'),
    path('api/schema', SpectacularAPIView.as_view(), name='schema')
]