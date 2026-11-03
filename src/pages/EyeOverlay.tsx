import { Eye } from "lucide-react";

interface EyeOverlayProps {
  gazeDirection: string;
  cameraError?: string;
}

const EyeOverlay = ({ gazeDirection, cameraError }: EyeOverlayProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4">
      {/* Top status */}
      <div className="flex items-center justify-between">
        <div className="backdrop-blur-xl bg-black/60 text-white px-3 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Gaze Tracker</span>
        </div>
        <div className="backdrop-blur-xl bg-black/60 text-sky-400 px-3 py-1.5 rounded-2xl text-xs font-semibold border border-white/10">
          Focal Centering
        </div>
      </div>

      {/* Center Target Anchor */}
      <div className="self-center my-auto flex items-center justify-center">
        <div className="relative w-36 h-36 rounded-full border border-sky-400/40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-md shadow-sky-400/50" />
        </div>
      </div>

      {/* Bottom Status bar */}
      <div className="flex items-center justify-between">
        <div className="backdrop-blur-xl bg-black/60 text-white px-3 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 border border-white/10">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>Gaze: {gazeDirection || "Center"}</span>
        </div>

        <div className="backdrop-blur-xl bg-black/60 text-slate-300 px-3 py-1.5 rounded-2xl text-xs font-semibold border border-white/10">
          Calm Focus
        </div>
      </div>

      {cameraError && (
        <div className="mx-auto mt-2 px-3 py-1.5 rounded-xl bg-amber-500/80 text-white text-[11px] font-medium border border-amber-400/40 shadow-lg">
          {cameraError}
        </div>
      )}
    </div>
  );
};

export default EyeOverlay;