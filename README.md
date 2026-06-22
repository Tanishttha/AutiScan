AutiScan

AutiScan is an AI-powered Autism Spectrum Disorder (ASD) behavioral analysis and therapy assistance platform. The system combines Machine Learning, Computer Vision, and AI-based recommendation techniques to assist in behavioral assessment, therapy generation, and progress tracking.

Live Demo

https://autismbuddy.vercel.app/

⸻

Features

* Autism behavior prediction using Machine Learning
* Eye tracking and behavioral analysis
* AI-powered therapy recommendation generation
* Personalized therapy suggestions
* Progress tracking system
* Interactive web dashboard
* Real-time prediction and analysis

⸻

Technology Stack

Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS

Backend

* Python
* Flask
* Scikit-Learn
* Pandas
* NumPy

AI & Machine Learning

* Behavioral Classification Models
* Recommendation Engine
* Eye Tracking Module
* Therapy Generation System

⸻

System Architecture

<p align="center">
  <img src="read/system_architecture.png" width="900">
</p>

⸻

Project Structure

AutiScan/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── data/
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── models/
│   ├── deploy.prototxt
│   ├── shape_predictor_68_face_landmarks.dat
│   └── res10_300x300_ssd_iter_140000.caffemodel
│
├── app.py
├── ai_companion_engine.py
├── ai_therapy_generator.py
├── recommendation_engine.py
├── therapy_recommendations.py
├── eye_tracking.py
├── progress_tracker.py
│
├── behavior_dataset.csv
├── behavior_model.pkl
├── best_model.pkl
├── encoders.pkl
├── label_encoder.pkl
│
└── requirements-backend.txt

⸻

Installation

Clone Repository

git clone https://github.com/USERNAME/AutiScan.git
cd AutiScan

⸻

Backend Setup

Create Virtual Environment

python -m venv venv

Activate Virtual Environment

Windows

venv\Scripts\activate

macOS/Linux

source venv/bin/activate

Install Dependencies

pip install -r requirements-backend.txt

Run Backend

python app.py

Backend will start on:

http://localhost:5000

⸻

Frontend Setup

Navigate to frontend directory:

cd frontend

Install dependencies:

npm install

Run development server:

npm run dev

Frontend will start on:

http://localhost:5173

⸻

Usage

1. Launch the backend server.
2. Start the frontend application.
3. Open the frontend URL in your browser.
4. Enter behavioral information and assessment data.
5. Generate autism behavior predictions.
6. View therapy recommendations and progress reports.

⸻

Screenshots

Home Page

<p align="center">
  <img src="read/homepage.png" width="900">
</p>

Prediction Module

<p align="center">
  <img src="read/prediction.png" width="900">
</p>

Therapy Recommendation System

<p align="center">
  <img src="read/therapy.png" width="900">
</p>

⸻

Future Enhancements

* Real-time video-based behavioral analysis
* Deep learning-based prediction models
* Therapist dashboard
* Cloud deployment support
* Mobile application integration
* Advanced analytics and reporting

⸻

Author

Tushar Banga

B.Tech Computer Engineering
J.C. Bose University of Science and Technology, YMCA

⸻

License

This project is intended for educational and research purposes.