import json
from datetime import datetime

import requests
from constance import config
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from proxy_requests.proxy_requests import ProxyRequests

from .models import SiteToCheck


def send_email(message, email):
    send_mail(
        subject='Errors on my pages',
        message=message,
        from_email=settings.EMAIL_ADDRESS,
        recipient_list=[email],
        fail_silently=False,
    )


def cron_job():
    users = User.objects.all()
    for user in users:
        sites = SiteToCheck.objects.filter(user_name=user)
        output = ''
        for site in sites:
            if 'error_msg' in SiteDownChecker(site, user).status():
                output += f'{site} - ERROR\n'
            elif site.last_status != 200:
                output += f'{site} - last status: {site.last_status}'
        if output:
            send_email(output, user.email)


def update_user_email(request):
    response_json = json.dumps(request.POST)
    data = json.loads(response_json)
    try:
        validate_email(data['email'])
        user = request.user
        if user.email == data['email']:
            error_message = 'It is your existing email address'
            messages.error(request, error_message)
        else:
            user.email = data['email']
            user.save()
            success_message = f'You changed your email. Every messages will be send to \
                        {request.user.email} until now.'
            messages.success(request, success_message)
    except ValidationError:
        error_message = 'It is not valid email address'
        messages.error(request, error_message)


class SiteDownChecker:

    def __init__(self, url, user_name):
        self.url = url
        self.time = 0
        self.error = None
        self.user = user_name

    def status(self, proxy=False):
        if SiteToCheck.objects.filter(url=self.url, user_name=self.user).exists():
            site = SiteToCheck.objects.get(url=self.url, user_name=self.user)
        else:
            site = None
        try:
            if proxy:
                r = ProxyRequests(self.url)
            else:
                r = requests.get(self.url)
            if site:
                site = SiteToCheck.objects.get(url=self.url, user_name=self.user)
                site.update_success_status(proxy, r)
                data = {
                    'last_status': site.last_status,
                    'last_response_time': site.last_response_time,
                    'last_check': site.last_check,
                    'error_msg': site.error_msg
                }
                return data
            else:
                return self.create_new_url_success(proxy, r)
        except Exception as e:
            if "invalid literal for int() with base 10: ''" in str(e):
                error = 'No connection'
            else:
                error = e
            if not proxy and config.PROXY:
                return self.status(proxy=True)
            if site:
                site = SiteToCheck.objects.get(url=self.url, user_name=self.user)
                site.update_exception_status(error)
                data = {
                    'last_status': site.last_status,
                    'last_response_time': site.last_response_time,
                    'last_check': site.last_check,
                    'error_msg': site.error_msg
                }
                return data
            else:
                return self.create_url_exception(error)

    def create_url_exception(self, e):
        new_object = SiteToCheck.objects.create(url=self.url,
                                                user_name=self.user,
                                                last_check=datetime.now().strftime("%Y-%m-%d %H:%M"),
                                                error_msg=str(
                                                    datetime.now().strftime(
                                                        "%Y-%m-%d %H:%M")) + ': ' + str(e) + '\n',
                                                last_status=None,
                                                last_response_time=None
                                                )
        return new_object

    def create_new_url_success(self, proxy, r):
        new_object = SiteToCheck.objects.create(url=self.url,
                                                user_name=self.user,
                                                last_status=r.status_code if not proxy else r.get_status_code(),
                                                last_response_time=r.elapsed.total_seconds() if not proxy else self.time,
                                                last_check=datetime.now().strftime("%Y-%m-%d %H:%M"))

        return new_object
