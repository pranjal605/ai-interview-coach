import React from "react";
import { useRoute, useLocation } from "wouter";
import { useGetSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, ArrowLeft, Calendar, User, Target, CheckCircle2, AlertTriangle, Lightbulb, Award } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

function scoreColor(score: number) {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-rose-600";
}

function scoreBg(score: number) {
  if (score >= 8) return "from-emerald-500 to-teal-500 shadow-emerald-200";
  if (score >= 7) return "from-amber-500 to-orange-400 shadow-amber-200";
  return "from-rose-500 to-pink-500 shadow-rose-200";
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/sessions/:sessionId");
  const sessionId = params?.sessionId || "";

  const { data: session, isLoading, isError } = useGetSession(sessionId, {
    query: { enabled: !!sessionId, queryKey: getGetSessionQueryKey(sessionId) }
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        </div>
        <p className="text-sm font-semibold text-gray-400">Loading session...</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-black text-gray-900 mb-2">Session not found</h2>
        <p className="text-gray-400 text-sm mb-6">This session may have expired or been deleted.</p>
        <button
          onClick={() => setLocation("/")}
          className="px-6 py-2.5 rounded-2xl border-2 border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const hasFeedback = session.scores && session.scores.length > 0 && session.feedbackList && session.feedbackList.length > 0;
  const avgScore = hasFeedback ? session.scores!.reduce((a, b) => a + b, 0) / session.scores!.length : 0;
  const chartData = session.scores?.map((score, index) => ({ name: `Q${index + 1}`, score })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Back */}
      <Link href="/" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Home
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Session Review</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
                <Calendar className="h-3.5 w-3.5" /> {format(new Date(session.createdAt), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 rounded-full px-3 py-1">
                <User className="h-3.5 w-3.5" /> {session.role}
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 rounded-full px-3 py-1">
                <Target className="h-3.5 w-3.5" /> {session.difficulty}
              </span>
            </div>
          </div>
          {hasFeedback && (
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-br ${scoreBg(avgScore)} shadow-lg text-white flex-shrink-0`}>
              <Award className="h-5 w-5 text-white/80" />
              <div>
                <div className="text-xs font-bold text-white/70">Avg Score</div>
                <div className="text-3xl font-black leading-tight">{avgScore.toFixed(1)}<span className="text-base font-bold text-white/60">/10</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {hasFeedback && chartData.length > 1 && (
        <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Score Progression</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "16px", border: "1px solid #e0e7ff", boxShadow: "0 10px 25px -5px rgba(99,102,241,0.1)" }}
                  formatter={(value: number) => [`${value} / 10`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#dashGrad)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ffffff", strokeWidth: 2, stroke: "#6366f1" }}
                  activeDot={{ r: 7, fill: "#6366f1" }}
                />
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Q&A Accordion */}
      <div>
        <h3 className="text-base font-black text-gray-900 mb-4">Questions & Feedback</h3>
        {session.questions && session.questions.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {session.questions.map((question, index) => {
              const answer = session.answers?.[index];
              const score = session.scores?.[index];
              const feedback = session.feedbackList?.[index];

              return (
                <AccordionItem key={index} value={`item-${index}`}
                  className="bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center justify-between w-full pr-4 text-left gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-sm text-gray-800 line-clamp-1">{question}</span>
                      </div>
                      {score !== undefined && (
                        <span className={`text-sm font-black flex-shrink-0 ${scoreColor(score)}`}>{score}/10</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-indigo-50 bg-gray-50/50">
                    <div className="p-5 space-y-5">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Question</p>
                        <p className="text-gray-800 font-semibold text-sm leading-relaxed">{question}</p>
                      </div>

                      {answer && (
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Your Answer</p>
                          <div className="p-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {answer}
                          </div>
                        </div>
                      )}

                      {feedback && (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-gray-600">Keyword Coverage</span>
                              <span className="text-xs font-black text-indigo-600">{feedback.keywordCoverage}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                style={{ width: `${feedback.keywordCoverage}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                              <h5 className="flex items-center gap-1.5 text-xs text-emerald-700 font-black mb-2">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                              </h5>
                              <ul className="space-y-1.5">
                                {feedback.strengths.map((s, i) => (
                                  <li key={i} className="text-xs text-emerald-900/80 flex items-start gap-1.5">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" /> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                              <h5 className="flex items-center gap-1.5 text-xs text-amber-700 font-black mb-2">
                                <AlertTriangle className="w-3.5 h-3.5" /> Improvements
                              </h5>
                              <ul className="space-y-1.5">
                                {feedback.improvements.map((s, i) => (
                                  <li key={i} className="text-xs text-amber-900/80 flex items-start gap-1.5">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" /> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <details className="group">
                            <summary className="text-xs font-black text-indigo-600 cursor-pointer flex items-center gap-1.5 select-none hover:text-indigo-800 transition-colors">
                              <Lightbulb className="w-3.5 h-3.5" /> View Model Answer
                            </summary>
                            <div className="mt-2 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
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
          <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-3xl text-sm font-medium">
            No questions answered in this session.
          </div>
        )}
      </div>
    </div>
  );
}
