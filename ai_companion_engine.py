import requests
import json
import re
import random

GROQ_API_KEY = "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"

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

print("✅ Groq Autism AI Teacher Enabled")

chat_history = []


def generate_ai_lesson(
    child_name="Friend",
    confidence=50,
    interests=None
):

    global chat_history

    if interests is None:
        interests = ["animals", "cars"]

    interests_str = ", ".join(interests)

    prompt = (
        "You are an expert AI Teacher for autistic children. "
        f"Create ONE simple speaking lesson for {child_name}. "
        f"The child likes {interests_str}. "

        "IMPORTANT RULES: "
        "Return ONLY ONE JSON object. "
        "Do NOT return an array. "
        "Do NOT return multiple lessons. "
        "Do NOT add explanations. "

        "JSON format must be exactly like this: "
        "{ "
        "\"word\": \"single word\", "
        "\"title\": \"short title\", "
        "\"text\": \"friendly lesson text\" "
        "}"
    )

    default_msg = (
        f"😊 Hi {child_name}! "
        "Today we will learn the word Apple."
    )

    default_response = {
        "lesson": {
            "word": "Apple",
            "title": "Healthy Fruits",
            "text": default_msg
        },
        "conversation": {
            "messages": [
                {
                    "role": "assistant",
                    "text": default_msg
                }
            ]
        },
        "live_mode": True
    }

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful AI teacher for autistic children."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 300
    }

    try:

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            GROQ_URL,
            headers=headers,
            json=payload,
            timeout=20
        )

        if response.status_code == 200:

            res_data = response.json()

            clean_text = (
                res_data["choices"][0]
                ["message"]["content"]
                .strip()
                .replace("```json", "")
                .replace("```", "")
            )

            print("RAW GROQ RESPONSE:", clean_text)

            # Extract first valid JSON object safely
            matches = re.findall(
                r"\{(?:[^{}]|(?:\{[^{}]*\}))*\}",
                clean_text,
                re.DOTALL
            )

            if matches:
                clean_text = matches[0]

            try:
                lesson_json = json.loads(clean_text)

            except Exception:
                lesson_json = {
                    "word": "Friend",
                    "title": "Learning Together",
                    "text": clean_text[:150]
                }

            txt = lesson_json.get(
                "text",
                "Let's learn together!"
            )

            wrd = lesson_json.get(
                "word",
                "Apple"
            )

            ttl = lesson_json.get(
                "title",
                "Fun Learning"
            )

            chat_history = [
                {
                    "role": "assistant",
                    "text": txt
                }
            ]

            return {
                "lesson": {
                    "word": wrd,
                    "title": ttl,
                    "text": txt
                },
                "conversation": {
                    "messages": chat_history
                },
                "live_mode": True
            }

        else:

            print(
                f"Groq API Error Status: {response.status_code}, "
                f"Response: {response.text}"
            )

            return default_response

    except Exception as e:

        print(
            "❌ Groq Teacher Error:",
            e
        )

        return default_response


def generate_live_ai_chat(
    user_message,
    child_name="Friend"
):

    global chat_history

    chat_history.append({
        "role": "user",
        "text": user_message
    })

    chat_history = chat_history[-10:]

    messages = [
        {
            "role": "system",
            "content": (
                "You are a friendly AI Teacher for autistic children. "
                "IMPORTANT RULES: "
                "Keep replies VERY short. "
                "Maximum 5 to 8 words only. "
                "Use simple child-friendly language. "
                "Sound warm and encouraging. "
                "Ask only ONE tiny follow-up question."
            )
        }
    ]

    for msg in chat_history:
        messages.append({
            "role": "assistant" if msg["role"] == "assistant" else "user",
            "content": msg["text"]
        })

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 35
    }

    try:

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            GROQ_URL,
            headers=headers,
            json=payload,
            timeout=20
        )

        if response.status_code == 200:

            res_data = response.json()

            ai_reply = (
                res_data["choices"][0]
                ["message"]["content"]
                .strip()
            )

        else:

            print(
                f"Groq Chat API Error: {response.status_code}",
                response.text
            )

            fallbacks = [
                "😊 Wow! Can you tell me more?",
                "🌈 That sounds exciting!",
                "🚀 Great talking! What happened next?",
                "🎉 I am listening carefully.",
                "✨ Very nice speaking!"
            ]

            ai_reply = random.choice(
                fallbacks
            )

    except Exception as e:

        print(
            "❌ Groq Chat Error:",
            e
        )

        fallbacks = [
            "😊 Wow! Can you tell me more?",
            "🌈 That sounds exciting!",
            "🚀 Great talking! What happened next?",
            "🎉 I am listening carefully.",
            "✨ Very nice speaking!"
        ]

        ai_reply = random.choice(
            fallbacks
        )

    chat_history.append({
        "role": "assistant",
        "text": ai_reply
    })

    return {
        "reply": ai_reply,
        "history": chat_history
    }