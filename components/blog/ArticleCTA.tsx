import Link from "next/link";
import { PlusCircle, BookOpen, ArrowRight, Zap } from "lucide-react";

interface ArticleCTAProps {
  variant?: "primary" | "medium" | "soft";
  title?: string;
  description?: string;
}

export function ArticleCTA({
  variant = "primary",
  title = "Conduct Live Coding Interviews with Zero Friction",
  description = "No candidate sign-up required. Create an instant room, share the link, and code together in real time with shared code execution.",
}: ArticleCTAProps) {
  if (variant === "soft") {
    return (
      <div className="my-8 p-5 rounded-[20px] bg-[#161616] border border-[#2e2e2e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Looking to practice or interview live?</h4>
          <p className="text-xs text-[#9d9d9d]">Explore Pairlet's curated library of 26+ live coding problems.</p>
        </div>
        <Link
          href="/problems"
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-[#cef565] bg-[#cef565]/10 border border-[#cef565]/30 hover:bg-[#cef565]/20 rounded-full shrink-0 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Explore Problems</span>
        </Link>
      </div>
    );
  }

  if (variant === "medium") {
    return (
      <div className="my-10 p-7 rounded-[28px] bg-gradient-to-br from-[#1a2115] via-[#161616] to-[#141414] border border-[#cef565]/40 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#cef565] uppercase tracking-wider">
          <Zap className="w-4 h-4 fill-current" />
          <span>Practice Live Coding</span>
        </div>
        <h3 className="text-xl font-extrabold text-white">{title}</h3>
        <p className="text-xs text-[#9d9d9d] leading-relaxed max-w-2xl">{description}</p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/interview/new"
            className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full transition-all shadow-lg shadow-[#cef565]/15"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Free Room</span>
          </Link>
          <Link
            href="/problems"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 text-xs font-semibold text-[#c4c4c4] hover:text-white hover:bg-[#222] rounded-full border border-[#2e2e2e] transition-all"
          >
            <span>View All Problems</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 p-8 sm:p-10 rounded-[32px] bg-gradient-to-b from-[#1f2617] via-[#161616] to-[#121212] border border-[#cef565]/50 text-center space-y-6 shadow-2xl relative overflow-hidden">
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#cef565]/10 border border-[#cef565]/30 text-xs font-bold text-[#cef565] uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>100% Free Live Coding Platform</span>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-[#9d9d9d] leading-relaxed">{description}</p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/interview/new"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full transition-all shadow-xl shadow-[#cef565]/20 hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Free Interview Room</span>
        </Link>
        <Link
          href="/problems"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-xs font-bold text-[#f4f4f4] hover:bg-[#222] rounded-full border border-[#2e2e2e] transition-colors"
        >
          <span>Explore 26+ Problems</span>
          <ArrowRight className="w-4 h-4 text-[#9d9d9d]" />
        </Link>
      </div>
    </div>
  );
}
