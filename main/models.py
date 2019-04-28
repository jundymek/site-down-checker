from datetime import datetime

from django.db import models
from django.contrib.auth.models import User


class SiteToCheck(models.Model):
    url = models.URLField(max_length=100)
    user_name = models.ForeignKey(User, on_delete=models.CASCADE)
    error_msg = models.TextField(null=True)
    last_status = models.IntegerField(null=True, default=None)
    last_response_time = models.FloatField(null=True, default=None)
    last_check = models.DateTimeField(null=True)

    def update_exception_status(self, e):
        if self.error_msg:
            self.error_msg += '\n'
        self.error_msg += datetime.now().strftime("%Y-%m-%d %H:%M") + ': ' + str(e)
        self.save()

    def update_success_status(self, proxy, r):
        self.last_status = r.get_status_code() if proxy else r.status_code
        self.last_response_time = self.time if proxy else r.elapsed.total_seconds()
        self.last_check = datetime.now().strftime("%Y-%m-%d %H:%M")
        if self.last_status != 200:
            if self.error_msg:
                self.error_msg += '\n'
            self.error_msg += str(
                datetime.now().strftime(
                    "%Y-%m-%d %H:%M")) + f": last status different than 200: {self.last_status}"
        self.save()

    def __str__(self):
        return self.url
