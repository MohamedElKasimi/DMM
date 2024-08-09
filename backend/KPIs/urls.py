from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import KPIViewSet

router = DefaultRouter()
router.register(r'kpis', KPIViewSet, basename='kpi')

urlpatterns = [
    # If you have any custom views, add them here
] + router.urls