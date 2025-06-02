from rest_framework import routers
from .views import TransactionViewSet, FraudReportViewSet, BankAccountViewSet, UserProfileViewSet

from .views import current_user_view


from django.urls import path, include
from graphene_django.views import GraphQLView
from .schema import schema 
router=routers.DefaultRouter()
router.register(r'transactions', TransactionViewSet)
router.register(r'fraud-reports', FraudReportViewSet)
router.register(r'bank-accounts', BankAccountViewSet)
router.register(r'user-profiles', UserProfileViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('graphql/', GraphQLView.as_view(graphiql=True, schema=schema)),


]

