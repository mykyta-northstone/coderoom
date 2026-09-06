"use client";

import { useState } from "react";
import { ExecutionResult, ConsoleLogEntry } from "@/lib/runner/executor";
import { Play, Trash2, Terminal, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface OutputConsoleProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onRun: () => void;
  onClear: () => void;
}

export function OutputConsole({
  result,
  isRunning,
  onRun,
  onClear,
}: OutputConsoleProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="w-full bg-[#181818] border-t border-[#2e2e2e] flex flex-col shrink-0 rounded-b-[20px] overflow-hidden">
      {/* Header Bar */}
      <div className="h-10 px-4 bg-[#1e1e1e] flex items-center justify-between border-b border-[#2e2e2e] text-xs select-none">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center space-x-1.5 font-bold text-[#c4c4c4] hover:text-white transition-colors"
          >
            <Terminal className="w-4 h-4 text-[#cef565]" />
            <span>Console Output</span>
            {collapsed ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#6a6a6a]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#6a6a6a]" />
            )}
          </button>

          {isRunning && (
            <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Running...</span>
            </span>
          )}

          {!isRunning && result && (
            <div className="flex items-center space-x-2">
              {result.error ? (
                <span className="flex items-center space-x-1 text-[#f2796b] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Error</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[#cef565] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              )}
              <span className="text-[11px] text-[#6a6a6a] font-mono">
                ({result.executionTimeMs}ms)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {result && (
            <button
              onClick={onClear}
              className="p-1 text-[#9d9d9d] hover:text-white hover:bg-[#2e2e2e] rounded-md transition-colors"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#cef565] hover:bg-[#b9e83c] disabled:opacity-50 text-[#131313] font-bold rounded-full shadow-sm transition-all active:scale-95 text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Output Console Content Area */}
      {!collapsed && (
        <div className="h-44 overflow-y-auto p-3 font-mono text-xs space-y-1.5 bg-[#141414] text-[#c4c4c4] select-text">
          {isRunning && (
            <div className="text-[#6a6a6a] italic">Executing code in Web Worker sandbox...</div>
          )}

          {!isRunning && !result && (
            <div className="text-[#6a6a6a] italic">
              Click &quot;Run Code&quot; or press <kbd className="px-1.5 py-0.5 bg-[#222222] rounded border border-[#2e2e2e] text-[#c4c4c4]">Cmd + Enter</kbd> to execute.
            </div>
          )}

          {!isRunning && result && (
            <>
              {result.logs.map((log: ConsoleLogEntry, index: number) => {
                let textClass = "text-[#c4c4c4]";
                if (log.type === "info") textClass = "text-[#7c5cfc]";
                if (log.type === "warn") textClass = "text-amber-400";
                if (log.type === "error") textClass = "text-[#f2796b] font-semibold";
                if (log.type === "result") textClass = "text-[#cef565] font-semibold";

                return (
                  <div key={index} className={`whitespace-pre-wrap ${textClass}`}>
                    {log.content}
                  </div>
                );
              })}

              {result.error && (
                <div className="p-2 rounded-md bg-[#f2796b]/10 border border-[#f2796b]/20 text-[#f2796b] whitespace-pre-wrap font-semibold">
                  {result.error}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
