import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import type { Feedback } from "@workspace/api-client-react";

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const scoreColor = 
    feedback.score >= 8 ? "text-green-600 dark:text-green-400" :
    feedback.score >= 5 ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";

  return (
    <Card className="w-full border-primary/20 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Evaluation Feedback
            </CardTitle>
            <CardDescription className="mt-1">
              AI analysis of your response
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${scoreColor} tracking-tighter`}>
              {feedback.score}<span className="text-2xl text-slate-400 font-medium">/10</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">
              Score
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Keyword Coverage</span>
            <span className="text-sm font-medium text-slate-500">{feedback.keywordCoverage}%</span>
          </div>
          <Progress value={feedback.keywordCoverage} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10 p-4">
            <h4 className="flex items-center gap-2 text-green-800 dark:text-green-400 font-semibold mb-3">
              <CheckCircle2 className="w-5 h-5" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-green-900/80 dark:text-green-200/80 flex items-start gap-2">
                  <span className="mt-1 text-green-500">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 p-4">
            <h4 className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold mb-3">
              <AlertTriangle className="w-5 h-5" />
              Areas to Improve
            </h4>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, i) => (
                <li key={i} className="text-sm text-amber-900/80 dark:text-amber-200/80 flex items-start gap-2">
                  <span className="mt-1 text-amber-500">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details className="group border border-border rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/30">
          <summary className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2 select-none hover:text-primary transition-colors">
            <Lightbulb className="w-5 h-5 text-primary" />
            View Model Answer
          </summary>
          <div className="mt-4 pt-4 border-t border-border/50 text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {feedback.modelAnswer}
          </div>
        </details>

      </CardContent>
    </Card>
  );
}
