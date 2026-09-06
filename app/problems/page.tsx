"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PROBLEMS, Problem, Difficulty } from "@/data/problems";
import { Search, PlusCircle, ChevronRight, Filter } from "lucide-react";

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const filteredProblems = PROBLEMS.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase()) ||
      problem.category.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Easy
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case "hard":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Hard
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Problem Library
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Browse standard JavaScript & TypeScript interview questions
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded-lg p-1 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
              {(["all", "easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                    difficultyFilter === diff
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problem list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem)}
                className={`p-4 rounded-xl glass-panel border transition-all cursor-pointer ${
                  selectedProblem?.id === problem.id
                    ? "border-blue-500 bg-slate-900/90 shadow-lg shadow-blue-500/10"
                    : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-semibold text-white">
                      {problem.title}
                    </h3>
                    {getDifficultyBadge(problem.difficulty)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">
                      JS / TS
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {problem.description.replace(/\n+/g, " ")}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-500 font-medium">
                    Category: {problem.category}
                  </span>
                  <Link
                    href={`/interview/new?problemId=${problem.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <span>Use for Interview</span>
                    <PlusCircle className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="text-center py-12 glass-panel rounded-xl border border-slate-800">
                <p className="text-sm text-slate-400">No problems found matching your filter.</p>
              </div>
            )}
          </div>

          {/* Problem Preview Drawer / Sidebar */}
          <div className="lg:col-span-1">
            {selectedProblem ? (
              <div className="sticky top-24 glass-panel rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  {getDifficultyBadge(selectedProblem.difficulty)}
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedProblem.category}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">
                  {selectedProblem.title}
                </h2>

                <div className="prose prose-invert prose-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedProblem.description}
                </div>

                {selectedProblem.examples && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                    {selectedProblem.examples}
                  </div>
                )}

                <Link
                  href={`/interview/new?problemId=${selectedProblem.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Interview with this Problem</span>
                </Link>
              </div>
            ) : (
              <div className="sticky top-24 glass-panel rounded-xl border border-slate-800 p-8 text-center text-slate-500 text-sm">
                Click any problem to view details and preview description.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
