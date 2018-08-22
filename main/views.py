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
                messages.error(request, 'Taka strona już istnieje w bazie')
                label_for_modal = 'Uwaga!!!'
                return render(request, 'index.html', {'form': form, 'sites': sites, 'label': label_for_modal})
            else:
                data = SiteDownChecker(cd['url']).status()
                label_for_modal = f"Url: {data['url']} został dodany"
                modal_text = f"Status: {data['last_status']}, Response time: {data['last_response_time']}"
                messages.success(request, modal_text)
            return render(request, 'index.html', {'form': form, 'data': data, 'sites': sites, 'label': label_for_modal})
    else:
        form = SiteToCheckForm
        if request.GET.get('mybtn'):
            for url in sites:
                SiteDownChecker(url).status()
            return redirect('/')

    return render(request, 'index.html', {'form': form, 'sites': sites})

# TODO: add login/logout view
