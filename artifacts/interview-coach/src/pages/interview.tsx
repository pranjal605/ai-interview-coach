import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/context/session-context";
import { useEvaluateAnswer, useGenerateQuestion } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, Send, ArrowRight } from "lucide-react";
import { Timer } from "@/components/timer";
import { VoiceInput } from "@/components/voice-input";
import { FeedbackCard } from "@/components/feedback-card";
import { Label } from "@/components/ui/label";

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

  // Redirect to home if no active session
  useEffect(() => {
    if (!sessionId || !currentQuestion) {
      setLocation("/");
    }
  }, [sessionId, currentQuestion, setLocation]);

  if (!sessionId || !currentQuestion) return null;

  const progress = ((questionIndex) / totalQuestions) * 100;

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
      
    } catch (error) {
      toast({
        title: "Evaluation failed",
        description: "Could not evaluate your answer. Please try again.",
        variant: "destructive"
      });
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
        const nextQ = await generateQuestion.mutateAsync({
          data: { role, difficulty }
        });
        setCurrentQuestion(nextQ);
      }
      setPhase("question");
    } catch (error) {
      toast({
        title: "Error fetching question",
        description: "Could not get the next question.",
        variant: "destructive"
      });
      setLocation("/");
    }
  };

  const isEvaluating = phase === "evaluating";
  const isFeedback = phase === "feedback";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header / Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <Badge variant="outline" className="font-semibold">{role}</Badge>
            <Badge variant="secondary">{difficulty}</Badge>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Question {questionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-t-4 border-t-primary shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl md:text-2xl leading-relaxed text-slate-800 dark:text-slate-100">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showHint && !isFeedback && (
            <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              <Lightbulb className="w-4 h-4 mr-2" /> Show Hint
            </Button>
          )}
          {showHint && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm text-amber-800 dark:text-amber-300 animate-in fade-in">
              <span className="font-bold mr-2">Hint:</span>
              {currentQuestion.hint}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Area */}
      {!isFeedback && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="answer" className="text-base font-semibold">Your Answer</Label>
            <Timer isActive={isTimerActive} onExpire={handleSubmit} />
          </div>
          
          <div className="relative">
            <Textarea 
              id="answer"
              placeholder="Type your answer here, or use the microphone to speak..."
              className="min-h-[200px] resize-y text-base p-4"
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

          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleSubmit} 
              disabled={answerText.length < 10 || isEvaluating}
              className="w-full sm:w-auto font-bold"
            >
              {isEvaluating ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Evaluating...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Answer</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Feedback Area */}
      {isFeedback && currentQuestion && (
        <div className="space-y-6">
          <FeedbackCard feedback={feedbackList[questionIndex]} />
          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={handleNext} className="font-bold w-full sm:w-auto">
              {questionIndex >= totalQuestions - 1 ? "Complete Interview" : "Next Question"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
