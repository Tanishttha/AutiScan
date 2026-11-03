import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Info,
  Sparkles,
  HelpCircle,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { api, OfflineError } from "@/services/api";

interface Question {
  id: string;
  text: string;
  category: string;
  description: string;
}

const questions: Question[] = [
  {
    id: "A1_Score",
    text: "I prefer to do things with friends rather than on my own",
    category: "Social Connection",
    description: "Evaluates preference for peer companionship vs solo play/activities."
  },
  {
    id: "A2_Score",
    text: "I frequently interrupt other people's conversations",
    category: "Communication Timing",
    description: "Evaluates conversational turn-taking and impulse awareness."
  },
  {
    id: "A3_Score",
    text: "I notice small sounds when others do not",
    category: "Sensory Processing",
    description: "Evaluates sensory sensitivity and auditory awareness."
  },
  {
    id: "A4_Score",
    text: "I find it difficult to imagine what it would be like to be someone else",
    category: "Theory of Mind",
    description: "Evaluates cognitive empathy and perspective-taking."
  },
  {
    id: "A5_Score",
    text: "I find it easy to do more than one thing at once",
    category: "Attention Switching",
    description: "Evaluates cognitive flexibility and multitasking."
  },
  {
    id: "A6_Score",
    text: "I find it easy to work out what someone is thinking or feeling",
    category: "Social Intuition",
    description: "Evaluates emotional cue detection and nonverbal comprehension."
  },
  {
    id: "A7_Score",
    text: "I find it difficult to work out people's intentions",
    category: "Social Understanding",
    description: "Evaluates awareness of subtle social motivations."
  },
  {
    id: "A8_Score",
    text: "I prefer to do things the same way over and over again",
    category: "Repetitive Patterns",
    description: "Evaluates comfort with predictable routines vs changes."
  },
  {
    id: "A9_Score",
    text: "I easily get upset if I don't follow my routine",
    category: "Routine Invariance",
    description: "Evaluates emotional reactivity to unexpected transitions."
  },
  {
    id: "A10_Score",
    text: "I find it difficult to read people's expressions",
    category: "Facial Cues",
    description: "Evaluates facial affect recognition and emotional reading."
  },
];

const Screening = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [age, setAge] = useState("8");
  const [gender, setGender] = useState("m");
  const [ethnicity, setEthnicity] = useState("White-European");
  const [jaundice, setJaundice] = useState("no");
  const [austim, setAustim] = useState("no");
  const [contryOfRes, setContryOfRes] = useState("United States");
  const [usedAppBefore, setUsedAppBefore] = useState("no");
  const [relation, setRelation] = useState("Parent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = Object.keys(responses).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const handleSelectOption = (questionId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (answeredCount < questions.length) {
      toast.error(`Please answer all ${questions.length} questions (${questions.length - answeredCount} remaining)`);
      return;
    }

    if (!age || !gender || !ethnicity || !jaundice || !austim || !contryOfRes || !usedAppBefore || !relation) {
      toast.error("Please complete all demographic fields");
      return;
    }

    setIsSubmitting(true);

    const result = Object.values(responses).reduce((sum, val) => sum + val, 0);

    const payload = {
      ...responses,
      age: parseFloat(age),
      gender: gender === "Female" ? "f" : gender === "male" ? "m" : gender === "Male" ? "m" : gender === "f" ? "f" : gender,
      ethnicity: ethnicity === "Middle Eastern" ? "Middle Eastern " : ethnicity,
      jaundice: jaundice?.toLowerCase?.() || jaundice,
      austim: austim?.toLowerCase?.() || austim,
      contry_of_res: contryOfRes,
      used_app_before: usedAppBefore?.toLowerCase?.() || usedAppBefore,
      result,
      relation: relation === "Parent" || relation === "Relative" || relation === "Health care professional" ? "Others" : relation,
    };

    try {
      const data = await api.predictASD(payload);

      toast.success("Assessment evaluated successfully!");
      navigate("/results", {
        state: {
          prediction: data.prediction,
          result: data.raw_score ?? result,
          raw_score: data.raw_score ?? result,
          probability: data.probability,
          threshold: data.threshold ?? 6,
          age,
          gender,
          ethnicity,
          austim,
          responses,
        },
      });
    } catch (err: unknown) {
      if (err instanceof OfflineError) {
        toast.error("No internet connection! Backend server is unreachable. Please verify your connection.");
      } else {
        const errorMsg = (err as Error)?.message || "Failed to connect to assessment server";
        toast.error(`No internet connection or server error: ${errorMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between pb-6 border-b border-black/[0.04] dark:border-white/[0.06] mb-8">
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
                Clinical ASD Screening (AQ-10)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Standardized behavioral quotient test adapted for children and youth
              </p>
            </div>
          </div>

          {/* Progress pill */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 tabular-nums">
              {answeredCount} of {questions.length} Completed
            </span>
            <div className="w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Gentle Context Card */}
        <div className="p-5 sm:p-6 rounded-3xl glass-card bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30 mb-8 flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-sky-400 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">
              Parents & Guardians Note:
            </strong>
            Answer based on the child's natural, everyday behavior when calm. This screening is a helpful diagnostic aid, not a standalone medical diagnosis.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Demographic Section */}
          <div className="p-6 sm:p-8 rounded-[32px] glass-card">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <span>Child & Participant Profile</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Used by the behavioral model for accurate baseline age and developmental norm weighting
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Child's Age (Years)</Label>
                <Input
                  type="number"
                  min="2"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Family ASD History</Label>
                <Select value={austim} onValueChange={setAustim}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Family history" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="yes">Yes, identified in family</SelectItem>
                    <SelectItem value="no">No known history</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Relationship to Child</Label>
                <Select value={relation} onValueChange={setRelation}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Relationship" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Parent">Parent / Guardian</SelectItem>
                    <SelectItem value="Self">Self (Adult/Youth)</SelectItem>
                    <SelectItem value="Relative">Relative</SelectItem>
                    <SelectItem value="Health care professional">Therapist / Clinician</SelectItem>
                    <SelectItem value="Others">Teacher / Caregiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Born with Jaundice?</Label>
                <Select value={jaundice} onValueChange={setJaundice}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Ethnicity</Label>
                <Select value={ethnicity} onValueChange={setEthnicity}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Select ethnicity" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="White-European">White-European</SelectItem>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="South Asian">South Asian</SelectItem>
                    <SelectItem value="Hispanic">Hispanic</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Country of Residence</Label>
                <Select value={contryOfRes} onValueChange={setContryOfRes}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl max-h-56">
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Others">Other Countries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Used Screening App Before?</Label>
                <Select value={usedAppBefore} onValueChange={setUsedAppBefore}>
                  <SelectTrigger className="rounded-2xl h-10 bg-white/60 dark:bg-slate-900/60 text-sm">
                    <SelectValue placeholder="Previous screening" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="no">No, First Time</SelectItem>
                    <SelectItem value="yes">Yes, Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Assessment Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Behavioral & Cognitive Statements
              </h2>
              <span className="text-xs text-slate-500">
                Select 1 (Agree) or 0 (Disagree)
              </span>
            </div>

            {questions.map((q, index) => {
              const currentVal = responses[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-6 rounded-[28px] glass-card transition-all duration-200 border ${
                    currentVal !== undefined
                      ? "border-blue-500/40 dark:border-sky-400/30 bg-blue-50/20 dark:bg-blue-950/15"
                      : "border-black/[0.06] dark:border-white/[0.08]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-blue-600 dark:text-sky-400 tabular-nums">
                          Statement {index + 1}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">· {q.category}</span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                        "{q.text}"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {q.description}
                      </p>
                    </div>

                    {/* Apple Segmented Response Buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-center bg-black/[0.03] dark:bg-white/[0.06] p-1.5 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectOption(q.id, 1)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                          currentVal === 1
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        Agree (1)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectOption(q.id, 0)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                          currentVal === 0
                            ? "bg-slate-800 text-white dark:bg-slate-700 shadow-sm"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        Disagree (0)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky/Bottom Submission Bar */}
          <div className="p-6 rounded-[32px] glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 border border-black/[0.06] dark:border-white/[0.08]">
            <div className="text-center sm:text-left">
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {answeredCount === questions.length ? "Ready for Evaluation" : `${questions.length - answeredCount} Questions Remaining`}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation results will generate personalized therapy suggestions and strength roadmaps.
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto px-8 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? "Evaluating Traits..." : "Calculate Evaluation"}</span>
            </Button>
          </div>

        </form>

      </div>
    </AppShell>
  );
};

export default Screening;
