import os
import time
import requests
import json
import re
import random
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b").strip()
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

if GROQ_API_KEY:
    print("✅ Groq Autism AI Teacher Enabled")
else:
    print("⚠️ Groq API key missing. Set GROQ_API_KEY in .env to enable live AI responses.")

chat_history = []
GROQ_RATE_LIMIT_COOLDOWN_SECONDS = 45
LAST_GROQ_RATE_LIMIT = 0.0


def _is_groq_rate_limited():
    return (time.time() - LAST_GROQ_RATE_LIMIT) < GROQ_RATE_LIMIT_COOLDOWN_SECONDS


def _missing_groq_reply(user_message="", child_name="Friend"):
    text = (user_message or "").strip().lower()
    if not text:
        return f"Hi {child_name}! Please add a valid GROQ_API_KEY in your .env file to enable live AI teaching."
    if any(word in text for word in ["hello", "hi", "hey"]):
        return f"Hi {child_name}! I need a valid Groq API key to respond live."
    if any(word in text for word in ["how are you", "how r you", "how are u"]):
        return f"I am ready, {child_name}! Add your Groq key to chat with me live."
    return f"Nice try, {child_name}! Please add a valid Groq API key and model to enable my live replies."


def generate_magic_story(hero_name="Your Hero", prompt="A kind child helps a friend in a magical forest"):
    safe_hero = (hero_name or "Your Hero").strip() or "Your Hero"
    safe_prompt = (prompt or "A kind child helps a friend in a magical forest").strip() or "A kind child helps a friend in a magical forest"

    fallback_story = {
        "title": f"{safe_hero}'s Sparkle Adventure",
        "hero": safe_hero,
        "topic": safe_prompt,
        "pages": [
            {
                "pageNumber": 1,
                "text": f"Once upon a time, {safe_hero} followed a glowing path through a magical forest and discovered a secret world full of wonder.",
                "illustrationEmoji": "🌲✨",
                "sceneTheme": "from-amber-400/20 via-orange-300/15 to-transparent",
                "focusWord": "Wonder"
            },
            {
                "pageNumber": 2,
                "text": f"A gentle friend smiled and said that kindness makes every step brighter. {safe_hero} shared a helping hand and learned that caring hearts can make magic together.",
                "illustrationEmoji": "🧡🤝",
                "sceneTheme": "from-sky-400/20 via-blue-300/15 to-transparent",
                "focusWord": "Kindness"
            },
            {
                "pageNumber": 3,
                "text": f"Together they followed the rainbow trail home, carrying courage, friendship, and a happy story for every child to hear again and again.",
                "illustrationEmoji": "🌈💛",
                "sceneTheme": "from-purple-400/20 via-pink-300/15 to-transparent",
                "focusWord": "Together"
            }
        ]
    }

    if not GROQ_API_KEY:
        return fallback_story

    if _is_groq_rate_limited():
        print("⏳ Groq rate limit active for story generation. Using safe fallback story.")
        return fallback_story

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a magical story writer for young autistic children. "
                    "Write a warm, simple, confident, child-friendly 3-page storybook. "
                    "Use short descriptive sentences, gentle language, and positive emotional moments. "
                    "Return ONLY valid JSON with this exact schema: "
                    "{\"title\":\"string\",\"hero\":\"string\",\"topic\":\"string\",\"pages\":[{\"pageNumber\":1,\"text\":\"string\",\"illustrationEmoji\":\"string\",\"sceneTheme\":\"string\",\"focusWord\":\"string\"},{...}]}. "
                    "Keep each page text under 180 characters. "
                    "Make the child the hero and use a playful, calming style."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Hero name: {safe_hero}. "
                    f"Story theme/prompt: {safe_prompt}. "
                    "Create a three-page storybook in JSON only."
                )
            }
        ],
        "temperature": 0.9,
        "max_tokens": 700
    }

    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=25)

        if response.status_code == 429:
            global LAST_GROQ_RATE_LIMIT
            LAST_GROQ_RATE_LIMIT = time.time()
            print(f"Groq Story API Rate Limit: {response.text}")
            return fallback_story

        if response.status_code != 200:
            print(f"Groq Story API Error: {response.status_code} {response.text}")
            return fallback_story

        response_json = response.json()
        content = response_json["choices"][0]["message"]["content"].strip()
        cleaned = content.replace("```json", "").replace("```", "").strip()

        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(0)

        parsed = json.loads(cleaned)
        pages = parsed.get("pages") or fallback_story["pages"]
        normalized_pages = []
        for index, page in enumerate(pages[:3], start=1):
            normalized_pages.append({
                "pageNumber": int(page.get("pageNumber", index)),
                "text": str(page.get("text", "")).strip() or fallback_story["pages"][index - 1]["text"],
                "illustrationEmoji": str(page.get("illustrationEmoji", "✨")).strip() or fallback_story["pages"][index - 1]["illustrationEmoji"],
                "sceneTheme": str(page.get("sceneTheme", "from-blue-400/20 to-transparent")).strip() or "from-blue-400/20 to-transparent",
                "focusWord": str(page.get("focusWord", "Wonder")).strip() or "Wonder"
            })

        if len(normalized_pages) < 3:
            while len(normalized_pages) < 3:
                normalized_pages.append(fallback_story["pages"][len(normalized_pages)])

        return {
            "title": str(parsed.get("title") or f"{safe_hero}'s Adventure").strip() or f"{safe_hero}'s Adventure",
            "hero": str(parsed.get("hero") or safe_hero).strip() or safe_hero,
            "topic": str(parsed.get("topic") or safe_prompt).strip() or safe_prompt,
            "pages": normalized_pages
        }

    except Exception as exc:
        print("❌ Groq Story Error:", exc)
        return fallback_story


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

    if not GROQ_API_KEY:
        return {
            "lesson": {
                "word": "Apple",
                "title": "AI key required",
                "text": f"Hi {child_name}! Please add your GROQ_API_KEY in the .env file to enable live lessons."
            },
            "conversation": {
                "messages": [{"role": "assistant", "text": f"Hi {child_name}! Please add your GROQ_API_KEY in the .env file to enable live lessons."}]
            },
            "live_mode": True
        }

    if _is_groq_rate_limited():
        print("⏳ Groq rate limit active for lesson generation. Using fallback lesson.")
        return default_response

    payload = {
        "model": GROQ_MODEL,
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

        if response.status_code == 429:
            global LAST_GROQ_RATE_LIMIT
            LAST_GROQ_RATE_LIMIT = time.time()
            print(f"Groq Lesson API Rate Limit: {response.text}")
            return default_response

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

    if not GROQ_API_KEY:
        ai_reply = _missing_groq_reply(user_message, child_name)
        chat_history.append({"role": "assistant", "text": ai_reply})
        return {"reply": ai_reply, "history": chat_history}

    if _is_groq_rate_limited():
        ai_reply = _missing_groq_reply(user_message, child_name)
        chat_history.append({"role": "assistant", "text": ai_reply})
        return {"reply": ai_reply, "history": chat_history}

    payload = {
        "model": GROQ_MODEL,
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

        if response.status_code == 429:
            global LAST_GROQ_RATE_LIMIT
            LAST_GROQ_RATE_LIMIT = time.time()
            print(f"Groq Chat API Rate Limit: {response.text}")
            ai_reply = _missing_groq_reply(user_message, child_name)
        elif response.status_code == 200:

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

            ai_reply = _missing_groq_reply(user_message, child_name)

    except Exception as e:

        print(
            "❌ Groq Chat Error:",
            e
        )

        ai_reply = _missing_groq_reply(user_message, child_name)

    chat_history.append({
        "role": "assistant",
        "text": ai_reply
    })

    return {
        "reply": ai_reply,
        "history": chat_history
    }