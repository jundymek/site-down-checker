from django.contrib.auth.models import User
from rest_framework import serializers

from .models import SiteToCheck


class SiteToCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteToCheck
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

