import cv2
import time
import numpy as np
import os
import statistics
from scipy.spatial import distance as scipy_distance

net = None
model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
face_config = os.path.join(model_dir, "deploy.prototxt")
face_weights = os.path.join(model_dir, "res10_300x300_ssd_iter_140000.caffemodel")
if os.path.isfile(face_config) and os.path.isfile(face_weights):
    try:
        if hasattr(cv2.dnn, "readNetFromCaffe"):
            try:
                net = cv2.dnn.readNetFromCaffe(face_config, face_weights)
            except Exception as caffe_error:
                print(f"Notice: readNetFromCaffe failed; trying OpenCV DNN fallback: {caffe_error}")
                net = cv2.dnn.readNet(face_weights, face_config, "caffe")
        else:
            net = cv2.dnn.readNet(face_weights, face_config, "caffe")
    except Exception as e:
        print(f"Notice: Caffe face detector net not loaded: {e}")
else:
    print(
        "Notice: Caffe face detector model files are missing. "
        f"Expected {face_config} and {face_weights}."
    )

face_detector = None
predictor = None
try:
    try:
        import dlib
        face_detector = dlib.get_frontal_face_detector()
        candidate_paths = [
            "models/shape_predictor_68_face_landmarks.dat",
            "shape_predictor_68_face_landmarks.dat"
        ]
        for cp in candidate_paths:
            if os.path.exists(cp):
                predictor = dlib.shape_predictor(cp)
                break
    except Exception as dlib_err:
        print(f"Notice: dlib landmarks not initialized ({dlib_err}), using OpenCV fallbacks.")
except Exception as e:
    print(f"Notice: Eye landmark detector initialized in fallback mode: {e}")


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

        self.position_history = []
        self.gaze_history = []
        self.focus_start_time = time.time()
        self.distraction_count = 0
        self.focus_loss_events = 0

    def analyze_frame(self, frame):
        if frame is None or net is None:
            return {
                "attention_score": 0,
                "engagement": "Tracking unavailable" if net is None else "Waiting for camera frame",
                "face_detected": False,
                "tracking_available": net is not None,
                "eyes_detected": 0,
                "blink_detected": False,
                "gaze_direction": "Unknown",
                "emotion": "Inactive",
                "movement": 0,
                "distance": 0,
                "confidence": 0,
                "movement_variance": 0,
                "gaze_stability": 0,
                "blink_frequency": 0,
                "face_ratio": 0,
                "hyperactivity_score": 0,
                "focus_duration": round(time.time() - self.start_time, 1),
                "therapy_recommendations": {
                    "status": "Tracking unavailable",
                    "suggestion": "Check camera permission and face detector setup"
                },
                "behavioral_status": "No live tracking data",
            }

        left_eye = []
        right_eye = []
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
        confidence = 0
        movement_variance = 0
        gaze_stability = 0
        blink_frequency = 0
        face_ratio = 0
        hyperactivity_score = 0
        focus_duration = 0
        left_eye = []
        right_eye = []
        eyes_detected = 0

        for i in range(detections.shape[2]):

            confidence_detection = detections[0, 0, i, 2]

            if confidence_detection < 0.6:
                continue

            confidence = int(confidence_detection * 100)

            box = detections[0, 0, i, 3:7] * np.array(
                [frame_w, frame_h, frame_w, frame_h]
            )

            (x1, y1, x2, y2) = box.astype("int")

            x = max(0, x1)
            y = max(0, y1)
            w = max(0, x2 - x1)
            h = max(0, y2 - y1)
            face_detected = True

            face_area = w * h
            frame_area = frame_w * frame_h
            face_ratio = round(face_area / frame_area, 4)

            face_center_x = x + (w // 2)
            face_center_y = y + (h // 2)
            frame_center = frame.shape[1] // 2
            frame_center_y = frame.shape[0] // 2
            distance = float(np.hypot(face_center_x - frame_center, face_center_y - frame_center_y))

            if predictor is not None and face_detector is not None:
                try:
                    rect = dlib.rectangle(x, y, x + w, y + h)
                    landmarks = predictor(gray, rect)

                    left_eye = []
                    for n in range(36, 42):
                        px = landmarks.part(n).x
                        py = landmarks.part(n).y
                        left_eye.append((px, py))

                    right_eye = []
                    for n in range(42, 48):
                        px = landmarks.part(n).x
                        py = landmarks.part(n).y
                        right_eye.append((px, py))

                    eyes_detected = 2

                    def eye_aspect_ratio(eye):
                        A = scipy_distance.euclidean(eye[1], eye[5])
                        B = scipy_distance.euclidean(eye[2], eye[4])
                        C = scipy_distance.euclidean(eye[0], eye[3])
                        if C == 0:
                            return 0
                        return (A + B) / (2.0 * C)

                    leftEAR = eye_aspect_ratio(left_eye)
                    rightEAR = eye_aspect_ratio(right_eye)
                    ear = (leftEAR + rightEAR) / 2.0

                    if ear < 0.20:
                        blink_detected = True
                        self.blink_count += 1

                    nose_x = landmarks.part(30).x
                    if nose_x < frame_center - 70:
                        gaze_direction = "Left"
                    elif nose_x > frame_center + 70:
                        gaze_direction = "Right"
                    else:
                        gaze_direction = "Center"
                except Exception as lm_err:
                    eyes_detected = 2
            else:
                eyes_detected = 2
                if face_center_x < frame_center - 80:
                    gaze_direction = "Left"
                elif face_center_x > frame_center + 80:
                    gaze_direction = "Right"
                else:
                    gaze_direction = "Center"

            focus_duration = int(
                time.time() - self.focus_start_time
            )

            max_center_distance = float(np.hypot(frame_w / 2, frame_h / 2))
            center_score = 100 - 45 * min(1.0, distance / max_center_distance)
            attention_score = int(center_score)
            self.focus_frames += 1

            self.gaze_history.append(gaze_direction)

            if len(self.gaze_history) > 15:
                self.gaze_history.pop(0)

            stable_gaze = self.gaze_history.count("Center")

            gaze_stability = int(
                (stable_gaze / len(self.gaze_history)) * 100
            ) if len(self.gaze_history) > 0 else 0

            if self.previous_face_x is not None:
                movement = min(float(np.hypot(
                    face_center_x - self.previous_face_x,
                    face_center_y - self.previous_face_y
                )), 100.0)

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

                movement_penalty = min(20, int(avg_movement * 0.4))
                attention_score -= movement_penalty

                if avg_movement > 60:
                    engagement = "Restless"
                    emotion = "Restless"

            self.previous_face_x = face_center_x
            self.previous_face_y = face_center_y

            for eye in left_eye:
                cv2.circle(frame, eye, 2, (0, 255, 0), -1)

            for eye in right_eye:
                cv2.circle(frame, eye, 2, (0, 255, 0), -1)

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

        session_time = max(
            1,
            time.time() - self.start_time
        )

        blink_frequency = round(
            self.blink_count / session_time,
            2
        )

        if face_ratio < 0.04 and face_detected:
            attention_score -= 15
            engagement = "Far From Screen"

        if movement_variance > 4000:
            engagement = "Hyperactive"
            emotion = "Restless"
            attention_score -= 20
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

        attention_score = max(0, min(100, attention_score))
        confidence = max(0, min(99, confidence))

        if face_detected:
            attention_score = int((0.55 * self.previous_score) + (0.45 * attention_score))
        else:
            attention_score = 0

        self.previous_score = attention_score
        attention_score = int(attention_score)
        focus_percentage = int(focus_percentage)

        if not face_detected:
            therapy_result = {
                "status": "Waiting for face",
                "suggestion": "Move into view and keep your face comfortably centered.",
                "next_target": "Look toward the center of the screen",
            }
        elif attention_score >= 75:
            therapy_result = {
                "status": "Steady focus",
                "suggestion": "Nice steady attention. Continue at a comfortable pace.",
                "next_target": "Keep following the screen activity",
            }
        else:
            therapy_result = {
                "status": "Gentle refocus",
                "suggestion": "Try a short visual rest, then return when ready.",
                "next_target": "Look toward the center of the screen",
            }

        return {
            "attention_score": attention_score,
            "engagement": engagement,
            "face_detected": face_detected,
            "tracking_available": True,
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


tracker = AttentionTracker()
