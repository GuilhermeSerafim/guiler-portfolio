import { SITE_HOSTS, type SiteId } from "./config";

const campaigns = [
  ["instagram", "social", "bio"],
  ["linkedin", "social", "portfolio"],
  ["qr", "offline", "palestra"],
] as const;
const keys = ["utm_source", "utm_medium", "utm_campaign"] as const;
const hashes = { linkhub: ["", "#links"], portfolio: ["", "#conteudo", "#inicio", "#projetos", "#trajetoria", "#sobre", "#contato"] };

function campaign(url: URL): readonly string[] | undefined {
  if (keys.some(key => url.searchParams.getAll(key).length !== 1)) return;
  return campaigns.find(values => values.every((value, index) => url.searchParams.get(keys[index]) === value));
}

export function sanitizePageUrl(site: SiteId, input: string): string {
  const result = new URL(`https://${SITE_HOSTS[site]}/`);
  try {
    const values = campaign(new URL(input));
    values?.forEach((value, index) => result.searchParams.set(keys[index], value));
  } catch { /* Use the canonical URL. */ }
  return result.href;
}

export function sanitizeReferrer(input: string): string {
  try {
    const url = new URL(input);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : "";
  } catch { return ""; }
}

// This strict guard is also used after loading the tag: removable entry fields
// must already be absent before Google can inspect the browser URL.
export function isSafeAnalyticsEntry(site: SiteId, input: string): boolean {
  try {
    const url = new URL(input);
    if (url.origin !== `https://${SITE_HOSTS[site]}` || url.pathname !== "/" || url.username || url.password || !hashes[site].includes(url.hash)) return false;
    for (const key of url.searchParams.keys()) if (![...keys, "_gl"].includes(key)) return false;
    if (url.searchParams.getAll("_gl").length > 1) return false;
    const linker = url.searchParams.get("_gl");
    if (linker !== null && (!/^[A-Za-z0-9*._~-]{1,4096}$/.test(linker) || linker.includes("\n"))) return false;
    return !keys.some(key => url.searchParams.has(key)) || !!campaign(url);
  } catch { return false; }
}

// Only these entry-only fields may be discarded. Do not widen campaign values
// or remove unknown fields to make an otherwise blocked entry collectable.
export function prepareAnalyticsEntry(site: SiteId, input: string): string | undefined {
  try {
    const url = new URL(input);
    for (const key of ["fbclid", "igsh", "utm_content"]) if (url.searchParams.has(key)) url.searchParams.delete(key);
    return isSafeAnalyticsEntry(site, url.href) ? url.href : undefined;
  } catch { return undefined; }
}
