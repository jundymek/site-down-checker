import requests
from datetime import datetime
from constance import config

from proxy_requests.proxy_requests import ProxyRequests

from django.core.mail import send_mail
from django.conf import settings

from .models import SiteToCheck


def send_email(message):
    subject = 'Errors on my pages'
    message = message
    from_email = settings.EMAIL_ADDRESS
    to_email = settings.TO_EMAIL
    send_mail(
        subject,
        message,
        from_email,
        [to_email],
        fail_silently=False,
    )


def my_cron_job():
    sites = SiteToCheck.objects.all()
    output = ''
    for site in sites:
        if 'bad_data' in SiteDownChecker(site).status():
            output += f'{site} - ERROR\n'
    if len(output) > 0:
        send_email(output)


class SiteDownChecker:

    def __init__(self, url):
        self.url = url
        self.time = 0
        self.error = None

    def status(self, proxy=False):
        try:
            if proxy:
                r = ProxyRequests(self.url)
                # r.set_headers({'User-Agent': 'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)'})
            else:
                r = requests.get(self.url, headers={
                    'User-Agent': 'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)'})
            if SiteToCheck.objects.filter(url=self.url).exists():
                return self.modify_url_success(proxy, r)
            else:
                return self.create_new_url_success(proxy, r)
        except Exception as e:
            self.error = str(e)
            if not proxy and config.PROXY:
                return self.status(proxy=True)
            if SiteToCheck.objects.filter(url=self.url).exists():
                return self.modify_url_exception(e)
            else:
                return self.create_url_exception()

    def create_url_exception(self):
        data = dict()
        SiteToCheck.objects.create(url=self.url,
                                   last_status=None,
                                   last_response_time=None,
                                   last_check=datetime.now().strftime("%Y-%m-%d %H:%M"),
                                   bad_data=str(
                                       datetime.now().strftime("%Y-%m-%d %H:%M")) + ': The url is not responding'
                                   )
        data['last_status'] = None
        data['last_response_time'] = None
        data['bad_data'] = 'The url is not responding'
        return data

    def modify_url_exception(self, e):
        data = dict()
        obj = SiteToCheck.objects.get(url=self.url)
        obj.last_status = None
        obj.last_response_time = None
        obj.last_check = datetime.now().strftime("%Y-%m-%d %H:%M")
        if len(obj.bad_data) > 0:
            obj.bad_data += '\n' + str(datetime.now().strftime("%Y-%m-%d %H:%M")) + ': ' + self.error
        else:
            obj.bad_data += str(datetime.now().strftime("%Y-%m-%d %H:%M")) + ': ' + self.error
        obj.save()
        data['bad_data'] = e
        data['last_status'] = None
        data['last_response_time'] = None
        data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        data['url'] = self.url
        return data

    def create_new_url_success(self, proxy, r):
        data = dict()
        if not proxy:
            SiteToCheck.objects.create(url=self.url,
                                       last_status=r.status_code,
                                       last_response_time=r.elapsed.total_seconds(),
                                       last_check=datetime.now().strftime("%Y-%m-%d %H:%M"))
            data['last_status'] = r.status_code
            data['last_response_time'] = r.elapsed.total_seconds()
        else:
            SiteToCheck.objects.create(url=self.url,
                                       last_status=r.get_status_code(),
                                       last_response_time=self.time,
                                       last_check=datetime.now().strftime("%Y-%m-%d %H:%M"))
            data['last_status'] = r.get_status_code()
            data['last_response_time'] = self.time
        data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        return data

    def modify_url_success(self, proxy, r):
        data = dict()
        obj = SiteToCheck.objects.get(url=self.url)
        if not proxy:
            obj.last_status = r.status_code
            obj.last_response_time = r.elapsed.total_seconds()
            data['last_status'] = r.status_code
            data['last_response_time'] = r.elapsed.total_seconds()
        else:
            obj.last_status = r.get_status_code()
            obj.last_response_time = self.time
            data['last_status'] = r.get_status_code()
            data['last_response_time'] = self.time
        obj.last_check = datetime.now().strftime("%Y-%m-%d %H:%M")
        obj.save()
        data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        return data
