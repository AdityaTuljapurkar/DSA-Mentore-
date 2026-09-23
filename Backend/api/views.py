from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt 
from django.views.decorators.http import require_POST 
import json 
from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response 
from django.shortcuts import get_object_or_404
from .models import Question
from .serializers import QuestionSerializer
from django.http import HttpResponse
from django.core.cache import cache
import requests 
from rest_framework import status 
from .models import Question, UserInfo, Submitted_question  
from rest_framework.permissions import IsAuthenticated
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

    new_user = User.objects.create_user(username=username,password=password)
    try : 
        UserInfo.objects.create(user=new_user ,user_streak = 0 , last_activity = None)
        print("data saved in [DB userinfo   ]")
    except Exception as e : 
        print(f"failed to save data in DB : userinfo >>> {e}")

    return JsonResponse({'message':'Happy learning'} , status = 201 )

@api_view(['GET'])
def get_question_detail(request,ques_no):
    question_obj = get_object_or_404(Question,ques_no=ques_no)

    serializer = QuestionSerializer(question_obj)
    return Response(serializer.data)


PISTON_ENDPOINT = "http://piston-api:2000/api/v2/execute"
# Mapping language names to Piston language & version
PISTON_LANGUAGES = {
    "python": {"language": "python", "version": "*"},
    "cpp": {"language": "c++", "version": "*"},
    "java": {"language": "java", "version": "*"},
    "javascript": {"language": "javascript", "version": "*"},
}





# {
#   "run": {
#     "signal": null,
#     "stdout": "",
#     "stderr": "  File \"/box/submission/file0.code\", line 4\n    qddqd\n    ^\nIndentationError: expected an indented block after function definition on line 3\n",
#     "code": 1,
#     "output": "  File \"/box/submission/file0.code\", line 4\n    qddqd\n    ^\nIndentationError: expected an indented block after function definition on line 3\n",
#     "memory": 12432000,
#     "message": "Exited with error status 1",
#     "status": "RE",
#     "cpu_time": 34,
#     "wall_time": 83
#   },
#   "language": "python",
#   "version": "3.12.0"
# }
REDIS_ENDPOINT = 'http://localhost:6379/'
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request,ques_no):
    question = request.data.get('question')
    language = request.data.get('language','').lower()
    source_code = request.data.get('source_code')
    stdin = request.data.get('stdin','')
    stout = request.data.get('stdout',"")
    memory = request.data.get('memory')
    cpu_time = request.data.get('cpu_time')

    


    # integrating piston-api 
        # Check against PISTON_LANGUAGES (the dictionary):
    if not source_code or language not in PISTON_LANGUAGES: 
        return Response(
            {'error': f'not a valid language or source code allowed languages : {list(PISTON_LANGUAGES.keys())} '},
            status=status.HTTP_400_BAD_REQUEST
        )
    language_config = PISTON_LANGUAGES[language]
    # payload for judge0 sandbox 
    payload = {
        "language" : language_config['language']  , 

        'version' :  language_config['version'],
        'files' : [
            {
                "content" : source_code
            }
        ],
        "stdin":stdin ,
        "run_timeout" : 5000 , 
        'compile_timeout' : 10000
    }

    try : 
#   "version": "3.12.0"
        response = requests.post(PISTON_ENDPOINT,json=payload,timeout=15)
        result_data = response.json()    
        print(result_data)
        # saving the response into the database 
        try:
            save_submission_to_db(ques_no, request.user, source_code, result_data)
        except Exception as e:
            print(f"[DB SAVE ERROR] failed to save data into database: {e}")
        return Response(result_data, status=status.HTTP_200_OK)

    except requests.exceptions.Timeout as e: 
        return Response({"error :"f"Exicution Engine timeout while waiting for response {str(e)}"},status=status.HTTP_504_GATEWAY_TIMEOUT)
    except Exception as e  : 
        return Response({"error":f"failed to reach the exicution engine {str(e)} "},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def save_submission_to_db(ques_no, user, source_code, exicution_result):
    """Helper function to save submission data into PostgreSQL."""
    try:
        user_obj = UserInfo.objects.get(user=user)
        question_object = Question.objects.get(ques_no=ques_no)

        exicution_output = exicution_result.get('run', {})
        language = exicution_result.get("language", "")
        cpu_time = str(exicution_output.get('cpu_time') or 0)
        memory = str(exicution_output.get('memory') or 0)
        stdin = question_object.stdin or ""
        stdout = exicution_output.get('stdout') or ""

        submission = Submitted_question.objects.create(
            question_no=question_object,
            language=language,
            source_code=source_code,
            stdin=stdin,
            stdout=stdout,
            memory=memory,
            cpu_time=cpu_time,
            user_id=user_obj
        )
        return submission

    except UserInfo.DoesNotExist:
        print(f"[DB SAVE ERROR]: UserInfo not found for user: {user}")
        return None
    except Question.DoesNotExist:
        print(f"[DB SAVE ERROR]: Question not found: {ques_no}")
        return None
    except Exception as e:
        print(f"[DB SAVE ERROR]: Failed to persist submission: {e}")
        return None