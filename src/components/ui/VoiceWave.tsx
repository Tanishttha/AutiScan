

interface VoiceWaveProps {
  active?: boolean;
  bars?: number;
  height?: number;
}

export default function VoiceWave({
  active = false,
  bars = 14,
  height = 80
}: VoiceWaveProps) {

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-10 overflow-hidden">

      {/* Floating Glow Background */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-cyan-400/20 blur-3xl animate-pulse" />

      {/* Floating Particles */}
      {active && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {[...Array(15)].map((_, index) => (
            <div
              key={index}
              className="absolute text-2xl animate-bounce opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${index * 0.15}s`
              }}
            >
              ✨
            </div>
          ))}

        </div>
      )}

      {/* Microphone Core */}
      <div className="relative mb-10 flex items-center justify-center">

        <div className={`absolute w-36 h-36 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 blur-3xl ${
          active ? "animate-ping" : "animate-pulse"
        }`} />

        <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-5xl shadow-[0_25px_70px_rgba(168,85,247,0.45)] border-[5px] border-white transition-all duration-500 ${
          active ? "scale-110 animate-bounce" : "animate-float"
        }`}>
          🎤
        </div>

      </div>

      {/* Rainbow Sound Bars */}
      <div className="relative flex items-end justify-center gap-3 min-h-[180px]">

        {[...Array(bars)].map((_, index) => {

          const randomHeight = active
            ? 40 + Math.random() * height
            : 20;

          const gradients = [
            "from-pink-500 to-rose-400",
            "from-purple-500 to-indigo-400",
            "from-cyan-500 to-blue-400",
            "from-yellow-400 to-orange-500",
            "from-green-400 to-emerald-500"
          ];

          return (
            <div
              key={index}
              className={`relative rounded-full transition-all duration-300 bg-gradient-to-t ${
                gradients[index % gradients.length]
              } ${
                active
                  ? "animate-pulse shadow-[0_15px_40px_rgba(168,85,247,0.45)]"
                  : "opacity-40"
              }`}
              style={{
                width: "16px",
                height: `${randomHeight}px`,
                animationDelay: `${index * 0.08}s`
              }}
            >

              {active && (
                <div className="absolute inset-0 rounded-full bg-white/20 blur-sm" />
              )}

            </div>
          );
        })}

      </div>

      {/* AI Listening Label */}
      <div className="mt-8 rounded-full bg-white/80 backdrop-blur-xl px-8 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-purple-100">

        <div className="text-xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
          {active
            ? "🎙 AI Buddy is listening..."
            : "✨ Ready for voice practice"}
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}