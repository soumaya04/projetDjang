from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import generics, permissions
from .models import Transaction, FraudReport, BankAccount, UserProfile
from .serializers import (
    TransactionSerializer,
    FraudReportSerializer,
    BankAccountSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer
)
from .tasks import send_welcome_email


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    user = request.user
    profile = getattr(user, 'profile', None)

    data = {
        "full_name": profile.full_name if profile else None,
        "date_of_birth": profile.date_of_birth.isoformat() if profile and profile.date_of_birth else None,
        "phone_number": profile.phone_number if profile else None,
        "address": profile.address if profile else None,
        "user": {
            "email": user.email,
        }
    }
    return Response(data)

# Nouvelle vue pour l'inscription

@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        # Optionnel : envoyer un email
        # send_welcome_email.delay(user.email)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    @action(detail=True, methods=['GET'])
    def get_account_transaction(self, request, account_id=None):
        try:
            account = BankAccount.objects.get(id=account_id)
        except BankAccount.DoesNotExist:
            return Response(
                data={'message': f'Account with id={account_id} is not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        transactions = Transaction.objects.filter(bank_account=account)
        
        if not transactions.exists():
            return Response(
                data={'message': f'There are no transactions for account {account_id}'},
                status=status.HTTP_204_NO_CONTENT
            )
        
        # Sérialisation des transactions et réponse
        result = TransactionSerializer(transactions, many=True)
        return Response(data=result.data, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_transactions(request):
    try:
        # Récupérer le UserProfile lié à l'utilisateur
        user_profile = UserProfile.objects.get(user=request.user)

        # Récupérer les comptes bancaires liés à ce profil (un ou plusieurs)
        bank_accounts = BankAccount.objects.filter(user_profile=user_profile)

        # Récupérer les transactions liées à ces comptes
        transactions = Transaction.objects.filter(bank_account__in=bank_accounts).order_by('-timestamp')

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profil utilisateur introuvable."}, status=404)
    except BankAccount.DoesNotExist:
        return Response({"error": "Compte bancaire introuvable."}, status=404)


class FraudReportViewSet(viewsets.ModelViewSet):
    queryset = FraudReport.objects.all()
    serializer_class = FraudReportSerializer


class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Vérifier que le compte bancaire appartient à l'utilisateur
        bank_account_id = serializer.validated_data.get('bank_account').id
        user_profile = self.request.user.userprofile
        
        if not BankAccount.objects.filter(
            id=bank_account_id, 
            user_profile=user_profile
        ).exists():
            raise ValidationError("Vous ne pouvez pas ajouter de transaction à ce compte")
        
        serializer.save()

    def perform_update(self, serializer):
        # Vérifier que l'utilisateur peut modifier cette transaction
        transaction = self.get_object()
        user_profile = self.request.user.userprofile
        
        if transaction.bank_account.user_profile != user_profile:
            raise ValidationError("Vous n'avez pas le droit de modifier cette transaction")
        
        serializer.save()
class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]        