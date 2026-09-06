import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import { getRoom } from "../lib/rooms/store";
import { getProblemById } from "../data/problems";

const messageSync = 0;
const messageAwareness = 1;

type RoomState = {
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
  conns: Map<WebSocket, Set<number>>;
};

const rooms = new Map<string, RoomState>();

// Support process.env.PORT (Render / Heroku / Cloud) as primary fallback
const PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : process.env.WS_PORT
  ? parseInt(process.env.WS_PORT, 10)
  : 1234;

const wss = new WebSocketServer({ port: PORT });

console.log(`[CodeRoom WS] Collaboration server running on port ${PORT}`);

function getOrCreateRoomState(roomId: string): RoomState {
  let state = rooms.get(roomId);
  if (!state) {
    const doc = new Y.Doc();
    const awareness = new awarenessProtocol.Awareness(doc);
    const conns = new Map<WebSocket, Set<number>>();

    state = { doc, awareness, conns };
    rooms.set(roomId, state);

    // Populate starter code if available
    const roomMeta = getRoom(roomId);
    if (roomMeta) {
      const problem = getProblemById(roomMeta.problemId);
      if (problem) {
        const starterCode = problem.starterCode[roomMeta.language] || "";
        const ytext = doc.getText("monaco");
        if (ytext.toString() === "") {
          ytext.insert(0, starterCode);
        }
      }
    }

    // Yjs document update broadcast
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

    // Awareness update broadcast
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

  // Send Sync Step 1 to new client
  const syncEncoder = encoding.createEncoder();
  encoding.writeVarUint(syncEncoder, messageSync);
  syncProtocol.writeSyncStep1(syncEncoder, doc);
  send(conn, encoding.toUint8Array(syncEncoder));

  // Send current Awareness state
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
      console.error("[CodeRoom WS] Error processing message:", err);
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
