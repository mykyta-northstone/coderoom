"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PROBLEMS, Problem, Difficulty } from "@/data/problems";
import { Search, PlusCircle, ChevronRight, Filter, ArrowUpDown } from "lucide-react";

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"difficulty-asc" | "difficulty-desc" | "title">("difficulty-asc");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const difficultyRank: Record<Difficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const filteredProblems = PROBLEMS.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase()) ||
      problem.category.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  }).sort((a, b) => {
    if (sortOrder === "difficulty-asc") {
      return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
    }
    if (sortOrder === "difficulty-desc") {
      return difficultyRank[b.difficulty] - difficultyRank[a.difficulty];
    }
    return a.title.localeCompare(b.title);
  });

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#cef565]/10 text-[#cef565] border border-[#cef565]/20">
            Easy
          </span>
        );
      case "medium":
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case "hard":
        return (
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#f2796b]/10 text-[#f2796b] border border-[#f2796b]/20">
            Hard
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#f4f4f4]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Problem Library
            </h1>
            <p className="text-sm text-[#9d9d9d] mt-1">
              Browse standard JavaScript & TypeScript interview questions
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#6a6a6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#6a6a6a] focus:outline-none focus:border-[#cef565] transition-colors"
              />
            </div>

            {/* Filter by Difficulty */}
            <div className="flex items-center space-x-1 bg-[#141414] border border-[#2e2e2e] rounded-full p-1 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#6a6a6a] ml-2" />
              {(["all", "easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-3.5 py-1 text-xs font-bold rounded-full capitalize transition-all ${
                    difficultyFilter === diff
                      ? "bg-[#cef565] text-[#131313]"
                      : "text-[#9d9d9d] hover:text-white"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-[#141414] border border-[#2e2e2e] rounded-full px-3 py-1 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6a6a6a] mr-2 shrink-0" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-2"
              >
                <option value="difficulty-asc" className="bg-[#1e1e1e] text-white">
                  Sort: Easy → Hard
                </option>
                <option value="difficulty-desc" className="bg-[#1e1e1e] text-white">
                  Sort: Hard → Easy
                </option>
                <option value="title" className="bg-[#1e1e1e] text-white">
                  Sort: Alphabetical
                </option>
              </select>
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
                className={`p-5 rounded-[20px] border transition-all cursor-pointer ${
                  selectedProblem?.id === problem.id
                    ? "border-[#cef565] bg-[#1e1e1e] shadow-lg shadow-[#cef565]/5"
                    : "bg-[#1e1e1e]/80 border-[#2e2e2e] hover:border-slate-700 hover:bg-[#1e1e1e]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-white">
                      {problem.title}
                    </h3>
                    {getDifficultyBadge(problem.difficulty)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#9d9d9d] font-mono bg-[#141414] px-2.5 py-0.5 rounded-full border border-[#2e2e2e]">
                      JS / TS
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#6a6a6a]" />
                  </div>
                </div>

                <p className="text-xs text-[#c4c4c4] mt-2.5 line-clamp-2 leading-relaxed">
                  {problem.description.replace(/\n+/g, " ")}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2e2e2e] text-xs">
                  <span className="text-[#9d9d9d] font-medium">
                    Category: {problem.category}
                  </span>
                  <Link
                    href={`/interview/new?problemId=${problem.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-[#cef565] hover:text-[#b9e83c] font-bold"
                  >
                    <span>Use for Interview</span>
                    <PlusCircle className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {filteredProblems.length === 0 && (
              <div className="text-center py-12 bg-[#1e1e1e] rounded-[24px] border border-[#2e2e2e]">
                <p className="text-sm text-[#9d9d9d]">No problems found matching your filter.</p>
              </div>
            )}
          </div>

          {/* Problem Preview Drawer */}
          <div className="lg:col-span-1">
            {selectedProblem ? (
              <div className="sticky top-24 bg-[#1e1e1e] rounded-[24px] border border-[#2e2e2e] p-6 space-y-5">
                <div className="flex items-center justify-between">
                  {getDifficultyBadge(selectedProblem.difficulty)}
                  <span className="text-xs text-[#9d9d9d] font-mono">
                    {selectedProblem.category}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">
                  {selectedProblem.title}
                </h2>

                <div className="text-xs text-[#c4c4c4] whitespace-pre-wrap leading-relaxed">
                  {selectedProblem.description}
                </div>

                {selectedProblem.examples && (
                  <div className="bg-[#141414] p-3.5 rounded-[14px] border border-[#2e2e2e] text-xs font-mono text-[#c4c4c4] whitespace-pre-wrap">
                    {selectedProblem.examples}
                  </div>
                )}

                <Link
                  href={`/interview/new?problemId=${selectedProblem.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-lg shadow-[#cef565]/15 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start Interview with this Problem</span>
                </Link>
              </div>
            ) : (
              <div className="sticky top-24 bg-[#1e1e1e] rounded-[24px] border border-[#2e2e2e] p-8 text-center text-[#6a6a6a] text-sm">
                Click any problem to view details and preview description.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
