"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { Language } from "@/data/problems";
import { ExecutionResult } from "@/lib/runner/executor";

export interface CollaborativeEditorHandle {
  setRoomEnded: () => void;
  setExecutingState: (isExecuting: boolean) => void;
  setExecutionResultState: (result: ExecutionResult | null) => void;
}

interface CollaborativeEditorProps {
  roomId: string;
  language: Language;
  userName: string;
  userRole: "interviewer" | "candidate";
  readOnly?: boolean;
  initialCode?: string;
  onRunCode?: () => void;
  onConnectionStatusChange?: (status: "connected" | "reconnecting" | "disconnected") => void;
  onPresenceChange?: (participants: Array<{ name: string; role: "interviewer" | "candidate"; color: string }>) => void;
  onCodeChange?: (code: string) => void;
  onRoomEndedChange?: (ended: boolean) => void;
  onExecutionResultChange?: (result: ExecutionResult | null) => void;
  onIsExecutingChange?: (isExecuting: boolean) => void;
}

const USER_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
];

export const CollaborativeEditor = forwardRef<CollaborativeEditorHandle, CollaborativeEditorProps>(
  (
    {
      roomId,
      language,
      userName,
      userRole,
      readOnly = false,
      initialCode,
      onRunCode,
      onConnectionStatusChange,
      onPresenceChange,
      onCodeChange,
      onRoomEndedChange,
      onExecutionResultChange,
      onIsExecutingChange,
    },
    ref
  ) => {
    const editorRef = useRef<any>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const bindingRef = useRef<MonacoBinding | null>(null);
    const docRef = useRef<Y.Doc | null>(null);
    const roomStateMapRef = useRef<Y.Map<any> | null>(null);

    const [editorReady, setEditorReady] = useState(false);

    useImperativeHandle(ref, () => ({
      setRoomEnded: () => {
        if (roomStateMapRef.current) {
          roomStateMapRef.current.set("ended", true);
        }
      },
      setExecutingState: (isExecuting: boolean) => {
        if (roomStateMapRef.current) {
          roomStateMapRef.current.set("isExecuting", isExecuting);
        }
      },
      setExecutionResultState: (result: ExecutionResult | null) => {
        if (roomStateMapRef.current) {
          roomStateMapRef.current.set("executionResult", result ? JSON.stringify(result) : null);
        }
      },
    }));

    const initialCodeRef = useRef(initialCode);
    useEffect(() => {
      initialCodeRef.current = initialCode;
    }, [initialCode]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      setEditorReady(true);

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
          : USER_COLORS[
              Math.abs(userName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
                USER_COLORS.length
            ];

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

      // Setup roomState shared Yjs map for real-time room status & output sync
      const roomStateMap = doc.getMap("roomState");
      roomStateMapRef.current = roomStateMap;

      const handleRoomStateObserve = () => {
        const ended = roomStateMap.get("ended");
        if (ended === true) {
          onRoomEndedChange?.(true);
        }

        const isExecuting = roomStateMap.get("isExecuting");
        if (typeof isExecuting === "boolean") {
          onIsExecutingChange?.(isExecuting);
        }

        const rawResult = roomStateMap.get("executionResult");
        if (rawResult) {
          try {
            const parsed = typeof rawResult === "string" ? JSON.parse(rawResult) : rawResult;
            onExecutionResultChange?.(parsed);
          } catch (e) {
            onExecutionResultChange?.(null);
          }
        } else if (rawResult === null) {
          onExecutionResultChange?.(null);
        }
      };

      roomStateMap.observe(handleRoomStateObserve);
      handleRoomStateObserve();

      // Bind Yjs text to Monaco model
      const ytext = doc.getText("monaco");

      const insertInitialIfNeeded = () => {
        if (ytext.toString() === "" && initialCodeRef.current) {
          ytext.insert(0, initialCodeRef.current);
        }
      };

      provider.on("sync", (isSynced: boolean) => {
        if (isSynced) {
          insertInitialIfNeeded();
        }
      });

      insertInitialIfNeeded();

      const model = editorRef.current.getModel();

      if (model) {
        const binding = new MonacoBinding(
          ytext,
          model,
          new Set([editorRef.current]),
          provider.awareness
        );
        bindingRef.current = binding;

        const handleModelChange = () => {
          onCodeChange?.(model.getValue());
        };

        model.onDidChangeContent(handleModelChange);
        handleModelChange();
      }

      return () => {
        roomStateMap.unobserve(handleRoomStateObserve);
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
);

CollaborativeEditor.displayName = "CollaborativeEditor";
