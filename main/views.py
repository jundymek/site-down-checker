import json
from constance import config

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, TemplateView
from django.views.generic.edit import FormView, CreateView, DeleteView

from .forms import SiteToCheckForm, MyUserCreationForm
from .models import SiteToCheck
from .calculations import SiteDownChecker, modify_email


# ---------Custom error views----------- #
class Custom400Handler(TemplateView):
    template_name = '400.html'


class Custom404Handler(TemplateView):
    template_name = '404.html'


class Custom500Handler(TemplateView):
    template_name = '404.html'


# ------------- End -------------------- #

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
        return SiteToCheck.objects.filter(user_name=self.request.user)


class AddSiteToCheckView(FormView):
    template_name = 'index.html'
    context_object_name = 'sites'
    model = SiteToCheck
    form_class = SiteToCheckForm

    def form_valid(self, form):
        cd = form.cleaned_data
        if SiteToCheck.objects.filter(url=cd['url'], user_name=self.request.user).exists():
            messages.error(self.request, 'The page already exists in database')
        else:
            data = SiteDownChecker(cd['url'], user_name=self.request.user).status()
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


class SiteDeleteView(UserPassesTestMixin, DeleteView):
    login_url = '403.html'
    model = SiteToCheck
    success_url = reverse_lazy('index')

    def get(self, *args, **kwargs):
        message = f'{self.get_object().url} was deleted'
        messages.success(self.request, message)
        return self.post(*args, **kwargs)

    def test_func(self):
        return self.request.user.username == str(self.get_object().user_name)


class SiteRefreshView(DetailView):
    model = SiteToCheck
    success_url = reverse_lazy('index')

    def get(self, *args, **kwargs):
        data = SiteDownChecker(self.get_object().url, user_name=self.request.user).status()
        message = f"{self.get_object().url} Status: {data['last_status']}, Response time: {data['last_response_time']}"
        messages.success(self.request, message)
        return redirect(self.request.META.get('HTTP_REFERER'))


@login_required
def update_email(request):
    modify_email(request)
    return redirect('/')


@login_required
def check_all(request):
    sites = SiteToCheck.objects.filter(user_name=request.user)
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
            if config.PROXY:
                config.PROXY = False
            else:
                config.PROXY = True
    return redirect('/')
