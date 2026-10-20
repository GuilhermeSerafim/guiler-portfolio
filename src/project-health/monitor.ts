import {
  nextHealthDeadline,
  parseHealthFeed,
  projectHealthViews,
  type HealthFeed,
  type HealthTargets,
  type ProjectId,
} from "./contract";
import type { ProjectHealthView } from "./view";

const POLL_MS = 5 * 60_000;
const FOCUS_THROTTLE_MS = 60_000;
const MAX_BYTES = 64 * 1024;
const TIMEOUT_MS = 8_000;

function safeEndpoint(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash
      ? url.href : null;
  } catch { return null; }
}

async function readDocument(response: Response): Promise<unknown> {
  if (!response.ok || !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) {
    await response.body?.cancel().catch(() => {});
    throw new Error("Invalid health response");
  }
  if (Number(response.headers.get("content-length")) > MAX_BYTES || !response.body) {
    await response.body?.cancel().catch(() => {});
    throw new Error("Invalid health body");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new Error("Health body too large");
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as unknown;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

/** One feed reader shared by every project; no tracking or persistent storage. */
export function startProjectHealthMonitor(options: {
  url: string | null;
  targets: HealthTargets;
  onChange: (views: Record<ProjectId, ProjectHealthView>) => void;
}): () => void {
  const url = safeEndpoint(options.url);
  let feed: HealthFeed | null = null;
  let unavailable = false;
  let disposed = false;
  let lastAttempt = -Infinity;
  let controller: AbortController | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function publish() {
    if (!disposed) options.onChange(projectHealthViews(feed, options.targets, Date.now(), unavailable));
  }
  function schedule() {
    clearTimeout(timer);
    if (disposed || !url) return;
    const now = Date.now();
    const deadline = nextHealthDeadline(feed, now);
    timer = setTimeout(tick, Math.max(1, Math.min(60_000, deadline === null ? 60_000 : deadline - now)));
  }
  async function refresh() {
    if (!url || controller || disposed) return;
    lastAttempt = Date.now();
    const request = new AbortController();
    controller = request;
    timeout = setTimeout(() => request.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        signal: request.signal,
        credentials: "omit",
        referrerPolicy: "no-referrer",
        cache: "no-cache",
        redirect: "error",
        headers: { Accept: "application/json" },
      });
      const parsed = parseHealthFeed(await readDocument(response), Date.now());
      if (!parsed || (feed && Date.parse(parsed.generatedAt) < Date.parse(feed.generatedAt))) {
        throw new Error("Invalid or older health snapshot");
      }
      if (disposed || request.signal.aborted) return;
      feed = parsed;
      unavailable = false;
    } catch {
      if (!disposed) unavailable = true;
    } finally {
      request.abort();
      clearTimeout(timeout);
      controller = null;
      if (!disposed) { publish(); schedule(); }
    }
  }
  function tick() {
    publish();
    if (document.visibilityState !== "hidden" && Date.now() - lastAttempt >= POLL_MS) void refresh();
    schedule();
  }
  function onFocus() {
    if (document.visibilityState === "hidden") return;
    // Expire the old observation synchronously, even if the new fetch hangs.
    publish();
    if (Date.now() - lastAttempt >= FOCUS_THROTTLE_MS) void refresh();
    schedule();
  }
  publish();
  if (url) {
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    void refresh();
    schedule();
  }
  return () => {
    disposed = true;
    clearTimeout(timer);
    clearTimeout(timeout);
    controller?.abort();
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onFocus);
  };
}
