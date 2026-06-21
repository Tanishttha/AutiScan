import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const targetWords = ["apple", "banana", "cat", "dog", "elephant", "hello", "goodbye", "water", "thank", "please"];

const Speech = () => {
  const navigate = useNavigate();
  const [heard, setHeard] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("Starting...");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    startListening();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser");
      setStatus("❌ Speech recognition not supported");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      listeningRef.current = true;
      setStatus("🎧 Listening...");
    };

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase().trim();
      setHeard(spoken);

      const matched = targetWords.find((w) => spoken.includes(w)) || spoken;

      if (targetWords.includes(spoken)) {
        setFeedback(`✅ Correct pronunciation of '${matched}'`);
        setIsCorrect(true);
        toast.success(`Great job! You said "${matched}" correctly!`);
      } else {
        setFeedback(`🔊 Try saying: ${matched}`);
        setIsCorrect(false);
      }

      const utter = new SpeechSynthesisUtterance(matched);
      utter.lang = "en-US";
      utter.rate = 0.9;
      speechSynthesis.speak(utter);
    };

    recognition.onerror = (err: any) => {
      console.warn("Recognition error:", err.error);
      setStatus(`⚠️ Error: ${err.error} — restarting...`);
      toast.error(`Error: ${err.error}`);
    };

    recognition.onend = () => {
      listeningRef.current = false;
      setStatus("🔁 Restarting listener...");
      setTimeout(startListening, 1000);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Speech Exercises</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Intro Card */}
        <Card className="mb-8 shadow-soft border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Automatic Speech Recognition</CardTitle>
            <CardDescription className="text-base">
              Just speak naturally - we're listening automatically and will help you improve!
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Status Card */}
        <Card className="mb-6 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-center text-xl">{status}</CardTitle>
          </CardHeader>
        </Card>

        {/* Main Exercise Card */}
        <Card className="shadow-glow border-border/50 mb-6">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Volume2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl mb-2">Speak Any Word</CardTitle>
            <CardDescription className="text-base">
              Try saying: {targetWords.slice(0, 5).join(", ")}...
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* What You Said */}
            {heard && (
              <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">You said:</p>
                <p className="text-2xl font-bold">{heard}</p>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div 
                className={`p-6 rounded-2xl border ${
                  isCorrect 
                    ? 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400' 
                    : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400'
                }`}
              >
                <p className="text-lg font-semibold">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle>Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>• Speak clearly and at a normal pace</p>
            <p>• Make sure your microphone is working</p>
            <p>• Try to minimize background noise</p>
            <p>• The system will automatically listen and provide feedback</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Speech;
