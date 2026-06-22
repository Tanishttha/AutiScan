

import { useEffect, useRef, useState } from "react";
import EyeOverlay from "./EyeOverlay";

interface WebcamPreviewProps {
  gazeDirection: string;
}

const WebcamPreview = ({
  gazeDirection,
}: WebcamPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cameraError, setCameraError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let activeStream: MediaStream;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 1280,
          height: 720,
          facingMode: "user",
        },
      })
      .then((stream) => {
        activeStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Webcam Error:", err);
        setCameraError("Camera access denied or unavailable");
        setIsLoading(false);
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-cyan-200">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-bold text-cyan-700">
          🎥 Live AI Camera
        </h2>

        <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-5 py-3 rounded-2xl font-bold shadow-lg animate-pulse">
          AI VISION ACTIVE
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-4 border-cyan-300 shadow-2xl bg-black min-h-[420px] flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <div className="text-7xl animate-bounce mb-5">🧠</div>
            <div className="text-2xl font-bold">
              Initializing AI Vision...
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-[420px] object-cover"
        />

        <EyeOverlay
          gazeDirection={gazeDirection}
          cameraError={cameraError}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-cyan-100 rounded-2xl p-5 text-center shadow-md">
          <div className="text-4xl mb-3">👁️</div>
          <div className="font-bold text-purple-700 text-lg">
            Eye Tracking
          </div>
        </div>

        <div className="bg-pink-100 rounded-2xl p-5 text-center shadow-md">
          <div className="text-4xl mb-3">🎯</div>
          <div className="font-bold text-purple-700 text-lg">
            Gaze Analysis
          </div>
        </div>

        <div className="bg-yellow-100 rounded-2xl p-5 text-center shadow-md">
          <div className="text-4xl mb-3">🧠</div>
          <div className="font-bold text-purple-700 text-lg">
            Behavioral AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamPreview;