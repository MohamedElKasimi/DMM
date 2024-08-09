from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import KPI, KPITarget
from .serializers import KPISerializer, KPITargetSerializer
from datetime import datetime, date

class KPIViewSet(viewsets.ModelViewSet):
    serializer_class = KPISerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.department:
            return KPI.objects.filter(department=user.department)
        return KPI.objects.none()

    def perform_create(self, serializer):
        serializer.save(department=self.request.user.department)

    def perform_update(self, serializer):
        if serializer.instance.department != self.request.user.department:
            raise PermissionDenied("You do not have permission to update this KPI.")
        serializer.save()

    @action(detail=True, methods=['get'])
    def targets(self, request, pk=None):
        kpi = self.get_object()
        current_year = datetime.now().year
        start_date = date(current_year, 1, 1)
        end_date = date(current_year, 12, 31)
        targets = KPITarget.objects.filter(kpi=kpi, month__range=(start_date, end_date))
        serializer = KPITargetSerializer(targets, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['put'])
    def update_targets(self, request, pk=None):
        kpi = self.get_object()
        targets_data = request.data.get('targets', [])
        updated_targets = []
         
        for target_data in targets_data:
            month = datetime.strptime(target_data['month'], '%Y-%m-%d').date()
            target_value = target_data['target_value']
            target, created = KPITarget.objects.update_or_create(
                kpi=kpi,
                month=month,
                defaults={'target_value': target_value}
            )
            updated_targets.append(target)
        
        serializer = KPITargetSerializer(updated_targets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)