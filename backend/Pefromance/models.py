from django.db import models

# Create your models here.
class DailyPerformance(models.Model):
    id = models.AutoField(primary_key=True)
    kpi = models.ForeignKey('KPIs.KPI', on_delete=models.CASCADE, related_name='daily_performances')
    date = models.DateField()
    value = models.FloatField()
    
    class Meta:
        unique_together = ['kpi', 'date']
    
    def __str__(self):
        return f"{self.kpi.name} - {self.date}: {self.value}"