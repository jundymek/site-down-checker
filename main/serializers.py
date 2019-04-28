from django.contrib.auth.models import User
from rest_framework import serializers

from main.calculations import SiteDownChecker
from .models import SiteToCheck


class SiteToCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteToCheck
        fields = '__all__'
        read_only_fields = ('user_name', 'error_msg', 'last_status', 'last_response_time', 'last_check')

    def create(self, validated_data):
        user = self.context['user']
        if SiteToCheck.objects.filter(url=validated_data['url'], user_name=user).exists():
            raise serializers.ValidationError("Already exists")
        data = SiteDownChecker(url=validated_data['url'], user_name=user).status()
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
