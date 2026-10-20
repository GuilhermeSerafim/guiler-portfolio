import { describe, expect, it } from "vitest";
import { parseConsent } from "../../src/analytics/consent";
import { canCollect, type AnalyticsConfig } from "../../src/analytics/config";
import { serializeEvent } from "../../src/analytics/events";
import { isSafeAnalyticsEntry, prepareAnalyticsEntry, sanitizePageUrl, sanitizeReferrer } from "../../src/analytics/urls";

const now = 1_800_000_000_000;
const config: AnalyticsConfig = { siteId: "portfolio", measurementId: "G-TESTONLY", enabled: true, hostname: "guiler.vercel.app" };

describe("consent policy", () => {
  it.each([null, "{", "null", "[]", '{"version":2}', JSON.stringify({version:1,analytics:"granted",updatedAt:now+1}), JSON.stringify({version:1,analytics:"granted",updatedAt:now-180*86400000})])("rejects absent, malformed, future or expired consent: %s", raw => {
    expect(parseConsent(raw, now)).toBe("unknown");
  });
  it.each(["granted", "denied"] as const)("retains a valid %s decision", analytics => {
    expect(parseConsent(JSON.stringify({version:1,analytics,updatedAt:now}), now)).toBe(analytics);
  });
  it("rejects a wrong record shape", () => {
    expect(parseConsent(JSON.stringify({version:1,analytics:"granted",updatedAt:String(now)}), now)).toBe("unknown");
  });
});

describe("collection guard", () => {
  it("allows only explicit configuration, exact app hostname, valid ID and grant", () => {
    expect(canCollect(config, "guiler.vercel.app", "granted")).toBe(true);
    for (const host of ["localhost", "127.0.0.1", "guiler-test.vercel.app", "evilguiler.vercel.app", "iamguiler.vercel.app"]) expect(canCollect(config, host, "granted")).toBe(false);
    for (const consent of ["unknown", "denied"] as const) expect(canCollect(config, config.hostname, consent)).toBe(false);
    for (const measurementId of ["", "G-foo", "G-OK<script>", "G-OK\n"]) expect(canCollect({...config, measurementId}, config.hostname, "granted")).toBe(false);
    expect(canCollect({...config, enabled:false}, config.hostname, "granted")).toBe(false);
    expect(canCollect({...config, hostname:"localhost"}, "localhost", "granted")).toBe(false);
    expect(canCollect({...config, siteId:"linkhub"}, config.hostname, "granted")).toBe(false);
  });
});

describe("safe URLs", () => {
  it("keeps only known complete campaigns and canonical app path", () => {
    expect(sanitizePageUrl("linkhub", "https://iamguiler.vercel.app/private/user@email.com?email=secret&utm_source=instagram&utm_medium=social&utm_campaign=bio#secret")).toBe("https://iamguiler.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=bio");
    expect(sanitizePageUrl("portfolio", "https://guiler.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio#projetos")).toBe("https://guiler.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio");
    expect(sanitizePageUrl("portfolio", "not a url")).toBe("https://guiler.vercel.app/");
    expect(sanitizePageUrl("portfolio", "https://guiler.vercel.app/?utm_source=instagram&email=private&_gl=secret")).toBe("https://guiler.vercel.app/");
  });
  it("drops duplicate, unknown and mismatched campaigns", () => {
    for (const query of ["utm_source=linkedin&utm_medium=offline&utm_campaign=portfolio", "utm_source=linkedin&utm_source=email@example.com&utm_medium=social&utm_campaign=portfolio", "utm_campaign=email@example.com"]) {
      expect(sanitizePageUrl("portfolio", `https://guiler.vercel.app/?${query}`)).toBe("https://guiler.vercel.app/");
    }
  });
  it("sends only HTTP(S) referrer origins", () => {
    expect(sanitizeReferrer("https://user:secret@example.com/path?email=private#hash")).toBe("https://example.com");
    for (const value of ["javascript:alert(1)", "not a URL", "mailto:person@example.com"]) expect(sanitizeReferrer(value)).toBe("");
  });
  it("fails closed for unexpected entry data until the real tag can be inspected", () => {
    expect(isSafeAnalyticsEntry("portfolio", "https://guiler.vercel.app/#projetos")).toBe(true);
    expect(isSafeAnalyticsEntry("portfolio", "https://guiler.vercel.app/?_gl=1.abc#projetos")).toBe(true);
    expect(isSafeAnalyticsEntry("portfolio", "https://guiler.vercel.app/?_gl=1*abc*_ga*MTIzLjQ1#contato")).toBe(true);
    expect(isSafeAnalyticsEntry("portfolio", "https://guiler.vercel.app/?_gl=person@example.com")).toBe(false);
    expect(isSafeAnalyticsEntry("portfolio", "https://guiler.vercel.app/?_gl=1.abc&_gl=1.def")).toBe(false);
    expect(isSafeAnalyticsEntry("portfolio", "https://guiler.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio#projetos")).toBe(true);
    for (const suffix of ["?email=person@example.com", "?utm_term=person@example.com", "?utm_source=unknown", "/person@example.com", "#person@example.com", "?gclid=unreviewed"]) expect(isSafeAnalyticsEntry("portfolio", `https://guiler.vercel.app/${suffix}`)).toBe(false);
  });
  it.each(["fbclid=value", "igsh=value", "utm_content=value", "fbclid=first&fbclid=second&igsh=value&utm_content=value", "%66bclid=private%40example.com&%69gsh=private&%75tm_content=private"])("discards only reviewed tracking parameters: %s", query => {
    const raw = `https://iamguiler.vercel.app/?${query}#links`;
    expect(isSafeAnalyticsEntry("linkhub", raw)).toBe(false);
    expect(prepareAnalyticsEntry("linkhub", raw)).toBe("https://iamguiler.vercel.app/#links");
  });
  it.each([
    ["linkhub", "https://iamguiler.vercel.app/", "#links"],
    ["portfolio", "https://guiler.vercel.app/", "#projetos"],
  ] as const)("preserves approved campaign, linker and anchor for %s", (site, origin, hash) => {
    const raw = `${origin}?utm_source=instagram&utm_medium=social&utm_campaign=bio&_gl=1~abc&fbclid=discard${hash}`;
    const prepared = prepareAnalyticsEntry(site, raw);
    expect(prepared).toBe(`${origin}?utm_source=instagram&utm_medium=social&utm_campaign=bio&_gl=1%7Eabc${hash}`);
    expect(new URL(prepared!).searchParams.get("_gl")).toBe("1~abc");
    expect(sanitizePageUrl(site, prepared!)).toBe(`${origin}?utm_source=instagram&utm_medium=social&utm_campaign=bio`);
    expect(prepareAnalyticsEntry(site, prepared!)).toBe(prepared);
  });
  it("leaves an already clean linker URL byte-for-byte unchanged", () => {
    const raw = "https://guiler.vercel.app/?_gl=1~abc#projetos";
    expect(prepareAnalyticsEntry("portfolio", raw)).toBe(raw);
  });
  it.each([
    "/?fbclid=discard&email=private", "/?FBCLID=discard", "/?utm_content=discard&utm_source=instagram",
    "/?igsh=discard&utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_source=instagram",
    "/?fbclid=discard&_gl=private%40example.com", "/?igsh=discard&_gl=1.abc&_gl=1.def",
    "/admin?fbclid=discard", "/?utm_content=discard#private", "/?gclid=discard",
  ])("does not recover an entry with other invalid data: %s", suffix => {
    expect(prepareAnalyticsEntry("portfolio", `https://guiler.vercel.app${suffix}`)).toBeUndefined();
  });
  it("rejects invalid URLs and foreign origins", () => {
    expect(prepareAnalyticsEntry("portfolio", "not a URL")).toBeUndefined();
    expect(prepareAnalyticsEntry("portfolio", "https://foreign.example/?fbclid=discard")).toBeUndefined();
  });
});

describe("runtime event allowlist", () => {
  it("strips PII and unrelated extra fields", () => {
    const event = { name:"project_open", params:{project_id:"georisk",ui_location:"project_cover",email:"private",phone:"private",user_id:"private",page_location:"private"} };
    expect(serializeEvent(event as never,"portfolio")).toEqual({site_id:"portfolio",schema_version:1,project_id:"georisk",ui_location:"project_cover"});
  });
  it("rejects malformed enums and cross-event parameters", () => {
    for (const event of [null, {}, {name:"generate_lead",params:{}}, {name:"project_open",params:{project_id:"person@example.com",ui_location:"project_cover"}}, {name:"project_open",params:{project_id:"georisk",ui_location:"footer"}}, {name:"contact_intent",params:{contact_method:"email_copy",ui_location:"footer"}}, {name:"link_click",params:{link_id:"projects",destination_id:"github_profile",ui_location:"link_grid"}}]) expect(serializeEvent(event as never,"portfolio")).toBeNull();
  });
  it("cannot smuggle fields into page_view", () => {
    expect(serializeEvent({name:"page_view",params:{ui_location:"page",page_location:"https://private.invalid/?email=secret",page_referrer:"https://example.com/private?q=secret",page_title:"person@example.com",user_id:"private"}} as never,"portfolio")).toEqual({site_id:"portfolio",schema_version:1,ui_location:"page",page_location:"https://guiler.vercel.app/",page_referrer:"https://example.com",page_title:"Guiler | Portfólio"});
  });
});
