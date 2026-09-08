import Link from "next/link";
import { Code2, PlusCircle, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md border-b border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#cef565]/15 border border-[#cef565]/30 flex items-center justify-center group-hover:border-[#cef565]/60 transition-all">
            <Code2 className="w-5 h-5 text-[#cef565]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-sans">
            Pair<span className="text-[#cef565]">let</span>
            <span className="text-xs font-mono text-[#9d9d9d] font-normal ml-0.5">.dev</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-3">
          <Link
            href="/problems"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-[#c4c4c4] hover:text-white hover:bg-[#222222] rounded-full transition-all border border-transparent hover:border-[#2e2e2e]"
          >
            <BookOpen className="w-4 h-4 text-[#9d9d9d]" />
            <span>Problems</span>
          </Link>
          <Link
            href="/interview/new"
            className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-lg shadow-[#cef565]/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create interview</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
