"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PROBLEMS, Language, Problem, Difficulty } from "@/data/problems";
import { trackEvent } from "@/lib/analytics";
import { PlusCircle, CheckCircle2, ArrowRight, PenTool, BookOpen } from "lucide-react";

function CreateInterviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProblemId = searchParams.get("problemId") || PROBLEMS[0].id;

  const [mode, setMode] = useState<"library" | "custom">("library");
  const [language, setLanguage] = useState<Language>("typescript");
  const [problemId, setProblemId] = useState<string>(initialProblemId);

  // Custom problem form state (simplified)
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>("medium");
  const [customExamples, setCustomExamples] = useState("");
  const [customStarterCode, setCustomStarterCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProblem = PROBLEMS.find((p) => p.id === problemId) || PROBLEMS[0];

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      let payload: any = { language };

      if (mode === "library") {
        payload.problemId = problemId;
      } else {
        if (!customTitle.trim()) {
          throw new Error("Please enter a title for your custom problem.");
        }
        if (!customDescription.trim()) {
          throw new Error("Please enter a description for your custom problem.");
        }

        const customProb: Problem = {
          id: `custom-${Date.now()}`,
          title: customTitle.trim(),
          difficulty: customDifficulty,
          category: "Custom Task",
          description: customDescription.trim(),
          examples: customExamples.trim() || "",
          starterCode: {
            javascript:
              customStarterCode.trim() ||
              `// ${customTitle}\nfunction solution() {\n  // Write candidate starter code here\n}\n`,
            typescript:
              customStarterCode.trim() ||
              `// ${customTitle}\nfunction solution(): void {\n  // Write candidate starter code here\n}\n`,
          },
        };

        payload.problemId = customProb.id;
        payload.customProblem = customProb;
      }

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

      trackEvent("create_interview", { roomId, mode, language });
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

      {/* Mode Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
          1. Choose Problem Type
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-[#141414] rounded-full border border-[#2e2e2e]">
          <button
            type="button"
            onClick={() => setMode("library")}
            className={`py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              mode === "library"
                ? "bg-[#cef565] text-[#131313] shadow-md"
                : "text-[#9d9d9d] hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Problem Library</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              mode === "custom"
                ? "bg-[#cef565] text-[#131313] shadow-md"
                : "text-[#9d9d9d] hover:text-white"
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Custom Task</span>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
          2. Select Primary Language
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

      {/* Library Problem Mode */}
      {mode === "library" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
              3. Select Problem from Library
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
      )}

      {/* Custom Task Mode (Simplified) */}
      {mode === "custom" && (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
            3. Define Custom Coding Task
          </label>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#9d9d9d] mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Implement Cart Checkout Discount Calculator"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-[14px] px-4 py-2.5 text-xs text-white placeholder-[#6a6a6a] focus:outline-none focus:border-[#cef565]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#9d9d9d] mb-1">
                Difficulty Level
              </label>
              <select
                value={customDifficulty}
                onChange={(e) => setCustomDifficulty(e.target.value as Difficulty)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-[14px] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#cef565]"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#9d9d9d] mb-1">
                Problem Description & Requirements *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain the coding challenge, requirements, and constraints for the candidate..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-[14px] p-3 text-xs text-white placeholder-[#6a6a6a] focus:outline-none focus:border-[#cef565] leading-relaxed resize-y"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#9d9d9d] mb-1">
                Examples / Input & Output (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Example 1:\nInput: items = [{ price: 100 }]\nOutput: 90"
                value={customExamples}
                onChange={(e) => setCustomExamples(e.target.value)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-[14px] p-3 text-xs font-mono text-white placeholder-[#6a6a6a] focus:outline-none focus:border-[#cef565] leading-relaxed resize-y"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#9d9d9d] mb-1">
                Initial Starter Code (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="function calculateDiscount(cart) {\n  // Your implementation here\n}"
                value={customStarterCode}
                onChange={(e) => setCustomStarterCode(e.target.value)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-[14px] p-3 text-xs font-mono text-white placeholder-[#6a6a6a] focus:outline-none focus:border-[#cef565] leading-relaxed resize-y"
              />
            </div>
          </div>
        </div>
      )}

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
