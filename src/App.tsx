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
const EyeContactBuddy = lazy(() => import("./pages/EyeContactBuddy"));
const MagicStoryMaker = lazy(() => import("./pages/MagicStoryMaker"));
const CalmMonster = lazy(() => import("./pages/CalmMonster"));
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
              <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-6">
                <div className="w-full max-w-md p-8 rounded-3xl glass-card text-center flex flex-col items-center gap-4 animate-fade-in shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20">
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                      <Brain className="w-7 h-7 text-blue-600 dark:text-sky-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">AutiScan Care</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Preparing your personalized therapy space...</p>
                  </div>
                  <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full w-2/3 bg-blue-600 dark:bg-sky-400 rounded-full animate-pulse" />
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
              <Route path="/eye-contact-buddy" element={<EyeContactBuddy />} />
              <Route path="/story-maker" element={<MagicStoryMaker />} />
              <Route path="/calm-monster" element={<CalmMonster />} />
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
