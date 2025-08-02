
import os
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ReactAppView(View):
    def get(self, request):
        index_path = os.path.join(settings.FRONTEND_DIST, 'index.html')
        try:
            with open(index_path, 'r') as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                "This build of the React app is not found. Please run the React build process.",
                status=501,
            )

class AuthStatusView(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'isAuthenticated': True, 'username': request.user.username})
        return Response({'isAuthenticated': False})

