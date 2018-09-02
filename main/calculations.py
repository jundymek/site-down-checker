import requests
from datetime import datetime

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
    print(output)
    if len(output) > 0:
        send_email(output)


class SiteDownChecker:

    def __init__(self, url):
        self.url = url

    def status(self):
        data = dict()
        try:
            r = requests.get(self.url)
            if SiteToCheck.objects.filter(url=self.url).exists():
                obj = SiteToCheck.objects.get(url=self.url)
                obj.last_status = r.status_code
                obj.last_response_time = r.elapsed.total_seconds()
                obj.last_check = datetime.now().strftime("%Y-%m-%d %H:%M")
                obj.save()
            else:
                SiteToCheck.objects.create(url=self.url,
                                           last_status=r.status_code,
                                           last_response_time=r.elapsed.total_seconds(),
                                           last_check=datetime.now().strftime("%Y-%m-%d %H:%M"))
            data['url'] = self.url
            data['last_status'] = r.status_code
            data['last_response_time'] = r.elapsed.total_seconds()
            data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
            # return data
        except Exception as e:
            if SiteToCheck.objects.filter(url=self.url).exists():
                obj = SiteToCheck.objects.get(url=self.url)
                obj.last_status = None
                obj.last_response_time = None
                obj.last_check = datetime.now().strftime("%Y-%m-%d %H:%M")
                if len(obj.bad_data) > 0:
                    obj.bad_data += '\n' + str(datetime.now().strftime("%Y-%m-%d %H:%M")) + ': ' + str(e)
                else:
                    obj.bad_data += str(datetime.now().strftime("%Y-%m-%d %H:%M")) + ': ' + str(e)
                obj.save()
                data['bad_data'] = e
                data['last_status'] = None
                data['last_response_time'] = None
                data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
                data['url'] = self.url
            else:
                SiteToCheck.objects.create(url=self.url,
                                           last_status=None,
                                           last_response_time=None,
                                           last_check=datetime.now().strftime("%Y-%m-%d %H:%M"),
                                           bad_data=str(datetime.now().strftime("%Y-%m-%d %H:%M")) + ': ' + str(e)
                                           )
                data['last_status'] = None
                data['last_response_time'] = None
                # data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
                data['bad_data'] = e
                # data['url'] = self.url
        data['last_check'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        data['url'] = self.url
        return data
