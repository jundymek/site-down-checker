from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import SiteToCheckForm
from .models import SiteToCheck
from .calculations import SiteDownChecker


def index(request):
    sites = SiteToCheck.objects.all()
    if request.method == 'POST':
        form = SiteToCheckForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            if SiteToCheck.objects.filter(url=cd['url']).exists():
                messages.info(request, 'Taka strona już istnieje w bazie')
                return render(request, 'index.html', {'form': form, 'sites': sites})
            else:
                data = SiteDownChecker(cd['url']).status()
                messages.info(request, data)
            return render(request, 'index.html', {'form': form, 'data': data, 'sites': sites})
    else:
        form = SiteToCheckForm
        if request.GET.get('mybtn'):
            for url in sites:
                SiteDownChecker(url).status()
            return redirect('/')

    return render(request, 'index.html', {'form': form, 'sites': sites})
