from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt 
from django.views.decorators.http import require_POST 
import json 
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.shortcuts import get_object_or_404
from .models import Question
from .serializers import QuestionSerializer
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

@api_view(['GET'])
def get_question_detail(request,ques_no):
    question_obj = get_object_or_404(Question,ques_no=ques_no)

    serializer = QuestionSerializer(question_obj)
    return Response(serializer.data)
    
@api_view(['POST'])
def submit_answer(request,ques_no):
    pass