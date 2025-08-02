import os
import subprocess
import shutil
import stat

from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings

class Command(BaseCommand):
    help = 'Windows-safe: Builds React app, cleans static files, and runs collectstatic.'

    def handle(self, *args, **kwargs):
        frontend_dir = os.path.join(settings.BASE_DIR, '..', 'frontend')
        build_dir = os.path.join(frontend_dir, 'dist')

        def handle_remove_readonly(func, path, exc_info):
            try:
                os.chmod(path, stat.S_IWRITE)
                func(path)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Could not remove {path}: {e}"))

        # Clean old static files
        self.stdout.write(self.style.WARNING('Cleaning old static files (Windows-safe)...'))
        try:
            if os.path.exists(settings.STATIC_ROOT):
                shutil.rmtree(settings.STATIC_ROOT, onerror=handle_remove_readonly)
                self.stdout.write(self.style.SUCCESS('Old staticfiles directory removed.'))
            if os.path.exists(build_dir):
                shutil.rmtree(build_dir, onerror=handle_remove_readonly)
                self.stdout.write(self.style.SUCCESS('Old React build directory removed.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error occurred while cleaning directories: {e}"))
            return

        # Build React app
        self.stdout.write(self.style.WARNING('Installing frontend dependencies...'))
        try:
            subprocess.run('npm install', cwd=frontend_dir, check=True, shell=True)
            self.stdout.write(self.style.SUCCESS('Frontend dependencies installed successfully.'))
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Error occurred while installing frontend dependencies: {e}"))
            return

        self.stdout.write(self.style.WARNING('Building React app...'))
        try:
            subprocess.run('npm run build', cwd=frontend_dir, check=True, shell=True)
            self.stdout.write(self.style.SUCCESS('React app built successfully.'))
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f"Error occurred while building React app: {e}"))
            return

        # Copy React build to Django static if needed
        static_target = os.path.join(settings.BASE_DIR, 'backend_core', 'Static', 'frontend')
        try:
            if os.path.exists(static_target):
                shutil.rmtree(static_target, onerror=handle_remove_readonly)
            shutil.copytree(build_dir, static_target)
            self.stdout.write(self.style.SUCCESS(f'React build copied to {static_target}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error copying React build: {e}"))
            return

        # Run collectstatic
        self.stdout.write(self.style.WARNING('Running collectstatic...'))
        try:
            call_command('collectstatic', '--noinput')
            self.stdout.write(self.style.SUCCESS('collectstatic completed successfully.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during collectstatic: {e}"))
            return
