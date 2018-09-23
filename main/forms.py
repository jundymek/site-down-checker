from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import SiteToCheck


class WwwAddressForm(forms.Form):
    www_address = forms.CharField(label='WWW address', max_length=200)


class SiteToCheckForm(forms.ModelForm):
    class Meta:
        model = SiteToCheck
        fields = ['url', ]
        labels = {
            "url": "",
        }
        widgets = {
            'url': forms.TextInput(attrs={'placeholder': 'Add new url here'}),
        }


class MyUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text="Every error messages will be sent to this email address")

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")
        labels = {
            "email": "Every error messages will be sent to this email address",
        }

    def save(self, commit=True):
        user = super(MyUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user
