from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'post_type', 'created_at')
    list_filter = ('post_type', 'created_at')
    search_fields = ('title', 'header1', 'content1', 'header2', 'content2', 'header3', 'content3')
    fields = (
        'title', 
        'image1', 'header1', 'content1', 
        'image2', 'header2', 'content2', 
        'image3', 'header3', 'content3', 
        'image4', 'header4', 'content4',
        'post_type', 
        'author'
    )