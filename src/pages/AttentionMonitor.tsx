import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import WebcamPreview from "./WebcamPreview";
import FocusChart from "./FocusChart";
import ReportPanel from "./ReportPanel";

function AttentionMonitor() {
  const [score, setScore] = useState<number>(0);
  const [engagement, setEngagement] = useState<string>("Loading...");

  const [blinkCount, setBlinkCount] = useState<number>(0);
  const [emotion, setEmotion] = useState<string>("Neutral");
  const [gazeDirection, setGazeDirection] = useState<string>("Center");
  const [focusPercentage, setFocusPercentage] = useState<number>(0);
  const [behavioralStatus, setBehavioralStatus] = useState<string>("");
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [history, setHistory] = useState<
    {
      time: string;
      score: number;
    }[]
  >([]);

  const [therapy, setTherapy] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [cameraError, setCameraError] = useState<string>("");

  const exportReport = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("AI_Attention_Report.pdf");
  };

  useEffect(() => {
    let activeStream: MediaStream;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        activeStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Webcam Error:", err);
        setCameraError("Camera access denied or unavailable");
      });

    const fetchData = async () => {
      try {
        const response = await fetch("https://botanical-sneak-jumble.ngrok-free.dev/attention");

        const data = await response.json();

        const analysis = data.analysis || {};

        setTherapy(data.therapy || null);
        setAnalytics(data.analytics || null);

        setScore(
          Number(
            analysis.attention_score || 0
          )
        );
        setEngagement(analysis.engagement || "Unknown");

        setBlinkCount(analysis.blink_count || 0);
        setEmotion(analysis.emotion || "Neutral");
        setGazeDirection(
          analysis.gaze_direction || "Center"
        );
        setFocusPercentage(
          analysis.focus_percentage || 0
        );
        setBehavioralStatus(
          analysis.behavioral_status || ""
        );
        setSessionTime(analysis.session_time || 0);

        setHistory((prev) => {
          const attentionValue =
            analysis.attention_score ||
            data.attention_score ||
            0;

          const updated = [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              score: Number(attentionValue),
            },
          ];

          return updated.slice(-15);
        });
      } catch (error) {
        console.error("Attention API Error:", error);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => {
      clearInterval(interval);

      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto" ref={reportRef}>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-purple-700 mb-4">
            🌟 AI Attention Monitor 🌟
          </h1>

          <p className="text-xl text-gray-600 font-semibold">
            Real-time Autism Behavioral Analysis System
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={exportReport}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
            >
              📄 Export AI Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <WebcamPreview gazeDirection={gazeDirection} />

          <ReportPanel
            score={score}
            engagement={engagement}
            emotion={emotion}
            blinkCount={blinkCount}
            gazeDirection={gazeDirection}
            focusPercentage={focusPercentage}
            behavioralStatus={behavioralStatus}
            sessionTime={sessionTime}
          />
        </div>

        <div className="mt-10">
          {history.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 shadow-xl text-center text-gray-600 font-bold text-lg border border-purple-100">
              📊 Waiting for realtime attention data...
            </div>
          ) : (
            <FocusChart history={history} />
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center border-2 border-pink-200">
            <div className="text-4xl mb-3">🧠</div>
            <div className="font-bold text-purple-700 text-xl">
              AI Analysis
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center border-2 border-blue-200">
            <div className="text-4xl mb-3">🎥</div>
            <div className="font-bold text-purple-700 text-xl">
              Live Tracking
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center border-2 border-yellow-200">
            <div className="text-4xl mb-3">📊</div>
            <div className="font-bold text-purple-700 text-xl">
              Analytics
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl text-center border-2 border-green-200">
            <div className="text-4xl mb-3">⏱️</div>
            <div className="font-bold text-purple-700 text-xl">
              {sessionTime}s Session
            </div>
          </div>
        </div>

        {therapy && (
          <div className="mt-14 space-y-10">

            {/* Therapy Overview */}
            <div className="rounded-[35px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl p-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div>
                  <h2 className="text-4xl font-extrabold text-purple-700 mb-3">
                    🧠 AI Therapy Insights
                  </h2>

                  <p className="text-gray-600 text-lg font-medium">
                    Personalized therapy recommendations generated from live behavioral AI analysis.
                  </p>
                </div>

                <div className="flex gap-4 flex-wrap">

                  <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-5 shadow-xl text-center min-w-[180px]">
                    <div className="text-sm uppercase font-bold opacity-80">
                      Progress Score
                    </div>
                    <div className="text-4xl font-extrabold mt-1">
                      {therapy.progress_score}%
                    </div>
                  </div>

                  <div className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-5 shadow-xl text-center min-w-[180px]">
                    <div className="text-sm uppercase font-bold opacity-80">
                      Improvement
                    </div>
                    <div className="text-2xl font-extrabold mt-2">
                      {therapy.improvement_level}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* AI Personalized Guidance */}
            <div className="rounded-[35px] bg-white shadow-2xl p-8 border border-purple-100 overflow-hidden relative">

              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />

              <div className="relative z-10">

                <h2 className="text-4xl font-extrabold text-purple-700 mb-6">
                  🤖 AI Personalized Guidance
                </h2>

               <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8 rounded-[30px] border border-purple-100 shadow-inner text-gray-700 text-lg leading-relaxed font-medium">

  {typeof therapy.ai_generated_plan === "string" ? (

    <div className="whitespace-pre-wrap">
      {therapy.ai_generated_plan}
    </div>

  ) : (

    <div className="space-y-6">

      <div>
        <h3 className="font-bold text-2xl mb-3 text-purple-700">
          🧠 Summary
        </h3>

        <p className="whitespace-pre-wrap">
          {therapy.ai_generated_plan?.summary ||
            "Generating AI summary..."}
        </p>
      </div>

      <div>
        <h3 className="font-bold text-2xl mb-3 text-pink-600">
          💬 Motivation
        </h3>

        <p className="whitespace-pre-wrap">
          {therapy.ai_generated_plan?.motivation_message ||
            "Preparing motivation guidance..."}
        </p>
      </div>

      <div>
        <h3 className="font-bold text-2xl mb-3 text-cyan-700">
          👨‍👩‍👧 Parent Guidance
        </h3>

        <p className="whitespace-pre-wrap">
          {therapy.ai_generated_plan?.parent_guidance ||
            "Preparing parent guidance..."}
        </p>
      </div>

    </div>
  )}

</div>

              </div>
            </div>

            {/* Therapy Recommendations */}
            <div className="rounded-[35px] bg-white shadow-2xl p-8 border border-pink-100">

              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <h2 className="text-4xl font-extrabold text-pink-600">
                  🎯 Personalized Therapy Activities
                </h2>

                <div className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xl">
                  {therapy.recommendations?.length || 0} Activities
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {therapy.recommendations?.map(
                  (rec: any, index: number) => (
                    <div
                      key={index}
                      className="rounded-[30px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-7 border border-white shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >

                      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">

                        <div>
                          <h3 className="text-2xl font-extrabold text-purple-700">
                            {rec.category}
                          </h3>

                          <p className="text-gray-600 mt-1 font-medium">
                            {rec.goal}
                          </p>
                        </div>

                        <div className="px-5 py-2 rounded-full bg-purple-600 text-white font-bold shadow-lg text-sm">
                          {rec.difficulty}
                        </div>

                      </div>

                      <div className="space-y-3 mb-6">
                        {rec.activities?.map(
                          (
                            activity: string,
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm font-semibold text-gray-700"
                            >
                              ✨ {activity}
                            </div>
                          )
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {rec.daily_tasks?.map(
                          (
                            task: string,
                            i: number
                          ) => (
                            <div
                              key={i}
                              className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-3 border border-cyan-100 text-sm font-bold text-cyan-700"
                            >
                              📅 {task}
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  )
                )}
              </div>
            </div>

            {/* Badges + Roadmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              <div className="rounded-[35px] bg-white shadow-2xl p-8 border border-yellow-100">

                <h2 className="text-4xl font-extrabold text-yellow-600 mb-8">
                  🏆 Achievement Badges
                </h2>

                <div className="flex flex-wrap gap-4">

                  {therapy.badges?.map(
                    (badge: string, index: number) => (
                      <div
                        key={index}
                        className="px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-white font-bold shadow-xl text-lg hover:scale-105 transition-all duration-300"
                      >
                        {badge}
                      </div>
                    )
                  )}

                </div>
              </div>

              <div className="rounded-[35px] bg-white shadow-2xl p-8 border border-cyan-100">

                <h2 className="text-4xl font-extrabold text-cyan-700 mb-8">
                  🗺 AI Therapy Roadmap
                </h2>

                <div className="space-y-5">

                  {therapy.roadmap?.map(
                    (week: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-3xl bg-gradient-to-r from-cyan-50 to-blue-50 p-5 border border-cyan-100 shadow-sm"
                      >

                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-extrabold text-cyan-700">
                            {week.week}
                          </h3>

                          <div className="text-3xl">
                            🚀
                          </div>
                        </div>

                        <p className="text-gray-700 font-bold mb-4 text-lg">
                          {week.focus}
                        </p>

                        <div className="space-y-2">
                          {week.tasks?.map(
                            (task: string, i: number) => (
                              <div
                                key={i}
                                className="bg-white rounded-2xl p-3 border border-cyan-100 font-semibold text-gray-700"
                              >
                                🎯 {task}
                              </div>
                            )
                          )}
                        </div>

                      </div>
                    )
                  )}

                </div>
              </div>

            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <div className="rounded-[28px] bg-gradient-to-br from-pink-500 to-rose-500 text-white p-7 shadow-2xl text-center">
                <div className="text-5xl mb-4">👁</div>
                <div className="text-lg font-bold opacity-90">
                  Gaze Direction
                </div>
                <div className="text-3xl font-extrabold mt-2">
                  {gazeDirection}
                </div>
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-7 shadow-2xl text-center">
                <div className="text-5xl mb-4">😊</div>
                <div className="text-lg font-bold opacity-90">
                  Emotion
                </div>
                <div className="text-3xl font-extrabold mt-2">
                  {emotion}
                </div>
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-7 shadow-2xl text-center">
                <div className="text-5xl mb-4">🔥</div>
                <div className="text-lg font-bold opacity-90">
                  Streak Days
                </div>
                <div className="text-3xl font-extrabold mt-2">
                  {therapy.streak_days}
                </div>
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-7 shadow-2xl text-center">
                <div className="text-5xl mb-4">🎯</div>
                <div className="text-lg font-bold opacity-90">
                  Engagement
                </div>
                <div className="text-3xl font-extrabold mt-2">
                  {engagement}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AttentionMonitor;