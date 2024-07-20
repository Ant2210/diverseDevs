from django.urls import path
from .views import blog, admin_posts, community_posts

urlpatterns = [
    path('', blog, name='blog'),
    path('admin-posts/', admin_posts, name='admin_posts'),
    path('community-posts/', community_posts, name='community_posts'),
]