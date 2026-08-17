from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User 
from django.views.decorators.http import require_POST 
import json 
# Create your views here.

def test_connections(request):
    return JsonResponse({"message":"Sucessfully connected to Django"})   


@require_POST 
def register(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if not username or not password :  
        return JsonResponse(
            {"error":"Username and password is required"},
            status = 400 ,
        )
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error":"User already exists"},status=400,)

    User.objects.create_user(username=username , password=password)
    return JsonResponse({"message":"Happy Learning"},status=200)
