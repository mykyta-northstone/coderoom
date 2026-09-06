type AnalyticsEvent =
  | "landing_view"
  | "create_interview"
  | "candidate_joined"
  | "interview_started"
  | "interview_ended";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, any>) {
  if (typeof window === "undefined") return;

  // Development logger & pluggable adapter point
  console.log(`[CodeRoom Analytics] ${event}`, payload || "");

  // Optional global event hook (e.g. window.gtag or window.posthog)
  if (typeof (window as any).posthog !== "undefined") {
    (window as any).posthog.capture(event, payload);
  }
}
