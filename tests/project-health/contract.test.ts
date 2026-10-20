import { describe, expect, it } from "vitest";
import {
  nextHealthDeadline,
  parseHealthFeed,
  projectHealthViews,
  type HealthFeed,
  type HealthTargets,
} from "../../src/project-health/contract";

const NOW = Date.parse("2026-10-20T15:10:00Z");
const CHECKED = "2026-10-20T15:00:00Z";
const targets: HealthTargets = {
  georisk: { url: "https://demo.example", role: "demo", coverage: "http-content" },
  mesa: { url: "https://example.com/mesa", role: "original", coverage: "http-content" },
};

function fixture(): HealthFeed {
  return {
    schemaVersion: 1,
    generatedAt: "2026-10-20T15:01:00Z",
    maxAgeSeconds: 2700,
    source: {
      provider: "github-actions", event: "schedule", runId: "123", commit: null,
      observationScope: "single-runner",
    },
    projects: ["georisk", "seven-tools", "playsenac", "mesa"].map((id) => ({
      id: id as HealthFeed["projects"][number]["id"],
      name: id, targetId: `${id}-target-a`, role: id === "mesa" ? "original" : "demo",
      url: id === "georisk" ? "https://demo.example/" : id === "mesa" ? "https://example.com/mesa" : null,
      phase: id === "georisk" || id === "mesa" ? "active" : "pending",
      status: id === "georisk" || id === "mesa" ? "operational" : "unknown",
      reasonCode: id === "georisk" || id === "mesa" ? "ok" : "demo_pending",
      publicMessage: "Do not use this arbitrary server message as proof of API health.",
      checkedAt: id === "georisk" || id === "mesa" ? CHECKED : null,
      lastSuccessAt: id === "georisk" || id === "mesa" ? CHECKED : null,
      validUntil: id === "georisk" || id === "mesa" ? "2026-10-20T15:45:00Z" : null,
      coverage: "http-content",
      components: id === "georisk" || id === "mesa" ? [{
        id: "public-entry", status: "operational", reasonCode: "ok", checkedAt: CHECKED,
        validUntil: "2026-10-20T15:45:00Z", attempts: 1,
        checks: ["html-marker", "entry-script"], responseTimeMs: 120, httpStatus: 200,
      }] : [],
      maintenance: null,
    })),
  };
}

function views(feed = fixture(), now = NOW, unavailable = false) {
  return projectHealthViews(parseHealthFeed(feed, now), targets, now, unavailable);
}

describe("untrusted health feed contract", () => {
  it("accepts the concrete v1 snapshot and normalizes root URL identity for the consumer", () => {
    const parsed = parseHealthFeed(fixture(), NOW);
    expect(parsed).not.toBeNull();
    expect(projectHealthViews(parsed, targets, NOW).georisk.status).toBe("operational");
  });

  it.each([
    ["unknown schema", (f: any) => { f.schemaVersion = 2; }],
    ["incorrect max age", (f: any) => { f.maxAgeSeconds = 999999; }],
    ["missing source", (f: any) => { delete f.source; }],
    ["unknown source provider", (f: any) => { f.source.provider = "untrusted"; }],
    ["incorrect observation scope", (f: any) => { f.source.observationScope = "global"; }],
    ["duplicate project", (f: any) => { f.projects[1] = f.projects[0]; }],
    ["unknown project", (f: any) => { f.projects[0].id = "other"; }],
    ["missing project", (f: any) => { f.projects.pop(); }],
    ["unknown status", (f: any) => { f.projects[0].status = "healthy"; }],
    ["unknown phase", (f: any) => { f.projects[0].phase = "ready"; }],
    ["unknown role", (f: any) => { f.projects[0].role = "production"; }],
    ["unknown coverage", (f: any) => { f.projects[0].coverage = "browser"; }],
    ["extra properties", (f: any) => { f.projects[0].privateDebug = "x"; }],
    ["invalid URL", (f: any) => { f.projects[0].url = "javascript:alert(1)"; }],
    ["credentials in URL", (f: any) => { f.projects[0].url = "https://secret:password@demo.example/"; }],
    ["invalid component ID", (f: any) => { f.projects[0].components[0].id = "api"; }],
    ["unknown component status", (f: any) => { f.projects[0].components[0].status = "green"; }],
    ["invalid attempt count", (f: any) => { f.projects[0].components[0].attempts = 3; }],
    ["unknown check", (f: any) => { f.projects[0].components[0].checks.push("api"); }],
    ["invalid HTTP status", (f: any) => { f.projects[0].components[0].httpStatus = 600; }],
  ])("rejects %s", (_label, mutate) => {
    const feed = fixture();
    mutate(feed);
    expect(parseHealthFeed(feed, NOW)).toBeNull();
  });

  it.each([
    "2026-02-30T15:00:00Z", "2026-10-20", "2026-10-20T15:00:00",
    "2026-10-20T15:00:00-03:00", "2026-10-20T24:00:00Z", "not a date",
  ])("rejects non-UTC or nonexistent timestamp %s", (timestamp) => {
    const feed = fixture();
    feed.projects[0].checkedAt = timestamp;
    expect(parseHealthFeed(feed, NOW)).toBeNull();
  });

  it("accepts explicit UTC offsets and fractional seconds emitted by the monitor", () => {
    const feed = fixture();
    feed.generatedAt = "2026-10-20T15:01:00.123456+00:00";
    expect(parseHealthFeed(feed, NOW)).not.toBeNull();
  });

  it.each(["generatedAt", "checkedAt", "lastSuccessAt", "componentCheckedAt"])(
    "rejects %s over five minutes in the future",
    (field) => {
      const feed = fixture();
      const future = "2026-10-20T15:15:00.001Z";
      if (field === "generatedAt") feed.generatedAt = future;
      else if (field === "componentCheckedAt") feed.projects[0].components[0].checkedAt = future;
      else feed.projects[0][field as "checkedAt" | "lastSuccessAt"] = future;
      expect(parseHealthFeed(feed, NOW)).toBeNull();
    },
  );

  it("permits planned maintenance and expiry in the future without treating them as observations", () => {
    const feed = fixture();
    feed.projects[0].validUntil = "2026-11-01T00:00:00Z";
    feed.projects[0].maintenance = {
      startsAt: "2026-10-21T00:00:00Z", endsAt: "2026-10-21T01:00:00Z", message: "Atualização programada.",
    };
    expect(parseHealthFeed(feed, NOW)).not.toBeNull();
  });

  it("rejects inverted maintenance windows", () => {
    const feed = fixture();
    feed.projects[0].maintenance = {
      startsAt: "2026-10-21T01:00:00Z", endsAt: "2026-10-21T00:00:00Z", message: "Atualização.",
    };
    expect(parseHealthFeed(feed, NOW)).toBeNull();
  });
});

describe("evidence freshness and target isolation", () => {
  it("expires exactly 45 minutes after the actual check even with a newer snapshot and generous expiry", () => {
    const feed = fixture();
    feed.generatedAt = "2026-10-20T15:44:00Z";
    for (const project of [feed.projects[0], feed.projects[3]]) {
      project.validUntil = "2026-10-21T00:00:00Z";
      project.components[0].validUntil = "2026-10-21T00:00:00Z";
    }
    expect(views(feed, Date.parse("2026-10-20T15:44:59.999Z")).georisk.status).toBe("operational");
    expect(views(feed, Date.parse("2026-10-20T15:45:00Z")).georisk.status).toBe("unknown");
  });

  it.each(["project", "component"])("honors an earlier %s validUntil", (scope) => {
    const feed = fixture();
    const evidence = scope === "project" ? feed.projects[0] : feed.projects[0].components[0];
    evidence.validUntil = "2026-10-20T15:10:00Z";
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it("does not renew an older component when aggregate checkedAt becomes fresh", () => {
    const feed = fixture();
    feed.projects[0].components[0].checkedAt = "2026-10-20T14:25:00Z";
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it.each(["project", "component", "empty-components"])("does not show green with missing %s evidence", (scope) => {
    const feed = fixture();
    if (scope === "empty-components") feed.projects[0].components = [];
    else if (scope === "project") feed.projects[0].checkedAt = null;
    else feed.projects[0].components[0].checkedAt = null;
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it("does not show green when component evidence is unknown or lacks the entry-script check", () => {
    const feed = fixture();
    feed.projects[0].components[0].status = "unknown";
    expect(views(feed).georisk.status).toBe("unknown");
    feed.projects[0].components[0].status = "operational";
    feed.projects[0].components[0].checks = ["html-marker"];
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it.each([null, 301, 401, 403, 429, 503])("does not confirm success with contradictory HTTP result %s", (code) => {
    const feed = fixture();
    feed.projects[0].components[0].httpStatus = code;
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it.each([401, 403, 429])("does not claim downtime when the observer receives HTTP %s", (code) => {
    const feed = fixture();
    feed.projects[0].status = "down";
    Object.assign(feed.projects[0].components[0], { status: "down", attempts: 2, httpStatus: code });
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it("only confirms a failed observation after a repeated failure", () => {
    const feed = fixture();
    feed.projects[0].status = "down";
    Object.assign(feed.projects[0].components[0], { status: "down", attempts: 1, httpStatus: 503 });
    expect(views(feed).georisk.status).toBe("unknown");
    feed.projects[0].components[0].attempts = 2;
    expect(views(feed).georisk.status).toBe("down");
  });

  it("does not infer recovery without a repeated successful attempt", () => {
    const feed = fixture();
    feed.projects[0].status = "degraded";
    Object.assign(feed.projects[0].components[0], { status: "degraded", attempts: 1 });
    expect(views(feed).georisk.status).toBe("unknown");
    feed.projects[0].components[0].attempts = 2;
    expect(views(feed).georisk.status).toBe("degraded");
  });

  it.each(["probe_blocked", "rate_limited", "unexpected_redirect", "collector_error"])(
    "cannot claim success when a known observer failure reason is %s",
    (reasonCode) => {
      const feed = fixture();
      feed.projects[0].components[0].reasonCode = reasonCode;
      expect(views(feed).georisk.status).toBe("unknown");
    },
  );

  it.each(["url", "role", "coverage", "unconfigured"])("does not reuse observations after target %s changes", (change) => {
    const changed = structuredClone(targets);
    if (change === "url") changed.georisk!.url = "https://other.example/";
    if (change === "role") changed.georisk!.role = "original";
    if (change === "coverage") (changed.georisk as any).coverage = "browser";
    if (change === "unconfigured") delete changed.georisk;
    const view = projectHealthViews(parseHealthFeed(fixture(), NOW), changed, NOW).georisk;
    expect(view.status).toBe("unknown");
    expect(view.checkedAt).toBeNull();
  });

  it("keeps pending projects unknown without fabricating dates", () => {
    const result = views();
    expect(result["seven-tools"].status).toBe("unknown");
    expect(result["seven-tools"].checkedAt).toBeNull();
    expect(result.playsenac.status).toBe("unknown");
  });

  it("clears green on fetch failure but preserves the previous actual check time", () => {
    const view = views(fixture(), NOW, true).georisk;
    expect(view.status).toBe("unknown");
    expect(view.checkedAt).toBe(CHECKED);
    expect(projectHealthViews(null, targets, NOW).georisk.checkedAt).toBeNull();
  });

  it.each(["brand_new_reason", "__proto__", "constructor", "toString"])(
    "uses neutral plain text for unknown reason code %s without trusting arbitrary server prose",
    (reasonCode) => {
    const feed = fixture();
    feed.projects[0].reasonCode = reasonCode;
    feed.projects[0].publicMessage = "<b>Todas as APIs e IA estão funcionando</b>";
    const view = views(feed).georisk;
    expect(typeof view.message).toBe("string");
    expect(view.message).not.toContain(feed.projects[0].publicMessage);
    expect(view.message).not.toMatch(/<[^>]+>/);
    expect(view.coverage).toContain("HTTP");
    expect(view.coverage).toMatch(/não/i);
  });

  it("cannot use a mismatched reason code to claim a failed check succeeded", () => {
    const feed = fixture();
    feed.projects[0].status = "down";
    feed.projects[0].components[0].status = "down";
    feed.projects[0].components[0].attempts = 2;
    const view = views(feed).georisk;
    expect(view.status).toBe("down");
    expect(view.message).not.toMatch(/responderam|recuperada/);
  });
});

describe("explicit maintenance and next transition", () => {
  function maintained() {
    const feed = fixture();
    feed.projects[0].status = "maintenance";
    feed.projects[0].components[0].status = "maintenance";
    feed.projects[0].maintenance = {
      startsAt: "2026-10-20T15:05:00Z", endsAt: "2026-10-20T16:00:00Z", message: "Atualização programada.",
    };
    return feed;
  }

  it("only exposes maintenance inside its explicit window", () => {
    expect(views(maintained()).georisk.status).toBe("maintenance");
    expect(views(maintained(), Date.parse("2026-10-20T15:04:59Z")).georisk.status).toBe("unknown");
    const ended = views(maintained(), Date.parse("2026-10-20T16:00:00Z")).georisk;
    expect(ended.status).toBe("unknown");
    expect(ended.maintenance).toBeNull();
  });

  it("keeps the bounded maintenance notice separate from expired or unavailable observations", () => {
    const stale = views(maintained(), Date.parse("2026-10-20T15:50:00Z")).georisk;
    expect(stale.status).toBe("unknown");
    expect(stale.maintenance?.endsAt).toBe("2026-10-20T16:00:00Z");
    const unavailable = views(maintained(), NOW, true).georisk;
    expect(unavailable.status).toBe("unknown");
    expect(unavailable.maintenance).not.toBeNull();
  });

  it("does not infer maintenance from status without a declaration", () => {
    const feed = maintained();
    feed.projects[0].maintenance = null;
    expect(views(feed).georisk.status).toBe("unknown");
  });

  it("returns the earliest actual evidence expiry, ignoring the snapshot creation time", () => {
    const feed = fixture();
    feed.projects[0].components[0].validUntil = "2026-10-20T15:20:00Z";
    expect(nextHealthDeadline(parseHealthFeed(feed, NOW), NOW)).toBe(Date.parse("2026-10-20T15:20:00Z"));
    expect(nextHealthDeadline(parseHealthFeed(feed, NOW), Date.parse("2026-10-20T15:46:00Z"))).toBeNull();
    expect(nextHealthDeadline(null, NOW)).toBeNull();
  });

  it("schedules both planned start and end boundaries without extending them after stale checks", () => {
    const feed = maintained();
    feed.projects[0].maintenance!.startsAt = "2026-10-20T15:11:00Z";
    const parsed = parseHealthFeed(feed, NOW);
    expect(nextHealthDeadline(parsed, NOW)).toBe(Date.parse("2026-10-20T15:11:00Z"));
    expect(nextHealthDeadline(parsed, Date.parse("2026-10-20T15:50:00Z"))).toBe(Date.parse("2026-10-20T16:00:00Z"));
    expect(nextHealthDeadline(parsed, Date.parse("2026-10-20T16:00:00Z"))).toBeNull();
  });
});
