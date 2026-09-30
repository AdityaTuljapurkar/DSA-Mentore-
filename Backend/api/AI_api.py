import os
from dotenv import load_dotenv
from google import genai
from .models import Question, UserInfo, Submitted_question
import json 
from rest_framework import status 




def AI_question_review(user, ques_no):
    try:
        submission = Submitted_question.objects.filter(
            question_no=ques_no
        ).order_by('-id').first()
        user =  UserInfo.objects.filter(
            user = user
        ).order_by('-id').first()

        if not submission:
            data =  {
                "error": "No submission found" , 
                "status" : status.HTTP_404_NOT_FOUND
                }

        question = submission.question_no

        data = {
            "question": question.question,
            "source_code": submission.source_code,
            "stdin": submission.stdin,
            "stdout": submission.stdout,
            "memory": submission.memory,
            "time": submission.cpu_time,
            "topic": question.topic,
            "language": submission.language
        }

        payload = f"""
Review my DSA submission according to your mentoring instructions.
Analyze the actual code and its output. First determine whether the logic
is correct. Do not rewrite correct code merely to improve its style.
If there is a bug, identify the exact line and explain it using a small
counterexample. Give me hints instead of the complete solution unless
I explicitly request the solution.
Submission data:
{json.dumps(data, ensure_ascii=False, indent=2)}
"""
        review = AI_review(payload)
        data =  json.dumps({"review": review, 'status':status.HTTP_200_OK})
        print(f' [AI_question_review : ]  {data}') 
        return data 

    except Exception as e:
        print(f"[AI REVIEW ERROR]: {e}")
        data =  json.dumps({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(f' [AI_question_review (error): ]  {data}') 
        return data 

def AI_review(prompt):
    load_dotenv()
    API_KEY = os.getenv("AI_API_KEY") or 'AQ.Ab8RN6IzlizZF7djPNDhnQefPyUqrvR_Es5Rxk-O5t7HTKWk4A'
    client = genai.Client(api_key=API_KEY)

    try:
        interaction = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )
        return interaction.text
    except Exception as e:
        print(f"[AI ERROR]: {e}")
        return f"[AI ERROR]: {e}"