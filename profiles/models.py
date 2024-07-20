from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('', 'Select Gender'),
        ('male', 'Male'),
        ('female', 'Female'),
        ('non_binary', 'Non-binary'),
        ('genderqueer', 'Genderqueer'),
        ('agender', 'Agender'),
        ('bigender', 'Bigender'),
        ('pangender', 'Pangender'),
        ('genderfluid', 'Genderfluid'),
        ('two_spirit', 'Two-spirit'),
        ('prefer_not_to_say', 'Prefer not to say'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=150, unique=True)
    profile_image = CloudinaryField('profile_image')
    gender = models.CharField(max_length=32, choices=GENDER_CHOICES, blank=True)
    custom_gender = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.user.username
    
    def save(self, *args, **kwargs):
        if self.gender != 'other':
            self.custom_gender = ''
        super(UserProfile, self).save(*args, **kwargs)