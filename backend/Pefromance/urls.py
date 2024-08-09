from django.urls import path
from .views import UserDailyPerformancesView
from .views import UpdatePerformancesView

urlpatterns = [
    path('performanceData/', UserDailyPerformancesView.as_view(), name='performanceData'),
    path('updateValue/<int:pk>/', UpdatePerformancesView.as_view(), name='updateValue'),
]   