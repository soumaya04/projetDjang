import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from .models import (
    UserProfile,
    BankAccount,
    Transaction,
    FraudReport,
    TransactionAlert
)

# -----------------------------
# Types GraphQL
# -----------------------------

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = "__all__"

class BankAccountType(DjangoObjectType):
    class Meta:
        model = BankAccount
        fields = "__all__"

class TransactionType(DjangoObjectType):
    class Meta:
        model = Transaction
        fields = "__all__"

class FraudReportType(DjangoObjectType):
    class Meta:
        model = FraudReport
        fields = "__all__"

class TransactionAlertType(DjangoObjectType):
    class Meta:
        model = TransactionAlert
        fields = "__all__"

# -----------------------------
# Requêtes GraphQL
# -----------------------------

class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    all_profiles = graphene.List(UserProfileType)
    all_bank_accounts = graphene.List(BankAccountType)
    all_transactions = graphene.List(TransactionType)
    all_fraud_reports = graphene.List(FraudReportType)
    all_transaction_alerts = graphene.List(TransactionAlertType)

    def resolve_all_users(root, info):
        return User.objects.all()

    def resolve_all_profiles(root, info):
        return UserProfile.objects.select_related("user").all()

    def resolve_all_bank_accounts(root, info):
        return BankAccount.objects.select_related("user_profile").all()

    def resolve_all_transactions(root, info):
        return Transaction.objects.select_related("bank_account").all()

    def resolve_all_fraud_reports(root, info):
        return FraudReport.objects.select_related("transaction", "reported_by").all()

    def resolve_all_transaction_alerts(root, info):
        return TransactionAlert.objects.select_related("transaction", "user_profile").all()

# -----------------------------
# Mutations
# -----------------------------

class CreateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            raise Exception("Username already exists")
        user = User.objects.create_user(username=username, email=email, password=password)
        return CreateUser(user=user)

class CreateUserProfile(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)
        full_name = graphene.String(required=True)
        phone_number = graphene.String(required=True)
        date_of_birth = graphene.Date(required=True)

    user_profile = graphene.Field(UserProfileType)

    def mutate(self, info, user_id, full_name, phone_number, date_of_birth):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise Exception("User not found")

        if UserProfile.objects.filter(user=user).exists():
            raise Exception("User already has a profile")

        profile = UserProfile.objects.create(
            user=user,
            full_name=full_name,
            phone_number=phone_number,
            date_of_birth=date_of_birth
        )
        return CreateUserProfile(user_profile=profile)

class UpdateUserProfile(graphene.Mutation):
    class Arguments:
        user_id = graphene.Int(required=True)
        full_name = graphene.String()
        phone_number = graphene.String()
        date_of_birth = graphene.Date()

    user_profile = graphene.Field(UserProfileType)

    def mutate(self, info, user_id, full_name=None, phone_number=None, date_of_birth=None):
        try:
            profile = UserProfile.objects.get(user__id=user_id)
        except UserProfile.DoesNotExist:
            raise Exception("UserProfile not found")

        if full_name is not None:
            profile.full_name = full_name
        if phone_number is not None:
            profile.phone_number = phone_number
        if date_of_birth is not None:
            profile.date_of_birth = date_of_birth

        profile.save()

        return UpdateUserProfile(user_profile=profile)

# -----------------------------
# Regroupement des mutations
# -----------------------------

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_user_profile = CreateUserProfile.Field()
    update_user_profile = UpdateUserProfile.Field()

# -----------------------------
# Schéma GraphQL
# -----------------------------

schema = graphene.Schema(query=Query, mutation=Mutation)
