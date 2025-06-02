# Django-Fraude-master/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Django-Fraude-master.settings')

app = Celery('Django-Fraude-master')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
