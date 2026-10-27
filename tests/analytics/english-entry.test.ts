import { describe, expect, it } from "vitest";
import { isSafeAnalyticsEntry, prepareAnalyticsEntry, sanitizePageUrl } from "../../src/analytics/urls";
import { serializeEvent } from "../../src/analytics/events";

describe("English portfolio analytics boundaries", () => {
  it.each(["/en", "/en/"])("accepts the English document %s with a known section and campaign", path => {
    const input = `https://guiler.vercel.app${path}?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio#projetos`;
    expect(isSafeAnalyticsEntry("portfolio", input)).toBe(true);
    expect(sanitizePageUrl("portfolio", input)).toBe("https://guiler.vercel.app/en/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio");
  });

  it("preserves the English destination and hash while removing reviewed social noise", () => {
    expect(prepareAnalyticsEntry("portfolio", "https://guiler.vercel.app/en/?fbclid=fake&igsh=fake&utm_content=fake&_gl=1.abc#projetos"))
      .toBe("https://guiler.vercel.app/en/?_gl=1.abc#projetos");
  });

  it.each(["/en/admin", "/en/callback", "/english", "/en//", "/en/index.html", "/en/?email=private", "/en/#private", "/en/?utm_source=unknown"])("does not broaden collection to %s", path => {
    expect(prepareAnalyticsEntry("portfolio", `https://guiler.vercel.app${path}`)).toBeUndefined();
  });

  it("keeps previews, foreign origins and the hub English route blocked", () => {
    expect(isSafeAnalyticsEntry("portfolio", "https://preview.vercel.app/en/")).toBe(false);
    expect(isSafeAnalyticsEntry("linkhub", "https://iamguiler.vercel.app/en/")).toBe(false);
    expect(sanitizePageUrl("portfolio", "https://foreign.example/en/private")).toBe("https://guiler.vercel.app/");
  });

  it("serializes the canonical English page without arbitrary titles or query values", () => {
    expect(serializeEvent({ name: "page_view", params: { ui_location: "page", page_location: "https://guiler.vercel.app/en/?email=private#projetos", page_referrer: "https://example.com/private" } }, "portfolio"))
      .toMatchObject({ site_id: "portfolio", page_location: "https://guiler.vercel.app/en/", page_title: "Guiler | Portfolio", page_referrer: "https://example.com" });
  });
});
