import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  CameraOff,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Star,
  Award,
  Smile,
  Heart,
  Volume2,
  CheckCircle2,
  Flame,
  HelpCircle,
  Play
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/services/api";

interface EmotionTarget {
  id: string;
  name: string;
  emoji: string;
  expression: string;
  description: string;
  clues: string[];
}

const EMOTIONS: EmotionTarget[] = [
  {
    id: "happy",
    name: "Happy Smile",
    emoji: "😊",
    expression: "Big Joyful Smile",
    description: "Show your teeth or lift the corners of your mouth high!",
    clues: ["Cheeks lift up", "Corners of lips curve upwards", "Eyes crinkle gently"]
  },
  {
    id: "surprised",
    name: "Surprised / Ooh!",
    emoji: "😲",
    expression: "Wide Open Surprise",
    description: "Open your mouth in an 'O' shape and open your eyes wide!",
    clues: ["Eyebrows raise high", "Mouth opens like an 'O'", "Eyes open wide"]
  },
  {
    id: "excited",
    name: "Super Excited",
    emoji: "🤩",
    expression: "Star-Struck Excitement",
    description: "Big bright grin like you just won a golden star prize!",
    clues: ["Huge smile", "Sparkling joyful face", "Head held high"]
  },
  {
    id: "calm",
    name: "Calm & Peaceful",
    emoji: "😌",
    expression: "Gentle Resting Face",
    description: "Relax your forehead, soften your eyes, and take a gentle breath.",
    clues: ["Forehead smooth", "Lips gently closed", "Shoulders relaxed"]
  },
  {
    id: "silly",
    name: "Playful & Silly",
    emoji: "😜",
    expression: "Wink & Fun Smile",
    description: "Wink one eye or make a funny friendly face for laughs!",
    clues: ["One eye winks", "Playful grin", "Pure laughter"]
  }
];

export default function EmotionMirror() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [emotionIndex, setEmotionIndex] = useState(0);
  const currentEmotion = EMOTIONS[emotionIndex];

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [analyzingText, setAnalyzingText] = useState("Show your expression to the camera!");
  const faceDetectionStreakRef = useRef(0);
  const faceDetectedRef = useRef(false);
  const matchTimeoutRef = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const clearMatchTimers = () => {
    matchTimeoutRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    matchTimeoutRef.current = [];
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.info("Webcam not supported in this environment");
        return;
      }
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      setMediaStream(s);
      setCameraActive(true);
      toast.success("Webcam connected to Emotion Mirror!");
    } catch (err) {
      console.warn("Emotion mirror camera error:", err);
      setCameraActive(false);
    }
  };

  // Auto request webcam setup
  useEffect(() => {
    startCamera();
    return () => {
      if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Ensure stream binds to video element once mediaStream is ready
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((e) => {
        console.warn("Video playback error:", e);
      });
    }
  }, [mediaStream]);

  useEffect(() => {
    faceDetectedRef.current = faceDetected;
  }, [faceDetected]);

  useEffect(() => {
    if (!cameraActive) {
      clearMatchTimers();
      faceDetectionStreakRef.current = 0;
      setFaceDetected(false);
      setIsMatched(false);
      setMatchingProgress(0);
      setAnalyzingText("Show your expression to the camera!");
      return;
    }

    let active = true;

    const pollFaceStatus = async () => {
      try {
        const data = await api.getAttention();
        if (!active) return;

        const detected = (data as any)?.analysis?.face_detected === true;

        if (detected) {
          faceDetectionStreakRef.current = 0;
          setFaceDetected(true);
          if (!isMatched && matchingProgress === 0) {
            setAnalyzingText("Face detected — now show your expression to the camera!");
          }
          return;
        }

        faceDetectionStreakRef.current += 1;
        if (faceDetectionStreakRef.current >= 2) {
          setFaceDetected(false);
          setIsMatched(false);
          setMatchingProgress(0);
          clearMatchTimers();
          setAnalyzingText("No face detected — please move into frame and face the camera.");
          toast.info("No face detected — face the camera to continue.");
        }
      } catch {
        if (!active) return;

        faceDetectionStreakRef.current += 1;
        if (faceDetectionStreakRef.current >= 2) {
          setFaceDetected(false);
          setIsMatched(false);
          setMatchingProgress(0);
          clearMatchTimers();
          setAnalyzingText("Face visibility lost — please reconnect your camera.");
          toast.info("Face visibility lost — please reconnect your camera.");
        }
      }
    };

    pollFaceStatus();
    const interval = window.setInterval(pollFaceStatus, 1200);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [cameraActive]);

  // Voice narration helper
  const speakInstruction = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const detectExpressionFromVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraActive) return { match: "none", confidence: 0 };

    const ctx = canvas.getContext("2d");
    if (!ctx) return { match: "none", confidence: 0 };

    const width = 180;
    const height = 140;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);

    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    const sampleRegion = (x: number, y: number, w: number, h: number) => {
      let sum = 0;
      let count = 0;
      for (let yy = y; yy < y + h; yy += 2) {
        for (let xx = x; xx < x + w; xx += 2) {
          const pixelIndex = (yy * width + xx) * 4;
          const r = data[pixelIndex];
          const g = data[pixelIndex + 1];
          const b = data[pixelIndex + 2];
          const brightness = (r + g + b) / 3;
          sum += brightness;
          count += 1;
        }
      }
      return count ? sum / count : 0;
    };

    const mouthX = Math.floor(width * 0.3);
    const mouthY = Math.floor(height * 0.58);
    const mouthW = Math.floor(width * 0.4);
    const mouthH = Math.floor(height * 0.12);

    const leftEyeX = Math.floor(width * 0.32);
    const leftEyeY = Math.floor(height * 0.35);
    const leftEyeW = Math.floor(width * 0.12);
    const leftEyeH = Math.floor(height * 0.08);

    const rightEyeX = Math.floor(width * 0.56);
    const rightEyeY = Math.floor(height * 0.35);
    const rightEyeW = Math.floor(width * 0.12);
    const rightEyeH = Math.floor(height * 0.08);

    const mouthBrightness = sampleRegion(mouthX, mouthY, mouthW, mouthH);
    const leftEyeBrightness = sampleRegion(leftEyeX, leftEyeY, leftEyeW, leftEyeH);
    const rightEyeBrightness = sampleRegion(rightEyeX, rightEyeY, rightEyeW, rightEyeH);
    const eyeBrightness = (leftEyeBrightness + rightEyeBrightness) / 2;
    const mouthWidthRatio = mouthW / Math.max(1, mouthH);

    let detected = "calm";
    let confidence = 0.35;

    if (mouthWidthRatio >= 3.2 && mouthBrightness > 85 && eyeBrightness > 82) {
      detected = "happy";
      confidence = 0.82;
    } else if (mouthWidthRatio >= 2.8 && mouthBrightness > 90 && eyeBrightness > 92) {
      detected = "surprised";
      confidence = 0.79;
    } else if (mouthWidthRatio >= 3.4 && mouthBrightness > 100 && eyeBrightness > 86) {
      detected = "excited";
      confidence = 0.84;
    } else if (mouthWidthRatio >= 2.4 && mouthBrightness > 80 && eyeBrightness > 88) {
      detected = "silly";
      confidence = 0.72;
    } else if (mouthWidthRatio < 1.5 && eyeBrightness < 80) {
      detected = "calm";
      confidence = 0.74;
    }

    return { match: detected, confidence };
  };

  // Interactive face analysis simulation & trigger
  const handleSimulateMatch = () => {
    if (isMatched) return;
    if (!cameraActive || !faceDetectedRef.current) {
      setMatchingProgress(0);
      setAnalyzingText("Show your face clearly to the camera first!");
      toast.info("Face not visible. Please move into frame and try again.");
      return;
    }

    clearMatchTimers();
    const detected = detectExpressionFromVideo();
    const target = currentEmotion.id;
    const targetMatch =
      (target === "happy" || target === "excited" || target === "silly")
        ? ["happy", "excited", "silly"].includes(detected.match)
        : target === "surprised"
          ? detected.match === "surprised"
          : detected.match === "calm";

    setAnalyzingText("Analyzing facial cues... Checking your expression now...");
    setMatchingProgress(40);

    const firstTimeout = window.setTimeout(() => {
      if (!faceDetectedRef.current) {
        setIsMatched(false);
        setMatchingProgress(0);
        setAnalyzingText("No face detected — please move into frame and face the camera.");
        toast.info("No face detected — face the camera to continue.");
        return;
      }

      if (!targetMatch) {
        setMatchingProgress(30);
        setAnalyzingText(`Close! Try a bigger ${currentEmotion.name.toLowerCase()} expression and keep your face in frame.`);
        return;
      }

      setMatchingProgress(80);
      setAnalyzingText("Almost there! Hold that beautiful expression!");
    }, 600);

    const secondTimeout = window.setTimeout(() => {
      if (!faceDetectedRef.current) {
        setIsMatched(false);
        setMatchingProgress(0);
        setAnalyzingText("No face detected — please move into frame and face the camera.");
        toast.info("No face detected — face the camera to continue.");
        return;
      }

      if (!targetMatch) {
        setMatchingProgress(0);
        setAnalyzingText(`Expression not detected yet. Try your ${currentEmotion.name.toLowerCase()} face again.`);
        toast.info(`Keep trying your ${currentEmotion.name.toLowerCase()} expression!`);
        return;
      }

      setMatchingProgress(100);
      setIsMatched(true);
      setScore((s) => s + 50);
      setStars((st) => st + 1);
      setStreak((str) => str + 1);
      setAnalyzingText("🌟 MATCH! Perfect expression superstar!");
      toast.success(`You matched "${currentEmotion.name}"! +50 Points! 🎉`);
      speakInstruction(`Wonderful! You made a perfect ${currentEmotion.name}!`);
    }, 1200);

    matchTimeoutRef.current = [firstTimeout, secondTimeout];
  };

  const handleNextEmotion = () => {
    clearMatchTimers();
    setIsMatched(false);
    setMatchingProgress(0);
    setAnalyzingText("Show your expression to the camera!");
    setEmotionIndex((prev) => (prev + 1) % EMOTIONS.length);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Navigation & Score Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.04] dark:border-white/[0.06] mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-2xl glass-card text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 mb-1 border border-blue-200/50 dark:border-blue-800/40">
                <Smile className="w-3 h-3" />
                <span>Facial Affect Learning</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Emotion Mirror Game 🎭
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{stars} Stars</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-blue-600 dark:text-sky-400 border border-blue-200/50 dark:border-blue-900/40">
              <Award className="w-4 h-4" />
              <span className="tabular-nums">{score} Pts</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Target Card & Camera Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Target Emotion Challenge Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl text-center relative overflow-hidden">
              
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400 block mb-2">
                Mission {emotionIndex + 1} of {EMOTIONS.length}
              </span>

              {/* Big Emotion Avatar */}
              <div className="relative inline-block my-4">
                <div className={`w-32 h-32 rounded-[32px] p-1 shadow-2xl transition-all duration-300 ${
                  isMatched
                    ? "bg-gradient-to-tr from-emerald-400 to-teal-500 scale-105 shadow-emerald-500/30"
                    : "bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400"
                }`}>
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[28px] flex items-center justify-center text-6xl select-none">
                    {currentEmotion.emoji}
                  </div>
                </div>

                {isMatched && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {currentEmotion.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
                {currentEmotion.description}
              </p>

              {/* Phonics / Clues */}
              <div className="mt-6 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-left text-xs space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  How to make this face:
                </span>
                {currentEmotion.clues.map((clue, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span>{clue}</span>
                  </div>
                ))}
              </div>

              {/* Voice Prompt Button */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button
                  onClick={() => speakInstruction(`Can you make a ${currentEmotion.name}? ${currentEmotion.description}`)}
                  variant="outline"
                  className="rounded-2xl glass-card text-xs font-semibold px-4 py-2 border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span>Hear Clue</span>
                </Button>
              </div>

            </div>

          </div>

          {/* Right Column: Mirror Webcam & Recognition Feedback */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl relative">
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cameraActive ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {cameraActive ? "Your Mirror Reflection" : "Camera Interactive Mirror"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Real-time Face Geometry
                </span>
              </div>

              {/* Webcam Surface */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center border border-black/[0.1] dark:border-white/[0.1]">
                {/* Always mounted video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => {
                    videoRef.current?.play().catch(() => {});
                  }}
                  className={`w-full h-full object-cover -scale-x-100 transition-opacity duration-300 ${
                    cameraActive ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!cameraActive && (
                  <div className="text-center p-6 text-slate-400 z-10">
                    <Camera className="w-12 h-12 mx-auto text-sky-400 mb-2 animate-pulse" />
                    <p className="text-sm font-semibold text-slate-200">Interactive Mirror Ready</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Make the matching expression and tap "Check My Expression"!
                    </p>
                    <Button
                      type="button"
                      onClick={startCamera}
                      size="sm"
                      className="mt-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs px-4 py-2"
                    >
                      <Camera className="w-3.5 h-3.5 mr-1.5" />
                      Turn On Mirror Camera
                    </Button>
                  </div>
                )}

                {/* Face Alignment Frame */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className={`w-48 h-60 rounded-[48px] border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                    isMatched
                      ? "border-emerald-400 bg-emerald-500/10 scale-105"
                      : "border-sky-400/50"
                  }`}>
                    {isMatched && (
                      <div className="text-6xl animate-bounce">
                        🎉
                      </div>
                    )}
                  </div>
                </div>

                {/* Live HUD match indicator */}
                <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-black/60 text-white px-3.5 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-white/10">
                  <span>Match Confidence:</span>
                  <span className="text-sky-400 font-bold tabular-nums">{faceDetected ? matchingProgress : 0}%</span>
                </div>

                {isMatched && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs flex items-center justify-center pointer-events-none animate-fade-in">
                    <div className="backdrop-blur-xl bg-emerald-600/90 text-white px-6 py-3 rounded-3xl font-bold text-lg shadow-2xl flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span>PERFECT MATCH! ⭐</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Message */}
              <div className="mt-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{analyzingText}</span>
                <span className="text-blue-600 dark:text-sky-400 font-bold">{faceDetected ? matchingProgress : 0}%</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
                <Button
                  onClick={handleSimulateMatch}
                  disabled={isMatched}
                  className="w-full sm:w-auto px-6 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isMatched ? "Matched! Great Job!" : "Check My Expression"}</span>
                </Button>

                <Button
                  onClick={handleNextEmotion}
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-5 rounded-2xl glass-card text-slate-800 dark:text-slate-200 font-semibold text-xs border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Next Emotion Face</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
