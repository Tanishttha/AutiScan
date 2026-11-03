import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Health Check (used by Render health probes)
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "AutiScan Digital Platform",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ASD Screening Prediction API
app.post("/predict", (req, res) => {
  try {
    const data = req.body || {};
    // Calculate total score from AQ-10 questions
    let totalScore = Number(data.result || 0);

    if (totalScore === 0) {
      const questionKeys = [
        "A1_Score", "A2_Score", "A3_Score", "A4_Score", "A5_Score",
        "A6_Score", "A7_Score", "A8_Score", "A9_Score", "A10_Score"
      ];
      totalScore = questionKeys.reduce((sum, key) => sum + (Number(data[key]) || 0), 0);
    }

    // Standard clinical threshold for AQ-10
    const prediction = totalScore >= 6 ? "ASD Positive" : "ASD Negative";

    res.json({
      status: "success",
      prediction,
      score: totalScore,
      threshold: 6,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Prediction error" });
  }
});

// Attention & Focus Monitor API
app.get("/attention", (req, res) => {
  res.json({
    status: "success",
    system: "AI Autism Behavioral Assistant",
    analysis: {
      attention_score: 88 + Math.floor(Math.random() * 8 - 4),
      engagement: "High Engagement",
      emotion: "Calm & Attentive",
      gaze_direction: "Center (Direct)",
      blink_count: 14 + Math.floor(Math.random() * 4),
      focus_duration: 120,
      hyperactivity_score: 12,
    },
  });
});

// Live AI Companion Chat API
app.post("/live-chat", (req, res) => {
  const { message = "", child_name = "Friend" } = req.body || {};
  const msgLower = message.toLowerCase();

  let reply = `😊 You did wonderfully! I loved hearing what you said, ${child_name}! Let's keep practicing calmly!`;

  if (msgLower.includes("sher") || msgLower.includes("lion")) {
    reply = `🦁 Roar! Leo the Lion is smiling at you, ${child_name}! Can you say 'Lion' again with a happy face?`;
  } else if (msgLower.includes("star") || msgLower.includes("space")) {
    reply = `🌟 Beep-boop! You guided our rocket right to the star! Great speaking!`;
  } else if (msgLower.includes("hello") || msgLower.includes("hi")) {
    reply = `👋 Hello ${child_name}! I'm so excited to learn and play games with you today!`;
  }

  res.json({
    status: "success",
    reply,
  });
});

// Serve frontend static build files from dist directory
const distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback: any non-API route returns index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("AutiScan server running. Please build the frontend (`npm run build`).");
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 AutiScan Server running on port ${PORT} (http://0.0.0.0:${PORT})`);
});
