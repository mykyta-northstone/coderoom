import { NextResponse } from "next/server";
import { getRoom, endRoom } from "@/lib/rooms/store";
import { getProblemById } from "@/data/problems";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  if (!room) {
    return NextResponse.json({ error: "Room not found or expired" }, { status: 404 });
  }

  const problem = getProblemById(room.problemId);

  return NextResponse.json({
    room: {
      id: room.id,
      problemId: room.problemId,
      language: room.language,
      createdAt: room.createdAt,
      expiresAt: room.expiresAt,
      ended: room.ended,
    },
    problem,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  try {
    const body = await request.json();
    const { action, interviewerToken } = body as { action: string; interviewerToken: string };

    if (action === "end") {
      const success = await endRoom(roomId, interviewerToken);
      if (!success) {
        return NextResponse.json({ error: "Unauthorized or room not found" }, { status: 403 });
      }
      return NextResponse.json({ success: true, ended: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
