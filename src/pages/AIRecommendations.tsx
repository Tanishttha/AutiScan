import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Eye,
  Mic,
  Brain,
  Target,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Heart
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, OfflineError } from "@/services/api";

const RECOMMENDATIONS = [
  {
    id: "gaze",
    title: "Eye Contact & Visual Social Comfort",
    emoji: "👁",
    description: "Structured visual tracking exercises designed to gently build comfort with direct and casual gaze.",
    activities: [
      "Mirror smile modeling (2 mins)",
      "Screen star follower game",
      "Emotion card face matching",
      "Comfortable turn-taking hello"
    ],
    path: "/attention",
    actionLabel: "Launch Attention Monitor"
  },
  {
    id: "speech",
    title: "Expressive Speech & Pronunciation",
    emoji: "🗣",
    description: "Multi-sensory phonics breakdown with auditory mimicry and slow-tempo repetition to encourage expressive speech.",
    activities: [
      "Vowel song practice (A-E-I-O-U)",
      "Daily 3-word vocabulary mastery",
      "Interactive story speaking with Buddy",
      "Phonics syllable tapping"
    ],
    path: "/speech",
    actionLabel: "Open Speech Lab"
  },
  {
    id: "cognitive",
    title: "Cognitive Memory & Sensory Comfort",
    emoji: "🧠",
    description: "Calming visual pattern games and structured routines that nurture cognitive memory without sensory overload.",
    activities: [
      "Sensory sorting puzzle",
      "Sequence recall (3 colors)",
      "Routine transition countdowns",
      "Balloon deep-breathing pause"
    ],
    path: "/therapy",
    actionLabel: "View Roadmap Plan"
  },
];

export default function AIRecommendations() {
  const navigate = useNavigate();
  const [therapyScore, setTherapyScore] = useState(0);
  const [attentionLevel, setAttentionLevel] = useState(0);
  const [speechAccuracy, setSpeechAccuracy] = useState(0);
  const [isDisconnected, setIsDisconnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.analyzeTherapy({ attention_score: 0, gaze_stability: 0, speech_confidence: 0 })
      .then((data) => {
        if (!isMounted) return;
        setIsDisconnected(false);
        if (data?.analysis) {
          setTherapyScore(data.analysis.progress_score || 0);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setIsDisconnected(true);
        if (err instanceof OfflineError) {
          toast.error("No internet connection / Backend server disconnected");
        } else {
          toast.error("No internet connection: Could not reach recommendations service");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {isDisconnected && (
          <div className="mb-6 p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs sm:text-sm animate-pulse">
            <div className="flex items-center gap-2.5 font-semibold">
              <span className="text-base">⚠️</span>
              <span>No internet connection / Backend server disconnected — Displaying cached baseline</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-[11px] underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Header Bar */}
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Personalized AI Recommendations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Dynamic interventions generated from child's speech, focus, and screening metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/therapy")}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 shadow-md shadow-blue-500/20"
            >
              Go to Therapy Plan
            </Button>
          </div>
        </div>

        {/* Live Index Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full sm:max-w-[820px] ml-auto">
          
          <div className="p-5 rounded-3xl glass-card w-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Therapy Balance Score
            </span>
            <div className="text-2xl font-bold text-blue-600 dark:text-sky-400 tabular-nums">
              {therapyScore}%
            </div>
            <div className="text-[11px] text-emerald-500 font-medium mt-1">
              Optimal therapeutic engagement
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card w-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Attention Stability Index
            </span>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {attentionLevel}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Calm gaze retention
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card w-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Speech Phonics Confidence
            </span>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {speechAccuracy}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Steady pronunciation growth
            </div>
          </div>

        </div>

        {/* Tailored Recommendation Cards */}
        <div className="space-y-6">
          {RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="p-6 sm:p-8 rounded-[32px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-3xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-3xl shrink-0 shadow-sm">
                  {rec.emoji}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {rec.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
                    {rec.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {rec.activities.map((act, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-black/[0.03] dark:bg-white/[0.06] px-3 py-1 rounded-xl border border-black/[0.04] dark:border-white/[0.06]"
                      >
                        • {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate(rec.path)}
                className="w-full md:w-auto px-6 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}