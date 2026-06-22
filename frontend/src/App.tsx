import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Sparkles, Brain, Heart, Stars } from "lucide-react";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

const Splash = lazy(() => import("./pages/Splash"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Screening = lazy(() => import("./pages/Screening"));
const Results = lazy(() => import("./pages/Results"));
const Speech = lazy(() => import("./pages/Speech"));
const About = lazy(() => import("./pages/About"));
const AttentionMonitor = lazy(() => import("./pages/AttentionMonitor"));
const TherapyDashboard = lazy(() => import("./pages/TherapyDashboard"));
const AICompanion = lazy(() => import("./pages/AICompanion"));
const ProgressAnalytics = lazy(() => import("./pages/ProgressAnalytics"));
const AIRecommendations = lazy(() => import("./pages/AIRecommendations"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-sky-100 to-purple-200 flex items-center justify-center px-6">

                {/* Floating Background Effects */}
                <div className="absolute inset-0 overflow-hidden">

                  <div className="absolute top-10 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />

                  <div className="absolute bottom-10 right-10 w-52 h-52 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />

                  <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl animate-bounce" />

                  <div className="absolute top-20 right-20 animate-spin slow-spin">
                    <Stars className="w-14 h-14 text-yellow-400" />
                  </div>

                  <div className="absolute bottom-20 left-20 animate-bounce">
                    <Heart className="w-12 h-12 text-pink-500 fill-pink-400" />
                  </div>

                </div>

                {/* Main Card */}
                <div className="relative z-10 w-full max-w-2xl rounded-[40px] border border-white/40 bg-white/60 backdrop-blur-2xl shadow-2xl p-10 text-center">

                  <div className="flex justify-center gap-5 mb-8">

                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl animate-bounce">
                      <Brain className="w-10 h-10 text-white" />
                    </div>

                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>

                  </div>

                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-5">
                    AI Autism Therapy Assistant
                  </h1>

                  <p className="text-xl text-slate-700 leading-relaxed mb-8 font-medium">
                    Preparing smart therapy tools, emotion tracking, behavioral AI,
                    attention monitoring, speech modules, and personalized learning
                    activities for kids ✨
                  </p>

                  {/* Loading Bar */}
                  <div className="w-full h-5 rounded-full bg-slate-200 overflow-hidden shadow-inner mb-6">
                    <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full animate-pulse" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                    <div className="rounded-2xl bg-pink-100/70 p-4 shadow-md hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">🧠</div>
                      <p className="text-sm font-bold text-pink-700">
                        Smart AI
                      </p>
                    </div>

                    <div className="rounded-2xl bg-blue-100/70 p-4 shadow-md hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">🎯</div>
                      <p className="text-sm font-bold text-blue-700">
                        Focus Tracking
                      </p>
                    </div>

                    <div className="rounded-2xl bg-yellow-100/70 p-4 shadow-md hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">🗣</div>
                      <p className="text-sm font-bold text-yellow-700">
                        Speech Therapy
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-100/70 p-4 shadow-md hover:scale-105 transition-all duration-300">
                      <div className="text-3xl mb-2">🏆</div>
                      <p className="text-sm font-bold text-purple-700">
                        Achievements
                      </p>
                    </div>

                  </div>

                  <div className="mt-8 text-slate-600 text-sm font-semibold animate-pulse">
                    Creating a safe, interactive and joyful therapy experience for children 💖
                  </div>

                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/screening" element={<Screening />} />
              <Route path="/results" element={<Results />} />
              <Route path="/speech" element={<Speech />} />
              <Route path="/attention" element={<AttentionMonitor />} />
              <Route path="/therapy" element={<TherapyDashboard />} />
              <Route path="/ai-companion" element={<AICompanion />} />
              <Route path="/analytics" element={<ProgressAnalytics />} />
              <Route path="/recommendations" element={<AIRecommendations />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
