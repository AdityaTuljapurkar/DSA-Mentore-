from django.urls import path 
from api import views
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView

urlpatterns = [
    path("api/login/",TokenObtainPairView.as_view(),name = 'login'),
    path('api/token/refresh',TokenRefreshView.as_view(),name="token-refresh"),
    path("api/register",views.register , name="register"),
    path("api/test", views.test_connections, name="test-connections"),
    path("api/questions/<int:ques_no>/",views.get_question_detail,name='question_detail'),
    path('api/submissions/<int:ques_no>',views.submit_answer,name='submit_answer')  
]
