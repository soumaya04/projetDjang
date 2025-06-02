# users/tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_welcome_email(email, username):
    subject = 'Bienvenue sur notre plateforme'
    message = f'Bonjour {username},\n\nMerci de vous être inscrit !'
    from_email = 'no-reply@tonsite.com'
    recipient_list = [email]
    
    send_mail(subject, message, from_email, recipient_list)
@shared_task
def send_login_notification_email(email, username):
    subject = "Connexion réussie"
    message = f"Bonjour {username},\n\nVous vous êtes connecté avec succès à votre compte."
    from_email = "noreply@tonsite.com"

    send_mail(subject, message, from_email, [email])
