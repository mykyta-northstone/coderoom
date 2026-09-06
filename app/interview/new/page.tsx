"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PROBLEMS, Language } from "@/data/problems";
import { trackEvent } from "@/lib/analytics";
import { PlusCircle, CheckCircle2, ArrowRight } from "lucide-react";

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
    <div className="max-w-2xl mx-auto bg-[#1e1e1e] p-6 sm:p-8 rounded-[28px] border border-[#2e2e2e] space-y-8 shadow-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Create a Live Interview Room
        </h1>
        <p className="text-xs text-[#9d9d9d] mt-1">
          Configure your JS/TS interview session. No account needed.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[#f2796b]/10 border border-[#f2796b]/20 rounded-[14px] text-xs font-semibold text-[#f2796b]">
          {error}
        </div>
      )}

      {/* Language Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
          1. Select Primary Language
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setLanguage("typescript")}
            className={`p-4 rounded-[18px] border flex items-center justify-between transition-all ${
              language === "typescript"
                ? "bg-[#cef565]/10 border-[#cef565] text-white shadow-lg shadow-[#cef565]/5"
                : "bg-[#141414] border-[#2e2e2e] text-[#9d9d9d] hover:border-slate-700 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#cef565]/15 text-[#cef565] font-extrabold flex items-center justify-center text-xs">
                TS
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">TypeScript</div>
                <div className="text-[11px] text-[#9d9d9d]">Strict typing & ESNext</div>
              </div>
            </div>
            {language === "typescript" && <CheckCircle2 className="w-5 h-5 text-[#cef565]" />}
          </button>

          <button
            type="button"
            onClick={() => setLanguage("javascript")}
            className={`p-4 rounded-[18px] border flex items-center justify-between transition-all ${
              language === "javascript"
                ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/5"
                : "bg-[#141414] border-[#2e2e2e] text-[#9d9d9d] hover:border-slate-700 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 font-extrabold flex items-center justify-center text-xs">
                JS
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">JavaScript</div>
                <div className="text-[11px] text-[#9d9d9d]">Modern ES6+ standard</div>
              </div>
            </div>
            {language === "javascript" && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Problem Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
            2. Select Coding Problem
          </label>
          <span className="text-xs text-[#6a6a6a]">
            {PROBLEMS.length} problems available
          </span>
        </div>

        <select
          value={problemId}
          onChange={(e) => setProblemId(e.target.value)}
          className="w-full bg-[#141414] border border-[#2e2e2e] rounded-[16px] px-4 py-3 text-xs text-white focus:outline-none focus:border-[#cef565] transition-colors"
        >
          {PROBLEMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.difficulty.toUpperCase()}) — {p.category}
            </option>
          ))}
        </select>

        {/* Selected Problem Summary */}
        <div className="p-4 rounded-[16px] bg-[#141414] border border-[#2e2e2e] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#cef565]">{selectedProblem.title}</span>
            <span className="capitalize text-[#9d9d9d] text-[11px] font-semibold">{selectedProblem.difficulty}</span>
          </div>
          <p className="text-xs text-[#9d9d9d] line-clamp-2">
            {selectedProblem.description}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full py-4 text-sm font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] disabled:opacity-50 rounded-full shadow-xl shadow-[#cef565]/15 transition-all flex items-center justify-center space-x-2"
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
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#f4f4f4]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<div className="text-center text-[#9d9d9d] py-12">Loading...</div>}>
          <CreateInterviewForm />
        </Suspense>
      </main>
    </div>
  );
}
