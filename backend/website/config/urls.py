from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from volcanes.views import VolcanoViewSet

router = routers.DefaultRouter()
router.register(r'volcanes', VolcanoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('users.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/', include('direct_messages.urls'))
]