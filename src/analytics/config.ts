import type { ConsentState } from "./consent";

export type SiteId = "linkhub" | "portfolio";
export type AnalyticsConfig = { siteId: SiteId; measurementId: string; enabled: boolean; hostname: string };
export const SITE_HOSTS = { linkhub: "iamguiler.vercel.app", portfolio: "guiler.vercel.app" } as const;
export const SITE_TITLES = { linkhub: "Guiler | Links", portfolio: "Guiler | Portfólio" } as const;

export function canCollect(config: AnalyticsConfig, hostname: string, consent: ConsentState): boolean {
  return config.enabled === true && typeof config.measurementId === "string" && /^G-[A-Z0-9]+$/.test(config.measurementId) && !config.measurementId.includes("\n") && Object.hasOwn(SITE_HOSTS, config.siteId) && config.hostname === SITE_HOSTS[config.siteId] && hostname === config.hostname && consent === "granted";
}

export const publicConfig: AnalyticsConfig = {
  siteId: "portfolio",
  hostname: SITE_HOSTS.portfolio,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID ?? "",
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
};
