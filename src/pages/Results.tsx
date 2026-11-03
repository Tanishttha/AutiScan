import { useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Mic,
  Eye,
  CalendarCheck,
  ShieldAlert,
  ArrowRight,
  Smile,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/AppShell";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    prediction,
    result,
    probability,
    raw_score,
    threshold,
    age,
    gender,
    ethnicity,
    austim,
  } = location.state || {
    prediction: "ASD Positive",
    result: 7,
    probability: 0.66,
    raw_score: 7,
    threshold: 6,
    age: "8",
    gender: "m",
    ethnicity: "Asian",
    austim: "no",
  };

  const modelPrediction = prediction || "ASD Positive";
  const rawResult = Number(raw_score ?? result ?? 0);
  const rawThreshold = Number(threshold ?? 6);
  const modelProbability = Number(probability ?? 0);
  const normalizedProbability = modelProbability > 1 ? modelProbability / 100 : modelProbability;
  const probabilityPercent = normalizedProbability > 0
    ? Math.min(100, Math.round(normalizedProbability * 100))
    : Math.min(100, Math.round((rawResult / 10) * 100));
  const isPositive = modelPrediction.includes("Positive") || rawResult >= rawThreshold;
  const score = rawResult || 0;
  const percentage = Math.min(100, Math.round((score / Math.max(rawThreshold, 10)) * 100));

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in print:p-0">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.06] mb-8 print:hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-2xl glass-card"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="rounded-2xl text-xs font-semibold glass-card border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </Button>

            <Button
              onClick={() => navigate("/screening")}
              variant="outline"
              className="rounded-2xl text-xs font-semibold glass-card border-slate-200/80 dark:border-slate-800/80"
            >
              Retake Assessment
            </Button>
          </div>
        </div>

        {/* Hero Result Glass Card */}
        <div className="p-8 sm:p-10 rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl relative overflow-hidden mb-8">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            
            <div className={`w-20 h-20 rounded-3xl p-1 flex items-center justify-center shrink-0 shadow-xl ${
              isPositive
                ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
                : "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white"
            }`}>
              {isPositive ? (
                <Brain className="w-10 h-10 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-10 h-10" />
              )}
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-slate-600 dark:text-slate-300">
                <Smile className="w-3.5 h-3.5" />
                <span>AQ-10 Assessment Outcome</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {isPositive
                  ? "Autism Spectrum Traits Identified"
                  : "Traits Within Neurotypical Range"}
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {isPositive
                  ? "The screening indicates notable indicators in communication timing, routine consistency, or sensory perception. AutiScan provides tailored speech exercises and focus therapies below to build confidence."
                  : "The responses fall within standard peer ranges for social interaction and sensory processing. AutiScan tools remain available for joyful cognitive stimulation."}
              </p>

              {/* Score bar */}
              <div className="mt-6 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">AI Model Prediction</span>
                  <span className="text-blue-600 dark:text-sky-400 tabular-nums text-sm">
                    {modelPrediction} ({probabilityPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPositive ? "bg-blue-600 dark:bg-sky-400" : "bg-emerald-500"
                    }`}
                    style={{ width: `${probabilityPercent}%` }}
                  />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-black/[0.04] dark:border-white/[0.06]">
                    <div className="font-semibold text-slate-400">AQ-10 raw score</div>
                    <div className="text-slate-800 dark:text-slate-100 font-bold tabular-nums">{score} / 10</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Demographic Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] text-xs">
            <div>
              <span className="text-slate-400 block">Child's Age</span>
              <span className="font-semibold text-slate-900 dark:text-white">{age || "8"} Years</span>
            </div>
            <div>
              <span className="text-slate-400 block">Gender</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">{gender === "f" ? "Female" : "Male"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Ethnicity</span>
              <span className="font-semibold text-slate-900 dark:text-white">{ethnicity || "Standard"}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Family History</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">{austim || "None reported"}</span>
            </div>
          </div>

        </div>

        {/* Recommended Immediate Care Steps */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Recommended Immediate Care Activities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div
              onClick={() => navigate("/speech")}
              className="p-5 rounded-3xl glass-card glass-card-hover cursor-pointer border border-black/[0.06] dark:border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200/50 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Start Speech Lab</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pronunciation feedback, phonics flashcards, and slow-tempo repetition.
              </p>
              <div className="mt-4 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <span>Open Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate("/attention")}
              className="p-5 rounded-3xl glass-card glass-card-hover cursor-pointer border border-black/[0.06] dark:border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/50 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gaze & Attention</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gentle webcam focus sessions with stability analytics and report export.
              </p>
              <div className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span>Start Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => navigate("/therapy")}
              className="p-5 rounded-3xl glass-card glass-card-hover cursor-pointer border border-black/[0.06] dark:border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-sky-400 mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">4-Week Therapy Roadmap</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Structured developmental exercises spanning memory, social, and motor skills.
              </p>
              <div className="mt-4 text-xs font-semibold text-blue-600 dark:text-sky-400 flex items-center gap-1">
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-5 rounded-3xl glass-card bg-black/[0.02] dark:bg-white/[0.03] text-xs text-slate-500 dark:text-slate-400 border border-black/[0.04] dark:border-white/[0.06]">
          <strong className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
            Important Clinical Information:
          </strong>
          The Autism Spectrum Quotient (AQ-10) is a quick screening tool developed by the Autism Research Centre. A high score suggests referral to an autism diagnostic specialist for a formal multidisciplinary assessment (such as ADOS-2 or ADI-R).
        </div>

      </div>
    </AppShell>
  );
};

export default Results;
