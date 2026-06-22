import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { prediction, result, age, gender, ethnicity, austim } = location.state || { prediction: "No data", result: 0 };

  const isHighRisk = prediction?.includes("Positive");
  const displayScore = result || 0;

  const handleDownload = () => {
    toast.success("PDF report will be downloaded");
  };

  const handleRetake = () => {
    navigate("/screening");
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
          <h1 className="text-2xl font-bold">Screening Results</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Result Card */}
        <Card className={`mb-6 shadow-glow border-2 ${isHighRisk ? 'border-destructive/50' : 'border-accent/50'}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isHighRisk ? (
                <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl mb-2">
              {prediction || "Test Complete"}
            </CardTitle>
            <CardDescription className="text-lg">
              Based on machine learning analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Total ASD Score</span>
                <span className="text-sm font-bold">{displayScore}/20</span>
              </div>
              <Progress value={(displayScore / 20) * 100} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Age Group</p>
                <p className="font-medium">{age || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{gender === "f" ? "Female" : gender === "m" ? "Male" : "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ethnicity</p>
                <p className="font-medium">{ethnicity || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Family History (PDD)</p>
                <p className="font-medium capitalize">{austim || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Test Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-6 border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Important Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This screening tool is designed for informational purposes only and is not a diagnostic tool.
            </p>
            <p>
              A formal diagnosis of Autism Spectrum Disorder (ASD) can only be made by qualified healthcare professionals through comprehensive evaluation.
            </p>
            <p className="font-medium text-foreground pt-2">
              Please consult with a pediatrician, psychologist, or psychiatrist for a professional assessment.
            </p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-6 border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <p className="text-sm">
                {isHighRisk 
                  ? "Schedule an appointment with a healthcare professional for comprehensive evaluation"
                  : "Continue monitoring developmental milestones and behaviors"
                }
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-secondary font-bold text-sm">2</span>
              </div>
              <p className="text-sm">
                Explore our speech therapy and mind games sections for developmental support
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent font-bold text-sm">3</span>
              </div>
              <p className="text-sm">
                Track progress regularly using our monitoring tools
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 py-6 rounded-2xl"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF Report
          </Button>
          <Button
            onClick={handleRetake}
            className="flex-1 gradient-primary text-white py-6 rounded-2xl"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Retake Test
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Results;
