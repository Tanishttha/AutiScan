import { useEffect, useRef, useState } from "react";
import EyeOverlay from "./EyeOverlay";
import { Camera, Eye, Target, Brain } from "lucide-react";

interface WebcamPreviewProps {
  gazeDirection: string;
}

const WebcamPreview = ({ gazeDirection }: WebcamPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let activeStream: MediaStream;

    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: "user",
        },
      })
      .then((stream) => {
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play().catch((err) => {
            console.warn("Video play interrupted:", err);
          });
        }
        setIsLoading(false);
        setCameraError("");
      })
      .catch((err) => {
        console.error("Webcam Error:", err);
        setCameraError("Camera unavailable or permission denied");
        setIsLoading(false);
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-6 rounded-[32px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Live Optical Stream
          </h2>
        </div>
        <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/40">
          Vision Active
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-slate-950 min-h-[380px] flex items-center justify-center border border-black/[0.1] dark:border-white/[0.1]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <Camera className="w-10 h-10 text-sky-400 animate-pulse mb-3" />
            <div className="text-sm font-semibold">Connecting camera...</div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => {
            videoRef.current?.play().catch(() => {});
          }}
          className="w-full h-[380px] object-cover -scale-x-100"
        />

        <EyeOverlay gazeDirection={gazeDirection} cameraError={cameraError} />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-2xl glass-card text-center border border-black/[0.04] dark:border-white/[0.06]">
          <Eye className="w-4 h-4 mx-auto text-blue-500 mb-1" />
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Eye Tracking</div>
        </div>
        <div className="p-3 rounded-2xl glass-card text-center border border-black/[0.04] dark:border-white/[0.06]">
          <Target className="w-4 h-4 mx-auto text-purple-500 mb-1" />
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Gaze Analysis</div>
        </div>
        <div className="p-3 rounded-2xl glass-card text-center border border-black/[0.04] dark:border-white/[0.06]">
          <Brain className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Behavior AI</div>
        </div>
      </div>
    </div>
  );
};

export default WebcamPreview;