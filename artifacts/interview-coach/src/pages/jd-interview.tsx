import React, { useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/context/session-context";
import { useParseJdQuestions, useStartSession } from "@workspace/api-client-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, ArrowRight, CheckCircle2, BookOpen, Sparkles } from "lucide-react";
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
      toast({ title: "Input too short", description: "Please paste a complete job description.", variant: "destructive" });
      return;
    }
    setIsParsing(true);
    try {
      const result = await parseJd.mutateAsync({ data: { jdText } });
      setQuestions(result);
    } catch {
      toast({ title: "Error parsing JD", description: "Could not generate questions. Please try again.", variant: "destructive" });
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
    } catch {
      toast({ title: "Error starting session", description: "Please try again later.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 p-7 overflow-hidden shadow-xl shadow-purple-200">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-24 translate-x-12 blur-2xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Job Description Prep</h1>
            <p className="text-white/70 text-sm">Paste any JD — AI extracts the core competencies and generates 5 tailored questions.</p>
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-lg shadow-purple-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-purple-500" />
            <h2 className="font-black text-gray-900">Paste Job Description</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            We'll analyze the requirements and generate targeted interview questions matched to the role.
          </p>
          <Textarea
            placeholder="Paste the full job description here..."
            className="min-h-[280px] resize-y text-sm p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-purple-300 focus:bg-white focus:ring-0 transition-colors font-mono"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={isParsing}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleParse}
              disabled={isParsing || jdText.length < 50}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 group"
            >
              {isParsing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing JD...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Questions</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Success header */}
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-gray-900">{questions.length} Questions Generated</h3>
                <p className="text-xs text-gray-400">Tailored to your job description</p>
              </div>
            </div>
            <button
              onClick={() => setQuestions([])}
              className="text-sm font-bold text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-4 py-1.5 rounded-xl transition-colors"
            >
              Edit JD
            </button>
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 hover:border-indigo-200 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">{q.question}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              onClick={handleStart}
              disabled={startSession.isPending}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 group"
            >
              {startSession.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              Start Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
