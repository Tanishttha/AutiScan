import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Award,
  Flame,
  CheckCircle2,
  Smile,
  Heart,
  HelpCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import speechDictionary from "../../autiscan_speech_dictionary_2000.json";

interface DictionaryWord {
  word: string;
  category: string;
  syllables: number;
  difficulty: string;
}

interface DictionaryPayload {
  words: DictionaryWord[];
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "Actions & Verbs": "🎯",
  Animals: "🐾",
  "Birds & Insects": "🐦",
  "Body Parts": "🧍",
  "Clothing & Accessories": "🧥",
  "Colors & Shapes": "🎨",
  "Community & Safety": "🚦",
  Drinks: "🥤",
  "Emotions & Feelings": "💛",
  "Everyday Vocabulary": "🧩",
  "Family & People": "👨‍👩‍👧",
  "Food & Meals": "🍽️",
  "Fruits & Vegetables": "🍎",
  "Garden & Plants": "🌱",
  "Home & Household": "🏠",
  "Nature & Weather": "🌤️",
  "Numbers & Measurement": "🔢",
  "Personal Care & Health": "🩺",
  "Places & Buildings": "🏫",
  Professions: "🧑‍🏫",
  "School & Learning": "📚",
  "Sea Life": "🐠",
  "Sports & Games": "⚽",
  "Technology & Communication": "📱",
  "Time & Calendar": "🕒",
  "Transport & Vehicles": "🚗",
};

const EMOJI_OVERRIDES: Record<string, string> = {
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  mango: "🥭",
  cat: "🐱",
  dog: "🐶",
  lion: "🦁",
  elephant: "🐘",
  sun: "☀️",
  tree: "🌳",
  water: "💧",
  rainbow: "🌈",
  book: "📚",
  pencil: "✏️",
  friend: "🤝",
  smile: "😊",
  bird: "🐦",
  fish: "🐟",
  hand: "🖐️",
  head: "🧠",
  shirt: "👕",
  shoe: "👟",
};

const splitWordIntoPhonics = (word: string, syllableCount: number): string[] => {
  const cleanWord = word.toLowerCase().trim();
  if (!cleanWord) return [word];
  if (syllableCount <= 1) return [cleanWord];

  const matches = cleanWord.match(/[aeiouy]+[^aeiouy]*/g) || [cleanWord];
  const segmented = matches.map((part) => part.trim()).filter(Boolean);

  if (segmented.length >= syllableCount) {
    return segmented;
  }

  const chunkSize = Math.ceil(cleanWord.length / syllableCount);
  const result: string[] = [];
  for (let i = 0; i < cleanWord.length; i += chunkSize) {
    const chunk = cleanWord.slice(i, i + chunkSize).trim();
    if (chunk) result.push(chunk);
  }
  return result.length ? result : [cleanWord];
};

const shuffleArray = <T,>(items: T[]): T[] => {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const buildSpeechCategories = (): typeof CATEGORIES => {
  const payload = speechDictionary as DictionaryPayload;
  const grouped = new Map<string, { name: string; words: { word: string; emoji: string; phonics: string[] }[] }>();

  for (const item of payload.words ?? []) {
    const categoryName = item.category || "Everyday Vocabulary";
    const current = grouped.get(categoryName) ?? { name: categoryName, words: [] };

    const word = item.word.toLowerCase();
    current.words.push({
      word,
      emoji: EMOJI_OVERRIDES[word] || CATEGORY_EMOJIS[categoryName] || "✨",
      phonics: splitWordIntoPhonics(word, Math.max(1, item.syllables || 1)),
    });

    grouped.set(categoryName, current);
  }

  const orderedCategories = Array.from(grouped.values()).map((category) => ({
    ...category,
    words: category.words,
  }));

  if (orderedCategories.length > 0) return orderedCategories as typeof CATEGORIES;

  const fallback = Array.from(grouped.values()).map((category) => ({
    ...category,
    words: category.words,
  }));

  return fallback as typeof CATEGORIES;
};

const CATEGORIES = buildSpeechCategories();

const ENCOURAGEMENTS = [
  "🌟 Amazing effort superstar!",
  "🎉 Brilliant pronunciation!",
  "👏 Wow, you spoke so clearly!",
  "🚀 Superstar speaker!",
  "💖 Keep it up, you are doing wonderfully!"
];

const GENTLE_TIPS = [
  "Take a deep breath and speak slowly.",
  "Listen to the sound first, then try matching it.",
  "You are doing great! Practice makes progress.",
  "Let's break it down syllable by syllable."
];

// Levenshtein similarity algorithm
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) =>
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

const calculateSimilarity = (first: string, second: string): number => {
  if (!first || !second) return 0;
  const a = first.toLowerCase().trim();
  const b = second.toLowerCase().trim();
  if (a === b) return 100;
  const dist = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
};

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const Speech = () => {
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);

  const currentCategory = CATEGORIES[selectedCategoryIndex] ?? CATEGORIES[0];
  const currentItem = currentCategory.words[selectedWordIndex] ?? currentCategory.words[0];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("Tap the microphone to speak slowly.");
  const [stars, setStars] = useState(3);
  const [streak, setStreak] = useState(5);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Text to speech with gentle slow cadence
  const speakWord = (text: string, rate: number = 0.75) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const evaluateSpokenWord = useCallback((spoken: string) => {
    const score = calculateSimilarity(spoken, currentItem.word);
    setSimilarity(score);

    if (score >= 75) {
      const praise = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setFeedback(`${praise} (Accuracy: ${score}%)`);
      setStars((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setSuccessAnimation(true);
      setTimeout(() => setSuccessAnimation(false), 2000);
      toast.success(`Superstar! Scored ${score}% on "${currentItem.word}"`);
    } else {
      const tip = GENTLE_TIPS[Math.floor(Math.random() * GENTLE_TIPS.length)];
      setFeedback(`Good try! You said "${spoken}". ${tip}`);
    }
  }, [currentItem.word]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback("Listening carefully... Speak now! 🎙️");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const spoken = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(spoken);
        evaluateSpokenWord(spoken);
      };

      recognition.onerror = (event: { error: string }) => {
        setIsListening(false);
        if (event.error === "no-speech") {
          setFeedback("No sound detected. Tap the mic and try again! 😊");
        } else {
          setFeedback("Microphone paused. Tap to try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [evaluateSpokenWord]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Browser doesn't support Web Speech API, provide interactive demo simulation
      const mockScore = 92;
      setTranscript(currentItem.word);
      evaluateSpokenWord(currentItem.word);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setSimilarity(null);
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    }
  };

  const handleNextWord = () => {
    setTranscript("");
    setSimilarity(null);
    setFeedback("Tap the microphone to speak slowly.");

    const nextCategoryIndex = Math.floor(Math.random() * CATEGORIES.length);
    const nextCategory = CATEGORIES[nextCategoryIndex];
    const nextWordIndex = Math.floor(Math.random() * nextCategory.words.length);

    setSelectedCategoryIndex(nextCategoryIndex);
    setSelectedWordIndex(nextWordIndex);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
        {/* Header Bar */}
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
                Speech Therapy Lab
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Gentle pronunciation practice, slow cadence guides, and phonics breakdown
              </p>
            </div>
          </div>

          {/* Gamification Stats Strip */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{stars} Stars</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="tabular-nums">{streak} Streak</span>
            </div>
          </div>
        </div>

        {/* Main Interactive Flashcard Studio */}
        <div className="grid grid-cols-1 gap-8 items-start">
          
          {/* Main Flashcard Column */}
          <div className="flex flex-col items-center">
            
            <div className={`w-full p-8 sm:p-12 rounded-[36px] glass-panel text-center relative overflow-hidden transition-all duration-300 border ${
              successAnimation
                ? "border-emerald-500/50 shadow-emerald-500/20 shadow-2xl scale-[1.02]"
                : "border-black/[0.06] dark:border-white/[0.08] shadow-2xl"
            }`}>
              
              {/* Randomized category indicator */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-black/[0.03] dark:bg-white/[0.05] mb-6">
                <span>Random Word</span>
                <span>·</span>
                <span>{currentCategory.name}</span>
              </div>

              {/* Big Word & Emoji */}
              <div className="text-6xl sm:text-7xl mb-4 select-none">
                {currentItem.emoji}
              </div>

              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize mb-6">
                {currentItem.word}
              </h2>

              {/* Phonics Syllables Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {currentItem.phonics.map((syllable, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => speakWord(syllable, 0.65)}
                    className="px-4 py-2 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-black/[0.05] dark:border-white/[0.08] hover:border-blue-400 text-slate-800 dark:text-slate-200 text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1.5"
                    title={`Click to hear syllable "${syllable}"`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>{syllable}</span>
                  </button>
                ))}
              </div>

              {/* Audio Listen Guide Button */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <Button
                  onClick={() => speakWord(currentItem.word, 0.75)}
                  variant="outline"
                  className="rounded-2xl glass-card px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <Volume2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <span>Listen Slowly (0.75x)</span>
                </Button>

                <Button
                  onClick={() => speakWord(currentItem.word, 0.55)}
                  variant="outline"
                  className="rounded-2xl glass-card px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <span>Very Slow</span>
                </Button>
              </div>

              {/* Giant Apple-style Microphone Record Button */}
              <div className="flex flex-col items-center justify-center my-4">
                <div className="relative">
                  {isListening && (
                    <div className="absolute inset-0 rounded-full bg-blue-500/30 dark:bg-sky-400/30 animate-ping" />
                  )}
                  <button
                    onClick={toggleListening}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all duration-300 ${
                      isListening
                        ? "bg-rose-500 text-white shadow-rose-500/40 animate-pulse"
                        : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:scale-105"
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start speaking"}
                  >
                    {isListening ? (
                      <MicOff className="w-10 h-10" />
                    ) : (
                      <Mic className="w-10 h-10" />
                    )}
                  </button>
                </div>
                
                <span className="text-xs font-semibold mt-3 text-slate-500 dark:text-slate-400">
                  {isListening ? "Listening... Speak into mic" : "Tap to Speak"}
                </span>
              </div>

              {/* Feedback Message */}
              <div className="mt-6 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                {feedback}
              </div>

              {/* Spoken Word Accuracy Score */}
              {similarity !== null && (
                <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Recognized Speech:</span>
                    <span className="font-bold text-slate-900 dark:text-white capitalize">"{transcript}"</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Pronunciation Accuracy:</span>
                    <span className={`font-extrabold text-sm ${similarity >= 75 ? "text-emerald-500" : "text-amber-500"}`}>
                      {similarity}%
                    </span>
                  </div>
                </div>
              )}

              {/* Next Word Action */}
              <div className="mt-8 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                <Button
                  onClick={() => {
                    setTranscript("");
                    setSimilarity(null);
                    setFeedback("Tap microphone to practice again.");
                  }}
                  variant="ghost"
                  className="rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Try Again</span>
                </Button>

                <Button
                  onClick={handleNextWord}
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>Next Word</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
};

export default Speech;