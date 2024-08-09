from django.core.management.base import BaseCommand
from Users.models import CustomUser
from Departments.models import Department

class Command(BaseCommand):
    help = 'Create predefined users'

    def handle(self, *args, **kwargs):
        users = [
            {'user_id': 'user4', 'password': 'pass4', 'department': 3},
        ]
        for user_data in users:
            department_instance = Department.objects.get(id=user_data['department'])
            
        for user_data in users:
            user = CustomUser.objects.create_user(
                user_id=user_data['user_id'],
                password=user_data['password'],
                department=department_instance
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created user {user.user_id}'))