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

  // Google Analytics 4 (gtag.js) event dispatching
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, payload);
  }

  // Vercel Analytics custom event tracking (if enabled)
  try {
    track(event, payload);
  } catch (err) {}

  // Umami event hook (if configured)
  if (typeof (window as any).umami === "object" && typeof (window as any).umami.track === "function") {
    (window as any).umami.track(event, payload);
  }

  // PostHog event hook (if configured)
  if (typeof (window as any).posthog !== "undefined") {
    (window as any).posthog.capture(event, payload);
  }
}
