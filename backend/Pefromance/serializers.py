# dailyperformances/serializers.py
from rest_framework import serializers
from .models import DailyPerformance
from KPIs.models import KPI, KPITarget

class PerformanceSerializer(serializers.ModelSerializer):
    kpi_name = serializers.SerializerMethodField()
    target = serializers.SerializerMethodField()

    class Meta:
        model = DailyPerformance
        fields = ['id', 'kpi', 'kpi_name', 'date', 'value', 'target']
        read_only_fields = ['id', 'kpi', 'kpi_name', 'date', 'target'] 

    def get_kpi_name(self, obj):
        return obj.kpi.name
    
    def get_target(self, obj):
        # Fetch the target for the KPI and the month of the performance
        try:
            # Assuming the target is for the same month as the performance date
            target = KPITarget.objects.get(kpi=obj.kpi, month=obj.date.replace(day=1))
            return target.target_value
        except KPITarget.DoesNotExist:
            return None
