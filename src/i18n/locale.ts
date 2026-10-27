export type Locale = "pt-BR" | "en";

export function getLocaleFromPath(pathname: string): Locale {
  return ["/en", "/en/", "/en/index.html"].includes(pathname) ? "en" : "pt-BR";
}

export function getLocalePath(locale: Locale): string {
  return locale === "en" ? "/en/" : "/";
}

export function getLanguageHref(locale: Locale, location: Pick<Location, "search" | "hash">): string {
  return `${getLocalePath(locale)}${location.search}${location.hash}`;
}
