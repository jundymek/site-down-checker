from django.contrib import admin
from .models import SiteToCheck


@admin.register(SiteToCheck)
class SiteToCheckAdmin(admin.ModelAdmin):
    list_display = ['url', 'last_status', 'last_response_time']
