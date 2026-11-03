import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Heart, Shield, Users, Sparkles, BookOpen, Smile } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Header Bar */}
        <div className="flex items-center gap-3 pb-6 border-b border-black/[0.04] dark:border-white/[0.06] mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-2xl glass-card text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Understanding Autism & Neurodiversity
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Empowering families with gentle science, early insights, and compassionate care
            </p>
          </div>
        </div>

        {/* Hero Glass Card */}
        <div className="p-8 sm:p-10 rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">What is Autism Spectrum (ASD)?</h2>
              <span className="text-xs text-blue-600 dark:text-sky-400 font-medium">A natural neurological difference, not a deficit</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Autism Spectrum Disorder (ASD) describes differences in sensory processing, communication timing, and cognitive exploration. Autistic children often possess remarkable strengths in detail perception, logical pattern recognition, deep focus, and creative authenticity.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          
          <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200/50 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Social Communication</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Every child communicates uniquely. AutiScan builds phonics speech confidence and playful turn-taking at the child's own natural pace.
            </p>
          </div>

          <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/50 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sensory Well-being</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Bright lights or loud sudden noises can trigger sensory overload. Our interface uses calming palettes, soft rounded glass, and zero jarring transitions.
            </p>
          </div>

        </div>

        {/* Action Callout */}
        <div className="p-6 sm:p-8 rounded-[32px] glass-panel bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-sky-500/10 border border-blue-200/50 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Ready to begin today's session?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">Explore the interactive screening, speech lab, and attention monitor.</p>
          </div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 shadow-md shadow-blue-500/20 shrink-0"
          >
            Go to Dashboard
          </Button>
        </div>

      </div>
    </AppShell>
  );
};

export default About;
