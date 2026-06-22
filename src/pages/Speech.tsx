import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Helpers ────────────────────────────────────────────────────────────────

const breakIntoPhonics = (word) => {
  return (
    word
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .match(/[^aeiou]*[aeiou]+(?:[^aeiou]*)/g) || [word]
  );
};

const getCorrectWord = async (spoken) => {
  try {
    const response = await fetch(`https://api.datamuse.com/words?sl=${spoken}&max=5`);
    const data = await response.json();
    if (data.length > 0) return data[0].word;
    return spoken;
  } catch {
    return spoken;
  }
};

const levenshteinDistance = (a, b) => {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
};

const similarityScore = (first, second) => {
  if (!first || !second) return 0;
  const distance = levenshteinDistance(first, second);
  const maxLength = Math.max(first.length, second.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
};

const normalize = (s) => s.toLowerCase().replace(/[^a-z]/g, "").trim();

/**
 * STRICT matching — user must say the word very accurately.
 * Fixed bugs:
 * 1. No self-matching (transcript === target is checked outside)
 * 2. Stricter thresholds
 * 3. Length difference allowed only ±0 for short words
 */
const isGoodMatch = (transcript, word) => {
  if (!transcript || !word) return false;

  const cleanTranscript = normalize(transcript);
  const cleanWord = normalize(word);

  // Exact match always passes
  if (cleanTranscript === cleanWord) return true;

  // Reject if lengths differ too much
  const lengthDifference = Math.abs(cleanTranscript.length - cleanWord.length);
  const maxAllowedLengthDiff = cleanWord.length <= 4 ? 0 : 1;
  if (lengthDifference > maxAllowedLengthDiff) return false;

  const similarity = similarityScore(cleanTranscript, cleanWord);

  // First letter must match exactly
  if (cleanTranscript.charAt(0) !== cleanWord.charAt(0)) return false;

  // First two letters must match for words > 3 chars
  if (cleanWord.length > 3 && cleanTranscript.slice(0, 2) !== cleanWord.slice(0, 2)) return false;

  // Last two letters must match
  if (cleanTranscript.slice(-2) !== cleanWord.slice(-2)) return false;

  // Missing starting sound check
  if (
    cleanTranscript.length > 2 &&
    cleanWord.length > 2 &&
    cleanTranscript.slice(1) === cleanWord.slice(0, -1)
  ) return false;

  // Vowel pattern must match exactly
  const vowels = ["a", "e", "i", "o", "u"];
  const transcriptVowels = cleanTranscript.split("").filter((c) => vowels.includes(c)).join("");
  const wordVowels = cleanWord.split("").filter((c) => vowels.includes(c)).join("");
  if (transcriptVowels !== wordVowels) return false;

  // Stricter similarity thresholds
  const requiredSimilarity = cleanWord.length >= 6 ? 96 : 93;
  return similarity >= requiredSimilarity;
};

const HAPPY = [
  "🌟 Awesome job superstar!",
  "🎉 Amazing pronunciation!",
  "🚀 Brilliant speaking!",
  "👏 Excellent practice!",
];
const SUPPORT = [
  "😊 It's okay, let's try together slowly.",
  "💪 Keep practicing, you are improving!",
  "🌈 You're doing great, try once more.",
  "🧠 Slow and clear speaking helps learning.",
];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Word bank for free-speak mode ───────────────────────────────────────────
// User must say one of these words; we don't auto-assign transcript as target
const WORD_BANK = [
  "apple", "ball", "cat", "dog", "elephant", "fish", "goat", "hat",
  "igloo", "jump", "kite", "lion", "mango", "nest", "orange", "parrot",
  "queen", "rabbit", "sun", "tree", "umbrella", "van", "water", "xylophone",
  "yellow", "zebra", "banana", "butter", "garden", "purple", "simple",
  "table", "window", "flower", "kitchen", "monkey", "pencil", "school",
  "friend", "happy", "music", "picture", "running", "spider", "turtle",
];

const pickWord = () => WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];

// ─── Voice Waveform ──────────────────────────────────────────────────────────

function VoiceWaveform() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const draw = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx2d = canvas.getContext("2d");
          const buf = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(buf);
          ctx2d.clearRect(0, 0, canvas.width, canvas.height);
          const barW = canvas.width / buf.length;
          buf.forEach((v, i) => {
            const h = (v / 255) * canvas.height;
            const hue = (i / buf.length) * 180 + 180;
            ctx2d.fillStyle = `hsl(${hue},90%,60%)`;
            ctx2d.fillRect(i * barW, canvas.height - h, barW - 1, h);
          });
          rafRef.current = requestAnimationFrame(draw);
        };
        draw();
      } catch {
        // mic not available
      }
    })();
    return () => {
      cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={160}
      className="w-full h-[160px] rounded-[25px] bg-black"
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Speech() {
  const navigate = useNavigate();
  const [heard, setHeard] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("Starting microphone...");
  const [correct, setCorrect] = useState(null);
  const [currentWord, setCurrentWord] = useState(() => pickWord()); // Always has a target!
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [practiceTarget, setPracticeTarget] = useState("");
  const [practiceRequired, setPracticeRequired] = useState(5);
  const [practiceCompleted, setPracticeCompleted] = useState(0);
  const [masteredWords, setMasteredWords] = useState([]);
  const [xpPoints, setXpPoints] = useState(0);
  const [combo, setCombo] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const [stars, setStars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [encouragement, setEncouragement] = useState("🌟 Say the word shown below!");
  const [showCelebration, setShowCelebration] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [phonicsParts, setPhonicsParts] = useState([]);
  const [currentPhonicIndex, setCurrentPhonicIndex] = useState(0);

  // Refs for stable closures
  const recognitionRef = useRef(null);
  const practiceTargetRef = useRef("");
  const currentWordRef = useRef(currentWord);
  const practiceCompletedRef = useRef(0);
  const practiceRequiredRef = useRef(5);
  const wrongAttemptsRef = useRef(0);
  const phonicsPartsRef = useRef([]);

  useEffect(() => { practiceTargetRef.current = practiceTarget; }, [practiceTarget]);
  useEffect(() => { currentWordRef.current = currentWord; }, [currentWord]);
  useEffect(() => { practiceCompletedRef.current = practiceCompleted; }, [practiceCompleted]);
  useEffect(() => { practiceRequiredRef.current = practiceRequired; }, [practiceRequired]);
  useEffect(() => { wrongAttemptsRef.current = wrongAttempts; }, [wrongAttempts]);
  useEffect(() => { phonicsPartsRef.current = phonicsParts; }, [phonicsParts]);

  const speak = useCallback((text, rate = 0.9, pitch = 1.05) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    u.pitch = pitch;
    speechSynthesis.speak(u);
  }, []);

  // Announce the current word on load
  useEffect(() => {
    if (currentWord) {
      setTimeout(() => speak(`Say the word: ${currentWord}`, 0.85, 1.1), 1000);
    }
  }, []);

  const loadNextWord = useCallback(() => {
    const next = pickWord();
    setCurrentWord(next);
    currentWordRef.current = next;
    setPracticeTarget("");
    practiceTargetRef.current = "";
    setPracticeCompleted(0);
    practiceCompletedRef.current = 0;
    setPracticeMode(false);
    setWrongAttempts(0);
    wrongAttemptsRef.current = 0;
    setPhonicsParts([]);
    phonicsPartsRef.current = [];
    setCurrentPhonicIndex(0);
    setCorrect(null);
    setFeedback("");
    speak(`Next word: ${next}`, 0.85, 1.1);
  }, [speak]);

  const masterWord = useCallback((word) => {
    setMasteredWords((prev) => [...prev, word]);
    speak(`Excellent! You mastered ${word}`, 0.7);
    setTimeout(() => loadNextWord(), 2000);
  }, [speak, loadNextWord]);

  const handleResult = useCallback(async (rawTranscript) => {
    const transcript = normalize(rawTranscript);
    setHeard(rawTranscript.toLowerCase().trim());
    setAttempts((p) => p + 1);

    const pt = practiceTargetRef.current;
    const cw = currentWordRef.current;

    // ── PRACTICE MODE ──
    if (pt) {
      const sim = similarityScore(transcript, normalize(pt));
      setAccuracy(sim);
      const matched = isGoodMatch(transcript, normalize(pt));

      if (matched) {
        const updated = practiceCompletedRef.current + 1;
        setPracticeCompleted(updated);
        practiceCompletedRef.current = updated;
        setCorrect(true);
        setAccuracy(100);
        setCombo((p) => p + 1);
        setXpPoints((p) => p + 10);

        const phonics = phonicsPartsRef.current;
        if (phonics.length > 0) {
          setCurrentPhonicIndex((p) => Math.min(p + 1, phonics.length - 1));
        }

        if (updated >= practiceRequiredRef.current) {
          setFeedback(`🏆 Amazing! You mastered "${pt}".`);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2500);
          masterWord(pt);
        } else {
          const phonicsGuide = phonics.length > 0 ? phonics.join(" ... ") : pt;
          setFeedback(
            `👏 Excellent! Say "${pt}" again. Progress ${updated}/${practiceRequiredRef.current}`
          );
          speak(`Great! Again slowly. ${phonicsGuide}`, 0.45, 1.05);
        }
      } else {
        setCorrect(false);
        setCombo(0);
        const retryPhonics = phonicsPartsRef.current.length > 0
          ? phonicsPartsRef.current.join(" ... ")
          : pt;
        setFeedback(
          `🧠 I heard "${rawTranscript.toLowerCase().trim()}". Try saying "${pt}" more clearly.`
        );
        speak(`Not quite. Listen carefully. ${retryPhonics}`, 0.42, 1.05);
      }
      return;
    }

    // ── FREE SPEAK MODE: compare against the assigned word ──
    // BUG FIX: Never use transcript as the target. Always use currentWord.
    if (!cw) return;

    const targetWord = normalize(cw);
    const sim = similarityScore(transcript, targetWord);
    setAccuracy(sim);
    const matched = isGoodMatch(transcript, targetWord);

    if (matched) {
      setPracticeMode(false);
      setWrongAttempts(0);
      wrongAttemptsRef.current = 0;
      setStars((p) => p + 1);
      setCombo((p) => p + 1);
      setXpPoints((p) => p + 15);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2500);
      setEncouragement(pick(HAPPY));
      setCorrect(true);
      setSessionCorrectCount((p) => p + 1);
      setFeedback(`✅ Perfect! "${cw}" — well said!`);
      speak(`Well done!`, 0.9);
      // Auto-advance after 2s
      setTimeout(() => loadNextWord(), 2200);
    } else {
      // Wrong pronunciation — enter practice mode for the ASSIGNED word
      setCorrect(false);
      setCombo(0);
      wrongAttemptsRef.current = wrongAttemptsRef.current + 1;
      setWrongAttempts(wrongAttemptsRef.current);
      setEncouragement(pick(SUPPORT));

      // Only start practice if not already in practice mode
      if (!practiceTargetRef.current) {
        // Use the ASSIGNED word (cw) as the practice target, NOT the transcript
        // Optionally, also check Datamuse for the phonetically closest real word
        // only if transcript is a real-sounding word attempt
        let practiceWord = cw; // default to assigned word

        // If user said something completely different, still practice the assigned word
        const req = Math.floor(Math.random() * 4) + 4; // 4-7 repetitions
        const parts = breakIntoPhonics(normalize(practiceWord));

        setPracticeTarget(practiceWord);
        practiceTargetRef.current = practiceWord;
        setPhonicsParts(parts);
        phonicsPartsRef.current = parts;
        setCurrentPhonicIndex(0);
        setPracticeRequired(req);
        practiceRequiredRef.current = req;
        setPracticeCompleted(0);
        practiceCompletedRef.current = 0;

        setFeedback(
          `🧠 I heard "${rawTranscript.toLowerCase().trim()}". Let's practice "${practiceWord}" correctly.`
        );
        speak(
          `Not quite right. Let us practice slowly. ${parts.join(" ... ")}`,
          0.42,
          1.05
        );
        setPracticeMode(true);
      }
    }
  }, [masterWord, speak, loadNextWord]);

  // Start recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setStatus("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setStatus("🎤 Listening...");
      setIsListening(true);
    };
    recognition.onerror = () => setStatus("⚠️ Microphone error. Restarting...");
    recognition.onend = () => {
      setIsListening(false);

      if (recognitionRef.current?.manualStop) {
        setStatus("⏹ Listening stopped");
        recognitionRef.current.manualStop = false;
        return;
      }

      setTimeout(() => {
        try {
          recognition.start();
        } catch {
          /* already started */
        }
      }, 800);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      handleResult(transcript);
    };

    recognition.manualStop = false;
    recognition.start();
    return () => recognition.stop();
  }, [handleResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-sky-100 to-cyan-300 text-white p-6 md:p-10 overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-pink-300/40 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-cyan-300/40 blur-3xl animate-bounce pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-yellow-300/40 blur-2xl animate-ping pointer-events-none" />
      <div className="absolute top-24 right-24 text-[120px] opacity-10 animate-spin pointer-events-none select-none">⭐</div>
      <div className="absolute bottom-24 left-24 text-[100px] opacity-10 animate-bounce pointer-events-none select-none">☁️</div>

      <div className="max-w-5xl mx-auto relative z-10">

        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-extrabold text-lg shadow-2xl hover:scale-105 transition-all duration-300 border-[3px] border-white"
          >
            🏠 Home Page
          </button>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-[120px] animate-bounce drop-shadow-2xl">🎉</div>
          </div>
        )}

        {/* Header */}
        <div className="rounded-[50px] bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 p-10 shadow-[0_25px_100px_rgba(168,85,247,0.5)] mb-10 border-[8px] border-white/50 relative overflow-hidden">
          <div className="absolute -top-8 -right-6 text-[110px] opacity-20 animate-bounce select-none">🧸</div>
          <div className="absolute bottom-0 left-0 text-[90px] opacity-20 animate-pulse select-none">🌈</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 drop-shadow-2xl">
            🌈 Smart Kids Speech World
          </h1>
          <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-semibold max-w-3xl">
            Fun AI-powered speech learning for kids with smart pronunciation correction, colorful speaking activities, voice rewards and adaptive practice games.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-6 py-4 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/30 font-extrabold text-lg shadow-xl">
              ⭐ Stars Earned: {stars}
            </div>
            <div className="px-6 py-4 rounded-full bg-white/25 backdrop-blur-xl border-2 border-white/30 font-extrabold text-lg shadow-xl">
              🎯 Practice Mode: {practiceMode ? "Active" : "Ready"}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "🎯 Pronunciation Accuracy", value: `${accuracy}%` },
              { label: "📚 Difficulty Level", value: "Adaptive AI" },
              { label: "🤖 AI Learning Engine", value: "Strict Match v2", small: true },
              { label: "⚡ XP Points", value: xpPoints },
            ].map(({ label, value, small }) => (
              <div key={label} className="rounded-3xl bg-white/20 backdrop-blur-md border border-white/20 p-5 text-center">
                <div className="text-lg font-semibold mb-2">{label}</div>
                <div className={`font-extrabold ${small ? "text-xl" : "text-4xl"}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TARGET WORD — big and prominent */}
        <div className="mb-8 rounded-[45px] bg-gradient-to-r from-yellow-300 to-orange-400 border-[8px] border-white/60 p-8 shadow-2xl text-center">
          <div className="text-2xl font-bold text-orange-900 mb-3">
            🎯 Say This Word:
          </div>
          <div className="text-7xl md:text-8xl font-black text-white drop-shadow-2xl tracking-wide uppercase">
            {practiceTarget || currentWord}
          </div>
          {!practiceTarget && (
            <button
              onClick={loadNextWord}
              className="mt-5 px-8 py-3 rounded-full bg-white text-orange-600 font-extrabold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              ⏭ Skip Word
            </button>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left panel – Listening */}
          <div className="rounded-[45px] bg-white/95 backdrop-blur-xl border-[6px] border-white/60 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.18)] text-gray-800 hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500">
            <div className="text-6xl mb-5 animate-bounce">🎤</div>
            <h2 className="text-3xl font-bold mb-4">Live Listening</h2>

            <button
              onClick={() => {
                const recognition = recognitionRef.current;

                if (!recognition) return;

                if (isListening) {
                  recognition.manualStop = true;
                  recognition.stop();
                } else {
                  recognition.start();
                }
              }}
              className={`mb-5 px-6 py-3 rounded-full text-white font-extrabold text-lg shadow-xl transition-all duration-300 hover:scale-105 ${
                isListening
                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600"
              }`}
            >
              {isListening ? "⏹ Stop Listening" : "🎤 Start Listening"}
            </button>
            <div className="text-xl text-cyan-700 font-extrabold mb-6">{status}</div>

            <div className="mb-6 rounded-[30px] bg-gradient-to-r from-purple-100 to-cyan-100 border-4 border-cyan-200 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-extrabold text-cyan-700">🎶 Rainbow Voice Analyzer</div>
                <div className="px-4 py-2 rounded-full bg-cyan-500 text-white font-bold text-sm animate-pulse">
                  AI Listening
                </div>
              </div>
              <VoiceWaveform />
              <div className="mt-4 text-center text-cyan-700 font-bold text-lg">
                Real-Time Voice Analysis
              </div>
            </div>

            <div className="rounded-[30px] bg-gradient-to-r from-yellow-100 to-pink-100 p-6 border-4 border-pink-200 shadow-xl">
              <div className="text-sm text-pink-600 mb-2 font-bold uppercase tracking-wide">
                🎤 What I Heard
              </div>
              <div className="text-3xl font-extrabold text-purple-700 break-words mb-4">
                {heard || "Waiting for speech..."}
              </div>

              {/* Accuracy vs target */}
              {heard && (
                <div className="mt-3 rounded-2xl bg-purple-50 border-2 border-purple-200 p-3">
                  <div className="text-sm font-bold text-purple-600 mb-1">
                    Match vs "{practiceTarget || currentWord}": {accuracy}%
                  </div>
                  <div className="w-full h-3 rounded-full bg-purple-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        accuracy >= 93 ? "bg-green-400" : accuracy >= 70 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              )}

              {practiceTarget && (
                <div className="rounded-[30px] bg-gradient-to-r from-orange-50 to-pink-50 border-[4px] border-orange-300 p-5 mt-4 shadow-xl animate-pulse">
                  <div className="text-lg font-bold text-orange-600 mb-2">🧠 Practice Target</div>
                  <div className="text-4xl font-extrabold text-orange-700 mb-3">{practiceTarget}</div>
                  <div className="text-orange-600 font-bold text-lg">
                    Progress: {practiceCompleted}/{practiceRequired}
                  </div>
                  <div className="w-full h-4 rounded-full bg-orange-100 overflow-hidden mt-4">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-500"
                      style={{ width: `${(practiceCompleted / practiceRequired) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {phonicsParts.length > 0 && (
                <div className="mt-5 rounded-[30px] bg-white border-[4px] border-cyan-300 p-5 shadow-xl">
                  <div className="text-2xl font-black text-cyan-700 mb-5 text-center">
                    🔤 Phonics Breakdown
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mb-5">
                    {phonicsParts.map((part, index) => (
                      <div
                        key={index}
                        className={`px-6 py-4 rounded-[25px] text-3xl font-black transition-all duration-500 shadow-lg ${
                          index === currentPhonicIndex
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110 border-[4px] border-white animate-pulse"
                            : "bg-cyan-100 text-cyan-700 border-[3px] border-cyan-300"
                        }`}
                      >
                        {part}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-cyan-700 font-bold text-lg">
                    🎤 Repeat each sound slowly.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel – Feedback */}
          <div className="rounded-[45px] bg-white/95 backdrop-blur-xl border-[6px] border-white/60 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.18)] text-gray-800 hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500">
            <div className="text-6xl mb-5 animate-bounce">
              {correct === true ? "🎉" : correct === false ? "🧠" : "💬"}
            </div>
            <h2 className="text-3xl font-bold mb-4">AI Feedback</h2>

            <div className="mb-5 rounded-3xl bg-gradient-to-r from-pink-100 to-yellow-100 border-4 border-pink-300 p-4 text-center text-pink-700 font-extrabold text-lg shadow-xl animate-pulse">
              {encouragement}
            </div>

            <div
              className={`rounded-[35px] p-6 text-xl font-extrabold border-[5px] shadow-2xl transition-all duration-300 ${
                correct === true
                  ? "bg-green-100 border-green-400 text-green-700"
                  : correct === false
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "bg-blue-50 border-blue-300 text-blue-700"
              }`}
            >
              {feedback || `Say the word: "${currentWord}"`}
            </div>

            <div className="mt-6 rounded-[30px] bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-purple-700">Session Progress</span>
                <span className="font-extrabold text-gray-800 text-xl">
                  {sessionCorrectCount} Correct
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-black/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(sessionCorrectCount * 10, 100)}%` }}
                />
              </div>
              <div className="mt-3 text-sm text-gray-500">Total Attempts: {attempts}</div>
              <div className="mt-2 text-sm text-red-500 font-bold">
                Wrong Attempts: {wrongAttempts}
              </div>
              <div className="mt-2 text-sm text-cyan-600 font-bold">
                🔥 Combo Streak: {combo}
              </div>

              {/* Mastered words */}
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-yellow-100 to-pink-100 border-2 border-pink-300 p-4 shadow-md">
                <div className="text-lg font-extrabold text-pink-700 mb-2">🏆 Mastered Words</div>
                <div className="flex flex-wrap gap-2">
                  {masteredWords.length === 0 ? (
                    <div className="text-gray-500 font-semibold">No mastered words yet.</div>
                  ) : (
                    masteredWords.map((word, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 rounded-full bg-white border-2 border-pink-300 text-pink-700 font-bold shadow-sm"
                      >
                        ⭐ {word}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {practiceMode && (
                <div className="mt-5 rounded-2xl bg-gradient-to-r from-orange-100 to-pink-100 border-4 border-orange-300 p-4 text-orange-700 font-bold text-center animate-bounce shadow-xl">
                  🧠 Practice Mode Active. Repeat the word until the mastery bar fills up!
                </div>
              )}
            </div>

            <div className="mt-8 rounded-[30px] bg-gradient-to-r from-cyan-100 to-purple-100 border-4 border-cyan-200 p-6 shadow-xl">
              <div className="text-2xl font-extrabold mb-5 text-cyan-700">🤖 Smart AI Therapy System</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: "🎤", label: "Speech Detection", color: "cyan" },
                  { icon: "🧠", label: "Adaptive Practice", color: "pink" },
                  { icon: "🏆", label: "Confidence Building", color: "purple" },
                ].map(({ icon, label, color }) => (
                  <div key={label} className={`rounded-2xl bg-white p-5 border-2 border-${color}-200 shadow-md text-center`}>
                    <div className="text-4xl mb-3">{icon}</div>
                    <div className={`font-bold text-${color}-700`}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[40px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-8 border-[6px] border-white/40 shadow-2xl text-center">
          <div className="text-4xl mb-4 animate-bounce">🧠🎮🌈</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Smart Adaptive AI Learning</h2>
          <p className="text-xl font-semibold text-white/95 max-w-3xl mx-auto leading-relaxed">
            The AI gives you a specific word to say, checks your pronunciation strictly, and only marks it correct when you say it clearly and accurately.
          </p>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 z-50 animate-bounce">
        <div className="rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 shadow-2xl border-[5px] border-white p-4 text-5xl">🦄</div>
      </div>
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <div className="rounded-full bg-gradient-to-r from-cyan-200 to-purple-200 shadow-2xl border-[5px] border-white p-4 text-5xl">🤖</div>
      </div>
    </div>
  );
}