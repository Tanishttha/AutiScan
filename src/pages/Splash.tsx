import { useNavigate } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Mic,
  Eye,
  Heart,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  Smile,
  Compass,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const Splash = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleGuestEntry = () => {
    localStorage.setItem("autiscan-guest", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient Sensory-Friendly Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-indigo-500/10 dark:bg-purple-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-teal-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            AutiScan
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-2xl glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all flex items-center gap-2 text-xs font-medium"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
          
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="rounded-2xl text-xs font-semibold px-4 py-2 bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        
        {/* Child-friendly gentle kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-medium text-blue-700 dark:text-sky-300 mb-6 border border-blue-200/50 dark:border-blue-900/40">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Child-Friendly & Calm Autism Therapy Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl leading-[1.15]">
          Empowering Every Child's Unique{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Voice & Focus
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          An interactive, sensory-friendly digital platform offering gentle ASD screening, speech pronunciation practice, real-time attention monitoring, and joyful AI learning companions.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="w-full sm:w-auto px-8 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 text-base font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Start Therapy Suite</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleGuestEntry}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-7 py-6 rounded-2xl glass-card text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-base font-medium transition-all active:scale-95"
          >
            Explore as Guest
          </Button>
        </div>

        {/* Apple-style Glass Feature Spotlight Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          
          <div className="p-6 rounded-3xl glass-card glass-card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-sky-400 mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Speech Therapy Lab</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Slow-tempo speech recognition, phonics breakdowns, real voice feedback, and motivating star rewards for children.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] text-xs font-semibold text-blue-600 dark:text-sky-400 flex items-center gap-1">
              <span>Interactive Phonics</span> · <span>Zero Pressure</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gaze & Attention Focus</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Gentle webcam attention tracker with live stability meters, calming visual anchors, and comprehensive downloadable PDF reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span>Eye-Contact Care</span> · <span>PDF Reports</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card glass-card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Joyful AI Companion</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Animated cheerful avatars that praise kids, tell short visual adventure stories, and nurture emotional confidence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Warm Encouragement</span> · <span>Star Badges</span>
            </div>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Private & Safe</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-500" />
            <span>Autism Spectrum Friendly</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            <span>AQ-10 Validated Screening</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-black/[0.04] dark:border-white/[0.06] py-5 text-center text-xs text-slate-400 dark:text-slate-500">
        AutiScan Digital Health & Support · Designed with care for kids and parents
      </footer>

    </div>
  );
};

export default Splash;
