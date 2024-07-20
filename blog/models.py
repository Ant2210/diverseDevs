from django.db import models
from cloudinary.models import CloudinaryField

class Post(models.Model):
    POST_TYPE_CHOICES = [
        ('admin', 'Admin Post'),
        ('community', 'Community Post'),
    ]
    
    title = models.CharField(max_length=200)
    image = CloudinaryField('image')
    content = models.TextField()
    post_type = models.CharField(max_length=10, choices=POST_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title