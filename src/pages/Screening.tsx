import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const questions = [
  { id: "A1_Score", text: "I prefer to do things with friends rather than on my own" },
  { id: "A2_Score", text: "I frequently interrupt other people's conversations" },
  { id: "A3_Score", text: "I notice small sounds when others do not" },
  { id: "A4_Score", text: "I find it difficult to imagine what it would be like to be someone else" },
  { id: "A5_Score", text: "I find it easy to do more than one thing at once" },
  { id: "A6_Score", text: "I find it easy to work out what someone is thinking or feeling" },
  { id: "A7_Score", text: "I find it difficult to work out people's intentions" },
  { id: "A8_Score", text: "I prefer to do things the same way over and over again" },
  { id: "A9_Score", text: "I easily get upset if I don't follow my routine" },
  { id: "A10_Score", text: "I find it difficult to read people's expressions" },
];

const Screening = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [jaundice, setJaundice] = useState("");
  const [austim, setAustim] = useState("");
  const [contryOfRes, setContryOfRes] = useState("");
  const [usedAppBefore, setUsedAppBefore] = useState("");
  const [relation, setRelation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(responses).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }
    
    if (!age || !gender || !ethnicity || !jaundice || !austim || !contryOfRes || !usedAppBefore || !relation) {
      toast.error("Please complete all demographic fields");
      return;
    }

    setIsSubmitting(true);

    // Calculate result (sum of all A scores)
    const result = Object.values(responses).reduce((sum, val) => sum + val, 0);

    const payload = {
      ...responses,
      age: parseFloat(age),
      gender,
      ethnicity,
      jaundice,
      austim,
      contry_of_res: contryOfRes,
      used_app_before: usedAppBefore,
      result,
      relation
    };

    try {
      const response = await fetch("https://autusmscan.onrender.com/predict", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/results", { 
          state: { 
            prediction: data.prediction,
            result,
            age, 
            gender, 
            ethnicity,
            austim
          } 
        });
      } else {
        toast.error(data.error || "Prediction failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Could not connect to the server. Make sure your Flask backend is running.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <h1 className="text-2xl font-bold">ASD Screening</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="mb-6 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Demographic Information</CardTitle>
            <CardDescription>Please provide some basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Enter age"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="f">Female</SelectItem>
                  <SelectItem value="m">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Select value={ethnicity} onValueChange={setEthnicity}>
                <SelectTrigger id="ethnicity">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="Latino">Latino</SelectItem>
                  <SelectItem value="Middle Eastern ">Middle Eastern</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                  <SelectItem value="Pasifika">Pasifika</SelectItem>
                  <SelectItem value="South Asian">South Asian</SelectItem>
                  <SelectItem value="Turkish">Turkish</SelectItem>
                  <SelectItem value="White-European">White-European</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jaundice">Was the patient jaundiced at birth?</Label>
              <Select value={jaundice} onValueChange={setJaundice}>
                <SelectTrigger id="jaundice">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="austim">Does a family member have PDD?</Label>
              <Select value={austim} onValueChange={setAustim}>
                <SelectTrigger id="austim">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country of Residence</Label>
              <Select value={contryOfRes} onValueChange={setContryOfRes}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Others">Other/Not Listed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="used-app">Used App Before</Label>
              <Select value={usedAppBefore} onValueChange={setUsedAppBefore}>
                <SelectTrigger id="used-app">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relation">Relation</Label>
              <Select value={relation} onValueChange={setRelation}>
                <SelectTrigger id="relation">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Self">Self</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Relative">Relative</SelectItem>
                  <SelectItem value="Health care professional">Health Professional</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Screening Questions</CardTitle>
            <CardDescription>Please rate each statement from 0 to 2</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label htmlFor={question.id} className="text-base">
                  {index + 1}. {question.text}
                </Label>
                <input
                  type="number"
                  id={question.id}
                  value={responses[question.id] ?? ""}
                  onChange={(e) =>
                    setResponses({ ...responses, [question.id]: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                  max="2"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Enter score (0-2)"
                  required
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-primary text-white py-6 text-lg rounded-2xl"
          >
            {isSubmitting ? "Processing..." : "Submit Test"}
            <CheckCircle2 className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Screening;
