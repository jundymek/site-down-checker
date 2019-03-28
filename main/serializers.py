from rest_framework import serializers

from .models import SiteToCheck


class SiteToCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteToCheck
        fields = '__all__'
