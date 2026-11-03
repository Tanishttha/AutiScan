import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { BrowserSpeechRecognition, SpeechRecognitionEvent } from "@/types/speech";
import {
  Sparkles,
  Volume2,
  Mic,
  MicOff,
  Send,
  Star,
  Award,
  ArrowLeft,
  RotateCcw,
  Smile,
  Heart,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api, OfflineError } from "@/services/api";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  emoji?: string;
}

const ADVENTURES = [
  {
    id: "jungle",
    title: "Magic Jungle Safari",
    emoji: "🦁",
    goal: "Learn animal words and help the friendly lion find his friends!",
    word: "Lion",
    story: "Leo the Lion wants to say hello to everyone in the jungle today! Can you help him by saying 'Lion'?"
  },
  {
    id: "space",
    title: "Rainbow Rocket Mission",
    emoji: "🚀",
    goal: "Travel past glowing stars and practice friendly space greetings!",
    word: "Star",
    story: "Beep-boop! Our friendly rocket is flying near a golden star! Can you say 'Star' to guide the spaceship?"
  },
  {
    id: "ocean",
    title: "Deep Sea Dolphin Adventure",
    emoji: "🐬",
    goal: "Swim through clear blue waves with bubbly ocean creatures!",
    word: "Water",
    story: "Splash! Flippy the Dolphin is leaping over the sunny waves! Say 'Water' to make a joyful splash!"
  }
];

const COMPANION_MOODS = [
  { emoji: "😊", label: "Happy & Ready" },
  { emoji: "🌟", label: "Cheering You On!" },
  { emoji: "👂", label: "Listening Carefully" },
  { emoji: "🧠", label: "Thinking with Joy" },
];

const AICompanion = () => {
  const navigate = useNavigate();
  const [adventureIndex, setAdventureIndex] = useState(0);
  const currentAdventure = ADVENTURES[adventureIndex];

  const [avatarMood, setAvatarMood] = useState(COMPANION_MOODS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello friend! 🌟 I'm your learning companion. Today we're exploring the "${currentAdventure.title}"! Are you ready?`,
      emoji: "😊"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [stars, setStars] = useState(8);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech synthesis
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setAvatarMood(COMPANION_MOODS[1]);

    const clean = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.onend = () => {
      setIsSpeaking(false);
      setAvatarMood(COMPANION_MOODS[0]);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setAvatarMood(COMPANION_MOODS[0]);
    };
    window.speechSynthesis.speak(utterance);
  };

  // Speech recognition for voice input
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setAvatarMood(COMPANION_MOODS[2]);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const spoken = event.results[0][0].transcript;
        handleSendMessage(spoken);
      };

      recognition.onend = () => {
        setIsListening(false);
        setAvatarMood(COMPANION_MOODS[0]);
      };

      recognitionRef.current = recognition;
    }
  }, [currentAdventure.word]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.info("Voice recognition simulation: Sending practice voice hello!");
      handleSendMessage(`Hello! I can say ${currentAdventure.word}!`);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setAvatarMood(COMPANION_MOODS[3]);

    try {
      const data = await api.sendChatMessage(text, "Friend");
      const reply = data?.reply || "I heard you loud and clear! 🌟 Great job speaking!";

      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: reply,
          emoji: "🌟"
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(reply);
        if (text.toLowerCase().includes(currentAdventure.word.toLowerCase())) {
          setStars((s) => s + 2);
        }
      }, 400);
    } catch (err: unknown) {
      const errorMessage = err instanceof OfflineError
        ? "No internet connection / Backend server disconnected"
        : err instanceof Error
          ? err.message
          : "AI Companion could not connect to the backend";
      toast.error(errorMessage);

      setTimeout(() => {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `⚠️ ${errorMessage}`,
          emoji: "📶"
        };
        setMessages((prev) => [...prev, errorMsg]);
        setAvatarMood(COMPANION_MOODS[0]);
      }, 300);
    }
  };

  const handleSelectAdventure = (idx: number) => {
    setAdventureIndex(idx);
    const adv = ADVENTURES[idx];
    const intro: Message = {
      id: Date.now().toString(),
      sender: "ai",
      text: `Let's start the "${adv.title}"! ${adv.story}`,
      emoji: adv.emoji
    };
    setMessages((prev) => [...prev, intro]);
    speakText(intro.text);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        
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
                Joyful AI Companion
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Supportive speaking buddy, interactive story adventures, and positive reinforcement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl glass-card text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="tabular-nums">{stars} Star Trophies</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Avatar Stage & Interactive Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Expressive Apple Avatar & Adventure Mode */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Expressive Avatar Stage */}
            <div className="p-8 rounded-[36px] glass-panel text-center border border-black/[0.06] dark:border-white/[0.08] shadow-2xl relative overflow-hidden">
              
              <div className="relative inline-block mb-4">
                <div className={`w-32 h-32 rounded-[32px] p-1 shadow-2xl transition-all duration-300 ${
                  isSpeaking
                    ? "bg-gradient-to-tr from-blue-500 to-indigo-500 scale-105 shadow-blue-500/30"
                    : "bg-gradient-to-tr from-sky-400 to-blue-600"
                }`}>
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[28px] flex items-center justify-center text-6xl select-none">
                    {avatarMood.emoji}
                  </div>
                </div>

                {isSpeaking && (
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md animate-bounce">
                    Speaking...
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Buddy the Learning Helper
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mood: {avatarMood.label}
              </p>

              {/* Story mode badge */}
              <div className="mt-6 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-sky-400 mb-1">
                  <span>{currentAdventure.emoji}</span>
                  <span>Active Mission: {currentAdventure.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentAdventure.goal}
                </p>
                <div className="mt-2 text-[11px] font-semibold text-slate-400">
                  Target Word: <span className="text-blue-600 dark:text-sky-400 font-bold capitalize">"{currentAdventure.word}"</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  onClick={() => speakText(currentAdventure.story)}
                  variant="outline"
                  className="rounded-2xl glass-card text-xs font-semibold px-4 py-2 border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Hear Story Aloud</span>
                </Button>
              </div>

            </div>

            {/* Adventure Selector */}
            <div className="p-6 rounded-[32px] glass-card border border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Choose Story Adventure</span>
              </h3>

              <div className="space-y-2">
                {ADVENTURES.map((adv, idx) => (
                  <button
                    key={adv.id}
                    onClick={() => handleSelectAdventure(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                      adventureIndex === idx
                        ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-sky-400 border border-blue-200/50 dark:border-blue-900/50"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{adv.emoji}</span>
                      <span>{adv.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Word: {adv.word}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Chat Stream */}
          <div className="lg:col-span-7 flex flex-col h-[580px] rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden">
            
            {/* Chat header */}
            <div className="p-4 sm:p-5 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between bg-black/[0.01] dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Friendly Voice & Text Chat
                </span>
              </div>
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: "1",
                      sender: "ai",
                      text: `Hello friend! 🌟 Let's start fresh. Say '${currentAdventure.word}' or tell me how your day is going!`,
                      emoji: "😊"
                    }
                  ]);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0 text-base">
                      {msg.emoji || "😊"}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-500/20"
                        : "glass-card text-slate-800 dark:text-slate-200 rounded-bl-sm border border-black/[0.05] dark:border-white/[0.08]"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="mt-2 text-[10px] text-blue-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Replay Voice</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input & Mic Bar */}
            <div className="p-4 border-t border-black/[0.05] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.02] flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl active:scale-95 transition-all ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "glass-card text-slate-700 dark:text-slate-200 hover:text-blue-600"
                }`}
                title="Tap to speak"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex-1 flex items-center gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Say or type: "${currentAdventure.word}"...`}
                  className="rounded-2xl h-11 bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm"
                />

                <Button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="h-11 w-11 rounded-2xl p-0 bg-blue-600 hover:bg-blue-700 text-white shrink-0 active:scale-95 shadow-md shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
};

export default AICompanion;
