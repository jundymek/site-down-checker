from django import forms


class WwwAddressForm(forms.Form):
    www_address = forms.CharField(label='WWW address', max_length=200)
