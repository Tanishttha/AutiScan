from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import base64
import json
import os
import sys
try:
    import eventlet
except ImportError:
    eventlet = None
import pickle
import pandas as pd
import numpy as np
import cv2
from flask_cors import CORS
from eye_tracking import tracker
from recommendation_engine import generate_recommendations
from ai_companion_engine import (
    generate_ai_lesson,
    generate_live_ai_chat,
    generate_magic_story
)
from image_generator import generate_learning_image

app = Flask(__name__)
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

camera = None

def get_camera_frame():
    global camera
    try:
        if camera is None:
            camera = cv2.VideoCapture(0)
            if not camera.isOpened():
                camera = None
                return None
            camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            camera.set(cv2.CAP_PROP_FPS, 30)
        success, frame = camera.read()
        if success:
            return frame
        return None
    except Exception:
        return None


try:
    with open("best_model.pkl", "rb") as f:
        model = pickle.load(f)

    with open("encoders.pkl", "rb") as f:
        encoders = pickle.load(f)
except FileNotFoundError:
    print("ERROR: Model or encoders file not found. Ensure 'best_model.pkl' and 'encoders.pkl' are in the same directory.")
    pass

feature_order = [
    'A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score', 
    'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score', 
    'age', 
    'gender', 'ethnicity', 'jaundice', 'austim', 'contry_of_res', 
    'used_app_before', 
    'result', 
    'relation'
]

all_numeric_cols_in_order = [
    'A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score', 
    'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score', 
    'age', 'result'
]

categorical_cols = [
    'gender', 'ethnicity', 'jaundice', 'austim', 'contry_of_res', 
    'used_app_before', 'relation'
]


def normalize_screening_value(column, value):
    if value is None:
        return value

    normalized = str(value).strip()

    if column == 'gender':
        lowered = normalized.lower()
        if lowered in ('male', 'm'):
            return 'm'
        if lowered in ('female', 'f'):
            return 'f'
        return normalized.lower() if normalized.lower() in ('m', 'f') else normalized

    if column == 'ethnicity':
        lowered = normalized.lower()
        if lowered in ('others', 'other'):
            return 'Others'
        if lowered.replace(' ', '') == 'middleeastern':
            return 'Middle Eastern '
        return normalized

    if column == 'jaundice':
        lowered = normalized.lower()
        if lowered in ('yes', 'y'):
            return 'yes'
        if lowered in ('no', 'n'):
            return 'no'
        return normalized.lower()

    if column == 'austim':
        lowered = normalized.lower()
        if lowered in ('yes', 'y'):
            return 'yes'
        if lowered in ('no', 'n'):
            return 'no'
        return normalized.lower()

    if column == 'used_app_before':
        lowered = normalized.lower()
        if lowered in ('yes', 'y'):
            return 'yes'
        if lowered in ('no', 'n'):
            return 'no'
        return normalized.lower()

    if column == 'contry_of_res':
        if normalized == 'Viet Nam':
            return 'Vietnam'
        if normalized == 'AmericanSamoa':
            return 'United States'
        if normalized == 'Hong Kong':
            return 'China'
        return normalized

    if column == 'relation':
        lowered = normalized.lower()
        if lowered in ('parent', 'guardian', 'relative', 'health care professional', 'therapist', 'clinician', 'teacher', 'caregiver'):
            return 'Others'
        if lowered in ('self', 'adult', 'youth'):
            return 'Self'
        return normalized

    return normalized


@socketio.on("connect")
def handle_connect():
    print("Client connected to realtime AI server")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@socketio.on("live_analysis")
def handle_live_analysis(data):
    try:

        analysis_result = generate_recommendations(data)

        emit(
            "live_results",
            analysis_result
        )

    except Exception as error:

        emit(
            "live_results",
            {
                "status": "error",
                "message": str(error)
            }
        )

@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "message": "Autism AI Backend Running Successfully",
        "service": "AI Autism Behavioral & Therapy Assistant"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])

        for col in all_numeric_cols_in_order:
            if col not in df or pd.isna(df[col].values[0]) or df[col].values[0] == "":
                return jsonify({"error": f"Missing or empty value for {col}"}), 400
            try:
                df[col] = df[col].astype(float)
            except ValueError:
                return jsonify({"error": f"Invalid numeric input for {col}: '{df[col].values[0]}'"}), 400

        for col in categorical_cols:
            raw_value = df[col].values[0]
            processed_value = normalize_screening_value(col, raw_value)

            if col not in df or pd.isna(raw_value) or raw_value == "":
                return jsonify({"error": f"Missing or empty value for {col}"}), 400

            if processed_value not in encoders[col].classes_:
                return jsonify({"error": f"Input value '{raw_value}' for {col} is invalid or wasn't trained on. Must be one of {list(encoders[col].classes_)}"}), 400

            df[col] = encoders[col].transform([processed_value])[0]

        df_final = df.reindex(columns=feature_order)
        pred = model.predict(df_final)[0]
        raw_score = float(df["result"].iloc[0])
        threshold = 6.0

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(df_final)[0]
            probability = float(probabilities[1] if pred == 1 else probabilities[0])
        else:
            probability = 0.5

        prediction = "ASD Positive" if pred == 1 else "ASD Negative"
        prediction_prob = round(probability, 4)

        return jsonify({
            "status": "success",
            "prediction": prediction,
            "probability": prediction_prob,
            "raw_score": raw_score,
            "threshold": threshold,
            "demographics": {
                "age": float(df["age"].iloc[0]),
                "gender": str(data.get("gender", "")),
                "relation": str(data.get("relation", ""))
            },
            "evaluation": {
                "clinical_indication": "High likelihood of ASD traits" if pred == 1 else "Low likelihood of ASD traits",
                "confidence_interval": f"Model confidence: {predictions_to_percent(prediction_prob)}%",
                "assessed_at": pd.Timestamp.utcnow().isoformat()
            }
        })

    except Exception as e:
        print(f"Predict Error: {e}")
        return jsonify({"error": f"An internal server error occurred. Detail: {str(e)}"}), 500


def predictions_to_percent(value):
    return round(max(0.0, min(100.0, value * 100)), 2)


@app.route("/attention", methods=["GET", "POST"])
def attention_monitor():
    try:
        frame = None
        if request.method == "POST":
            frame_data = (request.get_json(silent=True) or {}).get("frame", "")
            if frame_data:
                encoded_frame = frame_data.split(",", 1)[-1]
                frame_bytes = base64.b64decode(encoded_frame, validate=True)
                frame = cv2.imdecode(np.frombuffer(frame_bytes, dtype=np.uint8), cv2.IMREAD_COLOR)
        else:
            frame = get_camera_frame()

        if frame is not None and tracker is not None:
            result = tracker.analyze_frame(frame)
        else:
            result = {
                "attention_score": 0,
                "engagement": "Waiting for camera frame",
                "face_detected": False,
                "tracking_available": tracker is not None,
                "eyes_detected": 0,
                "emotion": "Inactive",
                "gaze_direction": "Unknown",
                "blink_count": 0,
                "focus_duration": 0,
                "hyperactivity_score": 0,
                "therapy_recommendations": {
                    "status": "Waiting for camera frame",
                    "suggestion": "Allow camera access and keep your face in view"
                }
            }

        enhanced_response = {
            "status": "success",
            "system": "AI Autism Behavioral & Therapy Assistant",
            "version": "2.0",
            "camera_active": frame is not None,
            "analysis": result,
            "analytics": {
                "attention_score": result.get("attention_score", 0),
                "engagement": result.get("engagement", "Waiting for camera frame"),
                "emotion": result.get("emotion", "Inactive"),
                "gaze_direction": result.get("gaze_direction", "Unknown"),
                "blink_count": result.get("blink_count", 0),
                "focus_duration": result.get("focus_duration", 0),
                "hyperactivity_score": result.get(
                    "hyperactivity_score", 0
                )
            },
            "therapy": result.get(
                "therapy_recommendations", {}
            )
        }

        return jsonify(enhanced_response)

    except Exception as e:
        print(f"Attention Monitor Error: {e}")
        return jsonify({"status": "error", "error": "Could not analyze the camera frame"}), 500

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json() or {}

        analysis_result = generate_recommendations(data)

        response = {
            "status": "success",
            "realtime_ai": True,
            "analysis": analysis_result
        }

        return jsonify(response)

    except Exception as e:
        print(f"Analyze Route Error: {e}")

        return jsonify({
            "error": str(e)
        }), 500
@app.route("/generate-lesson", methods=["POST"])
def generate_lesson():
    try:
        data = request.get_json() or {}

        child_name = data.get("child_name", "Friend")
        confidence = data.get("confidence", 50)
        interests = data.get("interests", [])

        lesson_data = generate_ai_lesson(
            child_name=child_name,
            confidence=confidence,
            interests=interests
        )

        lesson_content = lesson_data.get("lesson", "")
        
        if isinstance(lesson_content, dict):
            lesson_word = lesson_content.get("word", "Apple")
        else: 
            lesson_word = "Apple"

        image_data = generate_learning_image(lesson_word)

        response = {
            "status": "success",
            "ai_companion": True,
            "lesson_data": lesson_data,
            "image": image_data
        }

        return jsonify(response)

    except Exception as e:
        print(f"AI Companion Route Error: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/live-chat", methods=["POST"])
def live_chat():
    try:
        data = request.get_json() or {}

        user_message = data.get("message", "")
        child_name = data.get("child_name", "Friend")

        ai_response = generate_live_ai_chat(
            user_message=user_message,
            child_name=child_name
        )

        return jsonify({
            "status": "success",
            "reply": ai_response.get("reply", "😊 Hello friend!"),
            "history": ai_response.get("history", [])
        })

    except Exception as e:
        print(f"Live Chat Route Error: {e}")

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/generate-story", methods=["POST"])
def generate_story():
    try:
        data = request.get_json() or {}
        hero_name = data.get("hero_name", "Your Hero")
        prompt = data.get("prompt", "A kind child helps a friend in a magical forest")

        story_data = generate_magic_story(
            hero_name=hero_name,
            prompt=prompt
        )

        return jsonify({
            "status": "success",
            "story_data": story_data
        })

    except Exception as e:
        print(f"Story Generation Route Error: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "running",
        "service": "AI Autism Behavioral & Therapy Assistant",
        "version": "2.0",
        "camera_active": camera.isOpened() if camera is not None else True,
        "features": [
            "DNN Face Detection",
            "dlib Facial Landmarks",
            "EAR Blink Detection",
            "Attention Tracking",
            "Behavioral AI",
            "Therapy Recommendation Engine",
            "Progress Scoring",
            "Achievement System",
            "AI Therapy Roadmap",
            "AI Conversational Companion",
            "Adaptive Speech Learning",
            "Emotion-Aware AI Lessons",
            "Dynamic Autism Learning Engine"
        ]
    })


if __name__ == "__main__" and os.environ.get("AUTISCAN_IPC_WORKER") == "1":
    # Serve Flask routes to Express over stdin/stdout, keeping one TCP port.
    with app.test_client() as client:
        for line in sys.stdin:
            rpc_request = {}
            try:
                rpc_request = json.loads(line)
                method = rpc_request.get("method", "GET")
                kwargs = {"path": rpc_request.get("path", "/"), "method": method}
                if method.upper() not in ("GET", "HEAD"):
                    kwargs["json"] = rpc_request.get("body", {})
                flask_response = client.open(**kwargs)
                payload = flask_response.get_json(silent=True)
                if payload is None:
                    payload = flask_response.get_data(as_text=True)
                rpc_response = {"id": rpc_request["id"], "status": flask_response.status_code, "payload": payload}
            except Exception as error:
                rpc_response = {"id": rpc_request.get("id"), "status": 500, "payload": {"error": str(error)}}
            print("__AUTISCAN_RPC__" + json.dumps(rpc_response), flush=True)
elif __name__ == "__main__":
    try:
        socketio.run(
            app,
            debug=False,
            use_reloader=False,
            host="127.0.0.1",
            port=3000,
            allow_unsafe_werkzeug=True
        )
    finally:
        if camera is not None:
            camera.release()
