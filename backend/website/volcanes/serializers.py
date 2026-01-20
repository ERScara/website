from rest_framework import serializers
from .models import Volcano

class VolcanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volcano
        fields = '__all__' 