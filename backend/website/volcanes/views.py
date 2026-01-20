from rest_framework import viewsets
from .models import Volcano
from .serializers import VolcanoSerializer

class VolcanoViewSet(viewsets.ModelViewSet):
    queryset = Volcano.objects.all()
    serializer_class = VolcanoSerializer