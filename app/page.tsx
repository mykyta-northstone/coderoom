"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { trackEvent } from "@/lib/analytics";
import { PlusCircle, BookOpen, Zap, ShieldCheck, Users, Code } from "lucide-react";

export default function LandingPage() {
  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant JS & TS Interview Rooms</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Free live coding interviews for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              JavaScript & TypeScript
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Create a coding room, share the link, and interview candidates in real time. No candidate account required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/interview/new"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create interview</span>
            </Link>

            <Link
              href="/problems"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all"
            >
              <BookOpen className="w-5 h-5 text-slate-400" />
              <span>Browse problems</span>
            </Link>
          </div>

          {/* Quick value proposition badges */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="p-5 rounded-xl glass-panel border border-slate-800">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <h2 className="text-sm font-semibold text-white">No Account Needed</h2>
              <p className="text-xs text-slate-400 mt-1">Candidates join instantly with just a name. Zero sign-up friction.</p>
            </div>
            <div className="p-5 rounded-xl glass-panel border border-slate-800">
              <Code className="w-6 h-6 text-indigo-400 mb-2" />
              <h2 className="text-sm font-semibold text-white">Real-Time Monaco Sync</h2>
              <p className="text-xs text-slate-400 mt-1">Powered by Yjs CRDTs. Synchronized typing and live remote cursors.</p>
            </div>
            <div className="p-5 rounded-xl glass-panel border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
              <h2 className="text-sm font-semibold text-white">Minimal & Secure</h2>
              <p className="text-xs text-slate-400 mt-1">Unpredictable random room IDs. Automatic 24-hour room expiration.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        CodeRoom — Minimal Live Coding Interview Platform
      </footer>
    </div>
  );
}
