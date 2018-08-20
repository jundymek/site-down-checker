from django import forms
from .models import SiteToCheck


class WwwAddressForm(forms.Form):
    www_address = forms.CharField(label='WWW address', max_length=200)


class SiteToCheckForm(forms.ModelForm):
    class Meta:
        model = SiteToCheck
        fields = ['url',]
        labels = {
            "url": "Adres url do dodania",
        }
