"use client";

import { useState } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export interface TocHeading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <nav className="w-full bg-[#161616] border border-[#2e2e2e] rounded-[20px] p-5 space-y-3">
      {/* Mobile Accordion Toggle */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#cef565]">
          <List className="w-4 h-4" />
          <span>Table of Contents ({headings.length})</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md hover:bg-[#222] text-[#9d9d9d]"
          aria-label="Toggle Table of Contents"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#cef565]">
        <List className="w-4 h-4" />
        <span>Table of Contents</span>
      </div>

      {/* Links List */}
      <ul className={`space-y-2 text-xs font-medium text-[#9d9d9d] ${isOpen ? "block" : "hidden md:block"}`}>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="block hover:text-[#cef565] transition-colors line-clamp-1"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
