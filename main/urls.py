from django.contrib.auth.decorators import login_required
from django.urls import path
from .views import IndexView, url_delete, url_refresh, modify_settings, registration_view, \
    AddSiteToCheckView, check_all, update_email, SiteDetail
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', login_required(IndexView.as_view()), name='index'),
    path('add/', login_required(AddSiteToCheckView.as_view()), name='add'),
    path('update_email/', update_email, name='update_email'),
    path('check_all/', check_all, name='check_all'),
    path('details/<int:pk>/', login_required(SiteDetail.as_view()), name='details'),
    path('delete/<int:pk>/', url_delete, name='delete'),
    path('refresh/<int:pk>/', url_refresh, name='refresh'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', registration_view, name='register'),
    path('modify_settings/', modify_settings, name='modify_settings'),

]
