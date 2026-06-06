import React from "react";
import { useRoute } from "wouter";
import { useGetSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, ArrowLeft, Calendar, User, Target, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, params] = useRoute("/sessions/:sessionId");
  const sessionId = params?.sessionId || "";

  const { data: session, isLoading, isError } = useGetSession(sessionId, {
    query: { enabled: !!sessionId, queryKey: getGetSessionQueryKey(sessionId) }
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Session not found</h2>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Return Home
        </Button>
      </div>
    );
  }

  const hasFeedback = session.scores && session.scores.length > 0 && session.feedbackList && session.feedbackList.length > 0;
  const avgScore = hasFeedback ? session.scores!.reduce((a, b) => a + b, 0) / session.scores!.length : 0;

  const chartData = session.scores?.map((score, index) => ({
    name: `Q${index + 1}`,
    score
  })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Session Review</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(session.createdAt), 'MMMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> {session.role}</span>
              <span className="flex items-center gap-1"><Target className="h-4 w-4" /> {session.difficulty}</span>
            </div>
          </div>
          {hasFeedback && (
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Score</div>
              <div className="text-3xl font-black text-primary">{avgScore.toFixed(1)}<span className="text-lg text-muted-foreground">/10</span></div>
            </div>
          )}
        </div>
      </div>

      {hasFeedback && chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Score Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
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
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Questions & Feedback</h3>
        {session.questions && session.questions.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {session.questions.map((question, index) => {
              const answer = session.answers?.[index];
              const score = session.scores?.[index];
              const feedback = session.feedbackList?.[index];

              return (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-card overflow-hidden">
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <div className="flex items-center justify-between w-full pr-4 text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="shrink-0 bg-background">Q{index + 1}</Badge>
                        <span className="font-medium line-clamp-1 flex-1">{question}</span>
                      </div>
                      {score !== undefined && (
                        <div className={`font-bold shrink-0 ${score >= 8 ? 'text-green-600' : score >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
                          {score}/10
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 border-t bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="space-y-6 mt-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Question</h4>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{question}</p>
                      </div>

                      {answer && (
                        <div>
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Answer</h4>
                          <div className="p-4 bg-white dark:bg-slate-950 border rounded-md text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                            {answer}
                          </div>
                        </div>
                      )}

                      {feedback && (
                        <div className="space-y-4 pt-4 border-t border-border/50">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Keyword Coverage</span>
                              <span className="text-xs font-medium text-slate-500">{feedback.keywordCoverage}%</span>
                            </div>
                            <Progress value={feedback.keywordCoverage} className="h-1.5" />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-md border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10 p-3">
                              <h5 className="flex items-center gap-1.5 text-sm text-green-800 dark:text-green-400 font-semibold mb-2">
                                <CheckCircle2 className="w-4 h-4" /> Strengths
                              </h5>
                              <ul className="space-y-1">
                                {feedback.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-green-900/80 dark:text-green-200/80 flex items-start gap-1.5">
                                    <span className="text-green-500">•</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-md border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 p-3">
                              <h5 className="flex items-center gap-1.5 text-sm text-amber-800 dark:text-amber-400 font-semibold mb-2">
                                <AlertTriangle className="w-4 h-4" /> Improvements
                              </h5>
                              <ul className="space-y-1">
                                {feedback.improvements.map((s, i) => (
                                  <li key={i} className="text-xs text-amber-900/80 dark:text-amber-200/80 flex items-start gap-1.5">
                                    <span className="text-amber-500">•</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <details className="group mt-4">
                            <summary className="text-sm font-semibold text-primary cursor-pointer flex items-center gap-1.5 select-none hover:underline">
                              <Lightbulb className="w-4 h-4" /> View Model Answer
                            </summary>
                            <div className="mt-2 p-3 bg-primary/5 border border-primary/10 rounded-md text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {feedback.modelAnswer}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg bg-slate-50 dark:bg-slate-900/50">
            No questions answered in this session.
          </div>
        )}
      </div>
    </div>
  );
}
