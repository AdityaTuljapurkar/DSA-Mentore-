import os
from dotenv import load_dotenv
from google import genai

# Load .env file
load_dotenv()

API_KEY = os.getenv("AI_API_KEY")
client = genai.Client(api_key=API_KEY)

interaction = client.interactions.create(
    model="gemini-3.6-flash",  # Note: Gemini model name is usually gemini-2.5-flash or gemini-1.5-flash
    input="I am testing django secret KEY" 
)
print(interaction)