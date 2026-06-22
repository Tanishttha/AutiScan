import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  Brain,
  Mic,
  LogOut,
  Moon,
  Sun,
  Eye,
  Activity,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

import { auth } from "@/config/firebase";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "User");
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const features = [
    {
      icon: Mic,
      title: "Speech Pronunciation Checker",
      description:
        "Live speech recognition with pronunciation correction and voice feedback",
      path: "/speech",
      gradient: "from-pink-500 via-purple-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "ASD Screening",
      description: "Take a comprehensive autism screening assessment",
      path: "/screening",
      gradient: "from-primary to-accent",
    },
    {
      icon: Eye,
      title: "Attention Monitor",
      description:
        "Eye tracking, AI therapy guidance & behavioral monitoring",
      path: "/attention",
      gradient: "from-purple-500 via-pink-500 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "AI Therapy Dashboard",
      description:
        "Personalized autism therapy roadmap and AI guidance",
      path: "/therapy",
      gradient: "from-cyan-500 to-blue-600",
    },
    
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description:
        "Track achievements, attention growth & therapy progress",
      path: "/analytics",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Activity,
      title: "AI Recommendations",
      description:
        "Gemini AI-powered personalized therapy suggestions",
      path: "/recommendations",
      gradient: "from-indigo-500 to-purple-600",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AutiScan</h1>
          </div>
          <div className="flex items-center gap-3">

  <button
    onClick={() => navigate("/ai-companion")}
    className="group relative flex items-center gap-4 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white px-6 py-3 shadow-[0_15px_40px_rgba(236,72,153,0.35)] hover:scale-105 transition-all duration-300 border border-white/20 overflow-hidden"
  >

    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 blur-2xl opacity-40 animate-pulse" />

    <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-2xl animate-bounce shadow-lg">
      🤖
    </div>

    <div className="relative z-10 hidden md:flex flex-col items-start leading-tight">

      <span className="text-xs font-bold uppercase tracking-wider opacity-80">
        AI Buddy
      </span>

      <span className="text-sm lg:text-base font-black">
        Chat Companion
      </span>

    </div>

    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white animate-ping" />

    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />

  </button>
 <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-2">
            Hi, {userEmail.split('@')[0]} 👋
          </h2>
          <p className="text-muted-foreground">
            Continue your AI-powered autism support and therapy journey
          </p>
        </div>

        {/* Speech Pronunciation Banner */}
        <div
          onClick={() => navigate("/speech")}
          className="mb-10 relative overflow-hidden rounded-[40px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-8 md:p-10 shadow-2xl cursor-pointer hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300"
        >

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            <div className="max-w-3xl text-white">

              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                <span className="text-2xl">🎤</span>
                <span className="font-bold tracking-wide">
                  Real-Time Speech AI
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                Speech Pronunciation Checker
              </h2>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                Live microphone listening, pronunciation correction,
                speech recognition, voice feedback and real-time word analysis.
              </p>

            </div>

            <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-6 text-white shadow-xl min-w-[240px] text-center">
              <div className="text-6xl mb-4">🗣</div>
              <div className="text-xl font-bold opacity-90">
                AI Voice Recognition
              </div>
              <div className="text-4xl font-extrabold mt-3">
                LIVE
              </div>
            </div>

          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/90 backdrop-blur-sm shadow-soft hover:shadow-glow hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-scale-in rounded-[30px] overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xl`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Featured AI Therapy Banner */}
        <div
          className="mt-16 relative overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-500 p-6 md:p-10 shadow-2xl cursor-pointer transition-all duration-500 animate-fade-in"
          onClick={() => navigate("/attention")}
        >

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12">

            <div className="max-w-2xl text-white">

              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
                <span className="text-2xl">🧠</span>
                <span className="font-bold tracking-wide">
                  AI Autism Therapy Assistant
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 text-white max-w-4xl">
                Smart Behavioral AI & Therapy Dashboard
              </h2>

              <p className="text-base md:text-xl text-white/90 leading-relaxed mb-8 font-medium max-w-4xl">
                Live eye tracking, AI therapy guidance, emotion analysis,
                personalized activities, progress tracking, rewards,
                achievements and behavioral intelligence for kids.
              </p>

              <div className="flex flex-wrap gap-4">

                <div className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 font-bold text-white">
                  👁 Eye Tracking
                </div>

                <div className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 font-bold text-white">
                  🤖 Gemini AI
                </div>

                <div className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 font-bold text-white">
                  🏆 Rewards System
                </div>

                <div className="px-5 py-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 font-bold text-white">
                  📈 Progress Analytics
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5 w-full xl:w-auto xl:min-w-[320px]">

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 text-white shadow-xl">
                <div className="text-5xl mb-3">🎯</div>
                <div className="text-lg font-semibold opacity-90">
                  Live Attention Score
                </div>
                <div className="text-5xl font-extrabold mt-2">
                  94%
                </div>
              </div>

              <div className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 text-white shadow-xl">
                <div className="text-5xl mb-3">🏆</div>
                <div className="text-lg font-semibold opacity-90">
                  AI Therapy Activities
                </div>
                <div className="text-3xl font-extrabold mt-2">
                  24 Tasks
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate("/about")}
            className="rounded-2xl px-6 py-5 text-base font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            About Autism
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
