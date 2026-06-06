import React from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
            CoachAI
            <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold">Beta</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/jd" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              JD Prep
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              New Session
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 max-w-4xl py-8">
        {children}
      </main>
    </div>
  );
}
