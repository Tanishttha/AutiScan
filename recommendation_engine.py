from therapy_recommendations import therapy_data
from ai_therapy_generator import generate_ai_therapy
from datetime import datetime
import random


class RecommendationEngine:

    def __init__(self):
        self.history = []

    def generate_recommendations(self, analysis_data):

        recommendations = []
        detected_issues = []
        progress_score = 100
        badges = []
        roadmap = []
        realtime_insights = []
        adaptive_tasks = []
        emotional_state = "Stable"
        therapy_intensity = "Moderate"
        live_metrics = {}
        therapy_sessions_completed = random.randint(5, 40)
        focus_trend = random.choice([
            "Improving",
            "Stable",
            "Needs Improvement"
        ])

        attention_score = analysis_data.get("attention_score", 50)
        gaze_stability = analysis_data.get("gaze_stability", 50)
        blink_frequency = analysis_data.get("blink_frequency", 0.1)
        hyperactivity_score = analysis_data.get(
            "hyperactivity_score", 0
        )
        focus_duration = analysis_data.get(
            "focus_duration", 0
        )
        movement_variance = analysis_data.get(
            "movement_variance", 0
        )
        engagement = analysis_data.get(
            "engagement", "Unknown"
        )
        speech_confidence = analysis_data.get(
            "speech_confidence", random.randint(55, 95)
        )

        emotion_recognition = analysis_data.get(
            "emotion_recognition", random.randint(60, 95)
        )

        social_response_score = analysis_data.get(
            "social_response_score", random.randint(50, 95)
        )

        # LOW EYE CONTACT
        if gaze_stability < 45:
            detected_issues.append("Low Eye Contact")
            recommendations.append(
                therapy_data["Low Eye Contact"]
            )
            progress_score -= 15

        # ATTENTION FATIGUE
        if blink_frequency > 0.30:
            detected_issues.append("Attention Fatigue")
            recommendations.append(
                therapy_data["Attention Fatigue"]
            )
            progress_score -= 10

        # HYPERACTIVITY
        if hyperactivity_score > 70:
            detected_issues.append("Hyperactivity")
            recommendations.append(
                therapy_data["Hyperactivity"]
            )
            progress_score -= 20

        # SOCIAL INTERACTION ISSUES
        if engagement in [
            "Distracted",
            "Low Attention",
            "Partially Focused"
        ]:
            detected_issues.append("Social Interaction")
            recommendations.append(
                therapy_data["Social Interaction"]
            )
            progress_score -= 10

        # MEMORY / COGNITIVE WEAKNESS
        if focus_duration < 15:
            detected_issues.append("Memory Weakness")
            recommendations.append(
                therapy_data["Memory Weakness"]
            )
            progress_score -= 10

        # SENSORY SENSITIVITY
        if movement_variance > 5000:
            detected_issues.append("Sensory Sensitivity")
            recommendations.append(
                therapy_data["Sensory Sensitivity"]
            )
            progress_score -= 10

        # SPEECH DELAY (future integration placeholder)
        if analysis_data.get("speech_delay", False):
            detected_issues.append("Speech Delay")
            recommendations.append(
                therapy_data["Speech Delay"]
            )
            progress_score -= 15

        # SLOW VERBAL RESPONSE
        if analysis_data.get("slow_response", False):
            detected_issues.append("Slow Verbal Response")
            recommendations.append(
                therapy_data["Slow Verbal Response"]
            )
            progress_score -= 10

        # REMOVE DUPLICATES
        unique_recommendations = []
        seen_goals = set()

        for item in recommendations:
            goal = item["goal"]

            if goal not in seen_goals:
                unique_recommendations.append(item)
                seen_goals.add(goal)

        recommendations = unique_recommendations

        # REALTIME AI INSIGHTS
        if attention_score < 50:
            realtime_insights.append(
                "⚠ Low sustained attention detected during interaction."
            )
            adaptive_tasks.append(
                "2-minute focus tracking challenge"
            )

        if gaze_stability < 45:
            realtime_insights.append(
                "👁 Eye contact instability observed."
            )
            adaptive_tasks.append(
                "Mirror eye-contact exercise"
            )

        if blink_frequency > 0.30:
            realtime_insights.append(
                "😴 Cognitive fatigue indicators detected."
            )
            adaptive_tasks.append(
                "Guided breathing therapy"
            )

        if hyperactivity_score > 70:
            realtime_insights.append(
                "⚡ High movement variance detected."
            )
            adaptive_tasks.append(
                "Calm sensory balancing game"
            )
            therapy_intensity = "High"

        if speech_confidence < 60:
            realtime_insights.append(
                "🗣 Speech confidence requires improvement."
            )
            adaptive_tasks.append(
                "Phonics repetition practice"
            )

        if emotion_recognition < 65:
            emotional_state = "Emotion Recognition Difficulty"

        elif hyperactivity_score > 70:
            emotional_state = "Overstimulated"

        elif engagement == "Focused":
            emotional_state = "Calm & Engaged"

        else:
            emotional_state = "Moderately Stable"

        live_metrics = {
            "attention_level": attention_score,
            "speech_confidence": speech_confidence,
            "emotion_recognition": emotion_recognition,
            "social_response_score": social_response_score,
            "focus_duration": focus_duration,
            "gaze_stability": gaze_stability,
            "hyperactivity_score": hyperactivity_score,
            "therapy_sessions_completed": therapy_sessions_completed,
            "focus_trend": focus_trend
        }

        # BADGES
        if attention_score >= 90:
            badges.append("🏆 Focus Master")

        if gaze_stability >= 85:
            badges.append("👁 Eye Contact Hero")

        if focus_duration >= 60:
            badges.append("🔥 Consistency Star")

        if progress_score >= 85:
            badges.append("⭐ Rising Achiever")

        # DAILY STREAK ESTIMATION
        streak_days = int(
            max(1, focus_duration // 5)
        )

        # AI ROADMAP
        roadmap = [
            {
                "week": "Week 1",
                "focus": "Attention & Eye Contact",
                "difficulty": "Beginner",
                "tasks": [
                    "Mirror eye tracking",
                    "Visual focus games",
                    "Breathing exercises"
                ],
                "expected_improvement": "Better visual attention"
            },
            {
                "week": "Week 2",
                "focus": "Speech & Communication",
                "difficulty": "Intermediate",
                "tasks": [
                    "Phonics repetition",
                    "Story narration",
                    "Voice interaction tasks"
                ],
                "expected_improvement": "Improved speech clarity"
            },
            {
                "week": "Week 3",
                "focus": "Memory & Social Skills",
                "difficulty": "Intermediate",
                "tasks": [
                    "Pattern memory games",
                    "Roleplay conversations",
                    "Emotion recognition"
                ],
                "expected_improvement": "Enhanced cognitive interaction"
            },
            {
                "week": "Week 4",
                "focus": "Behavior Stability",
                "difficulty": "Advanced",
                "tasks": [
                    "Meditation",
                    "Sensory calming exercises",
                    "Attention endurance challenge"
                ],
                "expected_improvement": "Improved emotional stability"
            }
        ]

        # IMPROVEMENT LEVEL
        if progress_score >= 85:
            improvement_level = "Excellent"

        elif progress_score >= 70:
            improvement_level = "Good"

        elif progress_score >= 50:
            improvement_level = "Moderate"

        else:
            improvement_level = "Needs Attention"

        # Generate Gemini AI Therapy Guidance
        ai_generated_plan = generate_ai_therapy(
            analysis_data
        )
        # MERGE AI GENERATED DATA
        dynamic_roadmap = ai_generated_plan.get(
            "weekly_roadmap", []
        )

        if dynamic_roadmap:
            roadmap = dynamic_roadmap

        ai_recommendations = ai_generated_plan.get(
            "therapy_recommendations", []
        )

        ai_speech_exercises = ai_generated_plan.get(
            "speech_exercises", []
        )

        motivation_message = ai_generated_plan.get(
            "motivation_message",
            "Keep learning and improving every day!"
        )

        result = {
            "detected_issues": detected_issues,
            "recommendations": recommendations,
            "progress_score": max(0, progress_score),
            "improvement_level": improvement_level,
            "streak_days": streak_days,
            "badges": badges,
            "roadmap": roadmap,
            "engagement": engagement,
            "attention_score": attention_score,
            "speech_confidence": speech_confidence,
            "emotion_recognition": emotion_recognition,
            "social_response_score": social_response_score,
            "emotional_state": emotional_state,
            "therapy_intensity": therapy_intensity,
            "realtime_insights": realtime_insights,
            "adaptive_tasks": adaptive_tasks,
            "live_metrics": live_metrics,
            "therapy_sessions_completed": therapy_sessions_completed,
            "focus_trend": focus_trend,
            "generated_at": datetime.now().isoformat(),
            "motivation_message": motivation_message,
            "ai_recommendations": ai_recommendations,
            "speech_exercises": ai_speech_exercises,
            "ai_generated_plan": ai_generated_plan
        }

        self.history.append(result)

        return result


# Global recommendation engine instance
recommendation_engine = RecommendationEngine()


def generate_recommendations(analysis_data):
    return recommendation_engine.generate_recommendations(
        analysis_data
    )