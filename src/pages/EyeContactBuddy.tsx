import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Camera,
  Star,
  Award,
  ArrowLeft,
  Sparkles,
  Heart,
  Smile,
  CheckCircle2,
  Volume2,
  Play,
  RotateCcw
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "sonner";

interface BuddyCharacter {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const BUDDIES: BuddyCharacter[] = [
  { id: "bear", name: "Barnaby the Bear", emoji: "🐻", description: "A warm, gentle bear who loves making friendly eye contact!" },
  { id: "robot", name: "Beep the Robot", emoji: "🤖", description: "A cheerful mechanical buddy with glowing friendly optical sensors!" },
  { id: "puppy", name: "Pip the Puppy", emoji: "🐶", description: "An energetic puppy who wags his tail when you look into his eyes!" },
];

export default function EyeContactBuddy() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [buddyIndex, setBuddyIndex] = useState(0);
  const currentBuddy = BUDDIES[buddyIndex];

  const [isLookingAtBuddy, setIsLookingAtBuddy] = useState(false);
  const [gazeSeconds, setGazeSeconds] = useState(0);
  const [totalEyeContactTime, setTotalEyeContactTime] = useState(0);
  const [stars, setStars] = useState(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [clappingAnimation, setClappingAnimation] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [gazeDirection, setGazeDirection] = useState<string>("Center");
  const faceDetectionStreakRef = useRef(0);
  const isLookingAtBuddyRef = useRef(false);

  useEffect(() => {
    isLookingAtBuddyRef.current = isLookingAtBuddy;
  }, [isLookingAtBuddy]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      setMediaStream(s);
      setCameraActive(true);
      toast.success("Eye Contact camera connected!");
    } catch (err) {
      console.warn("Eye buddy camera error:", err);
      setCameraActive(false);
    }
  };

  // Setup webcam
  useEffect(() => {
    startCamera();
    return () => {
      if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Ensure stream attaches to video element
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((e) => {
        console.warn("Video playback error:", e);
      });
    }
  }, [mediaStream]);

  useEffect(() => {
    if (!cameraActive) {
      faceDetectionStreakRef.current = 0;
      setFaceDetected(false);
      if (isLookingAtBuddy) {
        setIsLookingAtBuddy(false);
        setGazeSeconds(0);
      }
      return;
    }

    let active = true;
    let pollInFlight = false;
    const pollFaceStatus = async () => {
      if (pollInFlight) return;

      const video = videoRef.current;
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg", 0.65);

      pollInFlight = true;
      try {
        const data = await api.getAttention(frame);
        if (!active) return;

        const analysis = (data as any)?.analysis ?? {};
        const detected = analysis.face_detected === true;
        const detectedGazeDirection = String(analysis.gaze_direction || "Center");
        const normalizedGaze = detectedGazeDirection.toLowerCase();
        const isCenteredGaze =
          normalizedGaze.includes("center") ||
          normalizedGaze.includes("direct") ||
          normalizedGaze.includes("slight left") ||
          normalizedGaze.includes("slight right");

        if (detected) {
          faceDetectionStreakRef.current = 0;
          setFaceDetected(true);
          setGazeDirection(detectedGazeDirection);

          if (!isCenteredGaze && isLookingAtBuddyRef.current) {
            setIsLookingAtBuddy(false);
            setGazeSeconds(0);
            toast.info("Face is visible, but gaze has moved away from center.");
          }
          return;
        }

        faceDetectionStreakRef.current += 1;

        if (faceDetectionStreakRef.current >= 3) {
          setFaceDetected(false);
          setGazeDirection("Center");
          if (isLookingAtBuddyRef.current) {
            setIsLookingAtBuddy(false);
            setGazeSeconds(0);
            toast.info("No face detected — eye contact paused.");
          }
        }
      } catch {
        if (!active) return;

        faceDetectionStreakRef.current += 1;
        if (faceDetectionStreakRef.current >= 3) {
          setFaceDetected(false);
          setGazeDirection("Center");
          if (isLookingAtBuddyRef.current) {
            setIsLookingAtBuddy(false);
            setGazeSeconds(0);
            toast.info("Eye contact paused while the face is not visible.");
          }
        }
      } finally {
        pollInFlight = false;
      }
    };

    pollFaceStatus();
    const interval = window.setInterval(pollFaceStatus, 1200);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [cameraActive]);

  // Timer when holding eye contact
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isLookingAtBuddy && cameraActive && faceDetected) {
      timer = setInterval(() => {
        setGazeSeconds((prev) => {
          const next = prev + 1;
          if (next === 3 || next === 5 || next === 10) {
            setStars((s) => s + 1);
            setClappingAnimation(true);
            setTimeout(() => setClappingAnimation(false), 1500);
            toast.success(`🌟 Fantastic! ${next} seconds of brave eye contact!`);
          }
          return next;
        });
        setTotalEyeContactTime((t) => t + 1);
      }, 1000);
    } else {
      setGazeSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLookingAtBuddy, cameraActive, faceDetected]);

  const speakBuddy = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
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
                <Eye className="w-3 h-3" />
                <span>Playful Gaze Game</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Eye-Contact Buddy 🐻
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{stars} Stars</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-blue-600 dark:text-sky-400 border border-blue-200/50 dark:border-blue-900/40">
              <Eye className="w-4 h-4" />
              <span className="tabular-nums">{totalEyeContactTime}s Total</span>
            </div>
          </div>
        </div>

        {/* Buddy Character Selector */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {BUDDIES.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => {
                setBuddyIndex(idx);
                setIsLookingAtBuddy(false);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 border ${
                buddyIndex === idx
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-600"
                  : "glass-card text-slate-700 dark:text-slate-200 border-black/[0.05] dark:border-white/[0.08]"
              }`}
            >
              <span>{b.emoji}</span>
              <span>{b.name}</span>
            </button>
          ))}
        </div>

        {/* Main 2-Zone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Buddy Stage */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-[40px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl text-center relative overflow-hidden">
            
            {/* Ambient character glow */}
            <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
              isLookingAtBuddy ? "opacity-30 bg-radial from-amber-400/30 to-transparent" : "opacity-0"
            }`} />

            {/* Character Reaction Bubble */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 transition-all shadow-sm border border-black/[0.04] dark:border-white/[0.06]">
              {isLookingAtBuddy ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Yay! You're looking into my eyes! Keep holding it!</span>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>👀 Look into my eyes right here! I'm waiting happily!</span>
                </span>
              )}
            </div>

            {/* Cartoon Character Display */}
            <div className="relative my-6 inline-block">
              <div className={`w-44 h-44 rounded-[40px] p-2 mx-auto flex items-center justify-center transition-all duration-300 shadow-2xl ${
                isLookingAtBuddy
                  ? "bg-gradient-to-tr from-amber-400 via-rose-400 to-purple-500 scale-110 rotate-2 shadow-amber-500/30"
                  : "bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700"
              }`}>
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[34px] flex flex-col items-center justify-center text-7xl select-none relative">
                  <span>{currentBuddy.emoji}</span>
                  
                  {isLookingAtBuddy && (
                    <div className="absolute -top-3 -right-3 text-2xl animate-bounce">
                      ✨
                    </div>
                  )}
                  {clappingAnimation && (
                    <div className="absolute -bottom-2 text-3xl animate-ping">
                      👏
                    </div>
                  )}
                </div>
              </div>

              {/* Eye Target Rings */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  isLookingAtBuddy ? "bg-amber-400 shadow-lg shadow-amber-400 scale-125" : "bg-slate-400/50"
                }`} />
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  isLookingAtBuddy ? "bg-amber-400 shadow-lg shadow-amber-400 scale-125" : "bg-slate-400/50"
                }`} />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {currentBuddy.name}
            </h2>

            {/* Streak & Timer */}
            <div className="mt-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] inline-flex items-center gap-6">
              <div>
                <span className="text-[11px] text-slate-400 block">Current Gaze Streak</span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-sky-400 tabular-nums">
                  {gazeSeconds}s
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[11px] text-slate-400 block">Today's Eye Contact</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {totalEyeContactTime}s
                </span>
              </div>
            </div>

            {/* Interactive Eye Contact Toggle Control */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                disabled={!cameraActive || !faceDetected}
                onClick={() => {
                  if (!cameraActive) {
                    toast.error("Turn on the camera first so your face can be seen.");
                    return;
                  }
                  if (!faceDetected) {
                    toast.info("Please move into frame so your face is visible before starting.");
                    return;
                  }

                  const nextState = !isLookingAtBuddy;
                  setIsLookingAtBuddy(nextState);
                  if (nextState) {
                    speakBuddy(`Hello friend! I see your bright eyes! Let's count together!`);
                  }
                }}
                size="lg"
                className={`w-full sm:w-auto px-8 py-6 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all ${
                  isLookingAtBuddy
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <Eye className="w-5 h-5 mr-2" />
                <span>{isLookingAtBuddy ? "Holding Eye Contact! (Tap to pause)" : !cameraActive ? "Turn On Camera" : !faceDetected ? "Face Not Visible" : "Start Eye Contact"}</span>
              </Button>

              <Button
                onClick={() => speakBuddy(`I love looking into your eyes! You are doing amazing!`)}
                variant="outline"
                className="rounded-2xl glass-card text-xs font-semibold px-5 py-6 border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-blue-500" />
                <span>Hear Buddy Speak</span>
              </Button>
            </div>

          </div>

          {/* Right Column: Mirror Camera & Gaze Milestones */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Webcam Feedback */}
            <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Child's Optical Gaze Mirror
                </span>
                <span className="text-[11px] font-semibold text-emerald-500">
                  {isLookingAtBuddy ? `Looking at ${gazeDirection} ✨` : `Gaze: ${gazeDirection}`}
                </span>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-black/[0.1] dark:border-white/[0.1]">
                {/* Always mounted video element ensures ref is available when stream arrives */}
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

                {!cameraActive && (
                  <div className="text-center p-4 text-slate-400 z-10">
                    <Camera className="w-8 h-8 mx-auto text-sky-400 mb-1.5" />
                    <span className="text-xs text-slate-300 block font-medium">Gaze Camera Ready</span>
                    <Button
                      type="button"
                      onClick={startCamera}
                      size="sm"
                      className="mt-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs px-3 py-1.5"
                    >
                      <Camera className="w-3 h-3 mr-1" />
                      Turn On Camera
                    </Button>
                  </div>
                )}

                {/* Target eye anchor box */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className={`w-28 h-28 rounded-full border-2 border-dashed transition-all ${
                    isLookingAtBuddy ? "border-amber-400 scale-105" : "border-white/30"
                  }`} />
                </div>
              </div>
            </div>

            {/* Gaze Milestones Box */}
            <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Gaze Milestones</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">3-Second Courage Hero</span>
                    <span className="text-slate-400 text-[11px]">Hold gaze for 3 continuous seconds</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>

                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">5-Second Star Gazer</span>
                    <span className="text-slate-400 text-[11px]">Hold gaze for 5 continuous seconds</span>
                  </div>
                  {totalEyeContactTime >= 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="text-[11px] text-slate-400">In Progress</span>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">10-Second Dancing Champion</span>
                    <span className="text-slate-400 text-[11px]">Unlock Barnaby's celebration dance!</span>
                  </div>
                  {totalEyeContactTime >= 10 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="text-[11px] text-slate-400">Next unlock</span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
