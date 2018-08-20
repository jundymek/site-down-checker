from django.db import models


class SiteToCheck(models.Model):
    url = models.URLField(max_length=100)
    bad_data = models.TextField(blank=True)
    last_status = models.IntegerField(blank=True, null=True)
    last_response_time = models.FloatField(blank=True, null=True)
    last_check = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.url
