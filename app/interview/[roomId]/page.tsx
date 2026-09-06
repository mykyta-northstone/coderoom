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
  Search,
  ShieldCheck,
} from "lucide-react";

const CollaborativeEditor = dynamic(
  () => import("@/components/editor/CollaborativeEditor").then((m) => m.CollaborativeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#181818] rounded-[20px] border border-[#2e2e2e] flex items-center justify-center text-[#9d9d9d] text-xs">
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
  endedAt?: number;
  customProblem?: Problem;
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

  // Interviewer bug checklist state
  const [checkedHints, setCheckedHints] = useState<Record<number, boolean>>({});

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
        setProblem(data.problem || data.room?.customProblem || null);
        setIsEnded(data.room.ended);

        if (Date.now() > data.room.expiresAt) {
          setIsExpired(true);
        }

        const savedToken = sessionStorage.getItem(`coderoom_interviewer_${roomId}`);
        if (savedToken) {
          setUserRole("interviewer");
          const savedInterviewerName = sessionStorage.getItem(`coderoom_interviewer_name_${roomId}`);
          if (savedInterviewerName) {
            setUserName(savedInterviewerName);
            trackEvent("interview_started", { roomId, role: "interviewer" });
          } else {
            setShowJoinModal(true);
          }
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

  // Interview duration timer (freezes when interview ends)
  useEffect(() => {
    if (!room) return;

    if (isEnded || room.ended) {
      const endTime = room.endedAt || Date.now();
      const seconds = Math.max(0, Math.floor((endTime - room.createdAt) / 1000));
      setElapsedSeconds(seconds);
      return;
    }

    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - room.createdAt) / 1000)));

    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.floor((Date.now() - room.createdAt) / 1000));
      setElapsedSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [room, isEnded]);

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

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinNameInput.trim()) return;

    const name = joinNameInput.trim();
    if (userRole === "interviewer") {
      setUserName(name);
      sessionStorage.setItem(`coderoom_interviewer_name_${roomId}`, name);
      setShowJoinModal(false);
      trackEvent("interview_started", { roomId, role: "interviewer", name });
    } else {
      setUserRole("candidate");
      setUserName(name);
      sessionStorage.setItem(`coderoom_candidate_name_${roomId}`, name);
      setShowJoinModal(false);
      trackEvent("candidate_joined", { roomId, name });
    }
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEndInterview = async () => {
    setIsEnded(true);
    setShowEndModal(false);

    // Broadcast ended state to all Yjs room participants instantly
    editorHandleRef.current?.setRoomEnded();

    const interviewerToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem(`coderoom_interviewer_${roomId}`) || ""
        : "";

    try {
      await fetch(`/api/rooms/${roomId}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", interviewerToken }),
      });
      trackEvent("interview_ended", { roomId });
    } catch (err) {
      console.error("Failed to sync room end to backend:", err);
    }
  };

  const handleRunCode = async () => {
    if (!room || isExecuting) return;

    editorHandleRef.current?.setExecutingState(true);
    editorHandleRef.current?.setExecutionResultState(null);

    const result = await executeCode(currentCode, room.language);

    editorHandleRef.current?.setExecutionResultState(result);
    editorHandleRef.current?.setExecutingState(false);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-[#9d9d9d]">
        <div className="w-8 h-8 border-2 border-[#cef565] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold">Connecting to interview room...</p>
      </div>
    );
  }

  if (error || isExpired) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e1e1e] p-8 rounded-[28px] border border-[#2e2e2e] text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#f2796b]/10 border border-[#f2796b]/20 text-[#f2796b] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">
              {isExpired ? "This interview room has expired." : "Interview not found."}
            </h1>
            <p className="text-xs text-[#9d9d9d] mt-2">
              {isExpired
                ? "Rooms expire automatically after 24 hours for security."
                : error}
            </p>
          </div>
          <Link
            href="/interview/new"
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create new interview</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#121212] overflow-hidden text-[#f4f4f4]">
      {/* Candidate / Interviewer Name Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleJoinSession}
            className="max-w-md w-full bg-[#1e1e1e] p-6 sm:p-8 rounded-[28px] border border-[#2e2e2e] space-y-6 shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#cef565]/15 border border-[#cef565]/30 flex items-center justify-center text-[#cef565]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  {userRole === "interviewer" ? "Welcome, Interviewer" : "Join interview"}
                </h2>
                <p className="text-xs text-[#9d9d9d]">
                  {userRole === "interviewer"
                    ? "Enter your name for participant presence"
                    : "No account required"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#c4c4c4] uppercase tracking-wider">
                Your name
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder={userRole === "interviewer" ? "e.g. Sarah (Interviewer)" : "e.g. Alex Smith"}
                value={joinNameInput}
                onChange={(e) => setJoinNameInput(e.target.value)}
                className="w-full bg-[#141414] border border-[#2e2e2e] rounded-full px-4 py-3 text-xs text-white placeholder-[#6a6a6a] focus:outline-none focus:border-[#cef565] transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-lg shadow-[#cef565]/15 transition-all"
            >
              Join Session
            </button>
          </form>
        </div>
      )}

      {/* End Interview Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1e1e1e] p-6 rounded-[28px] border border-[#2e2e2e] space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f2796b]/10 border border-[#f2796b]/20 text-[#f2796b] flex items-center justify-center">
                <PowerOff className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">End Interview?</h2>
                <p className="text-xs text-[#9d9d9d]">
                  This will make the room read-only for all participants.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#9d9d9d] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEndInterview}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#f2796b] hover:bg-rose-500 rounded-full shadow-md"
              >
                Confirm & End
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-14 shrink-0 px-4 bg-[#141414]/90 backdrop-blur-md flex items-center justify-between border-b border-[#2e2e2e]">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-7 h-7 rounded-xl bg-[#cef565]/15 border border-[#cef565]/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-[#cef565]" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white hidden sm:inline">
              Code<span className="text-[#cef565]">Room</span>
            </span>
          </Link>

          <span className="h-4 w-px bg-[#2e2e2e]" />

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-[#222222] text-[#c4c4c4] border border-[#2e2e2e]">
            {room?.language}
          </span>

          {problem?.type === "code_review" && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7c5cfc]/20 text-[#a894ff] border border-[#7c5cfc]/40 hidden sm:inline">
              Code Review Mode
            </span>
          )}

          <div className="flex items-center space-x-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-[#cef565] shadow-sm shadow-[#cef565]/50"
                  : connectionStatus === "reconnecting"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-[#f2796b]"
              }`}
            />
            <span className="text-[#9d9d9d] capitalize hidden md:inline">
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Center: Timer */}
        <div
          className={`flex items-center space-x-2 border px-3.5 py-1 rounded-full text-xs font-mono transition-colors ${
            isEnded
              ? "bg-[#f2796b]/10 border-[#f2796b]/30 text-[#f2796b]"
              : "bg-[#1e1e1e] border-[#2e2e2e] text-[#c4c4c4]"
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${isEnded ? "text-[#f2796b]" : "text-[#cef565]"}`} />
          <span>{formatTimer(elapsedSeconds)}</span>
          {isEnded && (
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider pl-1">
              (Ended)
            </span>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {userRole === "interviewer" && (
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold bg-[#cef565] hover:bg-[#b9e83c] text-[#131313] rounded-full transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#131313]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#131313]" />
                  <span>Copy interview link</span>
                </>
              )}
            </button>
          )}

          {userRole === "interviewer" && !isEnded && (
            <button
              onClick={() => setShowEndModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-[#f2796b]/10 hover:bg-[#f2796b]/20 text-[#f2796b] border border-[#f2796b]/20 rounded-full transition-all"
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
        <section className="w-full md:w-[35%] h-[35vh] md:h-full flex flex-col bg-[#1e1e1e] rounded-[24px] border border-[#2e2e2e] overflow-hidden">
          <div className="p-4 border-b border-[#2e2e2e] flex items-center justify-between shrink-0 bg-[#141414]/50">
            <div>
              <span className="text-xs text-[#9d9d9d] font-mono">
                {problem?.category}
              </span>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {problem?.title}
              </h2>
            </div>
            {problem && userRole === "interviewer" && getDifficultyBadge(problem.difficulty)}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-[#c4c4c4] leading-relaxed">
            {problem?.type === "code_review" && (
              <div className="p-4 rounded-[18px] bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-extrabold text-[#a894ff]">
                  <Search className="w-4 h-4 text-[#a894ff]" />
                  <span>Code Review Task</span>
                </div>
                <p className="text-[11px] text-[#c4c4c4] leading-relaxed">
                  Review the TypeScript code in the editor. Identify <strong>bugs</strong>, <strong>performance issues</strong>, <strong>security flaws</strong>, and <strong>maintainability problems</strong>. Explain your reasoning and refactor live together.
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-[#9d9d9d] uppercase tracking-wider mb-2">
                Problem Description
              </h3>
              <div className="whitespace-pre-wrap">
                {problem?.description}
              </div>
            </div>

            {problem?.type !== "code_review" && problem?.examples && (
              <div>
                <h3 className="text-xs font-bold text-[#9d9d9d] uppercase tracking-wider mb-2">
                  Examples
                </h3>
                <pre className="bg-[#141414] p-3.5 rounded-[14px] border border-[#2e2e2e] text-xs font-mono text-[#c4c4c4] overflow-x-auto whitespace-pre-wrap">
                  {problem.examples}
                </pre>
              </div>
            )}

            {/* Interviewer Guide & Bug Checklist (Visible strictly for Interviewers) */}
            {userRole === "interviewer" && problem?.hints && problem.hints.length > 0 && (
              <div className="p-4 rounded-[18px] bg-[#cef565]/5 border border-[#cef565]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-extrabold text-[#cef565] text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#cef565]" />
                    <span>Interviewer Guide</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#cef565]/15 text-[#cef565] border border-[#cef565]/30 uppercase">
                    Private to Interviewer
                  </span>
                </div>
                <p className="text-[11px] text-[#9d9d9d]">
                  Bug checklist to evaluate candidate performance during review:
                </p>
                <div className="space-y-2 pt-1">
                  {problem.hints.map((hint, idx) => {
                    const isChecked = !!checkedHints[idx];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setCheckedHints((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className={`w-full text-left flex items-start space-x-2.5 p-2.5 rounded-[12px] border transition-all ${
                          isChecked
                            ? "bg-[#cef565]/10 border-[#cef565]/30 text-[#cef565]"
                            : "bg-[#141414] border-[#2e2e2e] text-[#e4e4e4] hover:border-[#3e3e3e]"
                        }`}
                      >
                        <span
                          className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold mt-0.5 transition-colors ${
                            isChecked
                              ? "bg-[#cef565] border-[#cef565] text-[#121212]"
                              : "border-[#cef565]/40 bg-[#cef565]/5 text-[#cef565]"
                          }`}
                        >
                          {isChecked ? "✓" : idx + 1}
                        </span>
                        <span
                          className={`text-xs leading-snug ${
                            isChecked ? "line-through opacity-80" : ""
                          }`}
                        >
                          {hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#2e2e2e] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9d9d9d] font-bold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-[#cef565]" />
                  <span>Participants ({participants.length})</span>
                </span>
                <span className="text-[10px] text-[#6a6a6a] font-normal">
                  {userRole === "interviewer" ? "You are Interviewer" : "You are Candidate"}
                </span>
              </div>

              <div className="space-y-2">
                {participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-[14px] bg-[#141414] border border-[#2e2e2e] text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-semibold text-white">{p.name}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#222222] text-[#9d9d9d] border border-[#2e2e2e]">
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Monaco Editor + Output Console Panel (65% Desktop) */}
        <section className="w-full md:w-[65%] h-[65vh] md:h-full flex flex-col relative overflow-hidden rounded-[24px]">
          {/* Ended Interview Banner Overlay */}
          {isEnded && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1e1e1e]/95 border border-[#f2796b]/40 text-[#f2796b] px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center space-x-4">
              <span className="text-xs font-bold">Interview ended — Read Only</span>
              <Link
                href="/interview/new"
                className="text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] px-3.5 py-1 rounded-full transition-colors"
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

          {problem?.type !== "code_review" && (
            <OutputConsole
              result={executionResult}
              isRunning={isExecuting}
              onRun={handleRunCode}
              onClear={() => {
                setExecutionResult(null);
                editorHandleRef.current?.setExecutionResultState(null);
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}
