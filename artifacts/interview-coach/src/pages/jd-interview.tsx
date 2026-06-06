import React, { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/context/session-context";
import { useParseJdQuestions, useStartSession } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Question } from "@workspace/api-client-react";

export default function JDInterview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    setRole, setDifficulty, setTotalQuestions, setSessionId, 
    setCurrentQuestion, setPhase, setQuestionIndex, setJdSourcedQuestions, resetSession 
  } = useSession();

  const [jdText, setJdText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const parseJd = useParseJdQuestions();
  const startSession = useStartSession();

  const handleParse = async () => {
    if (jdText.length < 50) {
      toast({
        title: "Input too short",
        description: "Please paste a complete job description.",
        variant: "destructive"
      });
      return;
    }

    setIsParsing(true);
    try {
      const result = await parseJd.mutateAsync({
        data: { jdText }
      });
      setQuestions(result);
    } catch (error) {
      toast({
        title: "Error parsing JD",
        description: "Could not generate questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleStart = async () => {
    try {
      resetSession();
      setPhase("loading");
      setRole("JD Based Role");
      setDifficulty("Medium");
      setTotalQuestions(questions.length);
      setJdSourcedQuestions(questions);

      const session = await startSession.mutateAsync({
        data: { role: "Custom JD Role", difficulty: "Medium", totalQuestions: questions.length }
      });
      
      setSessionId(session.id);
      setCurrentQuestion(questions[0]);
      setQuestionIndex(0);
      setPhase("question");
      setLocation("/interview");
      
    } catch (error) {
      toast({
        title: "Error starting session",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Job Description Prep
        </h1>
        <p className="text-muted-foreground">Paste a JD to get tailored interview questions.</p>
      </div>

      {questions.length === 0 ? (
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Paste Job Description
            </CardTitle>
            <CardDescription>
              We'll analyze the requirements and extract the core competencies to generate tailored questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Paste the full job description here..."
              className="min-h-[300px] resize-y text-sm font-mono"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={isParsing}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button size="lg" onClick={handleParse} disabled={isParsing || jdText.length < 50} className="font-bold">
              {isParsing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing JD...</> : "Generate Questions"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Generated {questions.length} Questions
            </h3>
            <Button variant="outline" onClick={() => setQuestions([])}>Edit JD</Button>
          </div>
          
          <div className="space-y-4">
            {questions.map((q, i) => (
              <Card key={i} className="bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="p-4">
                  <div className="font-medium text-sm text-primary mb-1">Question {i + 1}</div>
                  <div className="text-slate-800 dark:text-slate-200">{q.question}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button size="lg" className="w-full sm:w-auto font-bold" onClick={handleStart} disabled={startSession.isPending}>
              {startSession.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Start Interview"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
