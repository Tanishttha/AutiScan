interface AvatarAssistantProps {
  mood?: string;
  message?: string;
  listening?: boolean;
}

export default function AvatarAssistant({
  mood = "😊",
  message = "Let's learn together!",
  listening = false
}: AvatarAssistantProps) {

  return (
    <div className="relative rounded-[40px] bg-white border-[4px] border-white p-8 shadow-[0_25px_70px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col items-center justify-center text-center">

      <div className="absolute top-0 right-0 w-52 h-52 bg-pink-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-0 w-52 h-52 bg-cyan-100 rounded-full blur-3xl opacity-40" />

      <div className="relative z-10 w-full flex flex-col items-center">

        <div className="relative mb-8 flex flex-col items-center justify-center">

          <div className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-pink-300/30 via-purple-300/30 to-cyan-300/30 blur-3xl animate-pulse" />

          <div
            className={`relative w-52 h-52 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 shadow-[0_25px_70px_rgba(168,85,247,0.35)] border-[6px] border-white flex flex-col items-center justify-center transition-all duration-500 ${
              listening
                ? "animate-bounce scale-110"
                : "animate-float"
            }`}
          >

            <div className="absolute top-5 right-5 text-3xl animate-spin-slow">
              ✨
            </div>

            <div className="flex items-center gap-6 mb-5">

              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 bg-white rounded-full animate-blink shadow-lg" />
                <div className="absolute top-2 left-1 w-3 h-3 bg-black rounded-full" />
              </div>

              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 bg-white rounded-full animate-blink shadow-lg" />
                <div className="absolute top-2 left-1 w-3 h-3 bg-black rounded-full" />
              </div>

            </div>

            <div
              className={`bg-white rounded-full transition-all duration-300 ${
                listening
                  ? "w-16 h-8 animate-pulse"
                  : "w-14 h-5"
              }`}
            />

            <div className="absolute bottom-4 text-5xl drop-shadow-lg animate-bounce">
              {mood}
            </div>

          </div>

        </div>

        <div className="relative rounded-[35px] bg-gradient-to-r from-yellow-50 via-pink-50 to-cyan-50 border-[4px] border-white px-6 py-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)] max-w-md overflow-hidden hover:scale-105 transition-all duration-300">

          <div className="absolute top-0 right-0 text-6xl opacity-10 animate-bounce">
            💬
          </div>

          <div className="text-lg font-black text-gray-700 leading-relaxed">
            {message}
          </div>
        </div>

        <div className="flex items-end gap-2 h-20 mt-8 justify-center">

          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`w-4 rounded-full transition-all duration-300 ${
                listening
                  ? "bg-gradient-to-t from-pink-500 to-cyan-400 animate-pulse"
                  : "bg-gray-200"
              }`}
              style={{
                height: listening
                  ? `${30 + Math.random() * 50}px`
                  : "18px"
              }}
            />
          ))}

        </div>

        <div className="mt-6 text-cyan-700 font-black text-xl animate-pulse flex items-center gap-3 bg-white/70 backdrop-blur-xl px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-cyan-100">
          {listening
            ? "🎙 AI Buddy is listening..."
            : "✨ Ready to practice speaking!"}
        </div>

      </div>

      <style>{`
        @keyframes blink {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-blink {
          animation: blink 3s infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}