import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Question, Feedback } from "@workspace/api-client-react";

export type SessionPhase = "home" | "loading" | "question" | "evaluating" | "feedback" | "summary";

interface SessionState {
  sessionId: string | null;
  role: string;
  difficulty: string;
  totalQuestions: number;
  questionIndex: number;
  currentQuestion: Question | null;
  answers: string[];
  scores: number[];
  feedbackList: Feedback[];
  phase: SessionPhase;
  jdSourcedQuestions: Question[] | null;
}

interface SessionContextType extends SessionState {
  setSessionId: (id: string | null) => void;
  setRole: (role: string) => void;
  setDifficulty: (difficulty: string) => void;
  setTotalQuestions: (count: number) => void;
  setQuestionIndex: (index: number) => void;
  setCurrentQuestion: (q: Question | null) => void;
  addAnswer: (answer: string) => void;
  addScore: (score: number) => void;
  addFeedback: (feedback: Feedback) => void;
  setPhase: (phase: SessionPhase) => void;
  setJdSourcedQuestions: (questions: Question[] | null) => void;
  resetSession: () => void;
}

const defaultState: SessionState = {
  sessionId: null,
  role: "Software Engineer",
  difficulty: "Medium",
  totalQuestions: 5,
  questionIndex: 0,
  currentQuestion: null,
  answers: [],
  scores: [],
  feedbackList: [],
  phase: "home",
  jdSourcedQuestions: null,
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(defaultState);

  const updateState = (updates: Partial<SessionState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const value: SessionContextType = {
    ...state,
    setSessionId: (id) => updateState({ sessionId: id }),
    setRole: (role) => updateState({ role }),
    setDifficulty: (difficulty) => updateState({ difficulty }),
    setTotalQuestions: (count) => updateState({ totalQuestions: count }),
    setQuestionIndex: (index) => updateState({ questionIndex: index }),
    setCurrentQuestion: (q) => updateState({ currentQuestion: q }),
    addAnswer: (answer) => updateState({ answers: [...state.answers, answer] }),
    addScore: (score) => updateState({ scores: [...state.scores, score] }),
    addFeedback: (feedback) => updateState({ feedbackList: [...state.feedbackList, feedback] }),
    setPhase: (phase) => updateState({ phase }),
    setJdSourcedQuestions: (questions) => updateState({ jdSourcedQuestions: questions }),
    resetSession: () => setState(defaultState),
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
