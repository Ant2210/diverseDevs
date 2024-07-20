from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Post
from profiles.models import UserProfile
from .forms import PostForm

def blog(request):
    """ A view to return the blog.html page """
    context = {
        'admin_posts_url': reverse('admin_posts'),
        'community_posts_url': reverse('community_posts'),
    }
    if request.user.is_authenticated:
        context['form'] = PostForm()
    return render(request, 'blog/blog.html', context)

def admin_posts(request):
    admin_posts = Post.objects.filter(post_type='admin')
    return render(request, 'blog/admin_posts.html', {'posts': admin_posts})

def community_posts(request):
    community_posts = Post.objects.filter(post_type='community')
    return render(request, 'blog/community_posts.html', {'posts': community_posts})

@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = UserProfile.objects.get(user=request.user)
            post.post_type = 'community'  # Set post_type to 'community'
            post.save()
            messages.success(request, 'You have successfully contributed to our blog! Please see the community posts tab to view your contribution!')
            return redirect('blog')
    else:
        form = PostForm()
    return render(request, 'blog/create_post.html', {'form': form})