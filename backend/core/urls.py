from django.urls import path, re_path
from .views import ReactAppView, AuthStatusView

urlpatterns = [
    path('auth/status/', AuthStatusView.as_view(), name='auth-status'),
    re_path(r'^.*$', ReactAppView.as_view(), name='react-app-fallback'),
]