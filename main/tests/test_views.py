from django.test import TransactionTestCase
from django.contrib.auth.models import User
from main.models import SiteToCheck


class BasicViewsTests(TransactionTestCase):
    def setUp(self):
        self.user = User.objects.create(username="test", email="test@test.pl")
        self.user.set_password("test")
        self.user.save()
        self.client.force_login(self.user)
        self.new_site = SiteToCheck.objects.create(url='http://www.test.html', user=self.user.username)
        self.new_site.save()
        self.site_id = self.new_site.id

    def test_home_page_status_code(self):
        response = self.client.get('/')
        self.assertEquals(response.status_code, 200)

    def test_details_page_status_code(self):
        response = self.client.get(f'/details/{self.site_id}/')
        self.assertEquals(response.status_code, 200)

    def test_modify_email(self):
        value = 'aass@dsdsad.pl'
        response = self.client.post('/modify_settings/', {'id': 'email', 'value': value},
                                    follow=True)
        message = list(response.context.get('messages'))[0]
        self.assertEquals(response.status_code, 200)
        self.assertEqual(message.tags, "success")
        self.assertTrue("You changed your email" in message.message)

    def test_refresh_page(self):
        response = self.client.get(f'/refresh/{self.site_id}/', follow=True)
        response1 = self.client.get(f'/refresh/{self.site_id}/', follow=True)
        self.assertEquals(response.status_code, 200)
        self.assertNotEqual(response, response1)
