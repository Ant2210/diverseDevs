from django.shortcuts import render

# Create your views here.
def blog(request):
    """ A view to return the blog.html page """
    return render(request, 'blog/blog.html')