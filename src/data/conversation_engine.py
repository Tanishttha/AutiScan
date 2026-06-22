import random
from datetime import datetime

GREETING_MESSAGES = [
    "Hello friend 😊",
    "Hi there 🌈",
    "Welcome back superstar 🚀",
    "Let's learn together ✨",
    "I am happy to practice with you 💖"
]

QUESTIONS = [
    {
        "category": "Greeting",
        "question": "Can you say hello?",
        "target": "hello",
        "difficulty": "easy"
    },
    {
        "category": "Animals",
        "question": "Can you say butterfly?",
        "target": "butterfly",
        "difficulty": "medium"
    },
    {
        "category": "Food",
        "question": "Can you say apple?",
        "target": "apple",
        "difficulty": "easy"
    },
    {
        "category": "Conversation",
        "question": "What is your name?",
        "target": "my name is",
        "difficulty": "medium"
    },
    {
        "category": "Emotion",
        "question": "How are you feeling today?",
        "target": "happy",
        "difficulty": "easy"
    },
    {
        "category": "Social Skills",
        "question": "Can you say thank you?",
        "target": "thank you",
        "difficulty": "easy"
    }
]

POSITIVE_RESPONSES = [
    "🌟 Amazing speaking!",
    "🎉 Wonderful pronunciation!",
    "👏 Great communication!",
    "🚀 Fantastic effort!",
    "😊 You are improving every day!"
]

PRACTICE_RESPONSES = [
    "💖 Let's practice slowly together.",
    "✨ Listen carefully and repeat after me.",
    "🎤 Try saying the word again slowly.",
    "🌈 You are doing great. Keep trying.",
    "🧠 Break the word into smaller sounds slowly."
]



def generate_greeting():
    """
    Generates friendly AI greeting.
    """

    return {
        "message": random.choice(GREETING_MESSAGES),
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }



def get_random_question(level=1):
    """
    Returns adaptive question based on difficulty.
    """

    if level <= 1:
        filtered = [
            q for q in QUESTIONS
            if q["difficulty"] == "easy"
        ]

    elif level <= 3:
        filtered = QUESTIONS

    else:
        filtered = QUESTIONS

    selected = random.choice(filtered)

    return {
        "status": "success",
        "category": selected["category"],
        "question": selected["question"],
        "target": selected["target"],
        "difficulty": selected["difficulty"],
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }



def evaluate_response(user_response, expected_answer):
    """
    Evaluates conversational response quality.
    """

    user = user_response.lower().strip()
    expected = expected_answer.lower().strip()

    matching_words = sum(
        1 for word in expected.split()
        if word in user
    )

    accuracy = min(
        100,
        int(
            (matching_words /
             max(len(expected.split()), 1)) * 100
        )
    )

    success = accuracy >= 70

    return {
        "status": "success",
        "correct": success,
        "accuracy": accuracy,
        "feedback": (
            random.choice(POSITIVE_RESPONSES)
            if success
            else random.choice(PRACTICE_RESPONSES)
        ),
        "practice_required": (
            0 if success else random.randint(5, 10)
        ),
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }



def generate_social_story():
    """
    Generates child-friendly AI social story.
    """

    stories = [
        {
            "title": "Magic Jungle Adventure 🌴",
            "story": "Today we are going to the magic jungle. Can you say hello to the friendly lion?"
        },
        {
            "title": "Rainbow Rocket 🚀",
            "story": "We are flying in a rainbow rocket. Can you count the stars with me?"
        },
        {
            "title": "Happy School Day 🏫",
            "story": "Today we meet our friends at school. Can you say good morning?"
        }
    ]

    selected = random.choice(stories)

    return {
        "status": "success",
        "title": selected["title"],
        "story": selected["story"],
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }



def realtime_conversation_metrics():
    """
    Simulated realtime communication metrics.
    """

    return {
        "speech_confidence": random.randint(70, 99),
        "social_interaction": random.randint(68, 97),
        "response_time": random.randint(60, 95),
        "conversation_accuracy": random.randint(72, 98),
        "engagement_level": random.randint(75, 100)
    }
