# dailyperformances/views.py
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from KPIs.models import KPI 
from .models import DailyPerformance
from .serializers import PerformanceSerializer

class UserDailyPerformancesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        date_param = request.query_params.get('date')

        if user.department:
            kpis = KPI.objects.filter(department=user.department)
            
            if date_param:
                year, month = map(int, date_param.split('-'))
                start_date = datetime.date(year, month, 1)
                if month == 12:
                    end_date = datetime.date(year + 1, 1, 1) - datetime.timedelta(days=1)
                else:
                    end_date = datetime.date(year, month + 1, 1) - datetime.timedelta(days=1)
            else:
                end_date = timezone.now().date()
                start_date = end_date.replace(day=1)

            daily_performances = DailyPerformance.objects.filter(
                kpi__in=kpis,
                date__range=[start_date, end_date]
            )
            serializer = PerformanceSerializer(daily_performances, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "User is not assigned to any department"}, status=status.HTTP_400_BAD_REQUEST)
    
    
class UpdatePerformancesView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            performance_data = DailyPerformance.objects.get(pk=pk)
        except DailyPerformance.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Check if the data is for the current date
        if performance_data.date != timezone.now().date():
            return Response({"error": "Can only update today's data"}, status=status.HTTP_403_FORBIDDEN)

        serializer = PerformanceSerializer(performance_data, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
