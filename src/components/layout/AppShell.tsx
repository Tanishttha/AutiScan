import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { WifiOff, RefreshCw } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, hideNav = false }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial and periodic ping check
    const checkServerHealth = async () => {
      if (!navigator.onLine) {
        setIsOffline(true);
        return;
      }
      try {
        const res = await fetch("/health");
        if (!res.ok) setIsOffline(true);
        else setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    };

    checkServerHealth();
    const interval = setInterval(checkServerHealth, 15000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col relative transition-colors duration-200">
      
      {/* Offline Status Alert Banner */}
      {isOffline && (
        <div className="w-full bg-amber-500/20 dark:bg-amber-500/30 border-b border-amber-500/40 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md z-50 backdrop-blur-md">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
            <span>No internet connection / Backend server disconnected — Telemetry and live AI features are paused.</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}

      {/* Ambient Sensory-Calming Frosted Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-400/10 dark:bg-purple-600/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-teal-600/10 blur-3xl" />
      </div>

      {!hideNav && <Navbar />}

      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Global Minimalist Footer */}
      {!hideNav && (
        <footer className="w-full border-t border-black/[0.04] dark:border-white/[0.06] bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-6 mt-12 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">AutiScan Platform</span>
              <span>·</span>
              <span>Screening, Speech & Focus Therapy (Single Port 3000)</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Children & Family First</span>
              <span>·</span>
              <span>Sensory-Friendly Design</span>
              <span>·</span>
              <span>Strict Privacy</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
