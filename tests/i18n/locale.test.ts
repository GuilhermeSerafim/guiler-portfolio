import { describe, expect, it } from "vitest";
import { getLanguageHref, getLocaleFromPath } from "../../src/i18n/locale";

describe("locale navigation", () => {
  it.each(["/en", "/en/", "/en/index.html"])("recognizes English at %s", path => expect(getLocaleFromPath(path)).toBe("en"));
  it.each(["/", "/english", "/en/private", "/__preview/cursor/a"])("does not infer English on %s", path => expect(getLocaleFromPath(path)).toBe("pt-BR"));
  it("preserves campaign/linker parameters and the existing section when switching languages", () => {
    const location = { search: "?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio&_gl=1~abc", hash: "#projetos" };
    expect(getLanguageHref("en", location)).toBe(`/en/${location.search}#projetos`);
    expect(getLanguageHref("pt-BR", location)).toBe(`/${location.search}#projetos`);
  });
});
