import { Language, getProblemById } from "@/data/problems";
import crypto from "crypto";

export type Room = {
  id: string;
  problemId: string;
  language: Language;
  createdAt: number;
  expiresAt: number;
  ended: boolean;
  interviewerToken: string;
};

// Global in-memory store for Next.js dev & prod runtime
const globalRoomStore = globalThis as unknown as {
  codeRoomStore?: Map<string, Room>;
};

if (!globalRoomStore.codeRoomStore) {
  globalRoomStore.codeRoomStore = new Map<string, Room>();
}

const roomStore = globalRoomStore.codeRoomStore;

export function generateRoomId(): string {
  // Generate random 9-character alphanumeric room ID like a8F2kLm9
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

export function createRoom(problemId: string, language: Language): { room: Room; interviewerToken: string } {
  const id = generateRoomId();
  const interviewerToken = generateToken();
  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

  const room: Room = {
    id,
    problemId,
    language,
    createdAt: now,
    expiresAt,
    ended: false,
    interviewerToken,
  };

  roomStore.set(id, room);
  return { room, interviewerToken };
}

export function getRoom(id: string): Room | null {
  const room = roomStore.get(id);
  if (!room) return null;
  if (Date.now() > room.expiresAt) {
    roomStore.delete(id);
    return null;
  }
  return room;
}

export function endRoom(id: string, interviewerToken: string): boolean {
  const room = getRoom(id);
  if (!room) return false;
  if (room.interviewerToken !== interviewerToken) {
    return false; // Unauthorized
  }
  room.ended = true;
  roomStore.set(id, room);
  return true;
}
