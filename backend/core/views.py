
import os
from django.conf import settings
from django.http import HttpResponse
from django.views import View

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
