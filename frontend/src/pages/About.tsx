import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold">About Autism</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <Card className="mb-8 shadow-glow border-2 border-primary/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                <Brain className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Understanding Autism</CardTitle>
            <CardDescription className="text-base">
              Autism Spectrum Disorder (ASD) is a developmental condition that affects communication and behavior
            </CardDescription>
          </CardHeader>
        </Card>

        {/* What is ASD */}
        <Card className="mb-6 border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle>What is Autism Spectrum Disorder?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Autism Spectrum Disorder (ASD) is a complex neurodevelopmental condition that affects how people perceive and interact with the world around them. It includes a wide range of symptoms and skills.
            </p>
            <p>
              ASD affects approximately 1 in 100 children worldwide. While autism is lifelong, early intervention and support can significantly improve quality of life and help individuals reach their full potential.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Social Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Differences in social interaction, understanding emotions, and non-verbal communication.</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Patterns of Behavior</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Repetitive behaviors, specific interests, and preference for routine and predictability.</p>
            </CardContent>
          </Card>
        </div>

        {/* Early Signs */}
        <Card className="mb-6 border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle>Early Signs & Screening</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Why early screening matters:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Early intervention leads to better outcomes</li>
              <li>Helps families access support services sooner</li>
              <li>Enables tailored educational approaches</li>
              <li>Improves quality of life for individuals and families</li>
            </ul>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card className="mb-6 border-border/50 shadow-soft">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <CardTitle>Support & Intervention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              AutiScan provides tools for screening, speech therapy, and cognitive development. However, comprehensive support typically includes:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Behavioral therapy and intervention programs</li>
              <li>Speech and language therapy</li>
              <li>Occupational therapy</li>
              <li>Educational support and accommodations</li>
              <li>Family counseling and support groups</li>
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-destructive/30 bg-destructive/5 shadow-soft">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-lg">Important Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              This platform is designed for educational and screening purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="font-medium text-foreground">
              Always seek the advice of qualified healthcare providers with any questions regarding autism or any medical condition.
            </p>
          </CardContent>
        </Card>

        {/* Developer Credits */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>AutiScan - Screen. Support. Strengthen.</p>
          <p className="mt-2">Developed with care for families and individuals on the autism spectrum</p>
        </div>
      </main>
    </div>
  );
};

export default About;
