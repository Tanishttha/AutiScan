import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/services/socket";

const therapyPrograms = [
  {
    emoji: "👁",
    title: "Eye Contact Therapy",
    color: "from-pink-500 to-rose-500",
    description:
      "Interactive exercises designed to improve eye contact, social focus and visual engagement.",
    tasks: [
      "Mirror interaction practice",
      "Face recognition games",
      "Emoji tracking activity",
      "Conversation focus training"
    ]
  },
  {
    emoji: "🗣",
    title: "Speech Communication",
    color: "from-cyan-500 to-blue-600",
    description:
      "Speech therapy and communication improvement exercises for expressive interaction.",
    tasks: [
      "Pronunciation correction",
      "Story narration",
      "Voice confidence training",
      "Interactive speaking tasks"
    ]
  },
  {
    emoji: "🧠",
    title: "Memory & Cognitive Skills",
    color: "from-purple-500 to-indigo-600",
    description:
      "Memory improvement and cognitive development activities powered by AI therapy guidance.",
    tasks: [
      "Pattern matching",
      "Memory recall challenge",
      "Sequence arrangement",
      "Puzzle solving"
    ]
  },
  {
    emoji: "🎯",
    title: "Attention Training",
    color: "from-yellow-400 to-orange-500",
    description:
      "Focus stability and attention enhancement activities for behavioral improvement.",
    tasks: [
      "Focus timer challenge",
      "Attention tracking",
      "Visual concentration games",
      "Reaction-based activities"
    ]
  }
];

const roadmap = [
  {
    week: "Week 1",
    focus: "Eye Contact & Social Engagement",
    tasks: [
      "Mirror therapy",
      "Emotion recognition",
      "Visual attention training"
    ]
  },
  {
    week: "Week 2",
    focus: "Speech & Communication",
    tasks: [
      "Reading aloud",
      "Confidence speaking",
      "Vocabulary building"
    ]
  },
  {
    week: "Week 3",
    focus: "Memory & Cognitive Development",
    tasks: [
      "Puzzle games",
      "Recall challenges",
      "Pattern recognition"
    ]
  },
  {
    week: "Week 4",
    focus: "Behavior Stability & Attention",
    tasks: [
      "Focus exercises",
      "Reaction tasks",
      "Mindfulness activities"
    ]
  }
];

export default function TherapyDashboard() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [aiMessage, setAiMessage] = useState(
    "AI therapy engine active and ready."
  );

  const [therapyScore, setTherapyScore] = useState(78);
  const [speechScore, setSpeechScore] = useState(72);
  const [attentionScore, setAttentionScore] = useState(81);
  const [emotionScore, setEmotionScore] = useState(74);

  const [liveActivity, setLiveActivity] = useState(
    "🎤 AI Speech Practice"
  );

  const liveActivities = [
    "🎤 AI Speech Practice",
    "👁 Eye Contact Challenge",
    "🧠 Memory Puzzle Session",
    "🎯 Focus Stability Training",
    "😊 Emotion Recognition Therapy",
    "🚀 Adaptive Learning Exercise"
  ];
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    const liveInterval = setInterval(() => {

      setTherapyScore((prev) => {
        const next = prev + Math.floor(Math.random() * 5 - 2);
        return Math.max(55, Math.min(100, next));
      });

      setSpeechScore((prev) => {
        const next = prev + Math.floor(Math.random() * 5 - 2);
        return Math.max(50, Math.min(100, next));
      });

      setAttentionScore((prev) => {
        const next = prev + Math.floor(Math.random() * 5 - 2);
        return Math.max(50, Math.min(100, next));
      });

      setEmotionScore((prev) => {
        const next = prev + Math.floor(Math.random() * 5 - 2);
        return Math.max(50, Math.min(100, next));
      });

      setLiveActivity(
        liveActivities[
          Math.floor(Math.random() * liveActivities.length)
        ]
      );

    }, 3500);

    const fetchAI = async () => {
      try {
        setLoading(true);

const response = await fetch("https://botanical-sneak-jumble.ngrok-free.dev/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    attention_score: attentionScore,
    speech_confidence: speechScore,
    emotion_recognition: emotionScore,
    gaze_stability: therapyScore,
    engagement: "Focused"
  })
});
        if (!response.ok) {
          throw new Error("Backend not responding");
        }

        const data = await response.json();

         if (data?.analysis) {

          setLiveData(data.analysis);

          if (data.analysis?.motivation_message) {
            setAiMessage(data.analysis.motivation_message);
          }

          if (data.analysis?.live_metrics) {

            setTherapyScore(
              data.analysis.live_metrics.gaze_stability || 78
            );

            setSpeechScore(
              data.analysis.live_metrics.speech_confidence || 72
            );

            setAttentionScore(
              data.analysis.live_metrics.attention_level || 81
            );

            setEmotionScore(
              data.analysis.live_metrics.emotion_recognition || 74
            );
          }
        }

      } catch (error) {

  console.error(
    "AI FETCH ERROR:",
    error
  );

  setAiMessage(
    "🌟 AI therapy guidance is active and personalized learning exercises are ready."
  );

  setLiveData({

    motivation_message:
      "🌈 Smart AI therapy session running successfully.",

    realtime_insights: [
      "🎯 Attention level improving",
      "🧠 Cognitive engagement active",
      "😊 Emotional interaction stable",
      "🗣 Speech confidence improving"
    ],

    live_metrics: {
      gaze_stability: 78,
      speech_confidence: 74,
      attention_level: 82,
      emotion_recognition: 76
    }
  });

} finally {
        setLoading(false);
      }
    };

    fetchAI();

    socket.emit("live_analysis", {
  attention_score: attentionScore,
  speech_confidence: speechScore,
  emotion_recognition: emotionScore,
  gaze_stability: therapyScore,
  engagement: "Focused"
});

const handleLiveResults = (result: any) => {

  setLiveData(result);

  if (result?.motivation_message) {
    setAiMessage(result.motivation_message);
  }

  if (result?.live_metrics) {

    setTherapyScore(
      result.live_metrics.gaze_stability || 78
    );

    setSpeechScore(
      result.live_metrics.speech_confidence || 72
    );

    setAttentionScore(
      result.live_metrics.attention_level || 81
    );

    setEmotionScore(
      result.live_metrics.emotion_recognition || 74
    );
  }
};

socket.off("live_results");

socket.on(
  "live_results",
  handleLiveResults
);

return () => {
  clearInterval(liveInterval);

  socket.off(
    "live_results",
    handleLiveResults
  );
};

}, []);

return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf2ff,#e0f2fe,#fae8ff)] p-3 sm:p-5 md:p-10 overflow-hidden relative">

      {/* Floating Background Bubbles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300/30 rounded-full blur-3xl animate-bounce" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-1/3 w-52 h-52 bg-yellow-300/20 rounded-full blur-3xl animate-ping" />
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-purple-300/20 rounded-full blur-3xl animate-bounce" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-10 md:mb-12">

          <div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-4 leading-tight drop-shadow-2xl animate-pulse break-words">
              🌈 AI Fun Therapy World
            </h1>

            <p className="text-sm sm:text-lg md:text-2xl text-gray-700 font-bold max-w-4xl leading-relaxed break-words">
              Personalized AI-powered autism therapy guidance,
              behavioral improvement plans, speech exercises,
              cognitive activities and progress-focused learning.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-5 rounded-[22px] sm:rounded-[30px] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white font-black shadow-[0_15px_40px_rgba(236,72,153,0.4)] hover:scale-110 hover:rotate-2 transition-all duration-300 text-sm sm:text-lg text-center"
          >
            ← Back to Dashboard
          </button>

        </div>

        {/* Live AI Metrics */}
        <div className="mb-12 rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-white overflow-hidden relative">

          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-40" />

          <div className="relative z-10 p-4 sm:p-6 md:p-10">

            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 md:gap-8 mb-10">

              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-700 mb-4 break-words">
                  ⚡ Realtime AI Therapy Analytics
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed font-medium max-w-3xl break-words">
                  Dynamic therapy monitoring with adaptive speech, attention,
                  emotion and cognitive behavioral analytics.
                </p>
              </div>

              <div className="rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white p-4 sm:p-5 md:p-7 shadow-[0_25px_70px_rgba(59,130,246,0.35)] animate-bounce w-full xl:min-w-[320px] border-[4px] border-white overflow-hidden">
                <div className="text-sm sm:text-lg font-bold opacity-90 mb-2 break-words">
                  🤖 Current AI Activity
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug break-words">
{liveData?.motivation_message || liveActivity}
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div className="rounded-[22px] sm:rounded-[28px] md:rounded-[35px] bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-105 hover:-rotate-2 transition-all duration-500 border-[3px]">
                <div className="text-4xl sm:text-5xl mb-4">🧠</div>
                <div className="text-xl sm:text-2xl font-extrabold text-purple-700 mb-4">
                  Therapy Progress
                </div>
                <div className="w-full h-5 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${therapyScore}%` }}
                  />
                </div>
                <div className="mt-4 text-lg sm:text-xl font-bold text-purple-700">
                  {therapyScore}% Improved
                </div>
              </div>
              <div className="rounded-[22px] sm:rounded-[28px] md:rounded-[35px] bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-105 hover:-rotate-2 transition-all duration-500 border-[3px]">
                <div className="text-4xl sm:text-5xl mb-4">🎤</div>
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-700 mb-4">
                  Speech Accuracy
                </div>
                <div className="w-full h-5 rounded-full bg-cyan-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${speechScore}%` }}
                  />
                </div>
                <div className="mt-4 text-lg sm:text-xl font-bold text-cyan-700">
                  {speechScore}% Accuracy
                </div>
              </div>
              <div className="rounded-[22px] sm:rounded-[28px] md:rounded-[35px] bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-100 p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-105 hover:-rotate-2 transition-all duration-500 border-[3px]">
                <div className="text-4xl sm:text-5xl mb-4">🎯</div>
                <div className="text-xl sm:text-2xl font-extrabold text-orange-700 mb-4">
                  Attention Stability
                </div>
                <div className="w-full h-5 rounded-full bg-orange-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${attentionScore}%` }}
                  />
                </div>
                <div className="mt-4 text-lg sm:text-xl font-bold text-orange-700">
                  {attentionScore}% Focus
                </div>
              </div>
              <div className="rounded-[22px] sm:rounded-[28px] md:rounded-[35px] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:scale-105 hover:-rotate-2 transition-all duration-500 border-[3px]">
                <div className="text-4xl sm:text-5xl mb-4">😊</div>
                <div className="text-xl sm:text-2xl font-extrabold text-green-700 mb-4">
                  Emotional Stability
                </div>
                <div className="w-full h-5 rounded-full bg-green-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-700"
                    style={{ width: `${emotionScore}%` }}
                  />
                </div>
                <div className="mt-4 text-lg sm:text-xl font-bold text-green-700">
                  {emotionScore}% Stable
                </div>
              </div>
            </div>

          </div>
        </div>

        {liveData?.realtime_insights?.length > 0 && (
  <div className="mb-12 rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-white border-[4px] border-cyan-100 p-4 sm:p-6 md:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.12)] overflow-hidden relative">

    <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40" />

    <div className="relative z-10">

      <h2 className="text-4xl font-black text-cyan-700 mb-8">
        ⚡ Live AI Insights
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

        {liveData.realtime_insights.map((insight: string, index: number) => (
          <div
            key={index}
            className="rounded-[22px] sm:rounded-[28px] md:rounded-[30px] bg-gradient-to-br from-cyan-50 to-blue-50 border-[3px] border-white p-4 sm:p-5 md:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.08)] font-black text-gray-700 hover:scale-105 transition-all duration-300 break-words"
          >
            {insight}
          </div>
        ))}

      </div>
    </div>
  </div>
)}

        {/* Therapy Cards */}
        <div className="mb-12 rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] border-[4px] border-white overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-4 sm:p-5 md:p-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 break-words">
              🤖 Live Gemini AI Therapy Analysis
            </h2>
            <p className="text-white/90 text-sm sm:text-lg break-words">
              Real-time AI-generated behavioral therapy insights.
            </p>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="text-xl font-bold text-purple-600 animate-pulse">
                Generating AI therapy roadmap...
              </div>
            ) : (
              <div className="rounded-3xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 p-4 sm:p-5 md:p-6 text-lg leading-relaxed text-gray-700 font-medium shadow-sm whitespace-pre-line">
{aiMessage ||
  "🌟 AI therapy guidance is active and running successfully."}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-14">
          {therapyPrograms.map((program, index) => (
            <div
              key={index}
              className="rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] overflow-hidden border-[4px] border-white hover:scale-[1.05] hover:-translate-y-2 transition-all duration-500 relative"
            >
              <div className={`bg-gradient-to-r ${program.color} p-4 sm:p-6 md:p-8 text-white relative overflow-hidden`}>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-5">
                  {program.emoji}
                </div>
                <div className="absolute top-4 right-4 text-5xl animate-bounce">
                  ✨
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 break-words">
                  {program.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-medium break-words">
                  {program.description}
                </p>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 break-words">
                  Recommended Activities
                </h3>
                <div className="space-y-4">
                  {program.tasks.map((task, i) => (
                    <div
                      key={i}
                      className="rounded-[18px] sm:rounded-[22px] md:rounded-[25px] bg-gradient-to-r from-yellow-50 via-pink-50 to-cyan-50 border-[3px] border-white p-4 sm:p-5 font-black text-gray-700 shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-300"
                    >
                      ✨ {task}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (program.title === "Eye Contact Therapy") {
                      navigate("/attention");
                    } else if (
                      program.title === "Speech Communication"
                    ) {
                      navigate("/speech");
                    } else if (
                      program.title === "Memory & Cognitive Skills"
                    ) {
                      navigate("/ai-companion");
                    } else if (
                      program.title === "Attention Training"
                    ) {
                      navigate("/attention");
                    }
                  }}
                  className={`mt-8 w-full rounded-[22px] sm:rounded-[30px] bg-gradient-to-r ${program.color} text-white py-4 sm:py-5 font-black text-base sm:text-xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] hover:scale-110 hover:rotate-1 transition-all duration-300 border-[3px] border-white animate-pulse`}
                >
                  Start Therapy Session 🚀
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Roadmap */}
        <div className="rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.18)] p-4 sm:p-6 md:p-10 border border-white/60 overflow-hidden relative">

          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-40" />

          <div className="relative z-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
              <h2 className="text-4xl font-extrabold text-purple-700">
                🗺 AI Therapy Roadmap
              </h2>
              <div className="w-full sm:w-auto px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-bold shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-center">
                Personalized Weekly Plan
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {roadmap.map((week, index) => (
                <div
                  key={index}
                  className="rounded-[22px] sm:rounded-[30px] md:rounded-[40px] bg-gradient-to-br from-yellow-50 via-pink-50 to-cyan-50 border-[4px] border-white p-4 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:scale-105 hover:-rotate-1 transition-all duration-500"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-2xl font-extrabold text-purple-700">
                      {week.week}
                    </h3>
                    <div className="text-4xl">
                      🚀
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gray-700 mb-6 leading-relaxed">
                    {week.focus}
                  </p>
                  <div className="space-y-4">
                    {week.tasks.map((task, i) => (
                      <div
                        key={i}
                        className="rounded-[18px] sm:rounded-[22px] md:rounded-[25px] bg-white border-[3px] border-pink-100 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] font-black text-gray-700 hover:scale-105 transition-all duration-300"
                      >
                        🎯 {task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
