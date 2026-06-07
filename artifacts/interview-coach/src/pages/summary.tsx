import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useSession } from "@/context/session-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw, Award, TrendingUp, AlertCircle, ChevronRight, Sparkles } from "lucide-react";

function scoreColor(score: number) {
  if (score >= 8.5) return "text-emerald-500";
  if (score >= 7) return "text-amber-500";
  return "text-rose-500";
}

function scoreBg(score: number) {
  if (score >= 8.5) return "from-emerald-500 to-teal-500 shadow-emerald-200";
  if (score >= 7) return "from-amber-500 to-orange-400 shadow-amber-200";
  return "from-rose-500 to-pink-500 shadow-rose-200";
}

function scoreLabel(score: number) {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Strong";
  if (score >= 7) return "Good";
  if (score >= 5) return "Fair";
  return "Needs Work";
}

export default function SessionSummary() {
  const [, setLocation] = useLocation();
  const { sessionId, role, difficulty, scores, feedbackList, resetSession } = useSession();

  useEffect(() => {
    if (!sessionId || scores.length === 0) {
      setLocation("/");
    }
  }, [sessionId, scores, setLocation]);

  if (!sessionId || scores.length === 0) return null;

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const chartData = scores.map((score, index) => ({ name: `Q${index + 1}`, score }));
  const bestScoreIndex = scores.indexOf(Math.max(...scores));
  const worstScoreIndex = scores.indexOf(Math.min(...scores));

  const handleRestart = () => {
    resetSession();
    setLocation("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Interview Complete
        </div>
        <h1 className="text-3xl font-black text-gray-900">Session Summary</h1>
        <p className="text-gray-500 text-sm">{role} · {difficulty}</p>
      </div>

      {/* Score + Chart */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Score card */}
        <div className={`rounded-3xl bg-gradient-to-br ${scoreBg(avgScore)} p-6 shadow-xl flex flex-col items-center justify-center text-center gap-2`}>
          <Award className="h-8 w-8 text-white/80" />
          <div className="text-6xl font-black text-white">{avgScore.toFixed(1)}</div>
          <div className="text-white/80 text-sm font-bold">out of 10</div>
          <div className="mt-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            {scoreLabel(avgScore)}
          </div>
        </div>

        {/* Chart */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-indigo-100 shadow-lg shadow-indigo-50 p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Performance Trend</p>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "16px", border: "1px solid #e0e7ff", boxShadow: "0 10px 25px -5px rgba(99,102,241,0.1)", fontFamily: "Inter, sans-serif" }}
                  formatter={(value: number) => [`${value} / 10`, "Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#scoreGradient)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ffffff", strokeWidth: 2, stroke: "#6366f1" }}
                  activeDot={{ r: 7, fill: "#6366f1" }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths / Improvements */}
      <div className="grid md:grid-cols-2 gap-5">
        {feedbackList[bestScoreIndex] && (
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-sm text-gray-900">Strongest Area</h3>
                <p className="text-xs text-gray-400">Question {bestScoreIndex + 1} · Score: {scores[bestScoreIndex]}</p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {feedbackList[bestScoreIndex].strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedbackList[worstScoreIndex] && scores[worstScoreIndex] < 8 && (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-black text-sm text-gray-900">Key Improvement</h3>
                <p className="text-xs text-gray-400">Question {worstScoreIndex + 1} · Score: {scores[worstScoreIndex]}</p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {feedbackList[worstScoreIndex].improvements.slice(0, 3).map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-gray-100">
        <button
          onClick={handleRestart}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all"
        >
          <RotateCcw className="h-4 w-4" /> Start Another Session
        </button>
        <button
          onClick={() => setLocation(`/sessions/${sessionId}`)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 group"
        >
          View Full Details <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
