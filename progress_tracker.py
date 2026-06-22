import json
import os
from datetime import datetime


class ProgressTracker:

    def __init__(self):

        self.file_path = "progress_data.json"

        if not os.path.exists(self.file_path):
            self.initialize_storage()

    def initialize_storage(self):

        default_data = {
            "total_sessions": 0,
            "total_focus_minutes": 0,
            "average_attention": 0,
            "highest_attention": 0,
            "daily_streak": 0,
            "last_active_date": "",
            "badges": [],
            "achievements": [],
            "history": [],
            "weekly_progress": [],
            "therapy_completion": {},
            "emotion_history": [],
            "focus_history": []
        }

        with open(self.file_path, "w") as file:
            json.dump(default_data, file, indent=4)

    def load_data(self):

        with open(self.file_path, "r") as file:
            return json.load(file)

    def save_data(self, data):

        with open(self.file_path, "w") as file:
            json.dump(data, file, indent=4)

    def update_progress(
        self,
        attention_score,
        engagement,
        emotion,
        focus_duration,
        completed_task=None
    ):

        data = self.load_data()

        today = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M:%S")

        data["total_sessions"] += 1

        data["total_focus_minutes"] += focus_duration

        previous_average = data["average_attention"]
        total_sessions = data["total_sessions"]

        new_average = (
            (
                previous_average * (total_sessions - 1)
            ) + attention_score
        ) / total_sessions

        data["average_attention"] = round(new_average, 2)

        if attention_score > data["highest_attention"]:
            data["highest_attention"] = attention_score

        if data["last_active_date"] != today:
            data["daily_streak"] += 1
            data["last_active_date"] = today

        history_entry = {
            "date": today,
            "time": current_time,
            "attention_score": attention_score,
            "engagement": engagement,
            "emotion": emotion,
            "focus_duration": focus_duration
        }

        data["history"].append(history_entry)

        data["focus_history"].append(
            {
                "date": today,
                "score": attention_score
            }
        )

        data["emotion_history"].append(
            {
                "date": today,
                "emotion": emotion
            }
        )

        if completed_task:

            if completed_task not in data[
                "therapy_completion"
            ]:
                data["therapy_completion"][
                    completed_task
                ] = 0

            data["therapy_completion"][
                completed_task
            ] += 1

        self.generate_badges(data)

        self.generate_achievements(data)

        weekly_summary = {
            "date": today,
            "attention": attention_score,
            "focus_duration": focus_duration
        }

        data["weekly_progress"].append(
            weekly_summary
        )

        data["history"] = data["history"][-200:]
        data["focus_history"] = (
            data["focus_history"][-100:]
        )
        data["emotion_history"] = (
            data["emotion_history"][-100:]
        )

        self.save_data(data)

        return data

    def generate_badges(self, data):

        badges = set(data["badges"])

        if data["highest_attention"] >= 95:
            badges.add("🏆 Focus Master")

        if data["daily_streak"] >= 7:
            badges.add("🔥 Consistency Star")

        if data["total_sessions"] >= 20:
            badges.add("🎯 Therapy Explorer")

        if data["average_attention"] >= 85:
            badges.add("⭐ Attention Champion")

        if data["total_focus_minutes"] >= 500:
            badges.add("🧠 Deep Focus Hero")

        data["badges"] = list(badges)

    def generate_achievements(self, data):

        achievements = []

        achievements.append(
            {
                "title": "Sessions Completed",
                "value": data["total_sessions"],
                "goal": 50
            }
        )

        achievements.append(
            {
                "title": "Focus Minutes",
                "value": data[
                    "total_focus_minutes"
                ],
                "goal": 1000
            }
        )

        achievements.append(
            {
                "title": "Average Attention",
                "value": data[
                    "average_attention"
                ],
                "goal": 90
            }
        )

        achievements.append(
            {
                "title": "Daily Streak",
                "value": data[
                    "daily_streak"
                ],
                "goal": 30
            }
        )

        data["achievements"] = achievements

    def get_dashboard_data(self):

        data = self.load_data()

        dashboard = {
            "summary": {
                "total_sessions": data[
                    "total_sessions"
                ],
                "average_attention": data[
                    "average_attention"
                ],
                "highest_attention": data[
                    "highest_attention"
                ],
                "daily_streak": data[
                    "daily_streak"
                ],
                "focus_minutes": data[
                    "total_focus_minutes"
                ]
            },
            "badges": data["badges"],
            "achievements": data[
                "achievements"
            ],
            "focus_history": data[
                "focus_history"
            ],
            "emotion_history": data[
                "emotion_history"
            ],
            "therapy_completion": data[
                "therapy_completion"
            ],
            "recent_sessions": data[
                "history"
            ][-10:]
        }

        return dashboard

progress_tracker = ProgressTracker()
