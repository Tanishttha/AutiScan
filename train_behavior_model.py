import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

df = pd.read_csv("behavior_dataset.csv")

X = df[
    [
        "face_offset",
        "movement",
        "blink_rate",
        "focus_percentage",
        "eyes_detected",
        "face_ratio",
        "movement_variance",
        "focus_duration",
        "gaze_stability",
        "blink_frequency",
        "confidence_detection",
        "hyperactivity_score"
    ]
]

y = df["label"]

encoder = LabelEncoder()

y_encoded = encoder.fit_transform(y)

model = RandomForestClassifier(
    n_estimators=500,
    max_depth=18,
    min_samples_split=2,
    min_samples_leaf=1,
    bootstrap=True,
    random_state=42
)

model.fit(X, y_encoded)

accuracy = model.score(X, y_encoded)

print(f"✅ Training Accuracy: {round(accuracy * 100, 2)}%")

joblib.dump(model, "behavior_model.pkl")
joblib.dump(encoder, "label_encoder.pkl")

print("✅ Advanced Behavioral AI model trained successfully")