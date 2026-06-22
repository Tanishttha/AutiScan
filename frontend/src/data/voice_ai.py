import random
from datetime import datetime

POSITIVE_FEEDBACK = [
    "🌟 Amazing pronunciation!",
    "🎉 Wonderful speaking effort!",
    "👏 Great job saying the word slowly!",
    "🚀 Fantastic communication practice!",
    "😊 Your speaking is improving every day!"
]

PRACTICE_FEEDBACK = [
    "💖 Let's practice together slowly.",
    "✨ Listen carefully and repeat after me.",
    "🎤 Try saying the word one more time.",
    "🌈 You are learning beautifully.",
    "🧠 Break the word into smaller sounds slowly."
]



def split_phonics(word):


    clean_word = "".join(
        char for char in word if char.isalpha()
    )

    phonics = [
        clean_word[i:i + 2]
        for i in range(0, len(clean_word), 2)
    ]

    return phonics if phonics else [word]



def pronunciation_score(spoken_text, target_word):


    spoken = spoken_text.lower().strip()
    target = target_word.lower().strip()

    if spoken == target:
        return 100

    matching = sum(
        1 for char in spoken
        if char in target
    )

    return min(
        95,
        int((matching / max(len(target), 1)) * 100)
    )



def analyze_voice(spoken_text, target_word):


    score = pronunciation_score(
        spoken_text,
        target_word
    )

    phonics = split_phonics(target_word)

    is_correct = score >= 80

    feedback = (
        random.choice(POSITIVE_FEEDBACK)
        if is_correct
        else random.choice(PRACTICE_FEEDBACK)
    )

    practice_repetitions = (
        0 if is_correct
        else random.randint(5, 10)
    )

    return {
        "status": "success",
        "spoken_text": spoken_text,
        "target_word": target_word,
        "score": score,
        "correct": is_correct,
        "phonics": phonics,
        "feedback": feedback,
        "practice_required": practice_repetitions,
        "slow_pronunciation": " - ".join(phonics),
        "generated_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }



def adaptive_difficulty(level):
 

    if level <= 1:
        return {
            "difficulty": "Easy",
            "word_length": "Short",
            "speech_speed": "Slow",
            "focus": "Basic pronunciation"
        }

    if level <= 3:
        return {
            "difficulty": "Medium",
            "word_length": "Moderate",
            "speech_speed": "Normal",
            "focus": "Sentence communication"
        }

    return {
        "difficulty": "Advanced",
        "word_length": "Long",
        "speech_speed": "Interactive",
        "focus": "Conversation and storytelling"
    }



def realtime_voice_metrics():


    return {
        "speech_confidence": random.randint(70, 98),
        "pronunciation_accuracy": random.randint(68, 97),
        "clarity_score": random.randint(65, 96),
        "communication_score": random.randint(72, 99),
        "engagement_level": random.randint(74, 100)
    }
