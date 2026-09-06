import { NextResponse } from "next/server";
import { createRoom } from "@/lib/rooms/store";
import { getProblemById, Language, Problem } from "@/data/problems";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, language, customProblem } = body as {
      problemId: string;
      language: Language;
      customProblem?: Problem;
    };

    if (!customProblem && (!problemId || !getProblemById(problemId))) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    if (language !== "javascript" && language !== "typescript") {
      return NextResponse.json({ error: "Language must be javascript or typescript" }, { status: 400 });
    }

    const { room, interviewerToken } = await createRoom(problemId || "custom", language, customProblem);

    return NextResponse.json({
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
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
