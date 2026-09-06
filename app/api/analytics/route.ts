import { NextResponse } from "next/server";

interface AnalyticsRecord {
  event: string;
  payload?: Record<string, any>;
  timestamp: number;
}

const globalAnalyticsStore = globalThis as unknown as {
  codeRoomAnalytics?: {
    counts: Record<string, number>;
    recentEvents: AnalyticsRecord[];
  };
};

if (!globalAnalyticsStore.codeRoomAnalytics) {
  globalAnalyticsStore.codeRoomAnalytics = {
    counts: {
      landing_view: 0,
      create_interview: 0,
      candidate_joined: 0,
      interview_started: 0,
      interview_ended: 0,
    },
    recentEvents: [],
  };
}

const analyticsStore = globalAnalyticsStore.codeRoomAnalytics;

// POST /api/analytics -> Log custom event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, payload } = body as { event: string; payload?: Record<string, any> };

    if (!event) {
      return NextResponse.json({ error: "Missing event name" }, { status: 400 });
    }

    analyticsStore.counts[event] = (analyticsStore.counts[event] || 0) + 1;

    analyticsStore.recentEvents.unshift({
      event,
      payload,
      timestamp: Date.now(),
    });

    // Keep last 100 events
    if (analyticsStore.recentEvents.length > 100) {
      analyticsStore.recentEvents.pop();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid analytics payload" }, { status: 400 });
  }
}

// GET /api/analytics -> View live platform metrics
export async function GET() {
  return NextResponse.json({
    summary: analyticsStore.counts,
    recentEventsCount: analyticsStore.recentEvents.length,
    recentEvents: analyticsStore.recentEvents.slice(0, 20),
  });
}
