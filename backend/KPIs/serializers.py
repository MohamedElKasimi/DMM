from rest_framework import serializers

from Departments.models import Department
from .models import KPI, KPITarget

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class KPISerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = KPI
        fields = ['id', 'name', 'department', 'department_name']

class KPITargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = KPITarget
        fields = '__all__'