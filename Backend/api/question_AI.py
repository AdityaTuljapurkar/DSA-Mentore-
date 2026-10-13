
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path

load_dotenv()

BASE_DIR = Path(__file__).resolve().parents[1]

QUESTION_PROMPT_PATH = (
    BASE_DIR / "prompts" / "Question_Generator_System_Prompt.md"
)

QUESTION_PROMPT = QUESTION_PROMPT_PATH.read_text(
    encoding="utf-8"
)


def AI_question_create(payload):
    API_KEY = os.getenv("AI_API_KEY")

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=API_KEY
    )

    try:
        print("[AI] Requesting question generation...")

        interaction = client.chat.completions.create(
            model="nvidia/nemotron-3.5-lightning:free",
            messages=[
                {
                    "role": "system",
                    "content": QUESTION_PROMPT
                },
                {
                    "role": "user",
                    "content": json.dumps(payload)
                }
            ],
            
            extra_body={
                "reasoning": {"effort": "low"}
            },
            response_format={"type": "json_object"}
        )

        message = interaction.choices[0].message
        response_text = message.content

        print("[AI_question_create RAW]:", response_text)

        if not response_text:
            return {"error": "AI returned empty response"}

        data = json.loads(response_text)
        print("[question AI] response data",data)
        return data

    except json.JSONDecodeError:
        return {"error": "AI returned invalid JSON"}

    except Exception as e:
        print("[AI_question_create ERROR]:", e)
        return {"error": str(e)}
