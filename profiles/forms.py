from django import forms
from .models import UserProfile
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['username', 'profile_image', 'gender', 'custom_gender']
        widgets = {
            'gender': forms.Select(choices=UserProfile.GENDER_CHOICES, attrs={'class': 'form-select'}),
        }
        labels = {
            'profile_image': 'Profile Image',
            'custom_gender': 'If other, please specify',
        }

    def __init__(self, *args, **kwargs):
        super(UserProfileForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'Save changes'))