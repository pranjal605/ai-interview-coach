import React from "react";
import { Link, useLocation } from "wouter";
import { Sparkles } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-foreground flex flex-col font-sans">
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md border-b border-indigo-100/80">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xl text-indigo-900 tracking-tight">CoachAI</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-600 ml-0.5">BETA</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/jd" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            JD Prep
          </Link>
          {!isHome && (
            <Link href="/" className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-200/50 transition-all hover:shadow-indigo-300/60">
              New Session
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-6 max-w-5xl py-8">
        {children}
      </main>
    </div>
  );
}
