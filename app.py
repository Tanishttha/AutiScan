from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import eventlet
import pickle
import pandas as pd
import numpy as np
import cv2
from flask_cors import CORS
from eye_tracking import tracker
from recommendation_engine import generate_recommendations
from ai_companion_engine import (
    generate_ai_lesson,
    generate_live_ai_chat
)
from image_generator import generate_learning_image

app = Flask(__name__)
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

camera = cv2.VideoCapture(0)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
camera.set(cv2.CAP_PROP_FPS, 30)


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
            processed_value = raw_value
            
            if col not in df or pd.isna(raw_value) or raw_value == "":
                return jsonify({"error": f"Missing or empty value for {col}"}), 400
            
            if col == 'ethnicity':
                if raw_value == '?' or raw_value == 'others': 
                    processed_value = 'Others'
            
            if col == 'relation':
                if raw_value in ['?', 'Relative', 'Parent', 'Health care professional']: 
                    processed_value = 'Others' 
            
            if col == 'contry_of_res':
                if raw_value == 'Viet Nam': processed_value = 'Vietnam'
                elif raw_value == 'AmericanSamoa': processed_value = 'United States'
                elif raw_value == 'Hong Kong': processed_value = 'China'
            
            if processed_value not in encoders[col].classes_:
                return jsonify({"error": f"Input value '{raw_value}' for {col} is invalid or wasn't trained on. Must be one of {list(encoders[col].classes_)}"}), 400

            df[col] = encoders[col].transform([processed_value])[0] 

        df_final = df.reindex(columns=feature_order)

        pred = model.predict(df_final)[0]
        
        result = "ASD Positive" if pred == 1 else "ASD Negative"
        return jsonify({"prediction": result})

    except Exception as e:
        print(f"Predict Error: {e}")
        return jsonify({"error": f"An internal server error occurred. Detail: {str(e)}"}), 500


@app.route("/attention", methods=["GET"])
def attention_monitor():
    try:
        success, frame = camera.read()

        if not success:
            return jsonify({
                "error": "Unable to access webcam"
            }), 500

        result = tracker.analyze_frame(frame)

        enhanced_response = {
            "status": "success",
            "system": "AI Autism Behavioral & Therapy Assistant",
            "version": "2.0",
            "camera_active": True,
            "analysis": result,
            "analytics": {
                "attention_score": result.get("attention_score", 0),
                "engagement": result.get("engagement", "Unknown"),
                "emotion": result.get("emotion", "Unknown"),
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

        return jsonify({
            "error": str(e)
        }), 500

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

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "running",
        "service": "AI Autism Behavioral & Therapy Assistant",
        "version": "2.0",
        "camera_active": camera.isOpened(),
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


if __name__ == "__main__":
    try:
        socketio.run(
            app,
            debug=True,
            host="0.0.0.0",
            port=5002,
            allow_unsafe_werkzeug=True
        )
    finally:
        camera.release()
