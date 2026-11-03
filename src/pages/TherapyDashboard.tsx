import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Eye,
  Mic,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  Smile,
  ShieldCheck,
  Play,
  RotateCcw
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, OfflineError } from "@/services/api";

interface Task {
  id: string;
  title: string;
  description: string;
  minutes: number;
}

interface WeekPlan {
  week: number;
  title: string;
  focus: string;
  emoji: string;
  tasks: Task[];
}

const ROADMAP: WeekPlan[] = [
  {
    week: 1,
    title: "Eye Contact & Visual Engagement",
    focus: "Gentle eye gaze tracking and face recognition",
    emoji: "👁",
    tasks: [
      { id: "w1-1", title: "Mirror Self-Reflection", description: "Sit in front of a mirror and practice smiling for 2 minutes.", minutes: 3 },
      { id: "w1-2", title: "Focal Object Gaze", description: "Follow a gentle moving star across the screen without turning head.", minutes: 5 },
      { id: "w1-3", title: "Emotion Card Identification", description: "Match happy, calm, and curious facial expressions on flashcards.", minutes: 5 },
      { id: "w1-4", title: "Warm Eye-Contact Hello", description: "Practice making 3-second gentle eye contact when greeting family.", minutes: 2 },
    ]
  },
  {
    week: 2,
    title: "Speech & Expressive Communication",
    focus: "Phonics syllables, slow tempo articulation and voice confidence",
    emoji: "🗣",
    tasks: [
      { id: "w2-1", title: "Vowel Sound Resonance", description: "Sing the vowel sounds 'A-E-I-O-U' slowly like gentle musical notes.", minutes: 4 },
      { id: "w2-2", title: "3 Favorite Word Repetitions", description: "Practice words 'Apple', 'Water', and 'Star' in the Speech Lab.", minutes: 6 },
      { id: "w2-3", title: "Visual Story Sharing", description: "Look at a jungle picture and name 2 friendly animals aloud.", minutes: 5 },
      { id: "w2-4", title: "Joyful Echo Game", description: "Repeat a cheerful phrase back to your parent or AI buddy.", minutes: 3 },
    ]
  },
  {
    week: 3,
    title: "Cognitive Memory & Pattern Skills",
    focus: "Visual recall, sequence arrangement, and calm problem-solving",
    emoji: "🧠",
    tasks: [
      { id: "w3-1", title: "Color Sequence Memory", description: "Remember and tap 3 colors in sequence (Blue -> Green -> Yellow).", minutes: 5 },
      { id: "w3-2", title: "Shape Match Sorting", description: "Group circles, stars, and squares into matching sensory boxes.", minutes: 5 },
      { id: "w3-3", title: "Story Event Ordering", description: "Recall what happened first and next in Buddy's space mission.", minutes: 4 },
      { id: "w3-4", title: "Puzzle Piece Assembly", description: "Complete a simple 4-piece visual puzzle at a comfortable pace.", minutes: 6 },
    ]
  },
  {
    week: 4,
    title: "Behavior Stability & Sustained Focus",
    focus: "Sensory regulation, deep breathing, and attention resilience",
    emoji: "🎯",
    tasks: [
      { id: "w4-1", title: "Calm Balloon Breathing", description: "Inhale slowly for 4 seconds, then exhale like blowing a gentle balloon.", minutes: 3 },
      { id: "w4-2", title: "5-Minute Continuous Attention", description: "Maintain steady focus in the Attention Monitor with zero hurry.", minutes: 5 },
      { id: "w4-3", title: "Transition Readiness Practice", description: "Use a visual timer countdown before changing activities.", minutes: 3 },
      { id: "w4-4", title: "Celebration & Star Trophy Review", description: "Count all the achievement badges earned across the month!", minutes: 4 },
    ]
  },
  {
    week: 5,
    title: "Playful Conversation & Turn-Taking",
    focus: "Simple social conversations and emotional vocabulary",
    emoji: "💬",
    tasks: [
      { id: "w5-1", title: "Friendly Hello Exchange", description: "Greet a caregiver and say one word with a happy smile.", minutes: 3 },
      { id: "w5-2", title: "Story Prompt Practice", description: "Answer 2 short questions about a picture scene.", minutes: 5 },
      { id: "w5-3", title: "Turn-Taking Game", description: "Take turns naming objects or colors in a calm rhythm.", minutes: 5 },
      { id: "w5-4", title: "Emotion Words", description: "Practice happy, calm, and excited words with facial cues.", minutes: 4 },
    ]
  },
  {
    week: 6,
    title: "Routine Flexibility & Confidence",
    focus: "Comfort with transitions and small daily changes",
    emoji: "🔄",
    tasks: [
      { id: "w6-1", title: "Visual Transition Timer", description: "Use a timer before moving to the next task and prepare calmly.", minutes: 3 },
      { id: "w6-2", title: "New Game Practice", description: "Try one new activity without frustration and celebrate effort.", minutes: 5 },
      { id: "w6-3", title: "Choice-Making Practice", description: "Pick between two activities and talk through the choice.", minutes: 4 },
      { id: "w6-4", title: "Calm Ending Ritual", description: "Finish the session with a positive recap and breathing reset.", minutes: 3 },
    ]
  },
  {
    week: 7,
    title: "Confidence Celebration & Review",
    focus: "Reflecting on progress and maintaining gentle momentum",
    emoji: "🏅",
    tasks: [
      { id: "w7-1", title: "Progress Review", description: "Look at all completed wins and talk about what felt easy.", minutes: 4 },
      { id: "w7-2", title: "Best Skill Showcase", description: "Repeat the favorite speech or focus exercise with confidence.", minutes: 5 },
      { id: "w7-3", title: "Family Celebration", description: "Share one proud moment with a caregiver or loved one.", minutes: 4 },
      { id: "w7-4", title: "Next-Step Goal", description: "Choose one small goal for the next week and practice it gently.", minutes: 3 },
    ]
  }
];

const AI_DEFAULT_PAYLOAD = {
  attention_score: 88,
  gaze_stability: 85,
  speech_confidence: 82,
  engagement: "Focused",
  blink_frequency: 0.12,
  hyperactivity_score: 28,
  focus_duration: 24,
  movement_variance: 3200,
  emotion_recognition: 82,
  social_response_score: 78
};

const STORAGE_KEYS = {
  roadmap: "autiscan-therapy-roadmap",
  selectedWeek: "autiscan-therapy-selected-week",
  motivation: "autiscan-therapy-motivation",
  summary: "autiscan-therapy-summary",
};

const readStoredRoadmap = (): WeekPlan[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.roadmap);
    if (!saved) return ROADMAP;

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fall back to default roadmap when storage is unavailable or corrupted.
  }

  return ROADMAP;
};

const readStoredNumber = (key: string, fallback: number): number => {
  try {
    const saved = Number(localStorage.getItem(key));
    return Number.isFinite(saved) && saved > 0 ? saved : fallback;
  } catch {
    return fallback;
  }
};

const readStoredString = (key: string, fallback: string): string => {
  try {
    const saved = localStorage.getItem(key);
    return saved && saved.trim() ? saved : fallback;
  } catch {
    return fallback;
  }
};

const buildRoadmapFromAnalysis = (analysis: Record<string, any> | undefined): WeekPlan[] => {
  const rawRoadmap =
    analysis?.roadmap ||
    analysis?.weekly_roadmap ||
    analysis?.ai_generated_plan?.roadmap ||
    analysis?.ai_generated_plan?.weekly_roadmap ||
    [];

  if (!Array.isArray(rawRoadmap) || rawRoadmap.length === 0) {
    return ROADMAP;
  }

  const normalizeTasks = (weekPlan: any, weekIndex: number, incomingTasks: any[] = []) => {
    const fallbackTemplate = [
      {
        id: `ai-${weekIndex + 1}-1`,
        title: weekPlan?.focus || weekPlan?.title || `Activity ${weekIndex + 1}`,
        description: weekPlan?.description || weekPlan?.expected_improvement || "Follow this guided practice to build confidence and stability.",
        minutes: 5,
      },
      {
        id: `ai-${weekIndex + 1}-2`,
        title: `${weekPlan?.focus || "Support"} Warm-Up`,
        description: `Begin with a calm guided ${weekPlan?.focus || "support"} activity to build confidence and focus.`,
        minutes: 5,
      },
      {
        id: `ai-${weekIndex + 1}-3`,
        title: "Confidence Review",
        description: "Celebrate progress gently and repeat the strongest step to keep momentum positive.",
        minutes: 4,
      },
      {
        id: `ai-${weekIndex + 1}-4`,
        title: "Gentle Practice Finish",
        description: "End the session with a calm recap and encouragement to continue with confidence.",
        minutes: 3,
      },
    ];

    const tasks = (Array.isArray(incomingTasks) ? incomingTasks : []).map((task: any, taskIndex: number) => {
      if (typeof task === "string") {
        return {
          id: `ai-${weekIndex + 1}-${taskIndex}`,
          title: task,
          description: "Follow this guided activity to build calm confidence and keep momentum going.",
          minutes: 5,
        };
      }

      return {
        id: task?.id ?? `ai-${weekIndex + 1}-${taskIndex}`,
        title: task?.title || task?.name || task?.focus || task?.task || `Activity ${taskIndex + 1}`,
        description:
          task?.description ||
          task?.task ||
          "Practice this guided activity with a gentle tempo and positive reinforcement.",
        minutes: Number(task?.minutes) || 5,
      };
    });

    const normalized = [...(tasks.length ? tasks : fallbackTemplate)];
    while (normalized.length < 4) {
      const nextIndex = normalized.length + 1;
      normalized.push({
        id: `ai-${weekIndex + 1}-${nextIndex}`,
        title: `Gentle support ${nextIndex}`,
        description: "Finish with a calm repetition routine and a gentle confidence check.",
        minutes: 4,
      });
    }

    return normalized.slice(0, 4);
  };

  const mapped = rawRoadmap.map((weekPlan: any, index: number) => {
    const normalizedTasks = Array.isArray(weekPlan?.tasks)
      ? weekPlan.tasks
      : Array.isArray(weekPlan?.task_list)
        ? weekPlan.task_list
        : typeof weekPlan?.task === "string" || typeof weekPlan?.title === "string"
          ? [
              {
                id: `ai-${index + 1}-1`,
                title: weekPlan?.task || weekPlan?.title || weekPlan?.focus || `Activity ${index + 1}`,
                description:
                  weekPlan?.description ||
                  weekPlan?.expected_improvement ||
                  `Practice ${weekPlan?.focus || "this guided support step"} with a calm, encouraging rhythm.`,
                minutes: Number(weekPlan?.minutes) || 7,
              },
              {
                id: `ai-${index + 1}-2`,
                title: `${weekPlan?.focus || "Support"} Warm-Up`,
                description: `Begin with a calm guided ${weekPlan?.focus || "support"} activity to build confidence and focus.`,
                minutes: 5,
              },
              {
                id: `ai-${index + 1}-3`,
                title: "Confidence Review",
                description: "Celebrate progress gently and repeat the strongest step to keep momentum positive.",
                minutes: 4,
              },
            ]
          : [];

    return {
      week: index + 1,
      title: weekPlan?.title || weekPlan?.focus || `Week ${index + 1}`,
      focus: weekPlan?.focus || weekPlan?.title || weekPlan?.day || "Gentle developmental support",
      emoji: ["👁", "🗣", "🧠", "🎯", "💬", "🔄", "🏅"][index % 7],
      tasks: normalizeTasks(weekPlan, index, normalizedTasks),
    };
  });

  if (mapped.length < 7) {
    const padded = [...mapped];
    while (padded.length < 7) {
      const nextIndex = padded.length;
      padded.push({
        week: nextIndex + 1,
        title: `Week ${nextIndex + 1}`,
        focus: "Gentle developmental support",
        emoji: ["👁", "🗣", "🧠", "🎯", "💬", "🔄", "🏅"][nextIndex % 7],
        tasks: [
          {
            id: `fallback-${nextIndex + 1}-1`,
            title: "Calm guided repetition",
            description: "Continue with a gentle, encouraging practice rhythm to build confidence.",
            minutes: 5,
          },
        ],
      });
    }
    return padded;
  }

  return mapped;
};

export default function TherapyDashboard() {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number>(() => readStoredNumber(STORAGE_KEYS.selectedWeek, 1));
  const [roadmap, setRoadmap] = useState<WeekPlan[]>(() => readStoredRoadmap());
  const [motivationMessage, setMotivationMessage] = useState<string>(() =>
    readStoredString(STORAGE_KEYS.motivation, "Keep learning and improving every day!")
  );
  const [aiSummary, setAiSummary] = useState<string>(() =>
    readStoredString(STORAGE_KEYS.summary, "AI-guided developmental support is preparing your personalized plan.")
  );
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("autiscan-completed-tasks");
      return saved ? JSON.parse(saved) : { "w1-1": true, "w1-2": true };
    } catch {
      return { "w1-1": true, "w1-2": true };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.roadmap, JSON.stringify(roadmap));
    } catch {
      // Ignore storage write failures to keep the UI functional in restricted environments.
    }
  }, [roadmap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.selectedWeek, String(selectedWeek));
    } catch {
      // Ignore storage write failures to keep the UI functional in restricted environments.
    }
  }, [selectedWeek]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.motivation, motivationMessage);
    } catch {
      // Ignore storage write failures to keep the UI functional in restricted environments.
    }
  }, [motivationMessage]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.summary, aiSummary);
    } catch {
      // Ignore storage write failures to keep the UI functional in restricted environments.
    }
  }, [aiSummary]);

  useEffect(() => {
    let isMounted = true;

    api
      .analyzeTherapy(AI_DEFAULT_PAYLOAD)
      .then((response) => {
        if (!isMounted) return;

        const analysis = response?.analysis ?? {};
        const nextRoadmap = buildRoadmapFromAnalysis(analysis);
        const nextMotivation =
          analysis?.motivation_message ||
          analysis?.ai_generated_plan?.motivation_message ||
          "Keep learning and improving every day!";
        const nextSummary =
          analysis?.ai_generated_plan?.summary ||
          analysis?.summary ||
          analysis?.improvement_level ||
          "AI-guided developmental support is preparing your personalized plan.";

        setRoadmap(nextRoadmap);
        setSelectedWeek((current) => Math.min(current, nextRoadmap.length || 1));
        setMotivationMessage(nextMotivation);
        setAiSummary(nextSummary);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!(err instanceof OfflineError)) {
          console.warn("Therapy analysis unavailable, using fallback roadmap.", err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentPlan = roadmap[selectedWeek - 1] ?? roadmap[0] ?? ROADMAP[0];
  const currentRoadmapTaskIds = new Set(roadmap.flatMap((plan) => plan.tasks.map((task) => task.id)));

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      localStorage.setItem("autiscan-completed-tasks", JSON.stringify(updated));
      if (updated[taskId]) {
        toast.success("Task completed! Milestone points added 🌟");
      }
      return updated;
    });
  };

  const currentWeekDoneCount = currentPlan.tasks.filter((t) => completedTasks[t.id]).length;
  const currentWeekProgress = Math.round((currentWeekDoneCount / currentPlan.tasks.length) * 100);

  const totalTasks = roadmap.reduce((sum, w) => sum + w.tasks.length, 0);
  const totalCompleted = roadmap.reduce(
    (sum, week) => sum + week.tasks.filter((task) => completedTasks[task.id]).length,
    0
  );
  const overallProgress = Math.min(100, Math.round((totalCompleted / Math.max(totalTasks, 1)) * 100));

  const staleCompletedCount = Object.keys(completedTasks).filter((taskId) => !currentRoadmapTaskIds.has(taskId) && completedTasks[taskId]).length;
  if (staleCompletedCount > 0) {
    localStorage.setItem(
      "autiscan-completed-tasks",
      JSON.stringify(Object.fromEntries(Object.entries(completedTasks).filter(([taskId]) => currentRoadmapTaskIds.has(taskId))))
    );
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
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
                Personalized Therapy Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Structured developmental exercises for communication, attention, and sensory comfort
              </p>
              <p className="text-[11px] text-blue-600 dark:text-sky-400 mt-2 font-medium">
                {aiSummary}
              </p>
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl glass-card flex items-center gap-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Milestone</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {totalCompleted} of {totalTasks} Tasks ({overallProgress}%)
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-sky-400 font-bold text-xs">
                {overallProgress}%
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-3xl border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 text-xs text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2 font-semibold text-blue-700 dark:text-sky-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Care Note</span>
          </div>
          <p className="mt-2 leading-relaxed">{motivationMessage}</p>
        </div>

        {/* Apple-style Segmented Week Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {roadmap.map((plan) => {
            const isSelected = selectedWeek === plan.week;
            const weekDone = plan.tasks.filter((t) => completedTasks[t.id]).length;
            const isAllDone = weekDone === plan.tasks.length;

            return (
              <button
                key={plan.week}
                onClick={() => setSelectedWeek(plan.week)}
                className={`p-4 rounded-[24px] text-left transition-all duration-200 active:scale-95 border ${
                  isSelected
                    ? "bg-white dark:bg-slate-800 border-blue-500/50 dark:border-sky-400/50 shadow-md ring-2 ring-blue-500/20"
                    : "glass-card border-black/[0.05] dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{plan.emoji}</span>
                  {isAllDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
                      {weekDone}/{plan.tasks.length}
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Week {plan.week}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {plan.title.split("&")[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Week Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Task Checklist Column */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-[32px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.05] dark:border-white/[0.06]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 mb-1">
                    <span>{currentPlan.emoji}</span>
                    <span>Week {currentPlan.week} Focus Plan</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {currentPlan.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {currentPlan.focus}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Week Progress: {currentWeekProgress}%
                  </span>
                  <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-sky-400 rounded-full transition-all duration-300"
                      style={{ width: `${currentWeekProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Items */}
              <div className="mt-6 space-y-3">
                {currentPlan.tasks.map((task, idx) => {
                  const isDone = !!completedTasks[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex items-start gap-4 ${
                        isDone
                          ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/40 dark:border-emerald-800/40"
                          : "glass-card hover:bg-black/[0.02] dark:hover:bg-white/[0.04] border-black/[0.05] dark:border-white/[0.08]"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label="Toggle task"
                        className="mt-0.5 shrink-0"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`text-sm font-bold ${isDone ? "text-slate-500 dark:text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>
                            {task.title}
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                            ~{task.minutes} mins
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${isDone ? "text-slate-400 line-through" : "text-slate-600 dark:text-slate-400"}`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Side Column: Quick Care Modules & Tips */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick launch interactive tools */}
            <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Companion Tools For Week {selectedWeek}
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/speech")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all border border-black/[0.05] dark:border-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <span>Speech Pronunciation Lab</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => navigate("/attention")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all border border-black/[0.05] dark:border-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span>Attention Focus Monitor</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => navigate("/ai-companion")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all border border-black/[0.05] dark:border-white/[0.08]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>Joyful AI Learning Buddy</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sensory Therapy Encouragement */}
            <div className="p-6 rounded-[32px] glass-card bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30 text-xs">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-2">
                <Smile className="w-4 h-4" />
                <span>Sensory Integration Note</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If the child feels overwhelmed or tired, pause the session immediately. AutiScan adapts to the child's pace, with zero urgency or punitive scoring.
              </p>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
