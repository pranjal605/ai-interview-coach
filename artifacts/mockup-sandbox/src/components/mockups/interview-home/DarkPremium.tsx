import { useState } from "react";
import { ChevronDown, Mic, BarChart3, Zap, ArrowRight, Clock, Target, TrendingUp, CheckCircle2, Briefcase } from "lucide-react";

const ROLES = ["Software Engineer", "Product Manager", "Data Scientist", "Frontend Developer", "Backend Developer", "Data Analyst"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COUNTS = ["3", "5", "10"];

const recentSessions = [
  { role: "Software Engineer", date: "Jun 5, 2026", score: 8.4, diff: "Hard" },
  { role: "Product Manager", date: "Jun 3, 2026", score: 7.1, diff: "Medium" },
  { role: "Data Scientist", date: "Jun 1, 2026", score: 9.2, diff: "Hard" },
];

const stats = [
  { label: "Sessions", value: "24", icon: Target },
  { label: "Avg Score", value: "8.1", icon: TrendingUp },
  { label: "Questions", value: "97", icon: CheckCircle2 },
];

export function DarkPremium() {
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5");
  const [roleOpen, setRoleOpen] = useState(false);
  const [diffOpen, setDiffOpen] = useState(false);
  const [countOpen, setCountOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-['Inter'] overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">CoachAI</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30 ml-1">BETA</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/40">
          <button className="hover:text-white/80 transition-colors">JD Prep</button>
          <button className="hover:text-white/80 transition-colors">History</button>
          <button className="px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">New Session</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Interview Training
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white leading-tight mb-4">
            Land the role.<br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Master every question.
            </span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Precision AI feedback. Real interview questions. No fluff — just results.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left — Start Card */}
          <div className="col-span-7">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Start Interview</h2>
                <div className="flex gap-1">
                  {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/50">
                      <Icon className="w-3 h-3" />
                      <span className="font-semibold text-white/80">{value}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Select */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Target Role</label>
                <div className="relative">
                  <button
                    onClick={() => { setRoleOpen(!roleOpen); setDiffOpen(false); setCountOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all text-sm font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-violet-400" />
                      {role}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${roleOpen ? "rotate-180" : ""}`} />
                  </button>
                  {roleOpen && (
                    <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[#13131f] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                      {ROLES.map(r => (
                        <button key={r} onClick={() => { setRole(r); setRoleOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-violet-500/10 transition-colors ${r === role ? "text-violet-400" : "text-white/70"}`}>
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
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Difficulty</label>
                  <div className="relative">
                    <button
                      onClick={() => { setDiffOpen(!diffOpen); setRoleOpen(false); setCountOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 transition-all text-sm font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${difficulty === "Easy" ? "bg-emerald-400" : difficulty === "Medium" ? "bg-amber-400" : "bg-rose-400"}`} />
                        {difficulty}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${diffOpen ? "rotate-180" : ""}`} />
                    </button>
                    {diffOpen && (
                      <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[#13131f] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {DIFFICULTIES.map(d => (
                          <button key={d} onClick={() => { setDifficulty(d); setDiffOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-violet-500/10 transition-colors ${d === difficulty ? "text-violet-400" : "text-white/70"}`}>
                            {d}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Count */}
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Questions</label>
                  <div className="relative">
                    <button
                      onClick={() => { setCountOpen(!countOpen); setDiffOpen(false); setRoleOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 transition-all text-sm font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-violet-400" />
                        {count} questions
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${countOpen ? "rotate-180" : ""}`} />
                    </button>
                    {countOpen && (
                      <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-[#13131f] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {COUNTS.map(c => (
                          <button key={c} onClick={() => { setCount(c); setCountOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-violet-500/10 transition-colors ${c === count ? "text-violet-400" : "text-white/70"}`}>
                            {c} questions
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-base transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 group">
                Begin Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Voice hint */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/25">
                <Mic className="w-3.5 h-3.5" />
                Answer by typing or speaking — voice input supported
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-5 flex flex-col gap-6">
            {/* JD Prep */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white mb-1">Job Description Prep</h3>
                  <p className="text-xs text-white/40 leading-relaxed">Paste any JD — AI generates 5 tailored questions just for that role.</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                </div>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-violet-500/30 text-violet-400 text-xs font-semibold hover:bg-violet-500/10 transition-colors">
                Paste Job Description <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Sessions */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex-1">
              <h3 className="font-bold text-sm text-white mb-4">Recent Sessions</h3>
              <div className="space-y-2">
                {recentSessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer group">
                    <div>
                      <div className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">{s.role}</div>
                      <div className="text-[10px] text-white/30 mt-0.5">{s.date} · {s.diff}</div>
                    </div>
                    <div className={`text-sm font-black ${s.score >= 8.5 ? "text-emerald-400" : s.score >= 7 ? "text-amber-400" : "text-rose-400"}`}>
                      {s.score}
                      <span className="text-white/30 font-normal text-xs">/10</span>
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
