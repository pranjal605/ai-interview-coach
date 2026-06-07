import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/context/session-context";
import { useEvaluateAnswer, useGenerateQuestion } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, Send, ArrowRight } from "lucide-react";
import { Timer } from "@/components/timer";
import { VoiceInput } from "@/components/voice-input";
import { FeedbackCard } from "@/components/feedback-card";

const DIFF_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function InterviewScreen() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    sessionId, role, difficulty, totalQuestions, questionIndex,
    currentQuestion, phase, setPhase, addAnswer, addScore, addFeedback,
    setQuestionIndex, setCurrentQuestion, jdSourcedQuestions, feedbackList
  } = useSession();

  const [answerText, setAnswerText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const evaluateAnswer = useEvaluateAnswer();
  const generateQuestion = useGenerateQuestion();

  useEffect(() => {
    if (!sessionId || !currentQuestion) {
      setLocation("/");
    }
  }, [sessionId, currentQuestion, setLocation]);

  if (!sessionId || !currentQuestion) return null;

  const progress = (questionIndex / totalQuestions) * 100;

  const handleSubmit = async () => {
    if (answerText.trim().length < 10) return;
    setIsTimerActive(false);
    setPhase("evaluating");
    try {
      const feedback = await evaluateAnswer.mutateAsync({
        data: {
          sessionId,
          questionIndex,
          question: currentQuestion.question,
          answer: answerText,
          expectedKeywords: currentQuestion.expectedKeywords
        }
      });
      addAnswer(answerText);
      addScore(feedback.score);
      addFeedback(feedback);
      setPhase("feedback");
    } catch {
      toast({ title: "Evaluation failed", description: "Could not evaluate your answer. Please try again.", variant: "destructive" });
      setIsTimerActive(true);
      setPhase("question");
    }
  };

  const handleNext = async () => {
    if (questionIndex >= totalQuestions - 1) {
      setPhase("summary");
      setLocation("/summary");
      return;
    }
    setPhase("loading");
    setAnswerText("");
    setShowHint(false);
    setIsTimerActive(true);
    setQuestionIndex(questionIndex + 1);
    try {
      if (jdSourcedQuestions && jdSourcedQuestions[questionIndex + 1]) {
        setCurrentQuestion(jdSourcedQuestions[questionIndex + 1]);
      } else {
        const nextQ = await generateQuestion.mutateAsync({ data: { role, difficulty } });
        setCurrentQuestion(nextQ);
      }
      setPhase("question");
    } catch {
      toast({ title: "Error fetching question", description: "Could not get the next question.", variant: "destructive" });
      setLocation("/");
    }
  };

  const isEvaluating = phase === "evaluating";
  const isFeedback = phase === "feedback";

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Header */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">{role}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFF_COLORS[difficulty] ?? "bg-gray-100 text-gray-600"}`}>{difficulty}</span>
          </div>
          <span className="text-xs font-bold text-gray-500">
            Question <span className="text-indigo-600">{questionIndex + 1}</span> of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-lg shadow-indigo-50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-6">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3">Interview Question</p>
          <h2 className="text-xl font-bold text-gray-900 leading-relaxed mb-4">
            {currentQuestion.question}
          </h2>
          {!showHint && !isFeedback && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Lightbulb className="w-4 h-4" /> Show Hint
            </button>
          )}
          {showHint && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800 animate-in fade-in duration-300">
              <span className="font-bold mr-1.5">Hint:</span>
              {currentQuestion.hint}
            </div>
          )}
        </div>
      </div>

      {/* Answer Area */}
      {!isFeedback && (
        <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Answer</p>
            <Timer isActive={isTimerActive} onExpire={handleSubmit} />
          </div>
          <div className="relative">
            <Textarea
              placeholder="Type your answer here, or use the microphone to speak..."
              className="min-h-[180px] resize-y text-sm p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-indigo-300 focus:bg-white focus:ring-0 transition-colors"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={isEvaluating}
            />
            <div className="absolute bottom-3 right-3">
              <VoiceInput
                onAppend={(text) => setAnswerText(prev => prev + (prev.endsWith(" ") ? "" : " ") + text)}
                disabled={isEvaluating}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={answerText.length < 10 || isEvaluating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed font-black text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              {isEvaluating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating your answer...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Answer</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Feedback Area */}
      {isFeedback && currentQuestion && (
        <div className="space-y-5 animate-in fade-in duration-500">
          <FeedbackCard feedback={feedbackList[questionIndex]} />
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-black text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 group"
            >
              {questionIndex >= totalQuestions - 1 ? "Complete Interview" : "Next Question"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {phase === "loading" && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-sm font-semibold text-gray-500">Generating next question...</p>
        </div>
      )}
    </div>
  );
}
