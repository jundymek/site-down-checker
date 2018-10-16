from django.test import TestCase, Client
from django.contrib.auth.models import User
from main.forms import SiteToCheckForm, MyUserCreationForm
from main.models import SiteToCheck


class UrlAddFormTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username="test", email="test@test.pl")
        self.user.set_password("test")
        self.user.save()
        self.client.force_login(self.user)

    def test_blank_data(self):
        form_data = {'url': ''}
        form = SiteToCheckForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_bad_data(self):
        form_data = {'url': 'bademailaddress'}
        form = SiteToCheckForm(data=form_data)
        self.assertFalse(form.is_valid())

    def test_proper_data(self):
        form_data = {'url': 'http://www.onet.pl'}
        form = SiteToCheckForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_page_already_exist(self):
        SiteToCheck.objects.create(url='http://www.onet.pl', user=self.user.username)
        form_data = {'url': 'http://www.onet.pl'}
        response = self.client.post('/', form_data, follow=True)
        message = list(response.context.get('messages'))[0]
        self.assertEqual(message.tags, "danger")
        self.assertTrue("The page already exists in database" in message.message)

    def test_success_add(self):
        form_data = {'url': 'http://www.onet.pl'}
        form = SiteToCheckForm(form_data)
        new_site = form.save()
        self.assertTrue(form.is_valid())
        self.assertEqual(new_site.url, form_data['url'])

    def test_success_add_status_not_200(self):
        form_data = {'url': 'http://www.dietarozdzielna.pl'}
        form = SiteToCheckForm(form_data)
        new_site = form.save()
        self.assertTrue(form.is_valid())
        self.assertFalse(new_site.last_status, 200)


class LoginTest(TestCase):

    def setUp(self):
        self.credentials = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        User.objects.create_user(**self.credentials)

    def test_login(self):
        response = self.client.post('/login/', self.credentials, follow=True)
        self.assertTrue(response.context['user'].is_authenticated)


class RegisterTest(TestCase):

    def setUp(self):
        self.client = Client()

    def test_registration_form_invalid(self):
        invalid_data = {
            "username": "testowy",
            "email": "test@email.com",
            "password1": "secret",
            "password2": "ssssss"
        }
        form = MyUserCreationForm(data=invalid_data)
        form.is_valid()
        self.assertTrue(form.errors)

    def test_registration_form_valid(self):
        valid_data = {
            "username": "testowy",
            "email": "test@email.com",
            "password1": "SECRET2323",
            "password2": "SECRET2323"
        }
        form = MyUserCreationForm(data=valid_data)
        form.is_valid()
        self.assertFalse(form.errors)
        self.client.post('/register/', valid_data, follow=True)
        self.assertEqual(User.objects.count(), 1)
