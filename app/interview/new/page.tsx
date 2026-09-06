"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PROBLEMS, Language } from "@/data/problems";
import { trackEvent } from "@/lib/analytics";
import { PlusCircle, Code, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

function CreateInterviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProblemId = searchParams.get("problemId") || PROBLEMS[0].id;

  const [language, setLanguage] = useState<Language>("typescript");
  const [problemId, setProblemId] = useState<string>(initialProblemId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProblem = PROBLEMS.find((p) => p.id === problemId) || PROBLEMS[0];

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, language }),
      });

      if (!res.ok) {
        throw new Error("Failed to create room");
      }

      const data = await res.json();
      const roomId = data.room.id;
      const interviewerToken = data.interviewerToken;

      // Save token in sessionStorage to identify as interviewer
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`coderoom_interviewer_${roomId}`, interviewerToken);
      }

      trackEvent("create_interview", { roomId, problemId, language });
      router.push(`/interview/${roomId}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong while creating the interview room.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create a Live Interview Room
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your JS/TS interview session. No account needed.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Language Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-200">
          1. Select Primary Language
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setLanguage("typescript")}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              language === "typescript"
                ? "bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                TS
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">TypeScript</div>
                <div className="text-xs text-slate-400">Strict typing & ESNext</div>
              </div>
            </div>
            {language === "typescript" && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => setLanguage("javascript")}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              language === "javascript"
                ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                JS
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">JavaScript</div>
                <div className="text-xs text-slate-400">Modern ES6+ standard</div>
              </div>
            </div>
            {language === "javascript" && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Problem Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-200">
            2. Select Coding Problem
          </label>
          <span className="text-xs text-slate-400">
            {PROBLEMS.length} problems available
          </span>
        </div>

        <select
          value={problemId}
          onChange={(e) => setProblemId(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          {PROBLEMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.difficulty.toUpperCase()}) — {p.category}
            </option>
          ))}
        </select>

        {/* Selected Problem Summary */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-400">{selectedProblem.title}</span>
            <span className="capitalize text-slate-400">{selectedProblem.difficulty}</span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2">
            {selectedProblem.description}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
      >
        {loading ? (
          <span>Creating interview room...</span>
        ) : (
          <>
            <PlusCircle className="w-5 h-5" />
            <span>Create interview</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </div>
  );
}

export default function CreateInterviewPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<div className="text-center text-slate-400 py-12">Loading...</div>}>
          <CreateInterviewForm />
        </Suspense>
      </main>
    </div>
  );
}
