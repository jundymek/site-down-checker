import requests
from datetime import datetime

from django.core.mail import send_mail
from django.conf import settings

from .models import SiteToCheck


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
                obj.last_check = datetime.now()
                obj.save()
            else:
                SiteToCheck.objects.create(url=self.url,
                                           last_status=r.status_code,
                                           last_response_time=r.elapsed.total_seconds(),
                                           last_check=datetime.now())
            data['url'] = self.url
            data['last_status'] = r.status_code
            data['last_response_time'] = r.elapsed.total_seconds()
            data['last_check'] = datetime.now().strftime("%Y/%m/%d-%H:%M:%S")
            return data
        except requests.exceptions.RequestException as e:
            if SiteToCheck.objects.filter(url=self.url).exists():
                obj = SiteToCheck.objects.get(url=self.url)
                obj.last_status = None
                obj.last_response_time = None
                obj.last_check = datetime.now()
                if len(obj.bad_data) > 0:
                    obj.bad_data += '\n' + str(datetime.now().strftime("%Y/%m/%d-%H:%M:%S")) + ': ' + str(e)
                else:
                    obj.bad_data += e
                obj.save()
            else:
                SiteToCheck.objects.create(url=self.url,
                                           last_status=None,
                                           last_response_time=None,
                                           last_check=datetime.now(),
                                           bad_data=e
                                           )
                data['status_code'] = None
                data['response_time'] = None
                data['last_check'] = datetime.now().strftime("%Y/%m/%d-%H:%M:%S")
                data['bad_data'] = e
                data['url'] = self.url
            self.send_email(self.url, e)
            return data

    def send_email(self, url, error):
        subject = 'Błędy na stronach'
        message = f'Na stronie {url} znaleziono błędy: {error}'
        from_email = settings.EMAIL_ADDRESS
        to_email = settings.TO_EMAIL
        send_mail(
            subject,
            message,
            from_email,
            [to_email],
            fail_silently=False,
        )
