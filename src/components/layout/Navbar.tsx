import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Brain,
  Mic,
  Eye,
  Sparkles,
  BarChart3,
  CalendarCheck,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  BookOpen,
  Wind,
  Gamepad2,
  Home
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

const GAMES_LIST = [
  {
    name: "Eye-Contact Buddy",
    emoji: "🐻",
    path: "/eye-contact-buddy",
    desc: "Dancing character & gaze focus",
    icon: Eye
  },
  {
    name: "Magic Story Maker",
    emoji: "📖",
    path: "/story-maker",
    desc: "Child-hero illustrated audio books",
    icon: BookOpen
  },
  {
    name: "Calm Monster",
    emoji: "🐉",
    path: "/calm-monster",
    desc: "Stillness dragon & balloon breathing",
    icon: Wind
  },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setGamesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("autiscan-guest");
      toast.success("Signed out successfully");
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  const isCurrent = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAnyGameActive = GAMES_LIST.some((g) => location.pathname.startsWith(g.path));

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Brand Logo & Wordmark (Zone 1) */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              AutiScan
            </span>
          </Link>

          {/* Clean 4-5 Primary Nav Links (Zone 2) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
            
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isCurrent("/dashboard")
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Dashboard
            </Link>

            {/* Interactive Games Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setGamesDropdownOpen(!gamesDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isAnyGameActive || gamesDropdownOpen
                    ? "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
                aria-expanded={gamesDropdownOpen}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Therapy Games</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${gamesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Apple-style Frosted Dropdown Sheet */}
              {gamesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 p-2 rounded-3xl glass-panel border border-black/[0.08] dark:border-white/[0.1] shadow-2xl animate-fade-in z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Child-Favorite Games
                  </div>
                  <div className="space-y-1">
                    {GAMES_LIST.map((game) => {
                      const active = location.pathname.startsWith(game.path);
                      return (
                        <Link
                          key={game.path}
                          to={game.path}
                          onClick={() => setGamesDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all ${
                            active
                              ? "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-sky-400 font-bold"
                              : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <span className="text-xl p-1 bg-black/[0.02] dark:bg-white/[0.04] rounded-xl">{game.emoji}</span>
                          <div>
                            <div className="text-xs font-bold leading-tight">{game.name}</div>
                            <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">{game.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Speech Lab Link */}
            <Link
              to="/speech"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isCurrent("/speech")
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Speech Lab
            </Link>

            {/* ASD Screening Link */}
            <Link
              to="/screening"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isCurrent("/screening")
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ASD Screening
            </Link>

            {/* Attention Monitor Link */}
            <Link
              to="/attention"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isCurrent("/attention")
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Focus Vision
            </Link>

            {/* Therapy Plan Link */}
            <Link
              to="/therapy"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isCurrent("/therapy")
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Therapy Plan
            </Link>

            {/* Analytics Link */}
            <Link
              to="/analytics"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                isCurrent("/analytics")
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Analytics
            </Link>

          </nav>

          {/* Right Action Zone: Apple Theme Toggle & Leave (Zone 3) */}
          <div className="flex items-center gap-2">
            
            {/* Minimalist Apple Theme Switcher (Icon Only) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200 border border-black/[0.05] dark:border-white/[0.08] transition-all duration-200 active:scale-95"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Exit Button */}
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
              title="Leave / Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] text-slate-700 dark:text-slate-200 border border-black/[0.05] dark:border-white/[0.08] active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Cleanly grouped & organized) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl animate-fade-in px-4 pt-3 pb-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            
            {/* Core Pages */}
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Core Modules
              </div>
              <div className="space-y-1 mt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isCurrent("/dashboard")
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Home className="w-4 h-4 text-blue-500" />
                  <span>Dashboard Overview</span>
                </Link>

                <Link
                  to="/screening"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isCurrent("/screening")
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>Clinical ASD Screening</span>
                </Link>

                <Link
                  to="/speech"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isCurrent("/speech")
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Mic className="w-4 h-4 text-purple-500" />
                  <span>Speech Therapy Lab</span>
                </Link>

                <Link
                  to="/attention"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isCurrent("/attention")
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Eye className="w-4 h-4 text-sky-500" />
                  <span>Attention & Gaze Monitor</span>
                </Link>
              </div>
            </div>

            {/* Child Games Section */}
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                Therapy Games & Activities
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {GAMES_LIST.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-2xl glass-card flex flex-col gap-1 border border-black/[0.05] dark:border-white/[0.08]"
                  >
                    <span className="text-2xl">{game.emoji}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {game.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Logout */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-2">
              <span className="text-xs text-slate-400">AutiScan Care Suite</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave App</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
