import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { BrowserSpeechRecognition, SpeechRecognitionEvent } from "@/types/speech";
import {
  BookOpen,
  Mic,
  MicOff,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCcw,
  Star,
  Award,
  Heart,
  Smile,
  Printer,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api, type StoryBook } from "@/services/api";

interface StoryPage {
  pageNumber: number;
  text: string;
  illustrationEmoji: string;
  sceneTheme: string;
  focusWord: string;
}

interface StoryBook {
  title: string;
  hero: string;
  topic: string;
  pages: StoryPage[];
}

const PRESET_TOPICS = [
  { prompt: "Ek sher aur ek chidiya ki dosti", label: "🦁 Sher & Chidiya (Lion & Bird)" },
  { prompt: "A brave rocket astronaut who visits the moon", label: "🚀 Space Rocket Explorer" },
  { prompt: "A friendly dolphin who finds a singing seashell", label: "🐬 Singing Ocean Dolphin" },
  { prompt: "A magical garden where flowers speak gently", label: "🌸 The Magic Whispering Garden" },
];

export default function MagicStoryMaker() {
  const navigate = useNavigate();
  const [heroName, setHeroName] = useState("");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  // Default active story
  const [activeStory, setActiveStory] = useState<StoryBook>({
    title: "Story Draft",
    hero: "Story Hero",
    topic: "A story will appear here after you enter a prompt.",
    pages: [
      {
        pageNumber: 1,
        text: "Enter a story idea to create a custom story for your child.",
        illustrationEmoji: "✨",
        sceneTheme: "from-slate-400/10 via-slate-300/10 to-transparent",
        focusWord: "Story"
      }
    ]
  });

  const currentPage = activeStory.pages[currentPageIndex];

  // Speech synthesis for Read Aloud
  const readCurrentPage = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (isReadingAloud) {
      setIsReadingAloud(false);
      return;
    }

    setIsReadingAloud(true);
    const utterance = new SpeechSynthesisUtterance(currentPage.text);
    utterance.rate = 0.78;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);
    window.speechSynthesis.speak(utterance);
  };

  // Stop reading when changing page
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
    }
  }, [currentPageIndex]);

  // Voice speech input for prompt
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const spoken = e.results[0][0].transcript;
        setStoryPrompt(spoken);
        toast.success(`Heard prompt: "${spoken}"`);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.info("Voice input simulated: Added jungle safari prompt!");
      setStoryPrompt("Ek sher aur ek chidiya ki kahani");
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

  const handleCreateStory = async () => {
    const cleanPrompt = storyPrompt.trim();
    const cleanHero = heroName.trim() || "Story Hero";

    if (!cleanPrompt) return;
    if (!navigator.onLine) {
      toast.error("No internet connection / Backend server disconnected");
      return;
    }

    setIsGenerating(true);
    toast.info("Crafting your personalized illustrated storybook...");

    try {
      const result = await api.generateStory(cleanHero, cleanPrompt);
      const generatedStory = result.story_data;

      if (!generatedStory?.pages?.length) {
        throw new Error("Story response was empty.");
      }

      setActiveStory(generatedStory);
      setCurrentPageIndex(0);
      toast.success("Magic story generated! Tap 'Read Aloud' to listen!");
    } catch (error) {
      console.error("Story generation failed:", error);
      toast.error(error instanceof Error ? error.message : "Story generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in print:p-0">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.04] dark:border-white/[0.06] mb-8 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-2xl glass-card text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 mb-1 border border-purple-200/50 dark:border-purple-800/40">
                <Sparkles className="w-3 h-3" />
                <span>Creative Language & Imagination</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Magic Story Maker 📖
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="rounded-2xl glass-card text-xs font-semibold border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Book</span>
            </Button>
          </div>
        </div>

        {/* Story Generator Inputs Bar */}
        <div className="p-6 sm:p-8 rounded-[36px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl mb-8 print:hidden">
          
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Create a New Story For Your Child
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Tell a prompt in voice or text. The child becomes the star of an illustrated learning adventure!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Hero Name input */}
            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Story Hero's Name
              </label>
              <Input
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Child's Name (e.g. Aarav)"
                className="rounded-2xl h-11 bg-white/60 dark:bg-slate-900/60 text-xs sm:text-sm"
              />
            </div>

            {/* Prompt input with mic */}
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                What should the story be about?
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={storyPrompt}
                    onChange={(e) => setStoryPrompt(e.target.value)}
                    placeholder="e.g. 'Ek sher aur ek chidiya ki dosti' or 'Space puppy'..."
                    className="rounded-2xl h-11 bg-white/60 dark:bg-slate-900/60 text-xs sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`absolute right-2 top-2 p-1.5 rounded-xl transition-all ${
                      isListening ? "bg-rose-500 text-white animate-pulse" : "text-slate-400 hover:text-blue-500"
                    }`}
                    title="Speak prompt with microphone"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <Button
                  onClick={handleCreateStory}
                  disabled={isGenerating || !storyPrompt.trim()}
                  className="rounded-2xl h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isGenerating ? "Weaving Story..." : "Generate Magic Book"}</span>
                </Button>
              </div>
            </div>

          </div>

          {/* Quick preset buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
            <span className="text-[11px] font-semibold text-slate-400">Quick Themes:</span>
            {PRESET_TOPICS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStoryPrompt(item.prompt)}
                className="text-xs px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 border border-black/[0.04] dark:border-white/[0.06] transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>

        {/* The Illustrated Picture Book Viewport */}
        <div className="p-8 sm:p-12 rounded-[44px] glass-panel border border-black/[0.06] dark:border-white/[0.08] shadow-2xl relative overflow-hidden bg-gradient-to-b from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-950/80">
          
          {/* Top book title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.05] dark:border-white/[0.06]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Starring: {activeStory.hero} 🌟
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {activeStory.title}
              </h2>
            </div>

            {/* Read Aloud Button */}
            <Button
              onClick={readCurrentPage}
              className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                isReadingAloud
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 animate-pulse"
                  : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/25"
              }`}
            >
              {isReadingAloud ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Pause Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>AI Read Aloud (0.75x)</span>
                </>
              )}
            </Button>
          </div>

          {/* Book Page Content */}
          <div className="my-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Page Illustration Card */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-[36px] glass-card border border-black/[0.05] dark:border-white/[0.08] shadow-inner aspect-square text-center">
              <div className="text-8xl select-none mb-4 animate-bounce">
                {currentPage.illustrationEmoji}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40">
                <span>Key Concept: {currentPage.focusWord}</span>
              </div>
            </div>

            {/* Story Text Box */}
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Chapter Page {currentPage.pageNumber} of {activeStory.pages.length}
              </span>

              <p className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                "{currentPage.text}"
              </p>

              <div className="pt-4 flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Vocabulary Highlight: <strong className="text-blue-600 dark:text-sky-400">{currentPage.focusWord}</strong></span>
              </div>
            </div>

          </div>

          {/* Book Page Flip Navigation */}
          <div className="pt-6 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
            <Button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              variant="outline"
              className="rounded-2xl glass-card text-xs font-semibold px-4 py-2 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </Button>

            {/* Page Dots */}
            <div className="flex items-center gap-2">
              {activeStory.pages.map((_, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setCurrentPageIndex(pIdx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentPageIndex === pIdx
                      ? "bg-blue-600 w-8"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  aria-label={`Go to page ${pIdx + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={() => setCurrentPageIndex((prev) => Math.min(activeStory.pages.length - 1, prev + 1))}
              disabled={currentPageIndex === activeStory.pages.length - 1}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2 flex items-center gap-1.5"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
