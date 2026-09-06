import { NextResponse } from "next/server";
import { createRoom } from "@/lib/rooms/store";
import { getProblemById, Language } from "@/data/problems";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, language } = body as { problemId: string; language: Language };

    if (!problemId || !getProblemById(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    if (language !== "javascript" && language !== "typescript") {
      return NextResponse.json({ error: "Language must be javascript or typescript" }, { status: 400 });
    }

    const { room, interviewerToken } = createRoom(problemId, language);

    return NextResponse.json({
      room: {
        id: room.id,
        problemId: room.problemId,
        language: room.language,
        createdAt: room.createdAt,
        expiresAt: room.expiresAt,
        ended: room.ended,
      },
      interviewerToken,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
