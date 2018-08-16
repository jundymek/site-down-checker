from django.http import HttpResponse
from django.shortcuts import render
from .forms import WwwAddressForm


def index(request):
    if request.method == 'POST':
        form = WwwAddressForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            print(cd)
    else:
        form = WwwAddressForm()

    return render(request, 'index.html', {'form': form})
