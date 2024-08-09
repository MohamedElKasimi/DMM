from django.core.management.base import BaseCommand
from Departments.models import Department
from KPIs.models import KPI, KPITarget
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Create predefined KPIs and their targets'

    def handle(self, *args, **kwargs):
        department = Department.objects.get(id=3)
        
        kpis = [
            {'name': 'Customer rejections'},
            {'name': 'Investments made'},
            {'name': 'Data faked'},

            ]

        for kpi_data in kpis:
            kpi = KPI.objects.create(
                name=kpi_data['name'],
                department=department
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created KPI: {kpi.name}'))

            # Create targets for the next 12 months
            current_date = date.today().replace(day=1)  # First day of current month
            for i in range(12):
                target_date = current_date + timedelta(days=32*i)
                target_date = target_date.replace(day=1)  # Ensure it's always the first of the month
                
                KPITarget.objects.create(
                    kpi=kpi,
                    target_value=5000,  # Example: Increasing target each month
                    month=target_date
                )
                self.stdout.write(self.style.SUCCESS(f'Created target for {kpi.name} - {target_date.strftime("%B %Y")}'))

        self.stdout.write(self.style.SUCCESS('All KPIs and targets created successfully'))