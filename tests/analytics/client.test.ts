import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, CONSENT_MAX_AGE } from "../../src/analytics/consent";
import type { AnalyticsConfig } from "../../src/analytics/config";

const config: AnalyticsConfig = { siteId:"portfolio", hostname:"guiler.vercel.app", measurementId:"G-TESTONLY", enabled:true };
const action = {name:"resume_download",params:{asset_id:"resume_fullstack",ui_location:"hero"}} as const;

function browser(options: { hostname?: string; href?: string; blockedStorage?: boolean; raw?: string } = {}) {
  const values = new Map(options.raw ? [[CONSENT_KEY, options.raw]] : []);
  const localStorage = {
    getItem(key: string) { if(options.blockedStorage) throw Error("blocked"); return values.get(key) ?? null; },
    setItem(key: string,value: string) { if(options.blockedStorage) throw Error("blocked"); values.set(key,value); },
  };
  const scripts: { onload: null | (() => void); onerror: null | (() => void); remove: ReturnType<typeof vi.fn>; src?: string }[] = [];
  const listeners: Record<string, (event: unknown) => void> = {};
  const cookieWrites: string[] = [];
  const win = {
    location: { hostname:options.hostname ?? config.hostname, href:options.href ?? "https://guiler.vercel.app/#projetos", origin:"https://guiler.vercel.app", reload:vi.fn() },
    localStorage,
    addEventListener: (name: string, listener: (event: unknown) => void) => { listeners[name] = listener; },
    dataLayer: undefined as unknown[] | undefined,
  };
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", {
    addEventListener: (name: string, listener: (event: unknown) => void) => { listeners[name] = listener; },
    referrer: "https://linkedin.com/private?email=secret#secret",
    title: "secret@example.com",
    createElement: () => ({ onload:null, onerror:null, remove:vi.fn() }),
    head:{ appendChild: (script: typeof scripts[number]) => scripts.push(script) },
    get cookie() { return "_ga=old; _ga_TESTONLY=old; unrelated=keep"; },
    set cookie(value: string) { cookieWrites.push(value); },
  });
  return {win,scripts,values,cookieWrites, commands:()=> (win.dataLayer ?? []).map(item => Array.from(item as ArrayLike<unknown>)), storage(raw: string | null, origin = win.location.origin) { if(raw) values.set(CONSENT_KEY,raw); else values.delete(CONSENT_KEY); listeners.storage?.({key:CONSENT_KEY,newValue:raw,storageArea:localStorage,url:`${origin}/`}); }};
}

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe("basic opt-in and transport", () => {
  it("does nothing before consent or when refused, and never replays old clicks", async () => {
    const env = browser(); const client = await import("../../src/analytics/client");
    client.initializeAnalytics(config); client.track(action);
    expect(env.scripts).toHaveLength(0); expect(env.commands()).toEqual([]);
    client.setConsent("denied"); client.track(action);
    expect(env.scripts).toHaveLength(0);
    client.setConsent("granted"); expect(env.scripts).toHaveLength(1);
    env.scripts[0].onload?.();
    expect(env.commands().filter(command=>command[0]==="event").map(command=>command[1])).toEqual(["page_view"]);
  });
  it("blocks unconfigured, preview and unreviewed URL entries even with a stored grant", async () => {
    for (const overrides of [{measurementId:""}, {enabled:false}, {hostname:"localhost"}, {hostname:"guiler-preview.vercel.app"}, {href:"https://guiler.vercel.app/?email=secret"}]) {
      vi.resetModules();
      const env = browser({...overrides,raw:JSON.stringify({version:1,analytics:"granted",updatedAt:Date.now()})});
      const client = await import("../../src/analytics/client"); client.initializeAnalytics({...config,...overrides}); client.track(action);
      expect(client.isAnalyticsConfigured()).toBe(false); expect(env.scripts).toHaveLength(0); expect(env.commands()).toEqual([]);
    }
  });
  it("initializes once, sanitizes every scope, denies ads and emits a single pageview", async () => {
    const env = browser({href:"https://guiler.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio#projetos"});
    const client = await import("../../src/analytics/client"); client.initializeAnalytics(config); client.initializeAnalytics(config);
    client.setConsent("granted"); client.setConsent("granted");
    expect(env.scripts).toHaveLength(1);
    const commands = env.commands();
    expect(commands[0]).toEqual(["consent","default",{analytics_storage:"granted",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"}]);
    const safe = {site_id:"portfolio",schema_version:1,page_location:"https://guiler.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio",page_referrer:"https://linkedin.com",page_title:"Guiler | Portfólio",campaign_source:"linkedin",campaign_medium:"social",campaign_name:"portfolio",campaign_id:"",campaign_term:"",campaign_content:""};
    expect(commands.find(c=>c[0]==="set")).toEqual(["set",expect.objectContaining(safe)]);
    expect(commands.find(c=>c[0]==="config")).toEqual(["config","G-TESTONLY",expect.objectContaining({...safe,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_domain:"guiler.vercel.app",cookie_expires:15552000,cookie_update:false})]);
    env.scripts[0].onload?.(); env.scripts[0].onload?.();
    expect(env.commands().filter(c=>c[0]==="event" && c[1]==="page_view")).toHaveLength(1);
    client.track({...action,params:{...action.params,email:"secret",phone:"secret"}} as never);
    expect(env.commands().at(-1)).toEqual(["event","resume_download",{site_id:"portfolio",schema_version:1,ui_location:"hero",asset_id:"resume_fullstack"}]);
    expect(JSON.stringify(env.commands())).not.toMatch(/secret|@|#projetos/);
  });
  it("drops events while loading and when a blocker rejects the tag", async () => {
    const env = browser(); const client = await import("../../src/analytics/client"); client.initializeAnalytics(config); client.setConsent("granted"); client.track(action);
    expect(env.commands().filter(c=>c[0]==="event")).toEqual([]);
    env.scripts[0].onerror?.(); expect(()=>client.track(action)).not.toThrow(); env.scripts[0].onload?.();
    expect(env.commands().filter(c=>c[0]==="event")).toEqual([]);
  });
});

describe("withdrawal and persistence failures", () => {
  it("clears existing GA cookies when a stored grant is withdrawn on a blocked entry", async () => {
    const env=browser({href:"https://guiler.vercel.app/?fbclid=unreviewed",raw:JSON.stringify({version:1,analytics:"granted",updatedAt:Date.now()})});
    const client=await import("../../src/analytics/client"); client.initializeAnalytics(config); client.setConsent("denied");
    expect(env.scripts).toHaveLength(0);
    expect(env.cookieWrites.some(value=>value.startsWith("_ga=")&&value.includes("Max-Age=0"))).toBe(true);
    expect(env.win.location.reload).not.toHaveBeenCalled();
  });
  it("disables automatic collection when a grant expires without a new user action", async () => {
    vi.useFakeTimers();
    try {
      const env=browser({raw:JSON.stringify({version:1,analytics:"granted",updatedAt:Date.now()-CONSENT_MAX_AGE+1000})});
      const client=await import("../../src/analytics/client"); client.initializeAnalytics(config); env.scripts[0].onload?.();
      await vi.advanceTimersByTimeAsync(1001);
      expect(client.getConsent()).toBe("unknown");
      expect((env.win as unknown as Record<string,unknown>)["ga-disable-G-TESTONLY"]).toBe(true);
      expect(env.commands()).toEqual([]);
    } finally { vi.useRealTimers(); }
  });
  it("blocks a tag-load race, disables GA and clears only GA cookies before reloading", async () => {
    const env=browser(); const client=await import("../../src/analytics/client"); client.initializeAnalytics(config); client.setConsent("granted");
    const lateLoad=env.scripts[0].onload;
    client.setConsent("denied"); lateLoad?.(); client.track(action);
    expect((env.win as unknown as Record<string,unknown>)["ga-disable-G-TESTONLY"]).toBe(true);
    expect(env.commands()).toEqual([]); expect(env.win.location.reload).toHaveBeenCalledTimes(1);
    expect(env.scripts[0].remove).toHaveBeenCalled();
    expect(env.cookieWrites.some(value=>value.startsWith("_ga=") && value.includes("Max-Age=0"))).toBe(true);
    expect(env.cookieWrites.some(value=>value.startsWith("unrelated="))).toBe(false);
    expect(JSON.parse(env.values.get(CONSENT_KEY)!)).toMatchObject({version:1,analytics:"denied"});
  });
  it("keeps denied in memory when storage fails, without reload loops", async () => {
    const env=browser({blockedStorage:true}); const client=await import("../../src/analytics/client"); client.initializeAnalytics(config); client.setConsent("granted"); env.scripts[0].onload?.(); client.setConsent("denied"); client.setConsent("denied"); client.track(action);
    expect(client.getConsent()).toBe("denied"); expect(env.win.location.reload).not.toHaveBeenCalled(); expect(env.commands()).toEqual([]);
  });
  it("honors revocation from another same-origin tab before any later event", async () => {
    const env=browser(); const client=await import("../../src/analytics/client"); client.initializeAnalytics(config); client.setConsent("granted"); env.scripts[0].onload?.();
    env.storage(JSON.stringify({version:1,analytics:"denied",updatedAt:Date.now()})); client.track(action);
    expect(client.getConsent()).toBe("denied"); expect(env.commands()).toEqual([]); expect(env.win.location.reload).toHaveBeenCalledTimes(1);
  });
  it("expires a previously valid grant before dispatch", async () => {
    vi.useFakeTimers();
    try { const env=browser(); const client=await import("../../src/analytics/client"); client.initializeAnalytics(config); client.setConsent("granted"); env.scripts[0].onload?.(); vi.setSystemTime(Date.now()+181*86400000); client.track(action); expect(client.getConsent()).toBe("unknown"); expect(env.commands()).toEqual([]); } finally { vi.useRealTimers(); }
  });
});
