from django.db import models
from cloudinary.models import CloudinaryField
from profiles.models import UserProfile

class Post(models.Model):
    POST_TYPE_CHOICES = [
        ('admin', 'Admin Post'),
        ('community', 'Community Post'),
    ]
    
    title = models.CharField(max_length=200)
    image1 = CloudinaryField('image1', null=True)
    header1 = models.CharField(max_length=200, blank=True, null=True)
    content1 = models.TextField(blank=True, null=True)
    image2 = CloudinaryField('image2', null=True)
    header2 = models.CharField(max_length=200, blank=True, null=True)
    content2 = models.TextField(blank=True, null=True)
    image3 = CloudinaryField('image3', null=True)
    header3 = models.CharField(max_length=200, blank=True, null=True)
    content3 = models.TextField(blank=True, null=True)
    image4 = CloudinaryField('image4', null=True)
    header4 = models.CharField(max_length=200, blank=True, null=True)
    content4 = models.TextField(blank=True, null=True)
    post_type = models.CharField(max_length=10, choices=POST_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return self.title