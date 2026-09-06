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
    <div className="w-full bg-[#0b1120] border-t border-slate-800 flex flex-col shrink-0 rounded-b-xl overflow-hidden">
      {/* Header Bar */}
      <div className="h-10 px-4 bg-slate-900/90 flex items-center justify-between border-b border-slate-800 text-xs select-none">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center space-x-1.5 font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Console Output</span>
            {collapsed ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
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
                <span className="flex items-center space-x-1 text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Error</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </span>
              )}
              <span className="text-[11px] text-slate-500 font-mono">
                ({result.executionTimeMs}ms)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {result && (
            <button
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-md shadow-sm transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Output Console Content Area */}
      {!collapsed && (
        <div className="h-44 overflow-y-auto p-3 font-mono text-xs space-y-1.5 bg-[#090d16] text-slate-300 select-text">
          {isRunning && (
            <div className="text-slate-500 italic">Executing code in Web Worker sandbox...</div>
          )}

          {!isRunning && !result && (
            <div className="text-slate-500 italic">
              Click &quot;Run Code&quot; or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Cmd + Enter</kbd> to execute.
            </div>
          )}

          {!isRunning && result && (
            <>
              {result.logs.map((log: ConsoleLogEntry, index: number) => {
                let textClass = "text-slate-300";
                if (log.type === "info") textClass = "text-blue-400";
                if (log.type === "warn") textClass = "text-amber-400";
                if (log.type === "error") textClass = "text-rose-400 font-semibold";
                if (log.type === "result") textClass = "text-emerald-400 font-semibold";

                return (
                  <div key={index} className={`whitespace-pre-wrap ${textClass}`}>
                    {log.content}
                  </div>
                );
              })}

              {result.error && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 whitespace-pre-wrap font-semibold">
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
