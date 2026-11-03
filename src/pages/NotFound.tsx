import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] glass-panel text-center border border-black/[0.06] dark:border-white/[0.08] shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-sky-400 mx-auto mb-4">
            <Brain className="w-8 h-8" />
          </div>

          <span className="text-4xl font-extrabold text-blue-600 dark:text-sky-400 tabular-nums">404</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            We couldn't find the requested path <code className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.08]">{location.pathname}</code>. Let's head back to the therapy dashboard!
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Home className="w-3.5 h-3.5 mr-1.5" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
