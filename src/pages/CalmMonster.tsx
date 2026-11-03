import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Smile,
  ShieldCheck,
  Award,
  Star,
  Activity,
  Wind
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type MonsterState = "sleeping" | "calm" | "restless";

export default function CalmMonster() {
  const navigate = useNavigate();
  const [monsterState, setMonsterState] = useState<MonsterState>("calm");
  const [stillnessScore, setStillnessScore] = useState(0); // 0 to 100
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCounter, setBreathCounter] = useState(4);
  const [calmStreakSeconds, setCalmStreakSeconds] = useState(0);
  const [stars, setStars] = useState(0);
  const [audioGuided, setAudioGuided] = useState(true);

  useEffect(() => {
    if (stillnessScore >= 80) {
      setMonsterState("sleeping");
    } else if (stillnessScore >= 50) {
      setMonsterState("calm");
    } else {
      setMonsterState("restless");
    }
  }, [stillnessScore]);

  // Guided breathing loop: Inhale 4s -> Hold 2s -> Exhale 4s
  useEffect(() => {
    let breathTimer: NodeJS.Timeout | null = null;

    if (breathingActive) {
      breathTimer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Cycle phases
          if (breathPhase === "inhale") {
            setBreathPhase("hold");
            if (audioGuided) speakGuide("Hold gently...");
            return 2;
          } else if (breathPhase === "hold") {
            setBreathPhase("exhale");
            if (audioGuided) speakGuide("Breathe out slowly like a warm balloon...");
            return 4;
          } else {
            setBreathPhase("inhale");
            // Boost stillness score when breathing
            setStillnessScore((s) => Math.min(95, s + 10));
            if (audioGuided) speakGuide("Breathe in fresh, calm air...");
            return 4;
          }
        });
      }, 1000);
    }

    return () => {
      if (breathTimer) clearInterval(breathTimer);
    };
  }, [breathingActive, breathPhase, audioGuided]);

  const speakGuide = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.75;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const getMonsterVisual = () => {
    if (monsterState === "sleeping") {
      return {
        emoji: "🐉💤",
        mood: "Peacefully Sleeping (Zzz...)",
        color: "from-teal-400 to-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        message: "Puff feels safe and calm with you. He is taking a peaceful nap!"
      };
    }
    if (monsterState === "calm") {
      return {
        emoji: "🐉✨",
        mood: "Gentle & Content",
        color: "from-blue-400 to-indigo-500",
        bg: "bg-blue-50 dark:bg-blue-950/40",
        message: "Puff is smiling gently, breathing softly with you."
      };
    }
    return {
      emoji: "🐉💨",
      mood: "Restless / Wiggly Energy",
      color: "from-amber-400 to-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      message: "Whoa, lots of wiggly energy! Let's do balloon breathing together!"
    };
  };

  const monsterVisual = getMonsterVisual();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Navigation & Header */}
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 mb-1 border border-emerald-200/50 dark:border-emerald-800/40">
                <Wind className="w-3 h-3" />
                <span>Sensory Self-Regulation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Calm Monster 🐉
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{stars} Calm Stars</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/40">
              <Activity className="w-4 h-4" />
              <span className="tabular-nums">{calmStreakSeconds}s Peaceful</span>
            </div>
          </div>
        </div>

        {/* 2-Zone Layout: Monster Avatar & Balloon Breathing Chamber */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Monster Stage */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-[40px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl text-center relative overflow-hidden">
            
            {/* Status pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold mb-4 glass-card border border-black/[0.05] dark:border-white/[0.08]">
              <span>Mood: {monsterVisual.mood}</span>
            </div>

            {/* Giant Animated Monster Visual */}
            <div className="relative my-6 inline-block">
              <div className={`w-48 h-48 rounded-[48px] p-2 mx-auto flex items-center justify-center transition-all duration-700 shadow-2xl ${
                monsterState === "sleeping"
                  ? "bg-gradient-to-tr from-teal-400 to-emerald-500 scale-100 shadow-emerald-500/20"
                  : monsterState === "calm"
                  ? "bg-gradient-to-tr from-sky-400 to-indigo-500 scale-105 shadow-blue-500/20"
                  : "bg-gradient-to-tr from-amber-400 to-rose-500 scale-110 animate-bounce shadow-rose-500/30"
              }`}>
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[40px] flex flex-col items-center justify-center text-8xl select-none">
                  {monsterState === "sleeping" ? "🐉💤" : monsterState === "calm" ? "🐉✨" : "🐉💨"}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Puff the Gentle Dragon
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              {monsterVisual.message}
            </p>

            {/* Stillness Gauge Slider */}
            <div className="mt-8 p-5 rounded-3xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-left">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Child's Body Stillness Index</span>
                <span className="text-blue-600 dark:text-sky-400 tabular-nums">{stillnessScore}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stillnessScore >= 80 ? "bg-emerald-500" : stillnessScore >= 50 ? "bg-blue-600" : "bg-amber-500"
                  }`}
                  style={{ width: `${stillnessScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Restless / Moving</span>
                <span>Calm Sitting</span>
                <span>Deep Rest</span>
              </div>

              {/* Stillness interactive buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStillnessScore(90)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-black/[0.05] dark:border-white/[0.08]"
                >
                  😌 Simulate Calm Body (90%)
                </button>
                <button
                  type="button"
                  onClick={() => setStillnessScore(40)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-black/[0.05] dark:border-white/[0.08]"
                >
                  ⚡ Simulate Fidgeting (40%)
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Balloon Breathing Guide ("Monster ke saath saans lo") */}
          <div className="lg:col-span-5 p-8 rounded-[40px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl text-center space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 mb-1">
                <Wind className="w-3.5 h-3.5" />
                <span>Monster Guided Breathing 🎈</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Breathe With Puff
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Slow breathing calms heart rate and puts the dragon to peaceful sleep.
              </p>
            </div>

            {/* Expanding/Contracting Breathing Orb */}
            <div className="my-8 relative h-56 flex items-center justify-center">
              <div
                className={`rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                  breathPhase === "inhale"
                    ? "w-48 h-48 bg-gradient-to-tr from-sky-400/80 to-blue-600/80 scale-110 shadow-sky-500/30"
                    : breathPhase === "hold"
                    ? "w-48 h-48 bg-gradient-to-tr from-indigo-500/80 to-purple-600/80 scale-105 shadow-purple-500/30"
                    : "w-36 h-36 bg-gradient-to-tr from-teal-400/80 to-emerald-500/80 scale-90 shadow-emerald-500/20"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  {breathingActive ? breathPhase : "Ready"}
                </span>
                <span className="text-4xl font-extrabold text-white tabular-nums my-1">
                  {breathingActive ? breathCounter : "4s"}
                </span>
                <span className="text-[11px] text-white/80 font-medium">
                  {breathPhase === "inhale" ? "Breathe In" : breathPhase === "hold" ? "Hold Gently" : "Breathe Out"}
                </span>
              </div>
            </div>

            {/* Start / Pause Breathing Button */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  const next = !breathingActive;
                  setBreathingActive(next);
                  if (next && audioGuided) {
                    speakGuide("Let's breathe together with Puff. Breathe in slowly...");
                  }
                }}
                size="lg"
                className={`w-full py-6 rounded-2xl font-bold text-xs shadow-lg active:scale-95 transition-all ${
                  breathingActive
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                }`}
              >
                <Wind className="w-4 h-4 mr-2" />
                <span>{breathingActive ? "Pause Breathing Exercise" : "Start Balloon Breathing"}</span>
              </Button>

              <div className="flex items-center justify-between px-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setAudioGuided(!audioGuided)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-500"
                >
                  {audioGuided ? <Volume2 className="w-3.5 h-3.5 text-blue-500" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{audioGuided ? "Audio Voice Guide: ON" : "Audio Guide: OFF"}</span>
                </button>

                <span className="text-emerald-500 font-semibold">Self-Regulation</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
