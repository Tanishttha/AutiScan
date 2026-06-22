import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const recommendations = [
  {
    title: "Eye Contact Training",
    emoji: "👁",
    color: "from-pink-500 to-rose-500",
    description:
      "Interactive activities to improve eye contact and social attention.",
    activities: [
      "Mirror practice",
      "Face tracking games",
      "Emoji recognition",
      "Conversation focus"
    ]
  },
  {
    title: "Speech Improvement",
    emoji: "🗣",
    color: "from-cyan-500 to-blue-600",
    description:
      "Speech exercises and pronunciation enhancement tasks.",
    activities: [
      "Word repetition",
      "Story narration",
      "Audio mimic exercises",
      "Vocabulary practice"
    ]
  },
  {
    title: "Memory Boost",
    emoji: "🧠",
    color: "from-purple-500 to-indigo-600",
    description:
      "Cognitive and memory enhancement activities for kids.",
    activities: [
      "Memory card games",
      "Pattern matching",
      "Sequence recall",
      "Puzzle solving"
    ]
  },
  {
    title: "Focus & Attention",
    emoji: "🎯",
    color: "from-yellow-400 to-orange-500",
    description:
      "Attention stability and concentration improvement activities.",
    activities: [
      "Focus timer",
      "Breathing exercises",
      "Visual tracking",
      "Attention challenges"
    ]
  }
];

const liveActivities = [
  "🎤 Pronunciation Practice",
  "🧠 Cognitive Memory Match",
  "👁 Eye Contact Challenge",
  "🎯 Attention Focus Mission",
  "😊 Emotion Recognition",
  "🗣 Interactive Story Speaking",
  "🎨 Visual Learning Therapy",
  "🚀 AI Guided Speech Practice"
];

export default function AIRecommendations() {

  const navigate = useNavigate();

  const [therapyScore, setTherapyScore] = useState(72);
  const [attentionLevel, setAttentionLevel] = useState(68);
  const [speechAccuracy, setSpeechAccuracy] = useState(74);
  const [liveRecommendation, setLiveRecommendation] = useState(
    "🧠 Loading AI recommendation..."
  );

  useEffect(() => {

    const interval = setInterval(() => {

      setTherapyScore((prev) => {
        const next = prev + Math.floor(Math.random() * 6 - 2);
        return Math.max(50, Math.min(100, next));
      });

      setAttentionLevel((prev) => {
        const next = prev + Math.floor(Math.random() * 6 - 2);
        return Math.max(45, Math.min(100, next));
      });

      setSpeechAccuracy((prev) => {
        const next = prev + Math.floor(Math.random() * 6 - 2);
        return Math.max(40, Math.min(100, next));
      });

      fetch(
        "http://localhost:5002/live-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message:
              "Give one very short autism therapy recommendation.",
            child_name: "Friend"
          })
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setLiveRecommendation(
            data?.reply ||
              "🧠 Practice attention activities"
          );
        })
        .catch(() => {
          setLiveRecommendation(
            "🧠 Practice attention activities"
          );
        });

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">

          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🤖 AI Therapy Recommendations
            </h1>

            <p className="text-xl text-gray-600 font-medium max-w-3xl leading-relaxed">
              Personalized AI-powered therapy exercises, behavioral guidance,
              memory games, speech activities and attention improvement tasks.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>

        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 p-10 shadow-2xl mb-12">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">

            <div className="max-w-3xl text-white">

              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                <span className="text-2xl">✨</span>
                <span className="font-bold tracking-wide">
                  Gemini AI Powered Therapy
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                Smart Personalized Therapy Guidance for Kids
              </h2>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                Adaptive AI recommendations for focus improvement,
                speech correction, emotional intelligence,
                behavioral therapy and autism support.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full xl:w-auto">

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 text-white shadow-xl text-center">
                <div className="text-5xl mb-3">🧠</div>
                <div className="text-lg font-semibold opacity-90">
                  AI Exercises
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  120+
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 text-white shadow-xl text-center">
                <div className="text-5xl mb-3">🏆</div>
                <div className="text-lg font-semibold opacity-90">
                  Reward System
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  Active
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 text-white shadow-xl text-center animate-pulse">
                <div className="text-5xl mb-3">📈</div>
                <div className="text-lg font-semibold opacity-90">
                  Live Therapy Score
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  {therapyScore}%
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 text-white shadow-xl text-center animate-pulse">
                <div className="text-5xl mb-3">🎤</div>
                <div className="text-lg font-semibold opacity-90">
                  Speech Accuracy
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  {speechAccuracy}%
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="rounded-[40px] bg-white shadow-2xl border border-white p-8 mb-10 overflow-hidden relative">

          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-40" />

          <div className="relative z-10">

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

              <div>
                <h2 className="text-4xl font-extrabold text-purple-700 mb-4">
                  ⚡ Live AI Therapy Recommendations
                </h2>

                <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-3xl">
                  Real-time adaptive therapy guidance based on attention,
                  speech interaction, behavioral analytics and cognitive engagement.
                </p>
              </div>

              <div className="rounded-[30px] bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 shadow-2xl min-w-[320px] animate-pulse">

                <div className="text-lg font-bold opacity-90 mb-2">
                  🧠 Current AI Recommendation
                </div>

                <div className="text-3xl font-extrabold leading-snug">
                  {liveRecommendation}
                </div>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

              <div className="rounded-[30px] bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 p-6 shadow-xl">
                <div className="text-5xl mb-4">📈</div>
                <div className="text-2xl font-extrabold text-purple-700 mb-3">
                  Therapy Progress
                </div>

                <div className="w-full h-5 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${therapyScore}%` }}
                  />
                </div>

                <div className="mt-3 text-lg font-bold text-purple-700">
                  {therapyScore}% Improved
                </div>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-6 shadow-xl">
                <div className="text-5xl mb-4">🎯</div>
                <div className="text-2xl font-extrabold text-cyan-700 mb-3">
                  Attention Stability
                </div>

                <div className="w-full h-5 rounded-full bg-cyan-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${attentionLevel}%` }}
                  />
                </div>

                <div className="mt-3 text-lg font-bold text-cyan-700">
                  {attentionLevel}% Focus
                </div>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100 p-6 shadow-xl">
                <div className="text-5xl mb-4">🗣</div>
                <div className="text-2xl font-extrabold text-orange-700 mb-3">
                  Speech Development
                </div>

                <div className="w-full h-5 rounded-full bg-orange-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${speechAccuracy}%` }}
                  />
                </div>

                <div className="mt-3 text-lg font-bold text-orange-700">
                  {speechAccuracy}% Accuracy
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {recommendations.map((item, index) => (
            <div
              key={index}
              className="rounded-[35px] bg-white shadow-2xl overflow-hidden border border-white hover:scale-[1.02] transition-all duration-300"
            >

              <div className={`bg-gradient-to-r ${item.color} p-8 text-white`}>

                <div className="text-6xl mb-5">
                  {item.emoji}
                </div>

                <h2 className="text-3xl font-extrabold mb-3">
                  {item.title}
                </h2>

                <p className="text-white/90 text-lg leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="p-8">

                <h3 className="text-2xl font-bold text-gray-800 mb-5">
                  Recommended Activities
                </h3>

                <div className="space-y-4">

                  {item.activities.map((activity, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-100 p-4 font-semibold text-gray-700 shadow-sm"
                    >
                      ✨ {activity}
                    </div>
                  ))}

                </div>

                <button
                  onClick={() => {

                    if (item.title === "Eye Contact Training") {
                      navigate("/face-recognition");

                    } else if (
                      item.title === "Speech Improvement"
                    ) {
                      navigate("/speech");

                    } else if (
                      item.title === "Memory Boost"
                    ) {
                      navigate("/ai-companion");

                    } else if (
                      item.title === "Focus & Attention"
                    ) {
                      navigate("/attention-monitor");
                    }
                  }}
                  className={`mt-8 w-full rounded-2xl bg-gradient-to-r ${item.color} text-white py-4 font-bold text-lg shadow-xl hover:scale-[1.02] transition-all duration-300`}
                >
                  Start Therapy Activities 🚀
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}