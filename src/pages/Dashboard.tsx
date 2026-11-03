import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  Brain,
  Mic,
  Eye,
  Sparkles,
  CalendarCheck,
  BarChart3,
  ArrowRight,
  Heart,
  Smile,
  ShieldCheck,
  Flame,
  Award,
  Volume2,
  CheckCircle2,
  Activity
} from "lucide-react";
import { auth } from "@/config/firebase";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "screening",
    icon: Brain,
    title: "Clinical ASD Screening",
    description: "Standardized AQ-10 screening assessment with instant clinical scoring and strength profiling.",
    path: "/screening",
    tag: "Assessment",
    color: "text-blue-600 dark:text-sky-400",
    bg: "bg-blue-50 dark:bg-blue-950/60",
    border: "border-blue-200/50 dark:border-blue-900/50",
    badge: "Clinical Tool"
  },
  {
    id: "speech",
    icon: Mic,
    title: "Speech Therapy Lab",
    description: "Interactive voice analyzer with phonics breakdown, slow-tempo audio guides, and pronunciation scores.",
    path: "/speech",
    tag: "Interactive Lab",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60",
    border: "border-purple-200/50 dark:border-purple-900/50",
    badge: "Real-time Voice"
  },
  {
    id: "attention",
    icon: Eye,
    title: "Attention & Gaze Monitor",
    description: "Gentle eye-tracking using your webcam with live focus percentage, stability gauges, and PDF reports.",
    path: "/attention",
    tag: "Focus Vision",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
    border: "border-indigo-200/50 dark:border-indigo-900/50",
    badge: "Webcam Care"
  },
  {
    id: "companion",
    icon: Sparkles,
    title: "Joyful AI Companion",
    description: "Expressive animated learning buddy who tells friendly adventure stories and cheers on children's progress.",
    path: "/ai-companion",
    tag: "Child Buddy",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    border: "border-emerald-200/50 dark:border-emerald-900/50",
    badge: "Joyful AI"
  },
  {
    id: "therapy",
    icon: CalendarCheck,
    title: "Personalized Therapy Plan",
    description: "AI-guided 4-week developmental roadmap focusing on communication, memory, focus, and social skills.",
    path: "/therapy",
    tag: "Care Roadmap",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    border: "border-amber-200/50 dark:border-amber-900/50",
    badge: "Structured"
  },
];

const childGames = [
  {
    id: "eye-buddy",
    emoji: "🐻",
    title: "Eye-Contact Buddy",
    description: "Look into Barnaby the Bear's eyes! He dances & claps when you make brave eye contact.",
    path: "/eye-contact-buddy",
    accent: "from-amber-400 to-orange-500",
    badge: "Gaze Focus"
  },
  {
    id: "story-maker",
    emoji: "📖",
    title: "Magic Story Maker",
    description: "Speak your prompt, make your child the hero, and listen to illustrated AI voice stories.",
    path: "/story-maker",
    accent: "from-purple-500 to-indigo-600",
    badge: "Creative AI"
  },
  {
    id: "calm-monster",
    emoji: "🐉",
    title: "Calm Monster",
    description: "Keep Puff sleeping with peaceful stillness, and practice balloon breathing self-regulation.",
    path: "/calm-monster",
    accent: "from-teal-400 to-emerald-500",
    badge: "Sensory Calm"
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("Friend");

  useEffect(() => {
    const isGuest = localStorage.getItem("autiscan-guest");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "Friend");
      } else if (isGuest) {
        setUserName("Guest Explorer");
      } else {
        // Allow browsing as friend
        setUserName("Champion");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/[0.04] dark:border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs font-semibold text-blue-600 dark:text-sky-400 mb-3 border border-blue-200/50 dark:border-blue-900/40">
              <Smile className="w-3.5 h-3.5" />
              <span>Sensory-Friendly Space</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hello, {userName}! 🌟
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Welcome to your calm therapy hub. Practice speaking, track attention comfortably, and explore gentle learning activities designed for neurodivergent minds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/ai-companion")}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Buddy</span>
            </Button>
          </div>
        </div>

        {/* Child-Favorite Games & Sensory Activities */}
        <div className="my-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Learning Adventures</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Child-Favorite Games & Sensory Activities 🎮
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Joyful computer vision and AI adventures designed specifically for children
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {childGames.map((game) => (
    <div
      key={game.id}
      onClick={() => navigate(game.path)}
      className="group w-full min-w-0 h-full p-6 rounded-[28px] glass-panel glass-card-hover cursor-pointer flex flex-col justify-between items-start border border-black/[0.06] dark:border-white/[0.08] relative overflow-hidden"
    >
      <div className="w-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="text-4xl group-hover:scale-115 transition-transform duration-300">
            {game.emoji}
          </span>

          <span className="ml-auto self-start text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 bg-black/[0.03] dark:bg-white/[0.06] px-2 py-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06] whitespace-nowrap">
            {game.badge}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
          {game.title}
        </h3>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {game.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] w-full flex items-center justify-between text-xs font-bold text-blue-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
        <span>Play Game</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  ))}
</div>
        </div>

        {/* Feature Modules Grid */}
        <div className="my-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Core Therapy Modules
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select an interactive area to begin today's guided session
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onClick={() => navigate(feature.path)}
                  className="group p-6 sm:p-7 rounded-[28px] glass-card glass-card-hover cursor-pointer flex flex-col justify-between border border-black/[0.06] dark:border-white/[0.08]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-13 h-13 p-3 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 bg-black/[0.03] dark:bg-white/[0.06] px-2.5 py-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {feature.tag}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Guided Activity Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-[32px] glass-panel bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-sky-500/10 border border-blue-200/50 dark:border-blue-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                Recommended Daily Session
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                5-Minute Joyful Speech & Focus Warmup
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Practice 3 friendly words with your AI Companion and complete a 2-minute eye-contact focus exercise.
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate("/speech")}
            size="lg"
            className="w-full md:w-auto px-6 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all shrink-0"
          >
            Start Today's Activity
          </Button>
        </div>

      </div>
    </AppShell>
  );
};

export default Dashboard;
