import { describe, expect, it, vi, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LocaleProvider } from "../../src/i18n";
import { getProjects, getExperience, projects, experience } from "../../src/data";
import { PrivacyNotice } from "../../src/components/PrivacyNotice";
import { ResumeDownloadLink } from "../../src/components/ResumeDownloadLink";
import { LanguageSwitcher } from "../../src/components/LanguageSwitcher";

afterEach(() => vi.unstubAllGlobals());

describe("bilingual content integration", () => {
  it("preserves project identity, category filters, destinations and technologies", () => {
    const english = getProjects("en");
    expect(english).toHaveLength(projects.length);
    for (const [index, project] of english.entries()) {
      const original = projects[index];
      for (const field of ["id", "name", "category", "tags", "technologies", "demo", "github", "frontendGithub"] as const) expect(project[field]).toEqual(original[field]);
      expect(project.description).not.toBe(original.description);
      expect(Boolean(project.demoNotice)).toBe(Boolean(original.demoNotice));
    }
    expect(getProjects("pt-BR")).toEqual(projects);
    expect(getExperience("en").map(item => [item.company, item.number, item.stack])).toEqual(experience.map(item => [item.company, item.number, item.stack]));
  });

  it("offers the English résumé from both English download controls", () => {
    const html = renderToStaticMarkup(<LocaleProvider locale="en"><PrivacyNotice /><ResumeDownloadLink location="hero" /><ResumeDownloadLink location="contact" /></LocaleProvider>);
    expect(html).toContain("this measurement is not anonymous");
    expect(html).toContain("Download résumé (PDF)");
    expect(html.match(/href="\/GuilhermeSerafim_Fullstack_EN\.pdf"/g)).toHaveLength(2);
    expect(html.match(/hrefLang="en"/g)).toHaveLength(2);
    expect(html).toContain('download="Guilherme_Serafim_Fullstack_EN.pdf"');
    expect(html).not.toContain("Portuguese");
    expect(html).not.toContain("Résumé (PT)");
    expect(html).not.toContain("Baixar currículo");
  });

  it("keeps Portuguese available and gives each language link its language and current state", () => {
    vi.stubGlobal("window", { location: { search: "?utm_source=linkedin", hash: "#projetos" } });
    const html = renderToStaticMarkup(<LocaleProvider locale="en"><LanguageSwitcher /></LocaleProvider>);
    expect(html).toContain('href="/?utm_source=linkedin#projetos"');
    expect(html).toContain('href="/en/?utm_source=linkedin#projetos"');
    expect(html).toContain('lang="en" aria-label="EN — English" aria-current="page"');
    expect(html).toContain('aria-label="PT — Português"');
    const portuguese = renderToStaticMarkup(<LocaleProvider locale="pt-BR"><ResumeDownloadLink location="hero" /><ResumeDownloadLink location="contact" /></LocaleProvider>);
    expect(portuguese).toContain("Baixar currículo");
    expect(portuguese.match(/href="\/GuilhermeSerafim_Fullstack\.pdf"/g)).toHaveLength(2);
    expect(portuguese.match(/hrefLang="pt-BR"/g)).toHaveLength(2);
    expect(portuguese).not.toContain("Fullstack_EN.pdf");
  });
});
