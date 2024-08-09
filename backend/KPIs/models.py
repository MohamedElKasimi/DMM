from django.db import models

# Create your models here.
class KPI(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    department = models.ForeignKey('Departments.Department', on_delete=models.CASCADE, related_name='kpis')
    
    def __str__(self):
        return f"{self.name} - {self.department.name}"

class KPITarget(models.Model):
    id = models.AutoField(primary_key=True)
    kpi = models.ForeignKey(KPI, on_delete=models.CASCADE, related_name='targets')
    target_value = models.FloatField()
    month = models.DateField()  # Store the first day of the month
    
    class Meta:
        unique_together = ['kpi', 'month']
    
    def __str__(self):
        return f"{self.kpi.name} - {self.month.strftime('%B %Y')}: {self.target_value}"