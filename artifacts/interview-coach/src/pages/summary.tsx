import React, { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useSession } from "@/context/session-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Home, RotateCcw, Award, TrendingUp, AlertCircle } from "lucide-react";

export default function SessionSummary() {
  const [, setLocation] = useLocation();
  const { 
    sessionId, role, difficulty, scores, feedbackList, resetSession 
  } = useSession();

  useEffect(() => {
    if (!sessionId || scores.length === 0) {
      setLocation("/");
    }
  }, [sessionId, scores, setLocation]);

  if (!sessionId || scores.length === 0) return null;

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  const chartData = scores.map((score, index) => ({
    name: `Q${index + 1}`,
    score
  }));

  const bestScoreIndex = scores.indexOf(Math.max(...scores));
  const worstScoreIndex = scores.indexOf(Math.min(...scores));

  const handleRestart = () => {
    resetSession();
    setLocation("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mb-2">Interview Complete</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Session Summary
        </h1>
        <p className="text-muted-foreground">{role} • {difficulty}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-2">
            <Award className="h-10 w-10 opacity-80" />
            <div className="text-5xl font-black">{avgScore.toFixed(1)}</div>
            <div className="text-primary-foreground/80 font-medium">Average Score / 10</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[150px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-md)" }}
                    formatter={(value: number) => [`${value} / 10`, "Score"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {feedbackList[bestScoreIndex] && (
          <Card className="border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-400">
                <TrendingUp className="h-5 w-5" />
                Strongest Area
              </CardTitle>
              <CardDescription>Question {bestScoreIndex + 1} (Score: {scores[bestScoreIndex]})</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedbackList[bestScoreIndex].strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 text-green-500">•</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {feedbackList[worstScoreIndex] && scores[worstScoreIndex] < 8 && (
          <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
                Key Improvement
              </CardTitle>
              <CardDescription>Question {worstScoreIndex + 1} (Score: {scores[worstScoreIndex]})</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedbackList[worstScoreIndex].improvements.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="mt-1 text-amber-500">•</span> {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
        <Button variant="outline" size="lg" onClick={handleRestart} className="font-semibold">
          <RotateCcw className="mr-2 h-4 w-4" /> Start Another Session
        </Button>
        <Button size="lg" asChild className="font-semibold">
          <Link href={`/sessions/${sessionId}`}>
            <Home className="mr-2 h-4 w-4" /> View Full Details
          </Link>
        </Button>
      </div>
    </div>
  );
}
