import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Brain, Mail, Lock, Sparkles, ArrowRight, Sun, Moon, ShieldCheck, Heart } from "lucide-react";
import { toast } from "sonner";

import { auth } from "@/config/firebase";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const isSigningUp = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !isSigningUp.current) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to sign in. You can also explore via Guest Mode.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    isSigningUp.current = true;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await sendEmailVerification(userCredential.user);
      } catch {
        // Continue if verification email fails
      }
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create account";
      toast.error(msg);
    } finally {
      setIsLoading(false);
      isSigningUp.current = false;
    }
  };

  const handleGuestEntry = () => {
    localStorage.setItem("autiscan-guest", "true");
    toast.success("Welcome! Exploring AutiScan as a Guest");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 left-1/3 w-[450px] h-[450px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-purple-600/10 rounded-full blur-[90px]" />
      </div>

      {/* Header with Theme Toggle */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            </div>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">AutiScan</span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-2xl glass-card text-slate-600 dark:text-slate-300 active:scale-95 transition-all flex items-center gap-2 text-xs font-medium"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </header>

      {/* Main Glassmorphic Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] glass-card shadow-2xl animate-fade-in border border-black/[0.06] dark:border-white/[0.08]">
          
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-sky-400 mb-3 shadow-sm">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeTab === "login" ? "Welcome to AutiScan" : "Create Child & Parent Profile"}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Personalized autism screening, speech therapy & focus monitoring
            </p>
          </div>

          {/* Segmented Apple-style Tab Switcher */}
          <div className="flex p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-2xl mb-6 border border-black/[0.04] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "login"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="parent@example.com"
                    required
                    className="pl-10 h-11 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-sm focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-11 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-sm focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200"
              >
                {isLoading ? "Signing in..." : "Sign In to Dashboard"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="parent@example.com"
                    required
                    className="pl-10 h-11 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-sm focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    required
                    className="pl-10 h-11 rounded-2xl bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-sm focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200"
              >
                {isLoading ? "Creating account..." : "Start Free Assessment"}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06] dark:border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/90 dark:bg-slate-900/90 text-slate-400">or try without account</span>
            </div>
          </div>

          {/* Guest Mode Direct Access */}
          <Button
            type="button"
            onClick={handleGuestEntry}
            variant="outline"
            className="w-full h-11 rounded-2xl glass-card text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant Demo / Guest Mode</span>
          </Button>

        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        Private, HIPAA-aware, zero-tracking therapeutic platform
      </footer>

    </div>
  );
};

export default Auth;
