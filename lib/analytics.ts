import { track } from "@vercel/analytics";

type AnalyticsEvent =
  | "landing_view"
  | "create_interview"
  | "candidate_joined"
  | "interview_started"
  | "interview_ended";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, any>) {
  if (typeof window === "undefined") return;

  // Console output for local dev inspection
  console.log(`[CodeRoom Analytics] ${event}`, payload || "");

  // Built-in free API logger (/api/analytics)
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload }),
    }).catch(() => {});
  } catch (err) {}

  // Vercel Analytics custom event tracking
  try {
    track(event, payload);
  } catch (err) {}

  // Google Analytics (gtag.js) event hook
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, payload);
  }

  // Umami event hook
  if (typeof (window as any).umami === "object" && typeof (window as any).umami.track === "function") {
    (window as any).umami.track(event, payload);
  }

  // PostHog event hook
  if (typeof (window as any).posthog !== "undefined") {
    (window as any).posthog.capture(event, payload);
  }
}
