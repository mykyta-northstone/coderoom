"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { trackEvent } from "@/lib/analytics";
import { PROBLEMS } from "@/data/problems";
import {
  PlusCircle,
  BookOpen,
  Zap,
  ShieldCheck,
  Users,
  Code,
  ArrowRight,
  Check,
  X,
  Play,
  Terminal,
  Sparkles,
  Clock,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  const featuredProblems = [
    ...PROBLEMS.filter((p) => p.type !== "code_review").slice(0, 4),
    ...PROBLEMS.filter((p) => p.type === "code_review").slice(0, 2),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#f4f4f4] font-sans selection:bg-[#cef565] selection:text-[#131313]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#cef565]/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-[#7c5cfc]/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#cef565]/10 border border-[#cef565]/25 text-xs font-bold text-[#cef565]">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>5-Second Room Setup • No Candidate Sign-Up</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
              The fastest live coding interviews for{" "}
              <span className="bg-gradient-to-r from-[#cef565] via-lime-200 to-[#7c5cfc] bg-clip-text text-transparent">
                JavaScript & TypeScript
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#c4c4c4] max-w-2xl mx-auto font-normal leading-relaxed">
              Stop making candidates create accounts or struggle with bloated platforms.
              Pick a problem, share the link, and code live together in real time.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/interview/new"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-9 py-4 text-sm font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-2xl shadow-[#cef565]/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Free Interview</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/problems"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-sm font-semibold text-[#c4c4c4] hover:text-white bg-[#1e1e1e] hover:bg-[#252525] border border-[#2e2e2e] rounded-full transition-all"
              >
                <BookOpen className="w-5 h-5 text-[#9d9d9d]" />
                <span>Explore {PROBLEMS.length}+ Problems</span>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#9d9d9d] font-medium">
              <span className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#cef565]" />
                <span>No Candidate Account</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#cef565]" />
                <span>Real-Time Code Sync</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#cef565]" />
                <span>Code Review Tasks & Interviewer Guides</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#cef565]" />
                <span>100% Free Forever</span>
              </span>
            </div>
          </div>

          {/* INTERACTIVE PRODUCT PREVIEW CARD */}
          <div className="mt-14 max-w-5xl mx-auto rounded-[28px] bg-[#1a1a1a] border border-[#2e2e2e] shadow-2xl overflow-hidden relative text-left">
            {/* Window Topbar */}
            <div className="h-11 px-4 bg-[#141414] border-b border-[#2e2e2e] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#f2796b]" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-[#cef565]" />
                <span className="ml-3 text-xs font-mono font-semibold text-[#9d9d9d]">
                  pairlet.dev/interview/a9jxXSUK5
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-[#cef565]/10 text-[#cef565] border border-[#cef565]/20 font-bold">
                  TypeScript
                </span>
                <span className="flex items-center space-x-1 text-[#cef565]">
                  <span className="w-2 h-2 rounded-full bg-[#cef565] animate-pulse" />
                  <span>Connected</span>
                </span>
              </div>
            </div>

            {/* Split Screen Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] bg-[#141414]">
              {/* Problem Left Panel (4 cols) */}
              <div className="md:col-span-4 p-5 border-r border-[#2e2e2e] bg-[#181818] space-y-4 text-xs text-[#c4c4c4]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#9d9d9d] uppercase">
                    Strings / Data Structures
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#cef565]/10 text-[#cef565] border border-[#cef565]/20">
                    Easy
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">Valid Parentheses</h3>
                <p className="text-xs text-[#9d9d9d] leading-relaxed">
                  Given a string <code className="text-[#cef565] bg-[#222] px-1 rounded">s</code> containing bracket characters, determine if the string is valid in correct order.
                </p>

                {/* Active Participants Badge */}
                <div className="pt-4 border-t border-[#2e2e2e] space-y-2">
                  <span className="text-[10px] font-bold text-[#9d9d9d] uppercase tracking-wider">
                    Live Participants (2)
                  </span>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#141414] border border-[#2e2e2e]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                      <span className="font-bold text-white text-xs">Nick (Interviewer)</span>
                    </div>
                    <span className="text-[10px] text-[#cef565] font-mono">Typing...</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#141414] border border-[#2e2e2e]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#cef565]" />
                      <span className="font-bold text-white text-xs">Alex (Candidate)</span>
                    </div>
                    <span className="text-[10px] text-[#9d9d9d] font-mono">Viewing</span>
                  </div>
                </div>
              </div>

              {/* Monaco Code Right Panel (8 cols) */}
              <div className="md:col-span-8 flex flex-col bg-[#121212]">
                <div className="flex-1 p-5 font-mono text-xs text-[#d2d2d2] space-y-2 relative leading-relaxed overflow-hidden">
                  <div>
                    <span className="text-[#a894ff]">function</span>{" "}
                    <span className="text-white font-bold">isValid</span>(
                    <span className="text-[#cef565]">s</span>:{" "}
                    <span className="text-[#f0c060]">string</span>):{" "}
                    <span className="text-[#f0c060]">boolean</span> {"{"}
                  </div>
                  <div className="pl-4 text-[#5f5f5f]">
                    // Stack-based bracket matcher implementation
                  </div>
                  <div className="pl-4">
                    <span className="text-[#a894ff]">const</span> stack:{" "}
                    <span className="text-[#f0c060]">string[]</span> = [];
                  </div>
                  <div className="pl-4">
                    <span className="text-[#a894ff]">const</span> map = &#123; &apos;)&apos;: &apos;(&apos;, &apos;&#125;&apos;: &apos;&#123;&apos;, &apos;]&apos;: &apos;[&apos; &#125;;
                  </div>
                  <div className="pl-4 flex items-center space-x-1">
                    <span className="text-[#a894ff]">for</span> (
                    <span className="text-[#a894ff]">const</span> char of s) {"{"}
                    {/* Simulated Remote Cursor */}
                    <span className="inline-block w-0.5 h-4 bg-[#cef565] animate-pulse relative ml-1">
                      <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-[#cef565] text-[#131313] text-[9px] font-bold whitespace-nowrap shadow">
                        Nick
                      </span>
                    </span>
                  </div>
                  <div className="pl-8">
                    <span className="text-[#a894ff]">if</span> (map[char]) {"{"}
                  </div>
                  <div className="pl-12 text-[#cef565]">
                    if (stack.pop() !== map[char]) return false;
                  </div>
                  <div className="pl-8">{"}"} else stack.push(char);</div>
                  <div className="pl-4">{"}"}</div>
                  <div className="pl-4">
                    <span className="text-[#a894ff]">return</span> stack.length === 0;
                  </div>
                  <div>{"}"}</div>
                  <div className="pt-2 text-[#cef565]">
                    console.log(isValid(&quot;()[]{}&quot;)); <span className="text-[#5f5f5f]">// true</span>
                  </div>
                </div>

                {/* Console Output Footer Bar */}
                <div className="h-20 bg-[#141414] border-t border-[#2e2e2e] p-3 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#9d9d9d] pb-1 border-b border-[#2e2e2e]/50">
                    <span className="flex items-center space-x-1.5 font-bold text-white">
                      <Terminal className="w-3.5 h-3.5 text-[#cef565]" />
                      <span>Console Output</span>
                    </span>
                    <span className="text-[#cef565] font-semibold flex items-center space-x-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span>Completed (1.4ms)</span>
                    </span>
                  </div>
                  <div className="text-[#cef565] pt-1 font-bold">
                    =&gt; true
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY PAIRLET? COMPARISON SECTION */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
          <div className="max-w-3xl mx-auto space-y-3 mb-16">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#cef565]/10 border border-[#cef565]/25 text-xs font-bold text-[#cef565] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Why Interviewers Switch to Pairlet</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ditch candidate accounts & $250/mo subscriptions
            </h2>
            <p className="text-sm text-[#9d9d9d] max-w-xl mx-auto">
              Traditional coding tools force candidates through frustrating signups and charge bloated fees. Pairlet is fast, free, and zero-friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-stretch">
            {/* Bloated Platforms */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-[#161616] border border-[#f2796b]/20 space-y-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#2e2e2e]">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#f2796b] uppercase tracking-wider">
                      Legacy Approach
                    </span>
                    <h3 className="text-xl font-bold text-[#f2796b]">
                      Traditional Tools (CoderPad, HackerRank)
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#f2796b]/10 border border-[#f2796b]/20 flex items-center justify-center text-[#f2796b] shrink-0">
                    <X className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-[20px] bg-[#121212] border border-[#262626] flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#f2796b]/10 text-[#f2796b] flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">Mandatory Sign-Up Friction</div>
                      <div className="text-[11px] text-[#8e8e8e] leading-relaxed">
                        Candidates must register, verify email, and log in before starting the interview.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#121212] border border-[#262626] flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#f2796b]/10 text-[#f2796b] flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">$250 - $500/mo Subscription Fees</div>
                      <div className="text-[11px] text-[#8e8e8e] leading-relaxed">
                        Expensive per-interviewer seat licenses with annual lock-in contracts.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#121212] border border-[#262626] flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#f2796b]/10 text-[#f2796b] flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">Slow Enterprise Room Setup</div>
                      <div className="text-[11px] text-[#8e8e8e] leading-relaxed">
                        Requires navigating admin dashboards, invitation forms, and scheduling queues.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#121212] border border-[#262626] flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#f2796b]/10 text-[#f2796b] flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">Cluttered & Heavy Interface</div>
                      <div className="text-[11px] text-[#8e8e8e] leading-relaxed">
                        Overloaded with video popups, ads, and unnecessary administrative options.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pairlet Advantage */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-gradient-to-b from-[#1f2617] via-[#1a1e16] to-[#161616] border border-[#cef565]/50 space-y-6 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-[#cef565]/10">
              {/* Glowing Pill Tag */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#cef565] text-[#131313] text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                Recommended
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#cef565]/20">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#cef565] uppercase tracking-wider">
                      Modern Standard
                    </span>
                    <h3 className="text-xl font-extrabold text-white">
                      Pair<span className="text-[#cef565]">let</span>
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#cef565] text-[#131313] flex items-center justify-center shrink-0 shadow-lg shadow-[#cef565]/20">
                    <Check className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-[20px] bg-[#141810] border border-[#cef565]/30 flex items-start space-x-3 transition-all hover:border-[#cef565]/60">
                    <div className="w-6 h-6 rounded-full bg-[#cef565]/20 text-[#cef565] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5 flex items-center space-x-2">
                        <span>Zero Candidate Friction</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#cef565]/15 text-[#cef565] text-[10px] font-mono">1 Second Join</span>
                      </div>
                      <div className="text-[11px] text-[#b8c29e] leading-relaxed">
                        Just send the room URL. Candidates type their name and start coding instantly.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#141810] border border-[#cef565]/30 flex items-start space-x-3 transition-all hover:border-[#cef565]/60">
                    <div className="w-6 h-6 rounded-full bg-[#cef565]/20 text-[#cef565] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5 flex items-center space-x-2">
                        <span>100% Free Forever</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#cef565]/15 text-[#cef565] text-[10px] font-mono">$0 / mo</span>
                      </div>
                      <div className="text-[11px] text-[#b8c29e] leading-relaxed">
                        No credit card, no subscription traps, no candidate volume limits.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#141810] border border-[#cef565]/30 flex items-start space-x-3 transition-all hover:border-[#cef565]/60">
                    <div className="w-6 h-6 rounded-full bg-[#cef565]/20 text-[#cef565] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5 flex items-center space-x-2">
                        <span>5-Second Instant Room Setup</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#cef565]/15 text-[#cef565] text-[10px] font-mono">1 Click</span>
                      </div>
                      <div className="text-[11px] text-[#b8c29e] leading-relaxed">
                        Pick a pre-made JS/TS question from library or type a custom task prompt.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[20px] bg-[#141810] border border-[#cef565]/30 flex items-start space-x-3 transition-all hover:border-[#cef565]/60">
                    <div className="w-6 h-6 rounded-full bg-[#cef565]/20 text-[#cef565] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5 flex items-center space-x-2">
                        <span>Real-Time Code Sync & Execution</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#cef565]/15 text-[#cef565] text-[10px] font-mono">Monaco IDE</span>
                      </div>
                      <div className="text-[11px] text-[#b8c29e] leading-relaxed">
                        Collaborative live editor with remote cursors and shared console output.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-STEP WORKFLOW SECTION */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#cef565] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Host a live interview in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-7 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#cef565] text-[#131313] font-extrabold text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Select or Type Task</h3>
              <p className="text-xs text-[#9d9d9d] leading-relaxed">
                Choose from {PROBLEMS.length}+ curated JS/TS coding challenges &amp; realistic Code Review tasks (N+1 queries, Race conditions) or type your custom problem prompt.
              </p>
            </div>

            <div className="p-7 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#cef565] text-[#131313] font-extrabold text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Share 1-Click Link</h3>
              <p className="text-xs text-[#9d9d9d] leading-relaxed">
                Copy the generated room link and send it to your candidate via Slack, Email, or Google Meet. No candidate login needed.
              </p>
            </div>

            <div className="p-7 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#cef565] text-[#131313] font-extrabold text-base flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Code & Run Live</h3>
              <p className="text-xs text-[#9d9d9d] leading-relaxed">
                Collaboratively edit code with live cursors in Monaco Editor. Execute code in-browser and view shared output in real time.
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR PROBLEMS QUICK LAUNCH */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#cef565] uppercase tracking-wider">
                Popular Interview Questions
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Start an interview in 1 click
              </h2>
            </div>
            <Link
              href="/problems"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#cef565] hover:underline"
            >
              <span>View All {PROBLEMS.length}+ Problems</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProblems.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-[24px] bg-[#1e1e1e] border border-[#2e2e2e] flex flex-col justify-between space-y-4 hover:border-[#cef565]/40 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#9d9d9d]">{p.category}</span>
                    {p.type === "code_review" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7c5cfc]/20 text-[#a894ff] border border-[#7c5cfc]/30">
                        Code Review
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#cef565]/10 text-[#cef565] border border-[#cef565]/20 uppercase">
                        {p.difficulty}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#cef565] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#9d9d9d] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <Link
                  href={`/interview/new?problemId=${p.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Launch Interview Room</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="p-10 sm:p-14 rounded-[32px] bg-gradient-to-br from-[#1e1e1e] via-[#1a1a1a] to-[#141414] border border-[#cef565]/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#cef565]/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#cef565]/10 text-xs font-bold text-[#cef565] border border-[#cef565]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready in 5 seconds</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready for your next live coding interview?
            </h2>

            <p className="text-sm text-[#c4c4c4] max-w-xl mx-auto">
              Create a JS/TS coding room now. No sign-up required for you or your candidate.
            </p>

            <Link
              href="/interview/new"
              className="inline-flex items-center space-x-2.5 px-10 py-4 text-sm font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-2xl shadow-[#cef565]/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Create Free Interview Room</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t border-[#2e2e2e] bg-[#0f0f0f] text-xs text-[#9d9d9d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222] pb-6">
            <div className="space-y-1">
              <span className="text-sm font-extrabold text-white">
                Pair<span className="text-[#cef565]">let</span>.dev
              </span>
              <p className="text-xs text-[#6a6a6a]">
                Minimal Free Live Coding Interview Platform for JS & TS
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <Link href="/problems" className="hover:text-[#cef565] transition-colors">Problems</Link>
              <Link href="/blog" className="hover:text-[#cef565] transition-colors">Blog</Link>
              <Link href="/blog/javascript" className="hover:text-[#cef565] transition-colors">JavaScript</Link>
              <Link href="/blog/typescript" className="hover:text-[#cef565] transition-colors">TypeScript</Link>
              <Link href="/blog/coding-interviews" className="hover:text-[#cef565] transition-colors">Coding Interviews</Link>
              <Link href="/blog/technical-interviews" className="hover:text-[#cef565] transition-colors">Technical Interviews</Link>
              <Link href="/blog/code-review" className="hover:text-[#cef565] transition-colors">Code Review</Link>
            </div>
          </div>
          <div className="text-center text-[11px] text-[#6a6a6a]">
            © {new Date().getFullYear()} pairlet.dev — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
