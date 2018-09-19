from django.urls import path
from .views import index, url_details, url_delete, url_refresh, modify_settings
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', index, name='index'),
    path('details/<int:pk>/', url_details, name='details'),
    path('delete/<int:pk>/', url_delete, name='delete'),
    path('refresh/<int:pk>/', url_refresh, name='refresh'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('modify_settings/', modify_settings, name='modify_settings'),

]
