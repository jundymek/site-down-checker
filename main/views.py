import json
from constance import config
from django.http import HttpResponseRedirect

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView
from django.views.generic.edit import FormView, CreateView, DeleteView

from .forms import SiteToCheckForm, MyUserCreationForm
from .models import SiteToCheck
from .calculations import SiteDownChecker, modify_email


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


class CreateNewUserView(CreateView):
    template_name = 'register.html'
    form_class = MyUserCreationForm

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('index')


class IndexView(ListView):
    template_name = 'index.html'
    context_object_name = 'sites'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['form'] = self.request.GET.get('form', SiteToCheckForm)
        return context

    def get_queryset(self):
        return SiteToCheck.objects.filter(user=self.request.user)


class AddSiteToCheckView(FormView):
    template_name = 'index.html'
    context_object_name = 'sites'
    model = SiteToCheck
    form_class = SiteToCheckForm

    def form_valid(self, form):
        cd = form.cleaned_data
        if SiteToCheck.objects.filter(url=cd['url'], user=self.request.user).exists():
            messages.error(self.request, 'The page already exists in database')
        else:
            data = SiteDownChecker(cd['url'], user=self.request.user).status()
            success_message_text = f"The page hes been added. \n\nStatus: {data['last_status']}, Response time: \
            {data['last_response_time']}"
            messages.success(self.request, success_message_text)
        return redirect('/')

    def form_invalid(self, form):
        messages.error(self.request, 'Please enter the correct URL')
        return redirect('/')


class SiteDetailView(DetailView):
    model = SiteToCheck
    template_name = 'details.html'
    context_object_name = 'url'


class SiteDeleteView(DeleteView):
    model = SiteToCheck
    success_url = reverse_lazy('index')

    def get(self, *args, **kwargs):
        message = f'{self.get_object().url} was deleted'
        messages.success(self.request, message)
        return self.post(*args, **kwargs)


@login_required
def update_email(request):
    modify_email(request)
    return redirect('/')


@login_required
def url_refresh(request, pk):
    url = get_object_or_404(SiteToCheck, pk=pk, user=request.user)
    if request.method == 'GET':
        data = SiteDownChecker(url.url, user=request.user).status()
        success_message_text = f"{url} Status: {data['last_status']}, Response time: {data['last_response_time']}"
        messages.success(request, success_message_text)
        return redirect(f'/details/{pk}')
    return render(request, 'index.html')


@login_required
def check_all(request):
    sites = SiteToCheck.objects.filter(user=request.user)
    for url in sites:
        SiteDownChecker(url, request.user).status()
    messages.success(request, 'Successfully refreshed sites statuses')
    return redirect('/')


def modify_settings(request):
    if request.method == 'POST':
        response_json = request.POST
        response_json = json.dumps(response_json)
        data = json.loads(response_json)
        if data['id'] == 'proxy':
            if config.PROXY is True:
                config.PROXY = False
            else:
                config.PROXY = True
    return redirect('/')
