import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import crypto from "crypto";
import { getProblemById, Language, Problem } from "../data/problems";

const messageSync = 0;
const messageAwareness = 1;

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

type RoomState = {
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
  conns: Map<WebSocket, Set<number>>;
};

const roomMetaStore = new Map<string, Room>();
const rooms = new Map<string, RoomState>();

function generateRoomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(9);
  let result = "";
  for (let i = 0; i < 9; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

function generateToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

function createRoom(
  problemId: string,
  language: Language,
  customProblem?: Problem
): { room: Room; interviewerToken: string } {
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

  roomMetaStore.set(id, room);
  return { room, interviewerToken };
}

function getRoom(id: string): Room | null {
  const room = roomMetaStore.get(id);
  if (!room) return null;
  if (Date.now() > room.expiresAt) {
    roomMetaStore.delete(id);
    return null;
  }
  return room;
}

const PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : process.env.WS_PORT
  ? parseInt(process.env.WS_PORT, 10)
  : 1234;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  // POST /api/rooms -> Create room
  if (req.method === "POST" && url.pathname === "/api/rooms") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const { problemId, language, customProblem } = parsed;
        const { room, interviewerToken } = createRoom(problemId, language, customProblem);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            room: {
              id: room.id,
              problemId: room.problemId,
              language: room.language,
              createdAt: room.createdAt,
              expiresAt: room.expiresAt,
              ended: room.ended,
              customProblem: room.customProblem,
            },
            interviewerToken,
          })
        );
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request payload" }));
      }
    });
    return;
  }

  // GET /api/rooms/:id -> Get room info
  const getMatch = url.pathname.match(/^\/api\/rooms\/([a-zA-Z0-9_-]+)$/);
  if (req.method === "GET" && getMatch) {
    const roomId = getMatch[1];
    const room = getRoom(roomId);
    if (!room) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Room not found or expired" }));
      return;
    }
    const problem = room.customProblem || getProblemById(room.problemId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        room: {
          id: room.id,
          problemId: room.problemId,
          language: room.language,
          createdAt: room.createdAt,
          expiresAt: room.expiresAt,
          ended: room.ended,
          customProblem: room.customProblem,
        },
        problem,
      })
    );
    return;
  }

  // POST /api/rooms/:id/end -> End room
  const endMatch = url.pathname.match(/^\/api\/rooms\/([a-zA-Z0-9_-]+)\/end$/);
  if (req.method === "POST" && endMatch) {
    const roomId = endMatch[1];
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const room = getRoom(roomId);
        if (room) {
          room.ended = true;
          room.endedAt = room.endedAt || Date.now();
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, ended: true, endedAt: room?.endedAt }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request payload" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

console.log(`[Pairlet WS & API] Server running on port ${PORT}`);

function getOrCreateRoomState(roomId: string): RoomState {
  let state = rooms.get(roomId);
  if (!state) {
    const doc = new Y.Doc();
    const awareness = new awarenessProtocol.Awareness(doc);
    const conns = new Map<WebSocket, Set<number>>();

    state = { doc, awareness, conns };
    rooms.set(roomId, state);

    const roomMeta = getRoom(roomId);
    if (roomMeta) {
      const problem = roomMeta.customProblem || getProblemById(roomMeta.problemId);
      if (problem) {
        const starterCode = problem.starterCode[roomMeta.language] || "";
        const ytext = doc.getText("monaco");
        if (ytext.toString() === "") {
          ytext.insert(0, starterCode);
        }
      }
    }

    doc.on("update", (update: Uint8Array, origin: any) => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);
      const message = encoding.toUint8Array(encoder);

      for (const [conn] of state!.conns) {
        if (conn.readyState === WebSocket.OPEN && conn !== origin) {
          send(conn, message);
        }
      }
    });

    awareness.on("update", ({ added, updated, removed }: any, origin: any) => {
      const changedClients = added.concat(updated, removed);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients)
      );
      const message = encoding.toUint8Array(encoder);

      for (const [conn] of state!.conns) {
        if (conn.readyState === WebSocket.OPEN) {
          send(conn, message);
        }
      }
    });
  }
  return state;
}

function send(conn: WebSocket, message: Uint8Array) {
  if (conn.readyState === WebSocket.OPEN) {
    conn.send(message);
  }
}

wss.on("connection", (conn: WebSocket, req) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const roomId = url.pathname.replace(/^\/+/, "").split("/")[0] || "default";

  const state = getOrCreateRoomState(roomId);
  const { doc, awareness, conns } = state;

  const controlledIds = new Set<number>();
  conns.set(conn, controlledIds);

  const syncEncoder = encoding.createEncoder();
  encoding.writeVarUint(syncEncoder, messageSync);
  syncProtocol.writeSyncStep1(syncEncoder, doc);
  send(conn, encoding.toUint8Array(syncEncoder));

  if (awareness.getStates().size > 0) {
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, messageAwareness);
    encoding.writeVarUint8Array(
      awarenessEncoder,
      awarenessProtocol.encodeAwarenessUpdate(
        awareness,
        Array.from(awareness.getStates().keys())
      )
    );
    send(conn, encoding.toUint8Array(awarenessEncoder));
  }

  conn.on("message", (data: ArrayBuffer | Buffer) => {
    try {
      const u8 = new Uint8Array(data);
      const decoder = decoding.createDecoder(u8);
      const messageType = decoding.readVarUint(decoder);

      if (messageType === messageSync) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn);
        if (encoding.length(encoder) > 1) {
          send(conn, encoding.toUint8Array(encoder));
        }
      } else if (messageType === messageAwareness) {
        const update = decoding.readVarUint8Array(decoder);
        awarenessProtocol.applyAwarenessUpdate(awareness, update, conn);
      }
    } catch (err) {
      console.error("[Pairlet WS] Error processing message:", err);
    }
  });

  conn.on("close", () => {
    conns.delete(conn);
    awarenessProtocol.removeAwarenessStates(
      awareness,
      Array.from(controlledIds),
      null
    );
  });
});

server.listen(PORT);
