from django.shortcuts import render
    

# Create your views here.
from django.http import JsonResponse

def test_connections(request):
    return JsonResponse({"message":"Sucessfully connected to Django"})   


