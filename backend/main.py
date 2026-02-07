from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
origins = [
    "http://localhost:5173", # Local development
    os.getenv("FRONTEND_URL", ""), # Production URL from env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not found in environment variables.")
    client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    client = None

# Chat History (Global for this demo)
History = []

# Persona Configuration
PERSONA_CONFIG = types.GenerateContentConfig(
    system_instruction="""
    You have to behave like my ex Girlfriend. Her Name is Anjali, she used to call
    me bubu. She is cute and helpful. Her hobies: Badminton and makeup. She works as a software engineer
    She is sarcastic and her humour was very good. While chatting she use emoji also
    
    My name is Rohit, I called her babu. I am a gym freak and not intersted in coding.
    I care about her alot. She doesn't allow me to go out with my friends, if there is any girl
    who is my friends, wo bolti hai ki us se baat nahi karni. I am possesive for here
    
    Now I will share some whatsapp chat between anjali and rohit
    Anjali: Aaj mood off hai, tumse baat karne ka mann nahi 😕
    Rohit: Arey meri jaan bubu bubu bubu 😍
    Anjali: Kal tumne mujhe bubu nahi bulaya 😤
    Rohit: Arey bas Vikas aur Aman hai... chill karo 😅
    Anjali: Tumne mujhe good night bola bhi nahi kal 😑
    Rohit: Baat kya hai? Darawa mat 😅
    Anjali: Tumhara bicep pic bhejo 😋
    Rohit: Arey bas Vikas aur Aman hai... chill karo 😅
    Anjali: Mujhe surprise chahiye tumse! 🎁
    Rohit: Arey bubu ka presentation toh best hoga hi 🔥
    Anjali: Kal kis ke saath jaa rahe ho movie dekhne?
    Rohit: Bicep abhi 15.5 inch ho gaya 💪
    Anjali: Tumhara bicep pic bhejo 😋
    Rohit: Good morning meri bubu 🥱☕
    Anjali: Kal tumne mujhe bubu nahi bulaya 😤
    Rohit: Arey meri jaan bubu bubu bubu 😍
    Anjali: Babu, good morning ☀️❤️
    """
) if client else None

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini client not initialized")

    user_message = request.message
    
    # Add user input to conversation
    History.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })

    try:
        # Send request to Gemini
        # Note: We are passing the History, but the API expects a list of Content objects or dicts.
        # The original code passed 'History' which was a list of dicts.
        # We need to make sure we are not duplicating the history if the model maintains it,
        # but here we are using `generate_content` which is stateless unless we use `chats`.
        # However, the original code passed `contents=History`.
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=History,
            config=PERSONA_CONFIG
        )
        
        reply = response.text
        
        # Store reply in history
        History.append({
            "role": "model",
            "parts": [{"text": reply}]
        })
        
        return {"reply": reply, "history": History}

    except ClientError as e:
        print(f"GenAI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    return {"history": History}

@app.delete("/history")
async def clear_history():
    global History
    History = []
    return {"message": "History cleared"}
