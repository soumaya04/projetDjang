"""
URL configuration for fraud_detection_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from fraud_app.views import current_user_view, register_user,user_transactions



urlpatterns = [
    path("admin/", admin.site.urls),
    path('fraude/', include('fraud_app.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/auth/register/", register_user, name="register"),
    path('api/current_user/', current_user_view, name='current_user'),
    path('api/user/transactions/', user_transactions, name='user-transactions'),

    


    
]
