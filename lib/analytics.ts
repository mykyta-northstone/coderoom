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

  // Vercel Analytics custom event tracking
  try {
    track(event, payload);
  } catch (err) {
    // Ignore analytics tracking errors silently
  }

  // Google Analytics (gtag.js) event hook
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, payload);
  }

  // PostHog event hook
  if (typeof (window as any).posthog !== "undefined") {
    (window as any).posthog.capture(event, payload);
  }
}
