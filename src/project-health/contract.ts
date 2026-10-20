import type { HealthStatus, ProjectHealthView } from "./view";

export type ProjectId = "georisk" | "seven-tools" | "playsenac" | "mesa";
export type HealthTargets = Partial<Record<ProjectId, {
  url: string;
  role: "demo" | "original";
  coverage: "http-content";
}>>;

type HealthComponent = {
  id: "public-entry";
  status: HealthStatus;
  reasonCode: string;
  checkedAt: string | null;
  validUntil: string | null;
  attempts: number;
  checks: ("html-marker" | "entry-script")[];
  responseTimeMs: number | null;
  httpStatus: number | null;
};

type HealthProject = {
  id: ProjectId;
  name: string;
  targetId: string;
  role: "demo" | "original";
  url: string | null;
  phase: "active" | "pending";
  status: HealthStatus;
  reasonCode: string;
  publicMessage: string;
  checkedAt: string | null;
  lastSuccessAt: string | null;
  validUntil: string | null;
  coverage: "http-content";
  components: HealthComponent[];
  maintenance: { startsAt: string; endsAt: string; message: string } | null;
};

export type HealthFeed = {
  schemaVersion: 1;
  generatedAt: string;
  maxAgeSeconds: 2700;
  source: {
    provider: "github-actions" | "local";
    event: string;
    runId: string | null;
    commit: string | null;
    observationScope: "single-runner";
  };
  projects: HealthProject[];
};

const PROJECT_IDS: ProjectId[] = ["georisk", "seven-tools", "playsenac", "mesa"];
const STATUSES: HealthStatus[] = ["operational", "degraded", "maintenance", "down", "unknown"];
const MAX_AGE_MS = 45 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;
const COVERAGE = "Verificação HTTP da página e do arquivo JavaScript selecionado. Não executa a aplicação nem testa APIs, IA ou envio de formulários.";

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function fields(value: unknown, names: string[]): value is Record<string, unknown> {
  return object(value)
    && Object.keys(value).length === names.length
    && names.every((name) => Object.hasOwn(value, name));
}

function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function integer(value: unknown, minimum: number, maximum = Infinity): boolean {
  return typeof value === "number" && Number.isInteger(value) && value >= minimum && value <= maximum;
}

function status(value: unknown): value is HealthStatus {
  return typeof value === "string" && STATUSES.includes(value as HealthStatus);
}

/** Date.parse alone silently normalizes impossible dates such as February 30. */
function timestamp(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|\+00:00)$/.exec(value);
  if (!match) return null;
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) return null;
  const date = new Date(milliseconds);
  const parts = [
    date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
  ];
  return parts.every((part, index) => part === Number(match[index + 1])) ? milliseconds : null;
}

function nullableTimestamp(value: unknown, latest = Infinity): boolean {
  if (value === null) return true;
  const parsed = timestamp(value);
  return parsed !== null && parsed <= latest;
}

function publicUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() !== value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function validComponent(value: unknown, latest: number): boolean {
  if (!fields(value, [
    "id", "status", "reasonCode", "checkedAt", "validUntil", "attempts",
    "checks", "responseTimeMs", "httpStatus",
  ])) return false;
  return value.id === "public-entry"
    && status(value.status)
    && typeof value.reasonCode === "string"
    && nullableTimestamp(value.checkedAt, latest)
    && nullableTimestamp(value.validUntil)
    && integer(value.attempts, 0, 2)
    && Array.isArray(value.checks)
    && value.checks.every((check) => check === "html-marker" || check === "entry-script")
    && (value.responseTimeMs === null || integer(value.responseTimeMs, 0))
    && (value.httpStatus === null || integer(value.httpStatus, 100, 599));
}

function validMaintenance(value: unknown): boolean {
  if (value === null) return true;
  if (!fields(value, ["startsAt", "endsAt", "message"])) return false;
  const start = timestamp(value.startsAt);
  const end = timestamp(value.endsAt);
  return start !== null && end !== null && start < end
    && typeof value.message === "string" && value.message.trim().length > 0
    && value.message.length <= 160;
}

function validProject(value: unknown, latest: number): boolean {
  if (!fields(value, [
    "id", "name", "targetId", "role", "url", "phase", "status", "reasonCode",
    "publicMessage", "checkedAt", "lastSuccessAt", "validUntil", "coverage",
    "components", "maintenance",
  ])) return false;
  return typeof value.id === "string" && PROJECT_IDS.includes(value.id as ProjectId)
    && typeof value.name === "string"
    && typeof value.targetId === "string" && value.targetId.length > 0
    && (value.role === "demo" || value.role === "original")
    && (value.url === null || publicUrl(value.url) !== null)
    && (value.phase === "active" || value.phase === "pending")
    && status(value.status)
    && typeof value.reasonCode === "string"
    && typeof value.publicMessage === "string"
    && nullableTimestamp(value.checkedAt, latest)
    && nullableTimestamp(value.lastSuccessAt, latest)
    && nullableTimestamp(value.validUntil)
    && value.coverage === "http-content"
    && Array.isArray(value.components) && value.components.length <= 1
    && value.components.every((component) => validComponent(component, latest))
    && validMaintenance(value.maintenance);
}

export function parseHealthFeed(input: unknown, now = Date.now()): HealthFeed | null {
  if (!Number.isFinite(now)
    || !fields(input, ["schemaVersion", "generatedAt", "maxAgeSeconds", "source", "projects"])) return null;
  const generatedAt = timestamp(input.generatedAt);
  if (input.schemaVersion !== 1 || input.maxAgeSeconds !== 2700
    || generatedAt === null || generatedAt > now + CLOCK_SKEW_MS) return null;
  const source = input.source;
  if (!fields(source, ["provider", "event", "runId", "commit", "observationScope"])
    || (source.provider !== "github-actions" && source.provider !== "local")
    || typeof source.event !== "string" || !nullableString(source.runId)
    || !nullableString(source.commit) || source.observationScope !== "single-runner") return null;
  if (!Array.isArray(input.projects) || input.projects.length !== PROJECT_IDS.length
    || !input.projects.every((project) => validProject(project, now + CLOCK_SKEW_MS))
    || new Set(input.projects.map((project) => (project as Record<string, unknown>).id)).size !== PROJECT_IDS.length) return null;
  return input as HealthFeed;
}

function expiry(evidence: { checkedAt: string | null; validUntil: string | null }): number | null {
  const checked = timestamp(evidence.checkedAt);
  const valid = timestamp(evidence.validUntil);
  return checked === null || valid === null ? null : Math.min(valid, checked + MAX_AGE_MS);
}

function fresh(evidence: { checkedAt: string | null; validUntil: string | null }, now: number): boolean {
  const end = expiry(evidence);
  const checked = timestamp(evidence.checkedAt);
  return end !== null && checked !== null && now < end && checked <= now + CLOCK_SKEW_MS;
}

function maintenanceAt(project: HealthProject, now: number): ProjectHealthView["maintenance"] {
  const notice = project.maintenance;
  if (!notice) return null;
  const start = timestamp(notice.startsAt);
  const end = timestamp(notice.endsAt);
  return start !== null && end !== null && start <= now && now < end
    ? { message: notice.message, endsAt: notice.endsAt }
    : null;
}

function unknown(checkedAt: string | null = null, maintenance: ProjectHealthView["maintenance"] = null): ProjectHealthView {
  return {
    status: "unknown", label: "Disponibilidade não confirmada",
    message: "Não há uma verificação recente e válida para confirmar a disponibilidade.",
    checkedAt, coverage: COVERAGE, maintenance,
  };
}

const LABELS: Record<HealthStatus, string> = {
  operational: "Resposta confirmada",
  degraded: "Resposta instável",
  down: "Falha na verificação",
  maintenance: "Manutenção informada",
  unknown: "Disponibilidade não confirmada",
};

function messageFor(result: HealthStatus, reasonCode: string): string {
  if (result === "operational" && reasonCode === "ok") {
    return "A página e o arquivo JavaScript selecionado responderam à última verificação.";
  }
  if (result === "degraded" && reasonCode === "intermittent") {
    return "A resposta foi recuperada após uma falha na mesma verificação.";
  }
  if (result === "maintenance" && reasonCode === "scheduled_maintenance") {
    return "Existe uma janela de manutenção informada para este endereço.";
  }
  return "Resultado limitado à verificação HTTP da página e do arquivo JavaScript selecionado por um observador.";
}

function observerFailure(reasonCode: string): boolean {
  return [
    "probe_blocked", "rate_limited", "unexpected_redirect", "collector_error",
    "response_too_large", "redirect_limit", "deadline_exceeded",
  ].includes(reasonCode);
}

function projectView(project: HealthProject | undefined, target: HealthTargets[ProjectId], now: number, unavailable: boolean): ProjectHealthView {
  if (!project || !target || project.phase !== "active" || project.url === null
    || publicUrl(project.url) !== publicUrl(target.url)
    || publicUrl(target.url) === null || project.role !== target.role
    || project.coverage !== target.coverage) return unknown();

  const maintenance = maintenanceAt(project, now);
  const checkedAt = project.checkedAt;
  const component = project.components[0];
  if (unavailable || !fresh(project, now) || !component || !fresh(component, now)
    || component.attempts < 1 || project.status === "unknown" || component.status === "unknown"
    || observerFailure(project.reasonCode) || observerFailure(component.reasonCode)
    || (component.httpStatus !== null && [401, 403, 429].includes(component.httpStatus))
    || ((component.status === "down" || component.status === "degraded") && component.attempts < 2)
    || ((component.status === "operational" || component.status === "degraded")
      && (component.httpStatus === null || component.httpStatus < 200 || component.httpStatus >= 300))) {
    return unknown(checkedAt, maintenance);
  }

  let selectedStatus = project.status;
  if (maintenance) selectedStatus = "maintenance";
  else if (project.status === "maintenance" || component.status !== project.status) return unknown(checkedAt);

  if ((selectedStatus === "operational" || selectedStatus === "degraded")
    && (!component.checks.includes("html-marker") || !component.checks.includes("entry-script"))) {
    return unknown(checkedAt, maintenance);
  }
  return {
    status: selectedStatus,
    label: LABELS[selectedStatus],
    message: messageFor(selectedStatus, project.reasonCode),
    checkedAt, coverage: COVERAGE, maintenance,
  };
}

export function projectHealthViews(
  feed: HealthFeed | null,
  targets: HealthTargets,
  now = Date.now(),
  unavailable = false,
): Record<ProjectId, ProjectHealthView> {
  return Object.fromEntries(PROJECT_IDS.map((id) => [
    id, projectView(feed?.projects.find((project) => project.id === id), targets[id], now, unavailable),
  ])) as Record<ProjectId, ProjectHealthView>;
}

/** Only returns a future boundary; the caller owns timers and focus handling. */
export function nextHealthDeadline(feed: HealthFeed | null, now: number): number | null {
  if (!feed || !Number.isFinite(now)) return null;
  const boundaries = feed.projects.flatMap((project) => [
    expiry(project),
    ...project.components.map(expiry),
    timestamp(project.maintenance?.startsAt),
    timestamp(project.maintenance?.endsAt),
  ]).filter((value): value is number => value !== null && value > now);
  return boundaries.length ? Math.min(...boundaries) : null;
}
