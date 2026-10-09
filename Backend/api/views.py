import os
from dotenv import load_dotenv
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt 
from django.views.decorators.http import require_POST 
import json 
from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response 
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
from .models import Question
from .serializers import QuestionSerializer
from django.http import HttpResponse
from django.core.cache import cache
import requests 

from rest_framework import status 
from .models import Question, UserInfo, Submitted_question ,Dashboard  
from rest_framework.permissions import IsAuthenticated
from api.AI_api import AI_review , AI_question_review
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
def get_question_detail(request, ques_no):
    try:
        question = Question.objects.get(ques_no=ques_no)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("[failed while fetching data from the Question DB]", e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    


PISTON_ENDPOINT = "http://piston-api:2000/api/v2/execute"
# Mapping language names to Piston language & version
PISTON_LANGUAGES = {
    "python": {"language": "python", "version": "*"},
    "cpp": {"language": "c++", "version": "*"},
    "java": {"language": "java", "version": "*"},
    "javascript": {"language": "javascript", "version": "*"},
}


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
    user = request.data.get('user')

    


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
        run_data = result_data.get("run")
        print(result_data)

        # saving the response into the database 
        try:
            save_submission_to_db(ques_no, request.user, source_code, result_data)
            

        except Exception as e:
            print(f"[DB SAVE ERROR] failed to save data into database: {e}")
        dashbord = None
        try : 
            question_title = Question.objects.get(
        ques_no=ques_no
    ).question
            
            dashbord =Dashboard.objects.filter(
        username=request.user,
        question=question_title
    ).first()
        except Exception as e : 
            print("failed to locate Dashboed in function submit_answer : ",e)
        if run_data.get("code") == 1:
            if dashbord:
                dashbord.remark = str(e) if 'e' in locals() else run_data.get("stderr")
                submission_status = False  # <--- Renamed from `status`
            return Response({'error': f"{run_data.get('stderr')}"}, status=status.HTTP_200_OK)
        
        else : 
            ai_res =  AI_question_review(user, ques_no)   
            if dashbord : 
                try : 
                    review_data = ai_res.data

                    execution_analysis = (
                            review_data
                            .get("message", {})
                            .get("execution_analysis", {})
                        )

                    dashbord.remark = str(
                        execution_analysis.get("interpretation", "")
                    )
                    dashbord.save(update_fields=["remark"])
             
                
                except Exception as e : 
                    print("failed to add the exicution anaylsis data in the dasbhboed DB [Submit_analysis]",e)
            
            return Response({
                "message":{
                    "code_output":run_data.get("output"),
                    "ai_review":ai_res.data
                }
            },status=status.HTTP_202_ACCEPTED)
        
        

    except requests.exceptions.Timeout as e: 
        return Response({"error :"f"Exicution Engine timeout while waiting for response {str(e)}"},status=status.HTTP_504_GATEWAY_TIMEOUT)
    except Exception as e  : 
        return Response({"error":f"failed to reach the exicution engine {str(e)} "},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def save_submission_to_db(ques_no, user, source_code, exicution_result):
    """Helper function to save submission data into PostgreSQL."""
    try:
        user_obj = UserInfo.objects.get(user=user)
        question_object = Question.objects.get(ques_no=ques_no)
        question_title = question_object.question

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
        # ----------savving InFO to redis 
        username = user.username 
        QUESTION_KEY = f"{username}:{ques_no}:source_code"
        RESULT_KEY = f"{username}:{ques_no}:result"
        # cache timeout for 3 days  
        cache.set(QUESTION_KEY,source_code,timeout=259200)
        cache.set(RESULT_KEY,exicution_result,timeout=259200)
        print(f"[REDIS CACHED] saved {QUESTION_KEY} and {RESULT_KEY}")
        




    except UserInfo.DoesNotExist:
        print(f"[DB SAVE ERROR]: UserInfo not found for user: {user}")
        return None
    except Question.DoesNotExist:
        print(f"[DB SAVE ERROR]: Question not found: {ques_no}")
        return None
    except Exception as e:
        print(f"[DB SAVE ERROR]: Failed to persist submission: {e}")
        return None
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cache_code(request, ques_no):
    username = request.user.username
    QUESTION_KEY = f"{username}:{ques_no}:source_code"

    # 1. Try Redis (Cache HIT)
    cached_code = cache.get(QUESTION_KEY)
    if cached_code is not None:
        print(f"[CACHE HIT]: {QUESTION_KEY}")
        return Response({"source_code": cached_code}, status=status.HTTP_200_OK)

    # 2. Cache MISS -> Try PostgreSQL
    submission = Submitted_question.objects.filter(
        user_id__user=request.user,
        question_no=ques_no
    ).order_by('-id').first()

    if submission:
        cache.set(QUESTION_KEY, submission.source_code, timeout=259200)
        print(f"[CACHE MISS -> DB HIT]: Cached {QUESTION_KEY}")
        return Response({"source_code": submission.source_code}, status=status.HTTP_200_OK)

    # 3. No code found -> frontend loads STARTER_TEMPLATES
    return Response({"source_code": None}, status=status.HTTP_200_OK)
def dashboard_set_data(username,question,review):
    query = Dashboard.objects.filter(
        username = username , question = question
    )
    try :
        query.review = review 
        print("Review adding in the Dashboard")
    except Exception as e :
        print(f"failed to update review into databse : {e}")
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    data = Dashboard.objects.filter(username=request.user)
    try :
        questions_payload = [{
            'sr_no': item.sr_no,
            'question': item.question,
            'solution_note': item.solution_note,
            'topic': item.topic,
            'date': item.date,
            'remark': item.remark,
            'subtopic': item.subtopic,
            'status': item.status
        } for item in data]

        return Response({
            "username": request.user.username,
            "questions": questions_payload
        }, status=status.HTTP_200_OK)
       
    except Exception as e : 
        print("[Dashbord Response Error] : ",e)
        return Response("error : falied to react server",status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def post_dashboard_data(request,payload):
    username = request.user
    question = payload.question 
    solution_note = payload.solution_note or None 
    topic =  payload.topic 
    subtopic = payload.subtopic
    remark = payload.remark

    last_sr_no =  Dashboard.objects.filter(username=username).order_by('-sr_no').first()
    if last_sr_no :
        new_sr_no += last_sr_no
    else : 
        new_sr_no =  1 
    try : 
        Dashboard.objects.create(
        username = username ,
        question=question,
        topic=topic ,
        subtopic=subtopic ,
        remark = remark, 
        sr_no = new_sr_no
    ) 
        
        
        print("[POST DASHBOARD DATA DONE]")
    except Exception as e : 
        print(f"[CREATE DASHBOARD DATA ERROR],{e}")

# this function will be called by the AI 
# this function will be called by the AI 
def create_question(request, payload):
    try:
        Question.objects.create(
            question = payload.get("question"), 
            question_content = payload.get("content", ""), 
            constraints = payload.get("constraints", ""), 
            timeLimit = payload.get("timelimit", 1.0), 
            memoryLimit = payload.get("memory_limit", 128), 
            subtopic = payload.get("subtopic") or None,
            hint_1 = payload.get("hint1", ""), 
            hint_2 = payload.get("hint2", ""), 
            hint_3 = payload.get("hint3", ""), 
            topic = payload.get("topic", "General"), 
            stdin = payload.get("stdin", "")
        )
        print("[new question saved in DB]")
    except Exception as e:
        print("[Error while saving the new Question in DB]:", e)
        return Response({"error": f"Failed to save Question: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        last_entry = Dashboard.objects.filter(username=request.user).order_by('-sr_no').first()
        new_sr_no = (last_entry.sr_no + 1) if (last_entry and last_entry.sr_no) else 1

        Dashboard.objects.create(
            username = request.user,
            question = payload.get("question"),
            topic = payload.get("topic", "General"),
            subtopic = payload.get("subtopic") or None,
            remark = None,
            sr_no = new_sr_no,
            status = False
        )
        print("[new question added to Dashboard DB]")
    except Exception as e:
        print(f"[failed to save the question data in dashboard DB]: {e}")

    # Return a DRF Response so test_create_question returns a valid HTTP response
    return Response({"message": "Question created successfully"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def test_create_question(request):
    payload = request.data
    return create_question(request, payload)
    



    




