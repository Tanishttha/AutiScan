interface EyeOverlayProps {
  gazeDirection: string;
  cameraError?: string;
}

const EyeOverlay = ({
  gazeDirection,
  cameraError,
}: EyeOverlayProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-0 border-4 border-cyan-400 rounded-3xl animate-pulse"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-6 h-6 rounded-full bg-cyan-400 animate-ping"></div>
        <div className="absolute top-10 right-10 w-6 h-6 rounded-full bg-cyan-400 animate-ping"></div>
        <div className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-cyan-400 animate-ping"></div>
        <div className="absolute bottom-10 right-10 w-6 h-6 rounded-full bg-cyan-400 animate-ping"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 animate-pulse shadow-[0_0_20px_#22d3ee]"></div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 border-4 border-cyan-400 rounded-full animate-spin opacity-40"></div>
      </div>

      <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold">
        🔴 LIVE TRACKING
      </div>

      <div className="absolute bottom-4 right-4 bg-cyan-500/80 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
        AI EYE SCAN ACTIVE
      </div>

      <div className="absolute bottom-4 left-4 bg-purple-500/80 text-white px-4 py-2 rounded-full text-sm font-bold">
        Gaze: {gazeDirection}
      </div>

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-xl font-bold text-center px-6 rounded-3xl">
          ⚠️ {cameraError}
        </div>
      )}
    </div>
  );
};

export default EyeOverlay;