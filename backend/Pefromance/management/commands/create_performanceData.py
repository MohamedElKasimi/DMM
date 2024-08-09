from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from KPIs.models import KPI
from Pefromance.models import DailyPerformance
import random

class Command(BaseCommand):
    help = 'Create dummy performance data'

    def handle(self, *args, **kwargs):
        # Define some KPIs for which to generate data
        kpi_ids = [30,31,32]  # Replace with actual KPI ids from your database
        
        # Define the start and end dates for generating data
        start_date = timezone.now().date() - timedelta(days=60)
        end_date = timezone.now().date() + timedelta(days=60)
        
        for kpi_id in kpi_ids:
            kpi_instance = KPI.objects.get(id=kpi_id)
            current_date = start_date
            while current_date <= end_date:
                value = random.uniform(100,500)  # Generate a random float between 50 and 100
                DailyPerformance.objects.create(
                    kpi=kpi_instance,
                    date=current_date,
                    value=value
                )
                current_date += timedelta(days=1)
        
        self.stdout.write(self.style.SUCCESS('Successfully created dummy performance data'))
