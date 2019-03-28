"""site-down-checker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from main.views import Custom400Handler, Custom404Handler, Custom500Handler
from main import views

handler400 = Custom400Handler.as_view()
handler404 = Custom404Handler.as_view()
handler500 = Custom500Handler.as_view()

router = routers.DefaultRouter()
router.register(r'sites', views.SiteToCheckViewSet)

urlpatterns = [
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]
