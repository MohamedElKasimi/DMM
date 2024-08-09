from django.core.management.base import BaseCommand
from Departments.models import Department
from django.db import IntegrityError

class Command(BaseCommand):
    help = 'Create predefined test departments'

    def handle(self, *args, **kwargs):
        departments = [
            {'id': 11, 'name': 'Safety'},
            {'id': 12, 'name': 'Environment'},
            {'id': 13, 'name': 'Quality'},
            {'id': 14, 'name': 'IE'},
            {'id': 15, 'name': 'LOG'},
            {'id': 16, 'name': 'WIP'},
            {'id': 17, 'name': 'HR'},
            {'id': 18, 'name': 'Production'},
            {'id': 19, 'name': 'Scrap'},
            {'id': 20, 'name': 'PP'},
            {'id': 21, 'name': 'Safety'},
            {'id': 22, 'name': 'Environment'},
            {'id': 23, 'name': 'Quality'},
            {'id': 24, 'name': 'IE'},
            {'id': 25, 'name': 'LOG'},
            {'id': 26, 'name': 'WIP'},
            {'id': 27, 'name': 'HR'},
            {'id': 28, 'name': 'Production'},
            {'id': 29, 'name': 'Scrap'},
            {'id': 30, 'name': 'PP'}
        ]

        for dept_data in departments:
            try:
                department = Department.objects.create(
                    id=dept_data['id'],
                    name=dept_data['name']
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully created department: {department.name} (ID: {department.id})'))
            except IntegrityError:
                self.stdout.write(self.style.WARNING(f'Department with ID {dept_data["id"]} or name "{dept_data["name"]}" already exists'))

        self.stdout.write(self.style.SUCCESS('Department creation process completed'))