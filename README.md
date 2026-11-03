# AutiScan - Digital Autism Screening & Therapeutic Support Platform

AutiScan is a sensory-friendly, Apple-grade digital platform designed for children on the autism spectrum, parents, and therapists. It features standardized ASD screening (AQ-10), speech therapy, real-time attention tracking, and 4 interactive games.

---

## 🚀 How to Run in VS Code (Step-by-Step)

### Prerequisites
1. **Node.js** (v18, v20, or v22) installed on your computer. Download from [nodejs.org](https://nodejs.org).
2. **VS Code** (Visual Studio Code).

---

### Step 1: Open the Project in VS Code
1. Open VS Code.
2. Click **File** ➔ **Open Folder...** (or press `Ctrl + K, Ctrl + O` on Windows / `Cmd + O` on Mac).
3. Select this `AutiScan` project root folder.

---

### Step 2: Open Terminal in VS Code
- Press `` Ctrl + ` `` (Backtick) or go to top menu: **Terminal** ➔ **New Terminal**.

---

### Step 3: Install Dependencies
Run the following command in the terminal to install all required packages:

```bash
npm install
```

---

### Step 4: Start the Development Server
Install the Python backend dependencies once:

```bash
python -m venv .venv
source .venv/bin/activate       # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Then start the full app:

```bash
npm run dev
```

You will see output like:
```text
  VITE v5.4.19  ready in 320 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

Open `http://localhost:3000`. Express serves the frontend and Python API on the same port. Python routes communicate with Express over local process input/output, so there is no separate backend network port.

---

### 📦 Production / Render

Render is configured as one Docker web service. The image installs Node and Python, installs both dependency sets, builds the frontend, and starts Express on Render's assigned `PORT`. Express serves the UI and forwards `/api/*` to the Python worker over local IPC, so no second public service or port is needed.

1. Push this repository to GitHub and create a Render Blueprint from `render.yaml`.
2. Add `GROQ_API_KEY` when Render prompts for the secret (or add it under the service's Environment settings).
3. Deploy. Render checks `/health`; the app will be served from the assigned `onrender.com` URL.

The Blueprint uses Render's paid Standard compute plan because Node plus the Python ML dependencies need more memory than the Free plan's 512 MB. Render Free web services also spin down after 15 minutes idle. [Render compute plans](https://render.com/docs/compute-plans) · [Free service limits](https://render.com/docs/free).

For a local production-mode run:

```bash
# 1. Build the frontend
npm run build

# 2. Start the production Express server
npm start
```
Open `http://localhost:3000` in your browser.

---

## 🎮 Key Features & Routes

| Feature | Route | Description |
|---|---|---|
| **Dashboard** | `/dashboard` | Central therapy hub & streak tracking |
| **Emotion Mirror Game 🎭** | `/emotion-mirror` | Facial affect mimicry & confetti rewards |
| **Eye-Contact Buddy 🐻** | `/eye-contact-buddy` | Animated character reacting to direct gaze |
| **Magic Story Maker 📖** | `/story-maker` | Illustrated audio storybooks starring the child |
| **Calm Monster 🐉** | `/calm-monster` | Stillness dragon & guided balloon breathing |
| **Speech Therapy Lab** | `/speech` | Slow-tempo phonics & voice recognition |
| **ASD Screening** | `/screening` | Standardized AQ-10 assessment & profiling |
| **Attention Focus** | `/attention` | Webcam gaze tracking & PDF report export |
| **Therapy Plan** | `/therapy` | 4-Week developmental roadmap |
| **Progress Analytics** | `/analytics` | Weekly attention curves & earned trophies |

---

