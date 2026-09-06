import Link from "next/link";
import { Code2, PlusCircle, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:border-blue-400/50 transition-colors">
            <Code2 className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Code<span className="text-blue-400">Room</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            href="/problems"
            className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-md transition-all"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Problems</span>
          </Link>
          <Link
            href="/interview/new"
            className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create interview</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
