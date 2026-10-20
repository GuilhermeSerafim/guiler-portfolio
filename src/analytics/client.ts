import { canCollect, SITE_HOSTS, SITE_TITLES, type AnalyticsConfig } from "./config";
import { CONSENT_KEY, CONSENT_MAX_AGE, parseConsent, type ConsentRecord, type ConsentState } from "./consent";
import { serializeEvent, type AnalyticsEvent } from "./events";
import { isSafeAnalyticsEntry, prepareAnalyticsEntry, sanitizePageUrl, sanitizeReferrer } from "./urls";

type GoogleWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
let config: AnalyticsConfig | undefined;
let rawConsent: string | null = null;
let script: HTMLScriptElement | undefined;
let active = false;
let retired = false;
let failed = false;
let pageViewed = false;
let reloadRequested = false;
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const googleWindow = () => window as unknown as GoogleWindow;

function readStorage(): string | null {
  try { return window.localStorage.getItem(CONSENT_KEY); } catch { return null; }
}

function persist(value: ConsentRecord): boolean {
  rawConsent = JSON.stringify(value);
  try {
    window.localStorage.setItem(CONSENT_KEY, rawConsent);
    return window.localStorage.getItem(CONSENT_KEY) === rawConsent;
  } catch { return false; }
}

function notify(): void { listeners.forEach(listener => listener()); }
export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function getConsent(): ConsentState { return parseConsent(rawConsent, Date.now()); }
export function isAnalyticsConfigured(): boolean {
  return !!config && canCollect(config, window.location.hostname, "granted") && prepareAnalyticsEntry(config.siteId, window.location.href) !== undefined;
}

function isRuntimeEntrySafe(): boolean {
  return !!config && canCollect(config, window.location.hostname, "granted") && isSafeAnalyticsEntry(config.siteId, window.location.href);
}

function scheduleExpiry(): void {
  clearTimeout(expiryTimer);
  if (getConsent() !== "granted") return;
  const record = JSON.parse(rawConsent!) as ConsentRecord;
  const remaining = record.updatedAt + CONSENT_MAX_AGE - Date.now();
  // Browser timers use a signed 32-bit delay; a full 180-day timeout overflows.
  expiryTimer = setTimeout(revalidateConsent, Math.min(Math.max(remaining, 1), 2_147_483_647));
}

function revalidateConsent(): void {
  if (getConsent() !== "granted" || !isRuntimeEntrySafe()) stop(false);
  scheduleExpiry();
  notify();
}

function clearCookies(): void {
  if (!config) return;
  try {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (!/^(_ga($|_)|_gid$|_gat($|_))/.test(name)) continue;
      const expired = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = expired;
      document.cookie = `${expired}; Domain=${config.hostname}`;
      document.cookie = `${expired}; Domain=.${config.hostname}`;
    }
  } catch { /* Browsers may deny cookie access. */ }
}

function reload(): void {
  if (reloadRequested) return;
  reloadRequested = true;
  try { window.location.reload(); } catch { /* Collection remains disabled. */ }
}

function stop(shouldReload: boolean): void {
  active = false;
  if (!config) return;
  googleWindow()[`ga-disable-${config.measurementId}`] = true;
  clearCookies();
  if (!script) return;
  retired = true;
  script.onload = null;
  script.onerror = null;
  script.remove();
  // Remove pending commands as well as the element: a late script must not
  // consume an earlier grant. A loaded runtime is removed by a safe reload.
  googleWindow().gtag = () => {};
  if (googleWindow().dataLayer) googleWindow().dataLayer!.length = 0;
  if (shouldReload) reload();
}

function start(): void {
  if (!config || script || retired || failed || !isAnalyticsConfigured() || getConsent() !== "granted") return;
  const settings = config;
  try {
    const prepared = prepareAnalyticsEntry(settings.siteId, window.location.href);
    if (!prepared) return;
    if (prepared !== window.location.href) window.history.replaceState(window.history.state, "", prepared);
    if (window.location.href !== prepared || !isRuntimeEntrySafe()) { failed = true; return; }
    const win = googleWindow();
    win[`ga-disable-${settings.measurementId}`] = false;
    win.dataLayer = [];
    win.gtag = function () { win.dataLayer!.push(arguments); };
    const pageLocation = sanitizePageUrl(settings.siteId, window.location.href);
    const campaign = new URL(pageLocation).searchParams;
    const defaults = {
      site_id: settings.siteId,
      schema_version: 1,
      page_location: pageLocation,
      page_referrer: sanitizeReferrer(document.referrer),
      page_title: SITE_TITLES[settings.siteId],
      campaign_source: campaign.get("utm_source") ?? "",
      campaign_medium: campaign.get("utm_medium") ?? "",
      campaign_name: campaign.get("utm_campaign") ?? "",
      campaign_id: "", campaign_term: "", campaign_content: "",
    };
    win.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    win.gtag("set", defaults);
    win.gtag("js", new Date());
    win.gtag("config", settings.measurementId, {
      ...defaults,
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: settings.hostname,
      cookie_expires: 15552000,
      cookie_update: false,
      linker: { domains: Object.values(SITE_HOSTS), accept_incoming: true },
    });
    script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.measurementId}`;
    script.referrerPolicy = "origin";
    script.onload = () => {
      if (retired || failed || !isRuntimeEntrySafe() || getConsent() !== "granted") { stop(false); return; }
      active = true;
      if (!pageViewed) {
        pageViewed = true;
        track({ name: "page_view", params: { ui_location: "page", page_location: pageLocation, page_referrer: defaults.page_referrer } });
      }
    };
    script.onerror = () => { failed = true; stop(false); };
    document.head.appendChild(script);
  } catch { failed = true; stop(false); }
}

export function initializeAnalytics(value: AnalyticsConfig): void {
  if (config || typeof window === "undefined") return;
  config = { ...value };
  rawConsent = readStorage();
  window.addEventListener("storage", event => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    try {
      if (event.storageArea !== window.localStorage || new URL(event.url).origin !== window.location.origin) return;
    } catch { return; }
    rawConsent = event.newValue;
    if (getConsent() !== "granted") stop(getConsent() === "denied");
    else start();
    scheduleExpiry();
    notify();
  });
  window.addEventListener("pageshow", revalidateConsent);
  document.addEventListener("visibilitychange", revalidateConsent);
  scheduleExpiry();
  start();
}

export function setConsent(value: "granted" | "denied"): void {
  if (value !== "granted" && value !== "denied") return;
  const persisted = persist({ version: 1, analytics: value, updatedAt: Date.now() });
  if (value === "denied") stop(persisted);
  else if (retired) {
    // A withdrawn runtime is never reused in the same document.
    if (persisted) reload();
    else rawConsent = JSON.stringify({ version: 1, analytics: "denied", updatedAt: Date.now() });
  } else start();
  scheduleExpiry();
  notify();
}

export function track(event: AnalyticsEvent): void {
  try {
    if (!config || !active || retired || failed) return;
    if (!isRuntimeEntrySafe() || getConsent() !== "granted") { stop(false); return; }
    const params = serializeEvent(event, config.siteId);
    if (params) googleWindow().gtag?.("event", event.name, params);
  } catch { /* Analytics must never break a control or delay navigation. */ }
}
