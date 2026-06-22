import { useNavigate } from "react-router-dom";

interface ReportPanelProps {
  score: number;
  engagement: string;
  emotion: string;
  blinkCount: number;
  gazeDirection: string;
  focusPercentage: number;
  behavioralStatus: string;
  sessionTime: number;
}

const ReportPanel = ({
  score,
  engagement,
  emotion,
  blinkCount,
  gazeDirection,
  focusPercentage,
  behavioralStatus,
  sessionTime,
}: ReportPanelProps) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    if (score >= 85) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-cyan-200">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-purple-700">
            🧠 AI Behavioral Report
          </h2>

          <p className="text-gray-600 mt-2 text-lg font-medium">
            Real-time autism behavioral analytics summary
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-2xl shadow-xl text-lg font-bold hover:scale-105 transition-all duration-300"
          >
            ⬅ Back to Dashboard
          </button>

          <div
            className={`bg-gradient-to-r ${getStatusColor()} text-white px-6 py-4 rounded-2xl shadow-xl text-lg font-bold animate-pulse`}
          >
            {engagement}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-3">🎯</div>
          <div className="text-lg font-bold text-purple-700">
            Attention Score
          </div>
          <div className="text-3xl font-extrabold text-gray-800 mt-2">
            {score}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-3">😊</div>
          <div className="text-lg font-bold text-purple-700">
            Emotion
          </div>
          <div className="text-2xl font-extrabold text-gray-800 mt-2">
            {emotion}
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-3">👁️</div>
          <div className="text-lg font-bold text-purple-700">
            Blink Count
          </div>
          <div className="text-3xl font-extrabold text-gray-800 mt-2">
            {blinkCount}
          </div>
        </div> */}

        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 shadow-lg text-center">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-lg font-bold text-purple-700">
            Focus Level
          </div>
          <div className="text-3xl font-extrabold text-gray-800 mt-2">
            {focusPercentage}%
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-100 via-cyan-100 to-pink-100 rounded-3xl p-8 shadow-xl mb-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 className="text-3xl font-bold text-purple-700 mb-3">
              📌 Behavioral Analysis
            </h3>

            <p className="text-xl text-gray-700 font-semibold leading-relaxed max-w-3xl">
              {behavioralStatus}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-lg font-bold text-purple-700 text-lg">
              🎯 Gaze: {gazeDirection}
            </div>

            <div className="bg-white px-5 py-3 rounded-2xl shadow-lg font-bold text-purple-700 text-lg">
              ⏱️ Session: {sessionTime}s
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border-2 border-cyan-200 rounded-2xl p-6 shadow-lg text-center hover:scale-105 transition-all duration-300">
          <div className="text-5xl mb-4">🧠</div>
          <div className="text-xl font-bold text-purple-700">
            Behavioral AI
          </div>

          <p className="text-gray-600 mt-3 font-medium">
            Advanced autism behavioral pattern analysis
          </p>
        </div>

        <div className="bg-white border-2 border-pink-200 rounded-2xl p-6 shadow-lg text-center hover:scale-105 transition-all duration-300">
          <div className="text-5xl mb-4">👀</div>
          <div className="text-xl font-bold text-purple-700">
            Eye Tracking
          </div>

          <p className="text-gray-600 mt-3 font-medium">
            Live gaze monitoring and attention detection
          </p>
        </div>

        <div className="bg-white border-2 border-yellow-200 rounded-2xl p-6 shadow-lg text-center hover:scale-105 transition-all duration-300">
          <div className="text-5xl mb-4">📈</div>
          <div className="text-xl font-bold text-purple-700">
            Analytics Engine
          </div>

          <p className="text-gray-600 mt-3 font-medium">
            Real-time focus and engagement analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPanel;