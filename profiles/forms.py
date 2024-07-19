from django import forms
from .models import UserProfile
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field

class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=False, label='First Name')
    last_name = forms.CharField(max_length=30, required=False, label='Last Name')
    email = forms.EmailField(required=False, label='Email')

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
        self.helper.layout = Layout(
            'first_name',
            'last_name',
            'email',
            'username',
            'profile_image',
            'gender',
            'custom_gender',
            Submit('submit', 'Save changes', css_class='btn btn-primary')
        )
        # Prepopulate the user fields
        if 'instance' in kwargs:
            user = kwargs['instance'].user
            self.fields['first_name'].initial = user.first_name
            self.fields['last_name'].initial = user.last_name
            self.fields['email'].initial = user.email