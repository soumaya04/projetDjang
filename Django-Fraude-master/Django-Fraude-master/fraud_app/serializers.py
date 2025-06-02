from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, FraudReport, BankAccount, UserProfile

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
class FraudReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraudReport
        fields = '__all__'

class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = '__all__'

# Serializer pour l'enregistrement de l'utilisateur et de son profil (UserProfile)
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirmation = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirmation']

    def validate(self, data):
        # Vérification que les mots de passe correspondent
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
        
        # Créer un profil utilisateur
        user_profile = UserProfile.objects.create(
            user=user,
            full_name="Nom Complet",  # Tu peux ajuster cela selon les données que tu reçois
            date_of_birth="1990-01-01",  # Tu peux ajuster cela aussi
            phone_number='+00000000000',  # Remplacer par un format correct
            address="Adresse"  # Remplacer par une adresse par défaut
        )
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
