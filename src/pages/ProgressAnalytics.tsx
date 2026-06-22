import { useNavigate } from "react-router-dom";

const weeklyProgress = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 80 },
  { day: "Wed", score: 76 },
  { day: "Thu", score: 88 },
  { day: "Fri", score: 92 },
  { day: "Sat", score: 95 },
  { day: "Sun", score: 90 },
];

const achievements = [
  {
    emoji: "🏆",
    title: "Focus Master",
    description: "Reached 95% attention score",
    color: "from-yellow-400 to-orange-500",
  },
  {
    emoji: "🔥",
    title: "Consistency Hero",
    description: "7-day therapy streak completed",
    color: "from-pink-500 to-rose-500",
  },
  {
    emoji: "🧠",
    title: "Memory Champion",
    description: "Completed advanced memory tasks",
    color: "from-purple-500 to-indigo-600",
  },
  {
    emoji: "🎯",
    title: "Attention Pro",
    description: "Maintained stable eye contact",
    color: "from-cyan-500 to-blue-600",
  },
];

const analyticsCards = [
  {
    title: "Average Attention",
    value: "91%",
    emoji: "👁",
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Therapy Completion",
    value: "84%",
    emoji: "🧠",
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Daily Streak",
    value: "14 Days",
    emoji: "🔥",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Activities Done",
    value: "126",
    emoji: "🏆",
    color: "from-yellow-400 to-orange-500",
  },
];

export default function ProgressAnalytics() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-100 p-6 md:p-10 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">

          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4 leading-tight">
              📈 Progress Analytics Dashboard
            </h1>

            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-4xl leading-relaxed">
              Track therapy improvement, attention stability,
              AI-generated insights, achievements,
              focus performance and behavioral growth analytics.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-2xl hover:scale-105 transition-all duration-300"
          >
            ← Back to Dashboard
          </button>

        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 p-8 md:p-12 shadow-2xl mb-12">

          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">

            <div className="max-w-4xl text-white">

              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                <span className="text-2xl">✨</span>
                <span className="font-bold tracking-wide">
                  AI Behavioral Intelligence System
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                Smart Autism Therapy Performance Tracking
              </h2>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium max-w-3xl">
                Visualize therapy growth, focus consistency,
                emotional stability, behavioral development
                and personalized improvement trends.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-5 w-full xl:w-auto">

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-6 text-white shadow-xl text-center">
                <div className="text-5xl mb-3">📊</div>
                <div className="text-lg font-semibold opacity-90">
                  Growth Rate
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  +28%
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-6 text-white shadow-xl text-center">
                <div className="text-5xl mb-3">🚀</div>
                <div className="text-lg font-semibold opacity-90">
                  AI Insights
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  Live
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-14">

          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-[35px] bg-gradient-to-br ${card.color} p-8 text-white shadow-2xl hover:scale-[1.03] transition-all duration-300`}
            >

              <div className="text-6xl mb-5">
                {card.emoji}
              </div>

              <div className="text-lg font-semibold opacity-90">
                {card.title}
              </div>

              <div className="text-5xl font-extrabold mt-4">
                {card.value}
              </div>

            </div>
          ))}

        </div>

        {/* Weekly Progress */}
        <div className="rounded-[40px] bg-white shadow-2xl p-8 md:p-10 mb-14 border border-white/60">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <h2 className="text-4xl font-extrabold text-purple-700">
              📊 Weekly Attention Progress
            </h2>

            <div className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl">
              AI Tracked Analytics
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-6 items-end min-h-[320px]">

            {weeklyProgress.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4"
              >

                <div className="text-lg font-bold text-gray-700">
                  {item.score}%
                </div>

                <div
                  className="w-full rounded-t-[30px] bg-gradient-to-t from-purple-600 via-pink-500 to-cyan-400 shadow-xl transition-all duration-500 hover:scale-105"
                  style={{
                    height: `${item.score * 2.2}px`,
                    minHeight: "80px",
                  }}
                />

                <div className="text-lg font-bold text-purple-700">
                  {item.day}
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* Achievements */}
        <div className="mb-14">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-4xl font-extrabold text-yellow-600">
              🏆 Achievements & Rewards
            </h2>

            <div className="px-5 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-xl">
              12 Badges Earned
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="rounded-[35px] bg-white shadow-2xl overflow-hidden border border-white hover:scale-[1.02] transition-all duration-300"
              >

                <div className={`bg-gradient-to-r ${achievement.color} p-8 text-white`}>

                  <div className="text-6xl mb-5">
                    {achievement.emoji}
                  </div>

                  <h2 className="text-3xl font-extrabold mb-3">
                    {achievement.title}
                  </h2>

                  <p className="text-white/90 text-lg font-medium leading-relaxed">
                    {achievement.description}
                  </p>

                </div>

                <div className="p-8">

                  <div className="flex items-center justify-between mb-5">
                    <span className="font-bold text-gray-700 text-lg">
                      Completion Progress
                    </span>

                    <span className="font-extrabold text-purple-700 text-xl">
                      100%
                    </span>
                  </div>

                  <div className="w-full h-5 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${achievement.color} w-full`} />
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-[40px] bg-white shadow-2xl p-8 md:p-10 border border-white/60 overflow-hidden relative">

          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-40" />

          <div className="relative z-10">

            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <h2 className="text-4xl font-extrabold text-purple-700">
                🤖 AI Behavioral Insights
              </h2>

              <div className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl">
                Gemini AI Analysis
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="rounded-[30px] bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-7 shadow-xl">
                <h3 className="text-2xl font-extrabold text-purple-700 mb-5">
                  🧠 Therapy Improvement
                </h3>

                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  AI detected strong progress in attention stability,
                  social engagement and memory performance.
                  Continue speech interaction and visual focus tasks.
                </p>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-7 shadow-xl">
                <h3 className="text-2xl font-extrabold text-cyan-700 mb-5">
                  🎯 Recommended Focus
                </h3>

                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  Suggested next activities:
                  emotion recognition games,
                  guided communication exercises,
                  attention tracking challenges and memory therapy.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
