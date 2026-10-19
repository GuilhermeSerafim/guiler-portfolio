export type ConsentState = "unknown" | "granted" | "denied";
export type ConsentRecord = { version: 1; analytics: "granted" | "denied"; updatedAt: number };
export const CONSENT_KEY = "guiler.analytics-consent.v1";
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;

export function parseConsent(raw: string | null, now: number): ConsentState {
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!value || typeof value !== "object" || Array.isArray(value)) return "unknown";
    const record = value as Partial<ConsentRecord>;
    if (record.version !== 1 || (record.analytics !== "granted" && record.analytics !== "denied") || typeof record.updatedAt !== "number" || !Number.isFinite(record.updatedAt) || record.updatedAt > now || now - record.updatedAt >= CONSENT_MAX_AGE) return "unknown";
    return record.analytics;
  } catch { return "unknown"; }
}
