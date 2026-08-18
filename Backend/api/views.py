from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt 
from django.views.decorators.http import require_POST 
import json 
# Create your views here.

def test_connections(request):
    return JsonResponse({"message":"Sucessfully connected to Django"})   

@csrf_exempt
@require_POST 
def register(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if not username or not password : 
        return JsonResponse({'error':'username and password are required'},status=400)
    if  User.objects.filter(username=username).exists():
        return JsonResponse({'error':'username already exists'})

    User.objects.create_user(username=username,password=password)
    return JsonResponse({'message':'Happy learning'} , status = 201 )
    