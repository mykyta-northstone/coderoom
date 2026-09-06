"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { Language } from "@/data/problems";

interface CollaborativeEditorProps {
  roomId: string;
  language: Language;
  userName: string;
  userRole: "interviewer" | "candidate";
  readOnly?: boolean;
  onRunCode?: () => void;
  onConnectionStatusChange?: (status: "connected" | "reconnecting" | "disconnected") => void;
  onPresenceChange?: (participants: Array<{ name: string; role: "interviewer" | "candidate"; color: string }>) => void;
  onCodeChange?: (code: string) => void;
}

const USER_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
];

export function CollaborativeEditor({
  roomId,
  language,
  userName,
  userRole,
  readOnly = false,
  onRunCode,
  onConnectionStatusChange,
  onPresenceChange,
  onCodeChange,
}: CollaborativeEditorProps) {
  const editorRef = useRef<any>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const docRef = useRef<Y.Doc | null>(null);

  const [editorReady, setEditorReady] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorReady(true);

    // Register Cmd + Enter / Ctrl + Enter shortcut to run code
    editor.addAction({
      id: "run-code-action",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        onRunCode?.();
      },
    });
  };

  useEffect(() => {
    if (!editorReady || !editorRef.current) return;

    // Initialize Yjs doc
    const doc = new Y.Doc();
    docRef.current = doc;

    const wsHost =
      process.env.NEXT_PUBLIC_WS_URL ||
      (typeof window !== "undefined"
        ? `ws://${window.location.hostname}:1234`
        : "ws://localhost:1234");

    const provider = new WebsocketProvider(wsHost, roomId, doc);
    providerRef.current = provider;

    const userColor =
      userRole === "interviewer"
        ? "#3b82f6"
        : USER_COLORS[Math.abs(userName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % USER_COLORS.length];

    provider.awareness.setLocalStateField("user", {
      name: userName,
      role: userRole,
      color: userColor,
    });

    provider.on("status", (event: { status: "connected" | "connecting" | "disconnected" }) => {
      const statusMap: Record<string, "connected" | "reconnecting" | "disconnected"> = {
        connected: "connected",
        connecting: "reconnecting",
        disconnected: "disconnected",
      };
      onConnectionStatusChange?.(statusMap[event.status] || "disconnected");
    });

    const updatePresence = () => {
      const states = provider.awareness.getStates();
      const participants: Array<{ name: string; role: "interviewer" | "candidate"; color: string }> = [];

      states.forEach((state: any) => {
        if (state.user) {
          participants.push({
            name: state.user.name || "Anonymous",
            role: state.user.role || "candidate",
            color: state.user.color || "#6366f1",
          });
        }
      });

      onPresenceChange?.(participants);
    };

    provider.awareness.on("change", updatePresence);
    updatePresence();

    const ytext = doc.getText("monaco");
    const model = editorRef.current.getModel();

    if (model) {
      const binding = new MonacoBinding(
        ytext,
        model,
        new Set([editorRef.current]),
        provider.awareness
      );
      bindingRef.current = binding;

      // Track current text changes for execution
      const handleModelChange = () => {
        onCodeChange?.(model.getValue());
      };

      model.onDidChangeContent(handleModelChange);
      handleModelChange();
    }

    return () => {
      bindingRef.current?.destroy();
      provider.disconnect();
      provider.destroy();
      doc.destroy();
    };
  }, [editorReady, roomId, userName, userRole]);

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-[#0f172a] rounded-t-xl border border-slate-800">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          fontFamily: "var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
        }}
      />
    </div>
  );
}
