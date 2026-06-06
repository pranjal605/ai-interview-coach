import React, { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/context/session-context";
import { useStartSession, useGenerateQuestion, useListSessions, getListSessionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, FileText, History } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

const ROLES = ["Software Engineer", "Data Analyst", "Product Manager", "Frontend Developer", "Backend Developer", "Data Scientist"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COUNTS = ["3", "5", "10"];

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const { role, difficulty, totalQuestions, setRole, setDifficulty, setTotalQuestions, setSessionId, setCurrentQuestion, setPhase, setQuestionIndex, resetSession } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startSession = useStartSession();
  const generateQuestion = useGenerateQuestion();
  
  const { data: recentSessions, isLoading: isLoadingSessions } = useListSessions({ query: { queryKey: getListSessionsQueryKey() }});

  const handleStart = async () => {
    try {
      resetSession();
      setPhase("loading");
      setRole(role);
      setDifficulty(difficulty);
      setTotalQuestions(totalQuestions);

      const session = await startSession.mutateAsync({
        data: { role, difficulty, totalQuestions }
      });
      
      setSessionId(session.id);
      
      const question = await generateQuestion.mutateAsync({
        data: { role, difficulty }
      });

      setCurrentQuestion(question);
      setQuestionIndex(0);
      setPhase("question");
      setLocation("/interview");
      
    } catch (error) {
      setPhase("home");
      toast({
        title: "Error starting session",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const isStarting = startSession.isPending || generateQuestion.isPending;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          Nail your next interview.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Practice with an AI coach that gives you precise, actionable feedback on your answers. No fluff, just preparation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Configure a standard mock interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Target Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Questions</Label>
                <Select value={totalQuestions.toString()} onValueChange={(v) => setTotalQuestions(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-bold" size="lg" onClick={handleStart} disabled={isStarting}>
              {isStarting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Starting...</> : "Start Session"}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-50 dark:bg-slate-900/50 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Tailored Prep
              </CardTitle>
              <CardDescription>Practice questions based on a specific job description.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-white dark:bg-slate-950" asChild>
                <Link href="/jd">
                  Paste Job Description <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSessions ? (
                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : recentSessions && recentSessions.length > 0 ? (
                <div className="space-y-2">
                  {recentSessions.slice(0, 3).map(session => (
                    <Link key={session.id} href={`/sessions/${session.id}`} className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-border">
                      <div>
                        <div className="font-medium text-sm">{session.role}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(session.createdAt), 'MMM d, yyyy')}</div>
                      </div>
                      <div className="text-sm font-semibold">
                        {session.scores && session.scores.length > 0 ? 
                          `${(session.scores.reduce((a,b)=>a+b,0)/session.scores.length).toFixed(1)}/10` : 
                          '-'}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-center text-muted-foreground py-4">No recent sessions found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
