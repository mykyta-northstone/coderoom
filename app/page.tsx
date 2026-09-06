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
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#f4f4f4]">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 text-center relative overflow-hidden">
        {/* Noir Lime background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#cef565]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#cef565]/10 border border-[#cef565]/20 text-xs font-bold text-[#cef565]">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant JS & TS Interview Rooms</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Free live coding interviews for{" "}
            <span className="bg-gradient-to-r from-[#cef565] via-lime-200 to-[#7c5cfc] bg-clip-text text-transparent">
              JavaScript & TypeScript
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#c4c4c4] max-w-2xl mx-auto font-normal leading-relaxed">
            Create a coding room, share the link, and interview candidates in real time. No candidate account required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/interview/new"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-sm font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-xl shadow-[#cef565]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create interview</span>
            </Link>

            <Link
              href="/problems"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-sm font-semibold text-[#c4c4c4] hover:text-white bg-[#1e1e1e] hover:bg-[#252525] border border-[#2e2e2e] rounded-full transition-all"
            >
              <BookOpen className="w-5 h-5 text-[#9d9d9d]" />
              <span>Browse problems</span>
            </Link>
          </div>

          {/* Noir Lime value proposition cards */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="p-6 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e]">
              <div className="w-10 h-10 rounded-xl bg-[#cef565]/10 border border-[#cef565]/20 flex items-center justify-center text-[#cef565] mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-white">No Account Needed</h2>
              <p className="text-xs text-[#9d9d9d] mt-1.5 leading-relaxed">
                Candidates join instantly with just a name. Zero sign-up friction.
              </p>
            </div>

            <div className="p-6 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e]">
              <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 flex items-center justify-center text-[#7c5cfc] mb-3">
                <Code className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-white">Real-Time Monaco Sync</h2>
              <p className="text-xs text-[#9d9d9d] mt-1.5 leading-relaxed">
                Powered by Yjs CRDTs. Synchronized typing and live remote cursors.
              </p>
            </div>

            <div className="p-6 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-white">Minimal & Secure</h2>
              <p className="text-xs text-[#9d9d9d] mt-1.5 leading-relaxed">
                Unpredictable random room IDs. Automatic 24-hour room expiration.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-[#2e2e2e] text-center text-xs text-[#6a6a6a]">
        CodeRoom — Minimal Live Coding Interview Platform
      </footer>
    </div>
  );
}
