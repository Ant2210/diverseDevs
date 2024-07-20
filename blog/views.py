from django.shortcuts import render
from django.urls import reverse
from .models import Post

def blog(request):
    """ A view to return the blog.html page """
    context = {
        'admin_posts_url': reverse('admin_posts'),
        'community_posts_url': reverse('community_posts'),
    }
    return render(request, 'blog/blog.html', context)

def admin_posts(request):
    admin_posts = Post.objects.filter(post_type='admin')
    return render(request, 'blog/admin_posts.html', {'posts': admin_posts})

def community_posts(request):
    community_posts = Post.objects.filter(post_type='community')
    return render(request, 'blog/community_posts.html', {'posts': community_posts})