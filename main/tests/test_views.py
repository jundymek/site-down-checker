from django.test import TestCase
from django.contrib.auth.models import User
from main.models import SiteToCheck


class BasicViewsTests(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="test", email="test@test.pl")
        self.user.set_password("test")
        self.user.save()
        self.client.force_login(self.user)
        self.new_site = SiteToCheck.objects.create(url='http://www.test.html', user_name=self.user)
        self.new_site.save()

    def test_home_page_status_code(self):
        response = self.client.get('/')
        self.assertEquals(response.status_code, 200)

    def test_details_page_status_code(self):
        response = self.client.get(f'/details/{self.new_site.id}/')
        self.assertEquals(response.status_code, 200)

    def test_refresh_page(self):
        response = self.client.get(f'/refresh/{self.new_site.id}/', follow=True)
        response1 = self.client.get(f'/refresh/{self.new_site.id}/', follow=True)
        self.assertEquals(response.status_code, 200)
        self.assertNotEqual(response, response1)

    def test_modify_email(self):
        response = self.client.post('/update_email/', {'email': "user_name@mp.com"}, follow=True)
        self.assertEqual(response.status_code, 200)
        message = list(response.context.get('messages'))[0]
        self.assertEqual(message.tags, "success")
