import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { useHeroEntry } from "../../src/components/HeroEntry";

function HeroProbe() {
  const { entry } = useHeroEntry();
  return <section data-entry={entry} />;
}

function renderEntry(path: string, { reduced = false, navigation = "navigate" } = {}) {
  vi.stubGlobal("window", {
    location: new URL(path, "https://guiler.vercel.app"),
    matchMedia: () => ({ matches: reduced }),
  });
  vi.spyOn(performance, "getEntriesByType").mockReturnValue([
    { type: navigation } as PerformanceNavigationTiming,
  ]);
  return renderToStaticMarkup(<HeroProbe />);
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("hero entry across portfolio languages", () => {
  it.each(["/", "/en", "/en/", "/en/index.html"])("animates a direct visit to %s", path => {
    expect(renderEntry(path)).toContain('data-entry="animate"');
  });

  it("animates an English entry with campaign parameters", () => {
    expect(renderEntry("/en/?utm_source=linkedin")).toContain('data-entry="animate"');
  });

  it("animates an English reload", () => {
    expect(renderEntry("/en/", { navigation: "reload" })).toContain('data-entry="animate"');
  });

  describe.each(["/", "/en/"])("entry guards on %s", path => {
    it("keeps direct section navigation static", () => {
      expect(renderEntry(`${path}#projetos`)).toContain('data-entry="static"');
    });

    it("respects the reduced-motion preference", () => {
      expect(renderEntry(path, { reduced: true })).toContain('data-entry="static"');
    });

    it("does not replay when returning through browser history", () => {
      expect(renderEntry(path, { navigation: "back_forward" })).toContain('data-entry="static"');
    });
  });

  it.each(["/__preview/cursor/a", "/en/private"])("keeps non-entry routes static: %s", path => {
    expect(renderEntry(path)).toContain('data-entry="static"');
  });

  it("renders statically outside the browser", () => {
    vi.stubGlobal("window", undefined);
    expect(renderToStaticMarkup(<HeroProbe />)).toContain('data-entry="static"');
  });
});
