from django.urls import path 
from api import views

urlpatterns = [
    path("api/test", views.test_connections, name="test-connections")
]
