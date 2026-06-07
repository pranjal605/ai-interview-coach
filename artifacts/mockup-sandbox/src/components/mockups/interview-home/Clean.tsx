import { useState } from "react";
import { ChevronDown, Mic, ArrowRight, Clock, BarChart2, FileText, ChevronRight, Check } from "lucide-react";

const ROLES = ["Software Engineer", "Product Manager", "Data Scientist", "Frontend Developer", "Backend Developer", "Data Analyst"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COUNTS = ["3", "5", "10"];

const recentSessions = [
  { role: "Software Engineer", date: "Jun 5, 2026", score: 8.4, diff: "Hard" },
  { role: "Product Manager", date: "Jun 3, 2026", score: 7.1, diff: "Medium" },
  { role: "Data Scientist", date: "Jun 1, 2026", score: 9.2, diff: "Hard" },
];

const diffMeta = {
  Easy:   { dot: "bg-teal-400",  text: "text-teal-700",  bg: "bg-teal-50"  },
  Medium: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  Hard:   { dot: "bg-red-400",   text: "text-red-700",   bg: "bg-red-50"   },
};

export function Clean() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5");
  const [roleOpen, setRoleOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [countOpen, setCountOpen] = useState(false);
  const close = () => { setRoleOpen(false); setDiffOpen(false); setCountOpen(false); };
  const dm = diffMeta[difficulty as keyof typeof diffMeta];

  return (
    <div className="min-h-screen bg-[#fafaf8] font-['Inter'] text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">CoachAI</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-700">BETA</span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <button className="text-gray-500 hover:text-gray-900 transition-colors font-medium">JD Prep</button>
          <button className="text-gray-500 hover:text-gray-900 transition-colors font-medium">History</button>
          <button className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-colors text-sm">
            New Session
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-10 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">AI Interview Coach</p>
          <h1 className="text-4xl font-bold text-gray-900 leading-snug mb-3">
            Practice. Improve.<br />
            <span className="text-teal-600">Get the job.</span>
          </h1>
          <p className="text-gray-500 max-w-lg">
            Role-specific AI questions, voice or text answers, and instant structured feedback — every session.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Start Card */}
          <div className="col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5">Configure your session</h2>

              {/* Role */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Target Role</label>
                <div className="relative">
                  <button
                    onClick={() => { close(); setRoleOpen(!roleOpen); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-teal-400 focus:border-teal-500 transition-colors text-sm font-medium text-gray-800"
                  >
                    {role}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${roleOpen ? "rotate-180" : ""}`} />
                  </button>
                  {roleOpen && (
                    <div className="absolute top-full mt-1.5 left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                      {ROLES.map(r => (
                        <button key={r} onClick={() => { setRole(r); setRoleOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors flex items-center justify-between">
                          <span className={r === role ? "text-teal-700 font-semibold" : "text-gray-700"}>{r}</span>
                          {r === role && <Check className="w-4 h-4 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Difficulty */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Difficulty</label>
                  <div className="relative">
                    <button
                      onClick={() => { close(); setDiffOpen(!diffOpen); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 hover:border-teal-400 bg-white transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${dm.dot}`} />
                        <span className={`text-sm font-semibold ${dm.text}`}>{difficulty}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${diffOpen ? "rotate-180" : ""}`} />
                    </button>
                    {diffOpen && (
                      <div className="absolute top-full mt-1.5 left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        {DIFFICULTIES.map(d => {
                          const m = diffMeta[d as keyof typeof diffMeta];
                          return (
                            <button key={d} onClick={() => { setDifficulty(d); setDiffOpen(false); }}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${m.dot}`} />
                                <span className="text-gray-700">{d}</span>
                              </div>
                              {d === difficulty && <Check className="w-4 h-4 text-teal-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Count */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Questions</label>
                  <div className="relative">
                    <button
                      onClick={() => { close(); setCountOpen(!countOpen); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 hover:border-teal-400 bg-white transition-colors text-sm font-medium text-gray-800"
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {count} questions
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${countOpen ? "rotate-180" : ""}`} />
                    </button>
                    {countOpen && (
                      <div className="absolute top-full mt-1.5 left-0 right-0 z-20 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        {COUNTS.map(c => (
                          <button key={c} onClick={() => { setCount(c); setCountOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors flex items-center justify-between">
                            <span className="text-gray-700">{c} questions</span>
                            {c === count && <Check className="w-4 h-4 text-teal-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mb-6" />

              {/* Summary */}
              <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-teal-50 border border-teal-100">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <BarChart2 className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs text-teal-700">
                  <span className="font-semibold">{count} {difficulty.toLowerCase()}-level</span> questions for <span className="font-semibold">{role}</span>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 group">
                Start Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                <Mic className="w-3 h-3" />
                Type or speak your answers — voice input included
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-5 flex flex-col gap-5">
            {/* JD Prep */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Job Description Prep</h3>
                  <p className="text-xs text-gray-400">5 tailored questions in seconds</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-lg border border-gray-200 hover:border-teal-400 hover:bg-teal-50 text-gray-700 hover:text-teal-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                Paste Job Description <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex-1">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-1">
                {recentSessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{s.role}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{s.date}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${diffMeta[s.diff as keyof typeof diffMeta].bg} ${diffMeta[s.diff as keyof typeof diffMeta].text}`}>{s.diff}</span>
                      <span className={`text-sm font-bold ${s.score >= 8.5 ? "text-teal-600" : s.score >= 7 ? "text-amber-600" : "text-red-600"}`}>{s.score}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
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
