/** Presentation model, separate from the monitor's untrusted wire contract. */
export type HealthStatus = "operational" | "degraded" | "maintenance" | "down" | "unknown";

export type ProjectHealthView = {
  status: HealthStatus;
  label: string;
  message: string;
  checkedAt: string | null;
  coverage: string;
  maintenance: { message: string; endsAt: string } | null;
};
