import time
from types import SimpleNamespace

import numpy as np

from ai_companion_engine import generate_magic_story, LAST_GROQ_RATE_LIMIT
from eye_tracking import AttentionTracker


class FakeResponse:
    def __init__(self, status_code=200, text="{}"):
        self.status_code = status_code
        self.text = text


def test_analyze_frame_handles_missing_face_without_crashing():
    tracker = AttentionTracker()
    frame = np.zeros((240, 320, 3), dtype=np.uint8)
    result = tracker.analyze_frame(frame)

    assert result["attention_score"] >= 0
    assert result["gaze_direction"] in {"Unknown", "Center", "Away", "Left", "Right", "Side"}


def test_magic_story_falls_back_when_groq_is_rate_limited(monkeypatch):
    import ai_companion_engine

    ai_companion_engine.GROQ_API_KEY = "fake-key"
    ai_companion_engine.LAST_GROQ_RATE_LIMIT = time.time()

    def fake_post(*args, **kwargs):
        return FakeResponse(status_code=429, text='{"error":{"message":"rate limited"}}')

    monkeypatch.setattr(ai_companion_engine.requests, "post", fake_post)

    story = ai_companion_engine.generate_magic_story("Aarav", "forest adventure")

    assert story["hero"] == "Aarav"
    assert len(story["pages"]) == 3


def test_screening_normalizes_model_labels_for_predict():
    from app import normalize_screening_value

    assert normalize_screening_value("gender", "Male") == "m"
    assert normalize_screening_value("gender", "Female") == "f"
    assert normalize_screening_value("ethnicity", "Middle Eastern") == "Middle Eastern "
    assert normalize_screening_value("relation", "Parent") == "Others"
    assert normalize_screening_value("relation", "Health care professional") == "Others"
    assert normalize_screening_value("used_app_before", "Yes") == "yes"
