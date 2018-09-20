import json
from constance import config

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

from .forms import SiteToCheckForm
from .models import SiteToCheck
from .calculations import SiteDownChecker


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
    user = request.user
    sites = SiteToCheck.objects.filter(user=user)
    if request.method == 'POST':
        form = SiteToCheckForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            if SiteToCheck.objects.filter(url=cd['url'], user=user).exists():
                messages.error(request, 'The page already exists in database')
            else:
                data = SiteDownChecker(cd['url'], user=user).status()
                success_message_text = f"The page hes been added. \n\nStatus: {data['last_status']}, Response time: \
                {data['last_response_time']}"
                messages.success(request, success_message_text)
        return redirect('/')
    else:
        form = SiteToCheckForm
        if request.GET.get('check_all_btn'):
            for url in sites:
                SiteDownChecker(url, user).status()
            return redirect('/')
    return render(request, 'index.html', {'form': form, 'sites': sites})


@login_required
def url_details(request, pk):
    url = get_object_or_404(SiteToCheck, pk=pk, user=request.user)
    if request.GET.get('check_btn'):
        data = SiteDownChecker(url, user=request.user).status()
        success_message_text = f"{url} Status: {data['last_status']}, Response time: {data['last_response_time']}"
        messages.success(request, success_message_text)
        refreshed_url = get_object_or_404(SiteToCheck, pk=pk, user=request.user)
        bad_data = refreshed_url.bad_data.splitlines()
        return render(request, 'details.html', {'url': url, 'bad_data': bad_data})
    else:
        bad_data = url.bad_data.splitlines()
        return render(request, 'details.html', {'url': url, 'bad_data': bad_data})


@login_required
def url_delete(request, pk):
    url = get_object_or_404(SiteToCheck, pk=pk, user=request.user)
    if request.method == 'GET':
        url.delete()
        message = f'{url.url} was deleted'
        messages.success(request, message)
        return redirect('/')
    return render(request, 'index.html')


@login_required
def url_refresh(request, pk):
    url = get_object_or_404(SiteToCheck, pk=pk, user=request.user)
    if request.method == 'GET':
        data = SiteDownChecker(url.url, user=request.user).status()
        success_message_text = f"{url} Status: {data['last_status']}, Response time: {data['last_response_time']}"
        messages.success(request, success_message_text)
        return redirect('/')
    return render(request, 'index.html')


def modify_settings(request):
    form = SiteToCheckForm
    sites = SiteToCheck.objects.filter(user=request.user)
    if request.method == 'POST':
        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)
        if data['id'] == 'proxy':
            if config.PROXY is True:
                config.PROXY = False
            else:
                config.PROXY = True
        elif data['id'] == 'email':
            user = request.user
            if user.email == data['value']:
                error_message = f'It is your existing email address'
                messages.error(request, error_message)
            else:
                user.email = data['value']
                user.save()
                success_message = f'You changed your email. Every messages will be send to \
                {request.user.email} until now.'
                messages.success(request, success_message)
            return redirect('/')
    return render(request, 'index.html', {'form': form, 'sites': sites})
