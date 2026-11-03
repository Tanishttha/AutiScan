import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Award,
  Flame,
  Star,
  Eye,
  Mic,
  CalendarCheck,
  ArrowLeft,
  Smile,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const WEEKLY_DATA = [
  { day: "Mon", focus: 75, speech: 12 },
  { day: "Tue", focus: 82, speech: 18 },
  { day: "Wed", focus: 78, speech: 14 },
  { day: "Thu", focus: 88, speech: 22 },
  { day: "Fri", focus: 92, speech: 26 },
  { day: "Sat", focus: 95, speech: 30 },
  { day: "Sun", focus: 90, speech: 24 },
];

const ACHIEVEMENTS = [
  {
    id: "focus",
    emoji: "🏆",
    title: "Focus Master",
    description: "Reached 95% sustained gaze stability in attention sessions.",
    date: "Achieved Yesterday",
    unlocked: true,
  },
  {
    id: "streak",
    emoji: "🔥",
    title: "Consistency Hero",
    description: "Maintained a joyful 7-day therapy practice streak.",
    date: "Active Streak",
    unlocked: true,
  },
  {
    id: "speech",
    emoji: "🌟",
    title: "Pronunciation Star",
    description: "Spoke 20+ words with over 80% phonics match.",
    date: "Achieved 3 days ago",
    unlocked: true,
  },
  {
    id: "memory",
    emoji: "🧠",
    title: "Memory Champion",
    description: "Solved pattern matching and sequence puzzles in week 3.",
    date: "Unlocked",
    unlocked: true,
  },
  {
    id: "buddy",
    emoji: "🤝",
    title: "Adventure Explorer",
    description: "Completed the Jungle and Space story missions with Buddy.",
    date: "Unlocked",
    unlocked: true,
  },
  {
    id: "calm",
    emoji: "🌈",
    title: "Sensory Calmness",
    description: "Practiced 4-second balloon breathing exercises calmly.",
    date: "In Progress",
    unlocked: false,
  },
];

export default function ProgressAnalytics() {
  const navigate = useNavigate();
  const [metricTab, setMetricTab] = useState<"focus" | "speech">("focus");

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
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
                Progress & Growth Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Longitudinal attention trends, speech confidence milestones, and earned rewards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/therapy")}
              variant="outline"
              className="rounded-2xl glass-card text-xs font-semibold border-slate-200/80 dark:border-slate-800/80"
            >
              View Therapy Plan
            </Button>
          </div>
        </div>

        {/* Top KPI Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="p-5 sm:p-6 rounded-3xl glass-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Avg Attention</span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-sky-400 tabular-nums">
              87%
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% this week</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl glass-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Total Words Spoken</span>
              <Mic className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
              146
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Across 4 vocabulary packs
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl glass-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Practice Streak</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 tabular-nums">
              7 Days
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Best streak: 14 days
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl glass-card">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Milestones Completed</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 tabular-nums">
              18 / 24
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              75% of monthly goal
            </div>
          </div>

        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left: Interactive Weekly Trend Chart */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span>Weekly Therapy Growth Metrics</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Consistent progress across daily sessions
                </p>
              </div>

              {/* Metric Tab Pill Selector */}
              <div className="flex p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06]">
                <button
                  onClick={() => setMetricTab("focus")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    metricTab === "focus"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Attention Score (%)
                </button>
                <button
                  onClick={() => setMetricTab("speech")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    metricTab === "speech"
                      ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Words Practiced
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DATA}>
                  <defs>
                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="speechGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "none",
                      borderRadius: "14px",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
                    }}
                  />
                  {metricTab === "focus" ? (
                    <Area
                      type="monotone"
                      dataKey="focus"
                      name="Attention (%)"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#focusGrad)"
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="speech"
                      name="Words Practiced"
                      stroke="#a855f7"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#speechGrad)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Weekly Average: 87.1%</span>
              <span className="text-emerald-500 font-semibold">Consistent Improvement 🌟</span>
            </div>

          </div>

          {/* Right: Milestone Unlocks */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Earned Trophies</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Achievements celebrate the child's dedication
            </p>

            <div className="space-y-3">
              {ACHIEVEMENTS.slice(0, 4).map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl flex items-center gap-3 border transition-all ${
                    badge.unlocked
                      ? "bg-white/60 dark:bg-slate-900/60 border-black/[0.05] dark:border-white/[0.08]"
                      : "opacity-50 border-dashed border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <div className="text-2xl shrink-0 p-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04]">
                    {badge.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {badge.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
