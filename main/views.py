from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .forms import SiteToCheckForm
from .models import SiteToCheck
from .calculations import SiteDownChecker, my_cron_job


def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        # Redirect to a success page.

        render(request, 'login.html')
    else:
        # Return an 'invalid login' error message.
        render(request, 'login.html')


def index(request):
    if not request.user.is_authenticated:
        return redirect('login/')
    sites = SiteToCheck.objects.all()
    if request.method == 'POST':
        form = SiteToCheckForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            if SiteToCheck.objects.filter(url=cd['url']).exists():
                messages.error(request, 'The page already exists in database')
            else:
                data = SiteDownChecker(cd['url']).status()
                success_message_text = f"The page hes been added. \n\nStatus: {data['last_status']}, Response time: {data['last_response_time']}"
                messages.success(request, success_message_text)
        return redirect('/')
    else:
        form = SiteToCheckForm
        if request.GET.get('check_all_btn'):
            # my_cron_job()
            for url in sites:
                SiteDownChecker(url).status()
            return redirect('/')

    return render(request, 'index.html', {'form': form, 'sites': sites})


# TODO Sort in descending order by date in template
@login_required
def url_details(request, id):
    url = get_object_or_404(SiteToCheck, pk=id)
    bad_data = url.bad_data.splitlines()
    print(bad_data)
    if request.GET.get('check_btn'):
        url = SiteDownChecker(url).status()
        return render(request, 'details.html', {'url': url, 'bad_data': bad_data})

    return render(request, 'details.html', {'url': url, 'bad_data': bad_data})


@login_required
def url_delete(request, id):
    url = get_object_or_404(SiteToCheck, pk=id)

    if request.method == 'GET':
        url.delete()
        return redirect('/')
    return render(request, 'index.html')
