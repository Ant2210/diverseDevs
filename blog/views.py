from django.shortcuts import render, redirect, get_object_or_404
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
    forms = {post.id: PostForm(instance=post) for post in admin_posts}
    return render(request, 'blog/admin_posts.html', {'posts': admin_posts, 'forms': forms})


def community_posts(request):
    community_posts = Post.objects.filter(post_type='community')
    forms = {post.id: PostForm(instance=post) for post in community_posts}
    return render(request, 'blog/community_posts.html', {'posts': community_posts, 'forms': forms})


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


@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if request.user.userprofile != post.author and not request.user.is_superuser:
        messages.error(request, 'You do not have permission to edit this post.')
        return redirect('blog')

    if request.method == 'POST':
        form = PostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Post updated successfully!')
            return redirect('blog')
    else:
        form = PostForm(instance=post)

    return render(request, 'blog/edit_post.html', {'form': form, 'post': post})

@login_required
def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if request.user.userprofile != post.author and not request.user.is_superuser:
        messages.error(request, 'You do not have permission to delete this post.')
        return redirect('blog')

    if request.method == 'POST':
        post.delete()
        messages.success(request, 'Post deleted successfully!')
        return redirect('blog')

    return render(request, 'blog/delete_post.html', {'post': post})