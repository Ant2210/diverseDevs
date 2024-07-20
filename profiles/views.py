from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout
from allauth.account.views import SignupView
from .forms import UserProfileForm, CustomSignupForm

class CustomSignupView(SignupView):
    form_class = CustomSignupForm

@login_required
def profile(request):
    user_profile = request.user.userprofile
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=user_profile)
        if form.is_valid():
            user = form.instance.user
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.email = form.cleaned_data['email']
            user.save()
            try:
                form.save()
                messages.success(request, 'Your profile has been updated successfully!')
                return redirect('profile')
            except Exception as e:
                print(f"Error saving profile: {e}")
                messages.error(request, f'Error saving profile: {e}')
        else:
            print(f"Form errors: {form.errors}")
            messages.error(request, 'Please correct the errors below.')
    else:
        form = UserProfileForm(instance=user_profile)
    
    return render(request, 'profiles/profile.html', {'form': form, 'user': request.user})


@login_required
def delete_profile(request):
    if request.method == 'POST':
        request.user.userprofile.delete()
        request.user.delete()
        messages.success(request, 'Your profile has been deleted successfully.')
        logout(request)
        return redirect('home')
    
    return render(request, 'profiles/delete_profile.html')