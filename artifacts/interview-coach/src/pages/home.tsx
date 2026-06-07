import React from "react";
import { useLocation, Link } from "wouter";
import { useSession } from "@/context/session-context";
import { useStartSession, useGenerateQuestion, useListSessions, getListSessionsQueryKey } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, BookOpen, Zap, Mic, Star, Clock, ChevronRight, Flame } from "lucide-react";
import { format } from "date-fns";

const ROLES = ["Software Engineer", "Data Analyst", "Product Manager", "Frontend Developer", "Backend Developer", "Data Scientist"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COUNTS = ["3", "5", "10"];

const FEATURES = [
  { icon: Zap, label: "AI Evaluation", desc: "Score + feedback instantly" },
  { icon: Mic, label: "Voice Input", desc: "Speak your answers freely" },
  { icon: Star, label: "Smart Questions", desc: "Role-tailored every time" },
];

const DIFF_COLORS: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border border-amber-200",
  Hard: "bg-rose-100 text-rose-700 border border-rose-200",
};

function scoreColor(score: number) {
  if (score >= 8.5) return "text-emerald-600";
  if (score >= 7) return "text-amber-600";
  return "text-rose-600";
}

export default function HomeScreen() {
  const [, setLocation] = useLocation();
  const { role, difficulty, totalQuestions, setRole, setDifficulty, setTotalQuestions, setSessionId, setCurrentQuestion, setPhase, setQuestionIndex, resetSession } = useSession();
  const { toast } = useToast();

  const startSession = useStartSession();
  const generateQuestion = useGenerateQuestion();
  const { data: recentSessions, isLoading: isLoadingSessions } = useListSessions({ query: { queryKey: getListSessionsQueryKey() } });

  const handleStart = async () => {
    try {
      resetSession();
      setPhase("loading");
      setRole(role);
      setDifficulty(difficulty);
      setTotalQuestions(totalQuestions);

      const session = await startSession.mutateAsync({ data: { role, difficulty, totalQuestions } });
      setSessionId(session.id);

      const question = await generateQuestion.mutateAsync({ data: { role, difficulty } });
      setCurrentQuestion(question);
      setQuestionIndex(0);
      setPhase("question");
      setLocation("/interview");
    } catch (error: unknown) {
      setPhase("home");
      let description = "Something went wrong. Please try again.";
      if (error && typeof error === "object" && "response" in error) {
        const res = (error as { response?: { status?: number; data?: { message?: string } } }).response;
        if (res?.status === 429) {
          description = res.data?.message ?? "AI rate limit reached — please wait a moment and try again.";
        }
      }
      toast({ title: "Couldn't start session", description, variant: "destructive" });
    }
  };

  const isStarting = startSession.isPending || generateQuestion.isPending;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 overflow-hidden shadow-xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-32 translate-x-20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-purple-400/30 translate-y-16 blur-xl pointer-events-none" />
        <div className="relative">
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
          <div className="flex flex-wrap gap-3 mt-6">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
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
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Quick Start Card */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/80 border border-indigo-100/50 p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-lg font-black text-gray-900">Quick Start</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Target Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-300 focus:border-indigo-400 focus:ring-0 h-11 font-semibold text-gray-800">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-indigo-100 shadow-xl shadow-indigo-100">
                    {ROLES.map(r => <SelectItem key={r} value={r} className="font-medium">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-300 focus:border-indigo-400 focus:ring-0 h-11 font-semibold">
                      <SelectValue placeholder="Difficulty">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFF_COLORS[difficulty] ?? ""}`}>{difficulty}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2 border-indigo-100 shadow-xl shadow-indigo-100">
                      {DIFFICULTIES.map(d => (
                        <SelectItem key={d} value={d} className="font-medium">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFF_COLORS[d]}`}>{d}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Questions</Label>
                  <Select value={totalQuestions.toString()} onValueChange={(v) => setTotalQuestions(parseInt(v))}>
                    <SelectTrigger className="rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-300 focus:border-indigo-400 focus:ring-0 h-11 font-semibold text-gray-800">
                      <SelectValue placeholder="Count" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2 border-indigo-100 shadow-xl shadow-indigo-100">
                      {COUNTS.map(c => <SelectItem key={c} value={c} className="font-medium">{c} questions</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed font-black text-base text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                {isStarting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Starting session...</>
                ) : (
                  <><span>Start Session</span><ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Voice input supported — type or speak your answers
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-5 flex flex-col gap-5">
          {/* JD Prep */}
          <div className="bg-white rounded-3xl shadow-lg shadow-purple-100/60 border border-purple-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm text-gray-900">Job Description Prep</h3>
                <p className="text-xs text-gray-400">5 tailored questions, instantly</p>
              </div>
            </div>
            <button
              onClick={() => setLocation("/jd")}
              className="w-full py-2.5 rounded-xl border-2 border-purple-200 text-purple-700 text-sm font-bold hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-1.5 group"
            >
              Paste a Job Description
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-3xl shadow-lg shadow-indigo-100/60 border border-indigo-100 p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm text-gray-900">Recent Sessions</h3>
              <Clock className="w-4 h-4 text-gray-300" />
            </div>
            {isLoadingSessions ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
              </div>
            ) : recentSessions && recentSessions.length > 0 ? (
              <div className="space-y-1">
                {recentSessions.slice(0, 4).map(session => {
                  const avg = session.scores && session.scores.length > 0
                    ? session.scores.reduce((a, b) => a + b, 0) / session.scores.length
                    : null;
                  return (
                    <Link key={session.id} href={`/sessions/${session.id}`}
                      className="flex items-center justify-between py-2.5 px-2 rounded-2xl hover:bg-indigo-50 cursor-pointer group transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-gray-800 truncate group-hover:text-indigo-900 transition-colors">{session.role}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{format(new Date(session.createdAt), 'MMM d, yyyy')} · {session.difficulty}</div>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        {avg !== null ? (
                          <span className={`text-sm font-black ${scoreColor(avg)}`}>
                            {avg.toFixed(1)}<span className="text-gray-300 font-normal text-[10px]">/10</span>
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-center text-gray-400 py-6">
                No sessions yet. Start your first interview above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
