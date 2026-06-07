import { useState } from "react";
import { ChevronDown, Mic, Sparkles, ArrowRight, Clock, Star, Flame, Zap, BookOpen } from "lucide-react";

const ROLES = ["Software Engineer", "Product Manager", "Data Scientist", "Frontend Developer", "Backend Developer", "Data Analyst"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COUNTS = ["3", "5", "10"];

const recentSessions = [
  { role: "Software Engineer", date: "Jun 5", score: 8.4, diff: "Hard" },
  { role: "Product Manager", date: "Jun 3", score: 7.1, diff: "Medium" },
  { role: "Data Scientist", date: "Jun 1", score: 9.2, diff: "Hard" },
];

const features = [
  { icon: Zap, label: "AI Evaluation", desc: "Score + feedback instantly" },
  { icon: Mic, label: "Voice Input", desc: "Speak your answers freely" },
  { icon: Star, label: "Smart Questions", desc: "Role-tailored every time" },
];

export function Vibrant() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5");
  const [roleOpen, setRoleOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [countOpen, setCountOpen] = useState(false);

  const diffColor = { Easy: "bg-emerald-100 text-emerald-700 border-emerald-200", Medium: "bg-amber-100 text-amber-700 border-amber-200", Hard: "bg-rose-100 text-rose-700 border-rose-200" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-['Inter']">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xl text-indigo-900 tracking-tight">CoachAI</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">JD Prep</button>
          <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">History</button>
          <button className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-200/50 transition-all hover:shadow-indigo-300/50">
            New Session
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-32 translate-x-20 blur-2xl" />
          <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-purple-400/30 translate-y-16 blur-xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4">
              <Flame className="w-3.5 h-3.5" /> AI-Powered Interview Prep
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-3">
              Nail your next interview.<br />
              <span className="text-yellow-300">Get the job you deserve.</span>
            </h1>
            <p className="text-white/80 text-base max-w-lg">
              Practice with an AI coach that gives you precise, actionable feedback. Real questions, real scores, real results.
            </p>
          </div>
          {/* Feature chips */}
          <div className="relative z-10 flex gap-3 mt-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{label}</div>
                  <div className="text-white/60 text-[10px]">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Start Card */}
          <div className="col-span-7">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/80 border border-indigo-100/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-lg font-black text-gray-900">Quick Start</h2>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Target Role</label>
                <div className="relative">
                  <button
                    onClick={() => { setRoleOpen(!roleOpen); setDiffOpen(false); setCountOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-sm font-semibold text-gray-800"
                  >
                    {role}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${roleOpen ? "rotate-180" : ""}`} />
                  </button>
                  {roleOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl shadow-indigo-100">
                      {ROLES.map(r => (
                        <button key={r} onClick={() => { setRole(r); setRoleOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-50 transition-colors ${r === role ? "text-indigo-700 bg-indigo-50/50 font-bold" : "text-gray-700"}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Difficulty */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Difficulty</label>
                  <div className="relative">
                    <button
                      onClick={() => { setDiffOpen(!diffOpen); setRoleOpen(false); setCountOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-indigo-300 transition-all text-sm font-semibold"
                    >
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${diffColor[difficulty as keyof typeof diffColor]}`}>
                        {difficulty}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${diffOpen ? "rotate-180" : ""}`} />
                    </button>
                    {diffOpen && (
                      <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl">
                        {DIFFICULTIES.map(d => (
                          <button key={d} onClick={() => { setDifficulty(d); setDiffOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-50 transition-colors text-gray-700">
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Count */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Questions</label>
                  <div className="relative">
                    <button
                      onClick={() => { setCountOpen(!countOpen); setDiffOpen(false); setRoleOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-indigo-300 transition-all text-sm font-semibold text-gray-800"
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {count} questions
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${countOpen ? "rotate-180" : ""}`} />
                    </button>
                    {countOpen && (
                      <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-xl">
                        {COUNTS.map(c => (
                          <button key={c} onClick={() => { setCount(c); setCountOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-indigo-50 transition-colors text-gray-700">
                            {c} questions
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-black text-base text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                Start Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Voice input supported — type or speak your answers
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-5 flex flex-col gap-4">
            {/* JD Prep */}
            <div className="bg-white rounded-3xl shadow-lg shadow-purple-100/60 border border-purple-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-200">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">Job Description Prep</h3>
                  <p className="text-xs text-gray-400">5 tailored questions, instantly</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl border-2 border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-1.5">
                Paste a Job Description <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-3xl shadow-lg shadow-indigo-100/60 border border-indigo-100 p-5 flex-1">
              <h3 className="font-black text-sm text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-2">
                {recentSessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 cursor-pointer group transition-colors">
                    <div>
                      <div className="text-xs font-bold text-gray-800">{s.role}</div>
                      <div className="text-[10px] text-gray-400">{s.date} · {s.diff}</div>
                    </div>
                    <div className={`text-base font-black ${s.score >= 8.5 ? "text-emerald-500" : s.score >= 7 ? "text-amber-500" : "text-rose-500"}`}>
                      {s.score}<span className="text-gray-300 font-normal text-xs">/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
