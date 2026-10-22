import { ChevronDown } from "lucide-react";
import type { ProjectHealthView } from "../project-health/view";
import "./ProjectHealthStatus.css";

const absoluteDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

function readableDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

/** Only actionable conditions interrupt the path to the external link. */
export function ProjectHealthNotice({ health }: { health: ProjectHealthView }) {
  const maintenance = health.maintenance;
  const hasMaintenance = Boolean(maintenance) || health.status === "maintenance";
  if (!hasMaintenance && health.status !== "down" && health.status !== "degraded") return null;

  const maintenanceEndsAt = readableDate(health.maintenance?.endsAt ?? null);
  const label = hasMaintenance
    ? "Manutenção informada"
    : health.status === "down"
      ? "Falha na última verificação"
      : "Resposta instável na última verificação";

  return (
    <aside
      className="project-health project-health-notice"
      data-health={hasMaintenance ? "maintenance" : health.status}
      aria-label="Condição de acesso"
    >
      <span className="project-health-state">
        <span className="project-health-indicator" aria-hidden="true" />
        <span>{label}</span>
      </span>
      {maintenance && <p>{maintenance.message}</p>}
      {maintenanceEndsAt && (
        <p>
          Previsão de término:{" "}
          <time dateTime={maintenanceEndsAt.toISOString()}>
            {absoluteDate.format(maintenanceEndsAt)}
          </time>
        </p>
      )}
    </aside>
  );
}

export function ProjectHealthStatus({ health }: { health: ProjectHealthView }) {
  const checkedAt = readableDate(health.checkedAt);

  return (
    <details
      className="project-health project-health--detail"
      data-health={health.status}
    >
      <summary>
        <span>Verificação do link</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="project-health-content">
        <span className="project-health-state">
          <span className="project-health-indicator" aria-hidden="true" />
          <span>{health.label}</span>
        </span>
        <p className="project-health-message">{health.message}</p>
        {checkedAt && (
          <p className="project-health-checked">
            Última verificação:{" "}
            <time dateTime={checkedAt.toISOString()}>
              {absoluteDate.format(checkedAt)}
            </time>
          </p>
        )}
        {health.coverage && (
          <p className="project-health-coverage">
            <span>Cobertura do monitoramento</span>
            {health.coverage}
          </p>
        )}
      </div>
    </details>
  );
}
