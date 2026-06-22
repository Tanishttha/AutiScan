import cv2
import time
import numpy as np
import joblib
import os
import statistics
import dlib
from scipy.spatial import distance as scipy_distance
from recommendation_engine import recommendation_engine

# OpenCV DNN Face Detector
net = cv2.dnn.readNetFromCaffe(
    "models/deploy.prototxt",
    "models/res10_300x300_ssd_iter_140000.caffemodel"
)

# Optional ML behavioral model
behavior_model = None
label_encoder = None

if os.path.exists("behavior_model.pkl") and os.path.exists("label_encoder.pkl"):
    behavior_model = joblib.load("behavior_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")

# dlib facial landmark detector
face_detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(
    "models/shape_predictor_68_face_landmarks.dat"
)


class AttentionTracker:
    def __init__(self):
        self.start_time = time.time()
        self.focus_frames = 0
        self.total_frames = 0
        self.last_attention = "Distracted"
        self.blink_count = 0
        self.last_blink_time = time.time()
        self.previous_face_x = None
        self.previous_face_y = None
        self.movement_history = []
        self.previous_score = 70

        # Advanced analytics
        self.position_history = []
        self.gaze_history = []
        self.prediction_history = []
        self.score_history = []
        self.focus_start_time = time.time()
        self.distraction_count = 0
        self.focus_loss_events = 0

    def analyze_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        (frame_h, frame_w) = frame.shape[:2]

        blob = cv2.dnn.blobFromImage(
            cv2.resize(frame, (300, 300)),
            1.0,
            (300, 300),
            (104.0, 177.0, 123.0)
        )

        net.setInput(blob)

        detections = net.forward()

        attention_score = 15
        engagement = "Distracted"
        face_detected = False
        eyes_detected = 0
        blink_detected = False
        gaze_direction = "Center"
        emotion = "Neutral"
        movement = 0
        distance = 0
        confidence = 50
        movement_variance = 0
        gaze_stability = 0
        blink_frequency = 0
        face_ratio = 0
        hyperactivity_score = 0
        focus_duration = 0

        for i in range(detections.shape[2]):

            confidence_detection = detections[0, 0, i, 2]

            if confidence_detection < 0.6:
                continue

            box = detections[0, 0, i, 3:7] * np.array(
                [frame_w, frame_h, frame_w, frame_h]
            )

            (x1, y1, x2, y2) = box.astype("int")

            x = max(0, x1)
            y = max(0, y1)
            w = max(0, x2 - x1)
            h = max(0, y2 - y1)
            face_detected = True

            # Face size analysis
            face_area = w * h
            frame_area = frame_w * frame_h
            face_ratio = round(face_area / frame_area, 4)

            # dlib facial landmarks
            rect = dlib.rectangle(x, y, x + w, y + h)
            landmarks = predictor(gray, rect)

            # Left eye points
            left_eye = []
            for n in range(36, 42):
                px = landmarks.part(n).x
                py = landmarks.part(n).y
                left_eye.append((px, py))

            # Right eye points
            right_eye = []
            for n in range(42, 48):
                px = landmarks.part(n).x
                py = landmarks.part(n).y
                right_eye.append((px, py))

            eyes_detected = 2

            face_center_x = x + (w // 2)
            face_center_y = y + (h // 2)

            frame_center = frame.shape[1] // 2

            distance = abs(face_center_x - frame_center)

            # EAR blink detection
            def eye_aspect_ratio(eye):
                A = scipy_distance.euclidean(eye[1], eye[5])
                B = scipy_distance.euclidean(eye[2], eye[4])
                C = scipy_distance.euclidean(eye[0], eye[3])

                if C == 0:
                    return 0

                ear = (A + B) / (2.0 * C)
                return ear

            leftEAR = eye_aspect_ratio(left_eye)
            rightEAR = eye_aspect_ratio(right_eye)

            ear = (leftEAR + rightEAR) / 2.0

            if ear < 0.20:
                blink_detected = True
                self.blink_count += 1

            # Focus duration
            focus_duration = int(
                time.time() - self.focus_start_time
            )

            # Dynamic attention score
            attention_score = max(55, 100 - int(distance / 4))

            self.focus_frames += 1

            # Dynamic gaze estimation
            if face_center_x < frame_center - 80:
                gaze_direction = "Left"

            elif face_center_x > frame_center + 80:
                gaze_direction = "Right"

            else:
                gaze_direction = "Center"

            # Landmark-based gaze estimation
            nose_x = landmarks.part(30).x

            if nose_x < frame_center - 70:
                gaze_direction = "Left"

            elif nose_x > frame_center + 70:
                gaze_direction = "Right"

            else:
                gaze_direction = "Center"

            # Gaze history stability
            self.gaze_history.append(gaze_direction)

            if len(self.gaze_history) > 15:
                self.gaze_history.pop(0)

            stable_gaze = self.gaze_history.count("Center")

            gaze_stability = int(
                (stable_gaze / len(self.gaze_history)) * 100
            ) if len(self.gaze_history) > 0 else 0

            # Movement tracking

            if self.previous_face_x is not None:
                movement = abs(face_center_x - self.previous_face_x)
                movement = min(movement, 100)

                # Position history tracking
                self.position_history.append(face_center_x)

                if len(self.position_history) > 20:
                    self.position_history.pop(0)

                if len(self.position_history) > 1:
                    movement_variance = int(
                        np.var(self.position_history)
                    )

                hyperactivity_score = int(
                    movement_variance / 50
                )

                self.movement_history.append(movement)

                if len(self.movement_history) > 10:
                    self.movement_history.pop(0)

                avg_movement = sum(self.movement_history) / len(self.movement_history)

                if avg_movement > 60:
                    attention_score -= 25
                    engagement = "Restless"
                    emotion = "Restless"

                elif avg_movement > 30:
                    attention_score -= 10

            self.previous_face_x = face_center_x
            self.previous_face_y = face_center_y

            # Draw facial landmarks
            for eye in left_eye:
                cv2.circle(frame, eye, 2, (0, 255, 0), -1)

            for eye in right_eye:
                cv2.circle(frame, eye, 2, (0, 255, 0), -1)

            # Dynamic engagement states
            if eyes_detected == 0:
                attention_score = 20
                engagement = "Low Attention"
                gaze_direction = "Away"
                emotion = "Distracted"

            elif eyes_detected == 1:
                attention_score = 45
                engagement = "Partially Focused"
                gaze_direction = "Side"
                emotion = "Calm"

            else:
                if attention_score >= 85:
                    engagement = "Highly Focused"
                    emotion = "Focused"

                elif attention_score >= 65:
                    engagement = "Attentive"
                    emotion = "Calm"

                else:
                    engagement = "Distracted"
                    emotion = "Distracted"

            break

        if not face_detected:
            attention_score = 10
            engagement = "No Face Detected"
            gaze_direction = "Unknown"
            emotion = "No Face"

        self.total_frames += 1
        self.last_attention = engagement

        focus_percentage = 0

        if self.total_frames > 0:
            focus_percentage = int(
                (self.focus_frames / self.total_frames) * 100
            )

        # Blink frequency analysis
        session_time = max(
            1,
            time.time() - self.start_time
        )

        blink_frequency = round(
            self.blink_count / session_time,
            2
        )

        # Face distance refinement
        if face_ratio < 0.04 and face_detected:
            attention_score -= 15
            engagement = "Far From Screen"

        # Hyperactivity detection
        if movement_variance > 4000:
            engagement = "Hyperactive"
            emotion = "Restless"
            attention_score -= 20

        # ML behavioral prediction
        if behavior_model is not None:

            features = [[
                distance if face_detected else 0,
                movement,
                self.blink_count,
                focus_percentage,
                eyes_detected,
                face_ratio,
                movement_variance,
                focus_duration,
                gaze_stability,
                blink_frequency,
                confidence_detection if face_detected else 0,
                hyperactivity_score
            ]]

            try:
                prediction = behavior_model.predict(features)

                engagement = label_encoder.inverse_transform(
                    prediction
                )[0]

                probabilities = behavior_model.predict_proba(features)

                confidence = int(
                    np.max(probabilities) * 100
                )

                # Prediction smoothing
                self.prediction_history.append(engagement)

                if len(self.prediction_history) > 10:
                    self.prediction_history.pop(0)

                engagement = max(
                    set(self.prediction_history),
                    key=self.prediction_history.count
                )

                if engagement == "Deep Focus":
                    attention_score = 95
                    emotion = "Highly Focused"
                    gaze_direction = "Center"

                elif engagement == "Highly Attentive":
                    attention_score = 82
                    emotion = "Focused"
                    gaze_direction = "Center"

                elif engagement == "Moderately Engaged":
                    attention_score = 65
                    emotion = "Calm"
                    gaze_direction = "Center"

                elif engagement == "Restless":
                    attention_score = 40
                    emotion = "Restless"
                    gaze_direction = "Side"

                elif engagement == "Distracted":
                    attention_score = 30
                    emotion = "Distracted"
                    gaze_direction = "Away"

                else:
                    attention_score = 15
                    emotion = "Inactive"
                    gaze_direction = "Away"

            except Exception as e:
                print("ML Prediction Error:", e)

        # Final dynamic AI refinement
        if not face_detected:
            engagement = "No Face Detected"
            emotion = "Inactive"

        elif attention_score >= 90:
            engagement = "Deep Focus"
            emotion = "Highly Focused"

        elif attention_score >= 75:
            engagement = "Highly Attentive"
            emotion = "Focused"

        elif attention_score >= 55:
            engagement = "Moderately Engaged"
            emotion = "Calm"

        elif attention_score >= 35:
            engagement = "Distracted"
            emotion = "Distracted"

        else:
            engagement = "Very Low Attention"
            emotion = "Inactive"

        # AI confidence estimation
        if behavior_model is None:
            confidence = min(
                99,
                attention_score + focus_percentage // 2
            )

        attention_score = max(0, min(100, attention_score))
        confidence = max(0, min(99, confidence))

        # Score history smoothing
        self.score_history.append(attention_score)

        if len(self.score_history) > 10:
            self.score_history.pop(0)

        attention_score = int(
            sum(self.score_history) /
            len(self.score_history)
        )

        # Smooth score transitions
        attention_score = int(
            (0.8 * self.previous_score) +
            (0.2 * attention_score)
        )

        self.previous_score = attention_score
        attention_score = int(attention_score)
        focus_percentage = int(focus_percentage)

        # AI Therapy Recommendation System
        therapy_result = (
            recommendation_engine.generate_recommendations(
                {
                    "attention_score": attention_score,
                    "gaze_stability": gaze_stability,
                    "blink_frequency": blink_frequency,
                    "hyperactivity_score": hyperactivity_score,
                    "focus_duration": focus_duration,
                    "movement_variance": movement_variance,
                    "engagement": engagement,
                    "speech_delay": False,
                    "slow_response": False
                }
            )
        )

        return {
            "attention_score": attention_score,
            "engagement": engagement,
            "face_detected": face_detected,
            "eyes_detected": eyes_detected,
            "focus_percentage": focus_percentage,
            "session_time": round(time.time() - self.start_time, 1),
            "blink_count": self.blink_count,
            "blink_detected": blink_detected,
            "gaze_direction": gaze_direction,
            "emotion": emotion,
            "confidence": confidence,
            "movement_variance": movement_variance,
            "gaze_stability": gaze_stability,
            "blink_frequency": blink_frequency,
            "face_ratio": face_ratio,
            "hyperactivity_score": hyperactivity_score,
            "focus_duration": focus_duration,
            "therapy_recommendations": therapy_result,
            "behavioral_status": self.generate_behavior_report(
                attention_score,
                focus_percentage,
                emotion
            )
        }

    def generate_behavior_report(
        self,
        attention_score,
        focus_percentage,
        emotion
    ):

        if attention_score >= 85 and focus_percentage >= 70:
            return "Highly attentive and engaged"

        elif attention_score >= 60:
            return "Moderately attentive with stable engagement"

        elif emotion == "Excited":
            return "Hyperactive behavioral response detected"

        else:
            return "Low engagement and possible distraction"


# Singleton tracker instance
tracker = AttentionTracker()