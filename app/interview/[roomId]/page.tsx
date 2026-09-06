"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Problem, Difficulty } from "@/data/problems";
import { trackEvent } from "@/lib/analytics";
import { executeCode, ExecutionResult } from "@/lib/runner/executor";
import { OutputConsole } from "@/components/editor/OutputConsole";
import { CollaborativeEditorHandle } from "@/components/editor/CollaborativeEditor";
import {
  Code2,
  Clock,
  Copy,
  Check,
  PowerOff,
  Users,
  AlertCircle,
  PlusCircle,
  UserCheck,
} from "lucide-react";

const CollaborativeEditor = dynamic(
  () => import("@/components/editor/CollaborativeEditor").then((m) => m.CollaborativeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#0f172a] rounded-xl border border-slate-800 flex items-center justify-center text-slate-400 text-sm">
        Initializing Collaborative Monaco Editor...
      </div>
    ),
  }
);

interface RoomData {
  id: string;
  problemId: string;
  language: "javascript" | "typescript";
  createdAt: number;
  expiresAt: number;
  ended: boolean;
}

export default function InterviewRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  const editorHandleRef = useRef<CollaborativeEditorHandle | null>(null);

  const [room, setRoom] = useState<RoomData | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // User identity state
  const [userRole, setUserRole] = useState<"interviewer" | "candidate" | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinNameInput, setJoinNameInput] = useState("");

  // Interview status & presence state
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "reconnecting" | "disconnected">("disconnected");
  const [participants, setParticipants] = useState<Array<{ name: string; role: "interviewer" | "candidate"; color: string }>>([]);
  const [isEnded, setIsEnded] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Code Execution state
  const [currentCode, setCurrentCode] = useState("");
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Fetch room metadata
  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (res.status === 404) {
          setError("Interview not found or expired.");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error("Unable to connect to the interview room.");
        }

        const data = await res.json();
        setRoom(data.room);
        setProblem(data.problem);
        setIsEnded(data.room.ended);

        if (Date.now() > data.room.expiresAt) {
          setIsExpired(true);
        }

        const savedToken = sessionStorage.getItem(`coderoom_interviewer_${roomId}`);
        if (savedToken) {
          setUserRole("interviewer");
          setUserName("Interviewer");
          trackEvent("interview_started", { roomId, role: "interviewer" });
        } else {
          const savedCandidateName = sessionStorage.getItem(`coderoom_candidate_name_${roomId}`);
          if (savedCandidateName) {
            setUserRole("candidate");
            setUserName(savedCandidateName);
            trackEvent("candidate_joined", { roomId, name: savedCandidateName });
          } else {
            setShowJoinModal(true);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load interview room.");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [roomId]);

  // Interview duration timer
  useEffect(() => {
    if (!room) return;
    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.floor((Date.now() - room.createdAt) / 1000));
      setElapsedSeconds(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [room]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const handleJoinAsCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinNameInput.trim()) return;

    const name = joinNameInput.trim();
    setUserRole("candidate");
    setUserName(name);
    sessionStorage.setItem(`coderoom_candidate_name_${roomId}`, name);
    setShowJoinModal(false);

    trackEvent("candidate_joined", { roomId, name });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEndInterview = async () => {
    if (!room) return;
    const interviewerToken = sessionStorage.getItem(`coderoom_interviewer_${roomId}`) || "";

    // Broadcast ended state to all Yjs room participants instantly
    editorHandleRef.current?.setRoomEnded();

    try {
      const res = await fetch(`/api/rooms/${roomId}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", interviewerToken }),
      });

      if (res.ok) {
        setIsEnded(true);
        setShowEndModal(false);
        trackEvent("interview_ended", { roomId });
      }
    } catch (err) {
      console.error("Failed to end interview:", err);
    }
  };

  const handleRunCode = async () => {
    if (!room || isExecuting) return;

    // Broadcast executing status & clear old result
    editorHandleRef.current?.setExecutingState(true);
    editorHandleRef.current?.setExecutionResultState(null);

    const result = await executeCode(currentCode, room.language);

    // Broadcast execution output to all participants
    editorHandleRef.current?.setExecutionResultState(result);
    editorHandleRef.current?.setExecutingState(false);
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Easy
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case "hard":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Hard
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Connecting to interview room...</p>
      </div>
    );
  }

  if (error || isExpired) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isExpired ? "This interview room has expired." : "Interview not found."}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {isExpired
                ? "Rooms expire automatically after 24 hours for security."
                : error}
            </p>
          </div>
          <Link
            href="/interview/new"
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create new interview</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#090d16] overflow-hidden text-slate-100">
      {/* Candidate Name Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleJoinAsCandidate}
            className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Join interview</h2>
                <p className="text-xs text-slate-400">No account required</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Your name
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Alex Smith"
                value={joinNameInput}
                onChange={(e) => setJoinNameInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              Join Session
            </button>
          </form>
        </div>
      )}

      {/* End Interview Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <PowerOff className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">End Interview?</h2>
                <p className="text-xs text-slate-400">
                  This will make the room read-only for all participants.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEndInterview}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md"
              >
                Confirm & End
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="glass-header h-14 shrink-0 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-base font-bold tracking-tight text-white hidden sm:inline">
              Code<span className="text-blue-400">Room</span>
            </span>
          </Link>

          <span className="h-4 w-px bg-slate-800" />

          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold uppercase bg-slate-800 text-slate-300">
            {room?.language}
          </span>

          <div className="flex items-center space-x-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : connectionStatus === "reconnecting"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-slate-400 capitalize hidden md:inline">
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700/60 transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy interview link</span>
              </>
            )}
          </button>

          {userRole === "interviewer" && !isEnded && (
            <button
              onClick={() => setShowEndModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">End interview</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace split */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 gap-3">
        {/* Left: Problem Statement Panel (35% Desktop) */}
        <section className="w-full md:w-[35%] h-[35vh] md:h-full flex flex-col glass-panel rounded-xl border border-slate-800/90 overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/40">
            <div>
              <span className="text-xs text-slate-400 font-mono">
                {problem?.category}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {problem?.title}
              </h2>
            </div>
            {problem && getDifficultyBadge(problem.difficulty)}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm text-slate-300 leading-relaxed">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Problem Description
              </h3>
              <div className="prose prose-invert prose-xs whitespace-pre-wrap">
                {problem?.description}
              </div>
            </div>

            {problem?.examples && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Examples
                </h3>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {problem.examples}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Participants ({participants.length})</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {userRole === "interviewer" ? "You are Interviewer" : "You are Candidate"}
                </span>
              </div>

              <div className="space-y-2">
                {participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-800 text-slate-400">
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Monaco Editor + Output Console Panel (65% Desktop) */}
        <section className="w-full md:w-[65%] h-[65vh] md:h-full flex flex-col relative overflow-hidden">
          {/* Ended Interview Banner Overlay */}
          {isEnded && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-rose-950/90 border border-rose-500/40 text-rose-200 px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center space-x-4">
              <span className="text-xs font-bold">Interview ended — Read Only</span>
              <Link
                href="/interview/new"
                className="text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1 rounded-md transition-colors"
              >
                Create another interview
              </Link>
            </div>
          )}

          <div className="flex-1 min-h-0">
            {userRole && (
              <CollaborativeEditor
                ref={editorHandleRef}
                roomId={roomId}
                language={room?.language || "typescript"}
                userName={userName}
                userRole={userRole}
                readOnly={isEnded}
                onRunCode={handleRunCode}
                onConnectionStatusChange={setConnectionStatus}
                onPresenceChange={setParticipants}
                onCodeChange={setCurrentCode}
                onRoomEndedChange={(ended) => setIsEnded(ended)}
                onExecutionResultChange={(result) => setExecutionResult(result)}
                onIsExecutingChange={(executing) => setIsExecuting(executing)}
              />
            )}
          </div>

          <OutputConsole
            result={executionResult}
            isRunning={isExecuting}
            onRun={handleRunCode}
            onClear={() => {
              setExecutionResult(null);
              editorHandleRef.current?.setExecutionResultState(null);
            }}
          />
        </section>
      </main>
    </div>
  );
}
