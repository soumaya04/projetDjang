from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, RegexValidator


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=20, validators=[
        RegexValidator(r'^\+?[0-9]{9,15}$', 'Enter a valid phone number.')
    ])
    address = models.TextField()

    class Meta:
        ordering = ['full_name']
        db_table = 'user_profile'

    def __str__(self):
        return self.full_name


class BankAccount(models.Model):
    ACCOUNT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='bank_accounts')
    account_number = models.CharField(max_length=20, unique=True, validators=[
        RegexValidator(r'^\d{10,20}$', 'Enter a valid account number.')
    ])
    balance = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    currency_type = models.CharField(max_length=10)
    account_status = models.CharField(max_length=10, choices=ACCOUNT_STATUS_CHOICES, default='active')

    class Meta:
        ordering = ['account_number']
        db_table = 'bank_account'

    def __str__(self):
        return f"{self.account_number} ({self.user_profile.full_name})"


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
    ]

    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0.01)])
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=255)

    class Meta:
        ordering = ['-timestamp']
        db_table = 'transaction'

    def __str__(self):
        return f"{self.transaction_type.title()} of {self.amount} on {self.timestamp.date()}"


class FraudReport(models.Model):
    FRAUD_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='fraud_reports')
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='fraud_reports')
    reason_for_suspicion = models.TextField()
    status = models.CharField(max_length=10, choices=FRAUD_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'fraud_report'

    def __str__(self):
        return f"Fraud Report: {self.transaction} - {self.get_status_display()}"


class TransactionAlert(models.Model):
    ALERT_TYPE_CHOICES = [
        ('ai_generated', 'AI Generated'),
        ('manual_review', 'Manual Review'),
    ]

    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='alerts')
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        db_table = 'transaction_alert'

    def __str__(self):
        return f"{self.alert_type.replace('_', ' ').title()} Alert ({self.severity.title()}) on {self.timestamp.date()}"
