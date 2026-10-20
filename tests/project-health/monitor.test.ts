import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startProjectHealthMonitor } from "../../src/project-health/monitor";
import type { HealthTargets } from "../../src/project-health/contract";
import type { ProjectHealthView } from "../../src/project-health/view";

const start = Date.parse("2026-10-20T12:00:00Z");
const endpoint = "https://status.example.test/status.json";
const targets: HealthTargets = {
  georisk: { url: "https://demo.example.test/", role: "demo", coverage: "http-content" },
};
function fixture(checkedAt = start) {
  const checked = new Date(checkedAt).toISOString();
  const until = new Date(checkedAt + 2_700_000).toISOString();
  return {
    schemaVersion: 1, generatedAt: checked, maxAgeSeconds: 2700,
    source: { provider: "local", event: "test-fixture", runId: null, commit: null, observationScope: "single-runner" },
    projects: ["georisk", "seven-tools", "playsenac", "mesa"].map(id => ({
      id, name: id, targetId: `test-${id}`, role: "demo",
      url: id === "georisk" ? targets.georisk!.url : null,
      phase: id === "georisk" ? "active" : "pending",
      status: id === "georisk" ? "operational" : "unknown",
      reasonCode: id === "georisk" ? "ok" : "demo_pending",
      publicMessage: "Fixture fictícia de teste",
      checkedAt: id === "georisk" ? checked : null, lastSuccessAt: null,
      validUntil: id === "georisk" ? until : null, coverage: "http-content", maintenance: null,
      components: id === "georisk" ? [{
        id: "public-entry", status: "operational", reasonCode: "ok",
        checkedAt: checked, validUntil: until, attempts: 1,
        checks: ["html-marker", "entry-script"], responseTimeMs: 30, httpStatus: 200,
      }] : [],
    })),
  };
}
function response(data: unknown = fixture(), type = "application/json") {
  return new Response(JSON.stringify(data), { headers: { "content-type": type } });
}

let stop: (() => void) | undefined;
let browserWindow: EventTarget;
let browserDocument: EventTarget & { visibilityState: string };
let history: ProjectHealthView[];
const current = () => history.at(-1)!;
function begin(url: string | null = endpoint) {
  stop = startProjectHealthMonitor({ url, targets, onChange: views => history.push(views.georisk) });
}
async function settle() { await vi.advanceTimersByTimeAsync(1); }
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(start);
  browserWindow = new EventTarget();
  browserDocument = Object.assign(new EventTarget(), { visibilityState: "visible" });
  vi.stubGlobal("window", browserWindow);
  vi.stubGlobal("document", browserDocument);
  history = [];
});
afterEach(() => { stop?.(); stop = undefined; vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("public health monitor lifecycle", () => {
  it("expires while the page stays open; repeated downloads never renew evidence", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => response()));
    begin(); await settle();
    expect(current()?.status).toBe("operational");
    await vi.advanceTimersByTimeAsync(2_700_000);
    expect(current()?.status).toBe("unknown");
    expect(current()?.checkedAt).toBe(new Date(start).toISOString());
  });
  it("invalidates immediately on focus after a suspended tab, before network completes", async () => {
    const fetcher = vi.fn().mockImplementationOnce(async () => response())
      .mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetcher);
    begin(); await settle();
    vi.setSystemTime(start + 2_700_001);
    browserWindow.dispatchEvent(new Event("focus"));
    expect(current()?.status).toBe("unknown");
    browserDocument.dispatchEvent(new Event("visibilitychange"));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("makes failed refresh unknown without losing the previous observation time", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementationOnce(async () => response()).mockRejectedValue(Error("offline")));
    begin(); await settle();
    await vi.advanceTimersByTimeAsync(60_000);
    browserWindow.dispatchEvent(new Event("focus")); await settle();
    expect(current()?.status).toBe("unknown");
    expect(current()?.checkedAt).toBe(new Date(start).toISOString());
  });
  it.each([
    ["wrong content type", () => response(fixture(), "text/html")],
    ["invalid schema", () => response({ schemaVersion: 99 })],
    ["oversized body", () => new Response(" ".repeat(70_000), { headers: { "content-type": "application/json" } })],
    ["HTTP error", () => new Response("unavailable", { status: 503 })],
  ])("handles %s as unknown", async (_label, getResponse) => {
    vi.stubGlobal("fetch", vi.fn(async () => getResponse()));
    begin(); await settle();
    expect(current()?.status).toBe("unknown");
  });
  it("bounds hung requests and does not turn timeout into maintenance", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementationOnce(async () => response())
      .mockImplementation((_url, init) => new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      })));
    begin(); await settle();
    expect(current()?.status).toBe("operational");
    await vi.advanceTimersByTimeAsync(300_000);
    expect(current()?.status).toBe("operational");
    await vi.advanceTimersByTimeAsync(8_001);
    expect(current()?.status).toBe("unknown");
    expect(current()?.maintenance).toBeNull();
  });
  it("does not accept an older snapshot after a newer one", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementationOnce(async () => response())
      .mockImplementation(async () => response(fixture(start - 60_000))));
    begin(); await settle();
    await vi.advanceTimersByTimeAsync(60_000);
    browserWindow.dispatchEvent(new Event("focus")); await settle();
    expect(current()?.status).toBe("unknown");
    expect(current()?.checkedAt).toBe(new Date(start).toISOString());
  });
  it("omits credentials/referrer and cleans up requests, listeners and timers", async () => {
    const fetcher = vi.fn(async () => response());
    vi.stubGlobal("fetch", fetcher);
    begin(); await settle();
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({ credentials: "omit", referrerPolicy: "no-referrer", cache: "no-cache", redirect: "error" });
    stop!(); stop = undefined;
    const count = history.length;
    browserWindow.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(600_000);
    expect(history).toHaveLength(count);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("does not fetch or invent availability without a configured HTTPS endpoint", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    begin(null); await settle();
    expect(current()?.status).toBe("unknown");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { "content-type": "text/html" },
    { "content-type": "application/json", "content-length": "90000" },
  ])("cancels a streaming body rejected by headers: %j", async headers => {
    let cancelled = false;
    let requestSignal: AbortSignal | undefined;
    const stream = new ReadableStream({ cancel() { cancelled = true; } });
    vi.stubGlobal("fetch", vi.fn(async (_url, init) => {
      requestSignal = init.signal;
      return new Response(stream, { headers });
    }));
    begin(); await settle();
    expect(cancelled).toBe(true);
    expect(requestSignal?.aborted).toBe(true);
    expect(current()?.status).toBe("unknown");
  });
});
