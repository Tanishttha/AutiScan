import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Eye,
  Camera,
  CameraOff,
  Sparkles,
  ArrowLeft,
  Download,
  Activity,
  Smile,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  Heart
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, OfflineError } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistoryPoint {
  time: string;
  score: number;
}

const AttentionMonitor = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const latestMetricsRef = useRef({ sessionSeconds: 0, attentionScore: 0, isDisconnected: false });

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [attentionScore, setAttentionScore] = useState<number>(0);
  const [engagement, setEngagement] = useState<string>("Waiting for telemetry");
  const [emotion, setEmotion] = useState<string>("Awaiting input");
  const [blinkCount, setBlinkCount] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [eyesDetected, setEyesDetected] = useState<boolean>(false);
  const [trackingAvailable, setTrackingAvailable] = useState<boolean | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryPoint[]>([{ time: "0s", score: 0 }]);

  const captureVideoFrame = () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) return undefined;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.65);
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Webcam not supported by browser environment.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setMediaStream(stream);
      setCameraActive(true);
      setCameraError("");
      toast.success("Webcam connected successfully!");
    } catch (err: unknown) {
      console.warn("Webcam error:", err);
      setCameraActive(false);
      setCameraError("Could not access webcam. Allow camera access to start live focus tracking.");
    }
  };

  // Auto request webcam stream on mount
  useEffect(() => {
    startCamera();
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    };
  }, []);

  // Guarantee stream attachment to video element whenever mediaStream is set
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((e) => {
        console.warn("Video playback prevented or interrupted:", e);
      });
    }
  }, [mediaStream]);

  // Keep elapsed time independent from the backend polling rate.
  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    latestMetricsRef.current = { sessionSeconds, attentionScore, isDisconnected };
  }, [sessionSeconds, attentionScore, isDisconnected]);

  // Send the current browser webcam frame to the Python tracker through the same port.
  useEffect(() => {
    let failureCount = 0;
    let pollInFlight = false;

    const pollTelemetry = async () => {
      if (pollInFlight) return;
      const frame = captureVideoFrame();
      if (!frame) return;
      pollInFlight = true;

      try {
        const data = await api.getAttention(frame);
        setIsDisconnected(false);
        failureCount = 0;

        if (data?.analysis) {
          const nextAttentionScore = Number(data.analysis.attention_score ?? 0);
          const nextFaceDetected = Boolean(data.analysis.face_detected);
          const nextConfidence = Number(data.analysis.confidence ?? 0);

          setAttentionScore(nextAttentionScore);
          setEngagement(data.analysis.engagement || "Waiting for camera frame");
          setEmotion(data.analysis.emotion || "Inactive");
          setBlinkCount(Number(data.analysis.blink_count ?? 0));
          setConfidence(nextConfidence);
          setFaceDetected(nextFaceDetected);
          setEyesDetected(Number(data.analysis.eyes_detected ?? 0) >= 2);
          setTrackingAvailable(Boolean(data.analysis.tracking_available));
        }
      } catch (err: unknown) {
        failureCount++;
        setIsDisconnected(true);
        if (failureCount === 1) {
          if (err instanceof OfflineError) {
            toast.error("No internet connection / Backend server disconnected");
          } else {
            toast.error(`Live telemetry paused: ${err instanceof Error ? err.message : "backend request failed"}`);
          }
        }
      } finally {
        pollInFlight = false;
      }
    };

    void pollTelemetry();
    const timer = setInterval(() => void pollTelemetry(), 1000);

    return () => clearInterval(timer);
  }, []);

  // Record graph points with actual session time; keep the latest 10 points.
  useEffect(() => {
    const chartInterval = setInterval(() => {
      setHistory((prev) => {
        const { sessionSeconds: elapsed, attentionScore: score, isDisconnected: disconnected } = latestMetricsRef.current;
        if (disconnected) return prev;
        const updated = [...prev, { time: `${elapsed}s`, score }].slice(-10);
        return updated;
      });
    }, 3000);

    return () => clearInterval(chartInterval);
  }, []);


  const exportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    toast.info("Generating high-resolution report PDF...");

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AutiScan_Attention_Session_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF Report downloaded successfully!");
    } catch {
      toast.error("Could not export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Navigation & Action Bar */}
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
                Attention & Focus Monitor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Gentle webcam gaze tracking, eye stability analysis, and session reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Session: {formatTime(sessionSeconds)}</span>
            </div>

            <Button
              onClick={exportPDF}
              disabled={isExporting}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "Exporting..." : "Export Report"}</span>
            </Button>
          </div>
        </div>

        {/* Printable/Exportable Report Container */}
        <div ref={reportRef} className="space-y-8">
          
          {isDisconnected && (
            <div className="p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs sm:text-sm animate-pulse">
              <div className="flex items-center gap-2.5 font-semibold">
                <span className="text-base">⚠️</span>
                <span>Live telemetry unavailable — retrying automatically</span>
              </div>
              <span className="text-[11px] opacity-80">Reconnecting automatically...</span>
            </div>
          )}

          {/* Two-Column Stage Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Zone: Webcam & Frosted HUD Stage */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 sm:p-6 rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl">
                
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cameraActive ? "bg-emerald-500" : "bg-amber-400"}`} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {cameraActive ? "Live Optical Stream" : "Interactive Focus Visualizer"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    640×480 · 30 FPS
                  </span>
                </div>

                {/* Video & Crosshair HUD Area */}
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center border border-black/[0.1] dark:border-white/[0.1]">
                  
                  {/* Always mounted video element ensures ref is never null when stream attaches */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => {
                      videoRef.current?.play().catch(() => {});
                    }}
                    className={`w-full h-full object-cover -scale-x-100 transition-opacity duration-300 ${
                      cameraActive ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                    }`}
                  />

                  {!cameraActive && (
                    <div className="text-center p-6 text-slate-400 z-10">
                      <div className="w-16 h-16 rounded-3xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Camera className="w-8 h-8 text-sky-400 animate-pulse" />
                      </div>
                      <p className="text-sm font-semibold text-slate-200">Camera Feed Idle / Blocked</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Allow camera permission to view your live face & eye tracking stream, or test with focus telemetry.
                      </p>
                      <Button
                        type="button"
                        onClick={startCamera}
                        size="sm"
                        className="mt-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs px-4 py-2"
                      >
                        <Camera className="w-3.5 h-3.5 mr-1.5" />
                        Enable Live Camera
                      </Button>
                    </div>
                  )}

                  {/* Gentle Child-Friendly Focus Crosshair HUD */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-sky-400/50 flex items-center justify-center animate-spin-slow">
                      <div className="w-3 h-3 rounded-full bg-sky-400/80 shadow-lg shadow-sky-400/50" />
                    </div>
                  </div>

                  {/* HUD Floating Status Capsule */}
                  <div className="absolute top-4 left-4 backdrop-blur-xl bg-black/60 text-white px-3.5 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-white/10">
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>{faceDetected ? "Focus Anchor: Active" : "Focus Anchor: No Face"}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-black/60 text-white px-3.5 py-1.5 rounded-2xl text-xs font-semibold tabular-nums border border-white/10">
                    Confidence: {Number.isFinite(confidence) ? `${confidence.toFixed(1)}%` : "0.0%"}
                  </div>

                </div>

                <div className="mt-4 px-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {trackingAvailable === false
                      ? "Face tracking model unavailable. Install the supported OpenCV version and restart."
                      : trackingAvailable === null
                        ? "Waiting for camera and face tracking..."
                      : !faceDetected
                        ? "Face not visible — move into frame and keep your face centered."
                        : eyesDetected
                          ? "Face and eyes analyzed locally; video is not saved."
                          : "Face detected; eye landmarks are not available yet."}
                  </span>
                  <span className="text-blue-600 dark:text-sky-400 font-medium">
                    {trackingAvailable === false ? "Tracking unavailable" : trackingAvailable === null ? "Starting tracker" : eyesDetected ? "Eye tracking active" : faceDetected ? "Face detected" : "Waiting for face"}
                  </span>
                </div>

              </div>
            </div>

            {/* Right Zone: Metric Cards, Graph & Recommendations */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="p-5 rounded-3xl glass-card">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Real-Time Attention Index
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-blue-600 dark:text-sky-400 tabular-nums">
                      {attentionScore}%
                    </span>
                    <span className="text-xs font-semibold text-emerald-500">{attentionScore >= 60 ? "Steady" : "Needs focus"}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${attentionScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-3xl glass-card">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Engagement & Affect
                  </span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {faceDetected ? emotion : "Inactive"}
                  </div>
                  <span className="text-[11px] text-emerald-500 mt-2 block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {faceDetected ? "Live camera analysis" : "Waiting for face"}
                  </span>
                </div>
              </div>

              {/* Focus Timeline Chart */}
              <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Session Focus Curve</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-500">
                    Avg: {attentionScore}%
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="time" stroke="#888888" fontSize={10} tickLine={false} />
                      <YAxis domain={[50, 100]} stroke="#888888" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Therapy Recommendations Box */}
              <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Real-Time Therapy Guidance</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Visual Rest Break
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Encourage looking at a distant object 20 feet away every 5 minutes to relax eye muscles.
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                      Positive Mirror Reinforcement
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      Ask the child to smile at their reflection on screen to foster happy visual self-acceptance.
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
};

export default AttentionMonitor;
