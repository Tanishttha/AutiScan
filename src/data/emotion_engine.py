

import random
from datetime import datetime

EMOTIONS = [
    {
        "emotion": "Happy",
        "emoji": "😊",
        "color": "green",
        "response": "You look happy today! Keep smiling and learning 🌟"
    },
    {
        "emotion": "Excited",
        "emoji": "🤩",
        "color": "yellow",
        "response": "Wow! Your excitement is amazing 🚀"
    },
    {
        "emotion": "Calm",
        "emoji": "😌",
        "color": "blue",
        "response": "You are calm and focused today ✨"
    },
    {
        "emotion": "Sad",
        "emoji": "😢",
        "color": "purple",
        "response": "It is okay to feel sad. Let's practice together 💖"
    },
    {
        "emotion": "Confused",
        "emoji": "😕",
        "color": "orange",
        "response": "No worries. We will learn slowly together 🌈"
    }
]

ENCOURAGEMENTS = [
    "🌟 Amazing effort!",
    "🎉 Great speaking today!",
    "🚀 Keep practicing slowly!",
    "👏 Fantastic pronunciation!",
    "💖 You are learning wonderfully!",
    "😊 Your communication is improving!"
]


def analyze_emotion(user_data=None):

    detected = random.choice(EMOTIONS)

    confidence = random.randint(72, 98)

    stability = random.randint(65, 96)

    focus = random.randint(70, 99)

    return {
        "status": "success",
        "detected_emotion": detected["emotion"],
        "emoji": detected["emoji"],
        "color": detected["color"],
        "confidence": confidence,
        "emotional_stability": stability,
        "focus_score": focus,
        "ai_response": detected["response"],
        "encouragement": random.choice(ENCOURAGEMENTS),
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }



def adaptive_emotion_support(emotion):

    emotion = emotion.lower()

    if emotion == "happy":
        return {
            "activity": "Storytelling Game",
            "difficulty": "Medium",
            "message": "Let's learn new words together 🌈"
        }

    if emotion == "excited":
        return {
            "activity": "Fast Speaking Challenge",
            "difficulty": "Hard",
            "message": "Your energy is amazing today 🚀"
        }

    if emotion == "sad":
        return {
            "activity": "Slow Calm Breathing",
            "difficulty": "Easy",
            "message": "Take your time. We are learning together 💖"
        }

    if emotion == "confused":
        return {
            "activity": "Phonics Practice",
            "difficulty": "Easy",
            "message": "Let's practice slowly step by step ✨"
        }

    return {
        "activity": "Conversation Practice",
        "difficulty": "Medium",
        "message": "Keep practicing and having fun 😊"
    }



def realtime_emotion_metrics():


    return {
        "attention_level": random.randint(65, 98),
        "emotion_recognition": random.randint(70, 97),
        "speech_confidence": random.randint(68, 95),
        "gaze_stability": random.randint(60, 94),
        "engagement_score": random.randint(72, 99)
    }