import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-card rounded-full p-8 shadow-glow">
              <Brain className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AutiScan
          </h1>
          <p className="text-xl text-muted-foreground font-light tracking-wide">
            Screen. Support. Strengthen.
          </p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your comprehensive digital platform for autism screening, speech therapy, and cognitive development
        </p>

        {/* CTA Button */}
        <div className="pt-8">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="gradient-primary text-white px-12 py-6 text-lg rounded-2xl shadow-glow hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="pt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Trusted by families</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span>Backed by research</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
