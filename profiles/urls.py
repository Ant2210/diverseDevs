from django.urls import path, include
from . import views
from .views import CustomSignupView

urlpatterns = [
    path('', views.profile, name='profile'),
    path('profile/delete/', views.delete_profile, name='delete_profile'),
    path('signup/', CustomSignupView.as_view(), name='account_signup'),
    path('', include('allauth.urls')),
]