import os
from dotenv import load_dotenv
from .models import Question, UserInfo, Submitted_question
import json 
from rest_framework import status 
from pathlib import Path 
from rest_framework.response import Response 
from pathlib import Path
from datetime import datetime
# /home/adity/Documents/DSA_mentor/Backend/api/AI_api.py
# /home/adity/Documents/DSA_mentor/Backend/prompts
load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[1]

PROMPT_ROOT = BASE_DIR / "prompts"

SYSTEM_PROMPT_PATH = PROMPT_ROOT / "System_Prompt_Template.md"
USER_PROMPT_PATH = PROMPT_ROOT / "User_Prompt_Template.md"

SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
USER_PROMPT_TEMPLATE = USER_PROMPT_PATH.read_text(encoding="utf-8")




if SYSTEM_PROMPT_PATH.exists():
    SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
else:
    print(f"[WARNING]: {SYSTEM_PROMPT_PATH} not found!")
    
    

if USER_PROMPT_PATH.exists():
    USER_PROMPT = USER_PROMPT_PATH.read_text(encoding="utf-8")
else:
    print(f"[WARNING]: {SYSTEM_PROMPT_PATH} not found!")
    

def AI_question_review(user, ques_no):
    try:
        submission = Submitted_question.objects.filter(
            question_no=ques_no
        ).order_by('-id').first()
        user =  UserInfo.objects.filter(
            user = user
        ).order_by('-id').first()

        if not submission:
             return Response(
        {"error": "No submission found"},
        status=status.HTTP_404_NOT_FOUND
    )

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
        print(f' [AI_question_review : ]  {review}') 
        return Response({'message':review},status=status.HTTP_200_OK)

    
    except Exception as e:
      now = datetime.now()
      print(f"[AI REVIEW ERROR]: {e}  TIME :{now.strftime("%H:%M:%S")} ")

      return Response(
          {"error": "Failed to generate AI review"},
          status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )

from openai import OpenAI
def AI_review(prompt):
    load_dotenv()
    API_KEY = os.getenv("AI_API_KEY") 
    print(f"API_key : {API_KEY}")
    
    client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=f"{API_KEY}",
)

    try:
        interaction = client.chat.completions.create(
            model="nvidia/nemotron-3.5-super-vl:free",
             messages=[
                      {
                        "role":'system' ,
                        "content": SYSTEM_PROMPT
                      },
                      {
                          "role":'user' ,
                          'content':prompt
                      }

                    ],
        )
        response_text = interaction.choices[0].message.content

        if not response_text:
            raise ValueError("AI returned an empty response")

        try:
            review_data = json.loads(response_text)
        except json.JSONDecodeError:
            return {"review": response_text}

        if not isinstance(review_data, dict):
            return {"review": response_text}

        return review_data
                  
    except Exception as e:
      print(f"[AI ERROR]: {e}")
      return f"[AI ERROR]: {e}"

 

     