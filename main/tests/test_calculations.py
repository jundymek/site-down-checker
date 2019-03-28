from django.test import TestCase
from django.contrib.auth.models import User
from main.models import SiteToCheck


class CreatingNewSiteTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="test", email="test@test.pl")
        self.user.set_password("test")
        self.user.save()
        self.client.force_login(self.user)
