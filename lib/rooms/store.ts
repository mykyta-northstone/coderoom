import { Language, getProblemById, Problem } from "@/data/problems";
import crypto from "crypto";

export type Room = {
  id: string;
  problemId: string;
  language: Language;
  createdAt: number;
  expiresAt: number;
  ended: boolean;
  endedAt?: number;
  interviewerToken: string;
  customProblem?: Problem;
};

const globalRoomStore = globalThis as unknown as {
  codeRoomStore?: Map<string, Room>;
};

if (!globalRoomStore.codeRoomStore) {
  globalRoomStore.codeRoomStore = new Map<string, Room>();
}

const roomStore = globalRoomStore.codeRoomStore;

export function getBackendHttpUrl(): string | null {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (!wsUrl) return null;
  return wsUrl.replace(/^ws:/, "http:").replace(/^wss:/, "https:");
}

export function generateRoomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(9);
  let result = "";
  for (let i = 0; i < 9; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export function generateToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function createRoom(
  problemId: string,
  language: Language,
  customProblem?: Problem
): Promise<{ room: Room; interviewerToken: string }> {
  const backendUrl = getBackendHttpUrl();
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, language, customProblem }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("[CodeRoom Store] Failed to create room on backend:", err);
    }
  }

  // Fallback local memory
  const id = generateRoomId();
  const interviewerToken = generateToken();
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000;

  const room: Room = {
    id,
    problemId,
    language,
    createdAt: now,
    expiresAt,
    ended: false,
    interviewerToken,
    customProblem,
  };

  roomStore.set(id, room);
  return { room, interviewerToken };
}

export async function getRoom(id: string): Promise<Room | null> {
  const backendUrl = getBackendHttpUrl();
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.room;
      }
      if (res.status === 404) return null;
    } catch (err) {
      console.error("[CodeRoom Store] Failed to fetch room from backend:", err);
    }
  }

  const room = roomStore.get(id);
  if (!room) return null;
  if (Date.now() > room.expiresAt) {
    roomStore.delete(id);
    return null;
  }
  return room;
}

export async function endRoom(id: string, interviewerToken: string): Promise<boolean> {
  const backendUrl = getBackendHttpUrl();
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/rooms/${id}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", interviewerToken }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.error("[CodeRoom Store] Failed to end room on backend:", err);
    }
  }

  const room = roomStore.get(id);
  if (!room) return false;
  if (room.interviewerToken !== interviewerToken) return false;
  room.ended = true;
  room.endedAt = room.endedAt || Date.now();
  roomStore.set(id, room);
  return true;
}
