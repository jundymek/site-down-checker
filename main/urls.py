from django.urls import path
from .views import index, url_details, url_delete
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', index, name='index'),
    path('details/<int:id>/', url_details, name='details'),
    path('delete/<int:id>/', url_delete, name='delete'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

]
