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

const clockTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function readableDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function ProjectHealthStatus({
  health,
  compact = false,
}: {
  health: ProjectHealthView;
  compact?: boolean;
}) {
  const checkedAt = readableDate(health.checkedAt);
  const maintenanceEndsAt = readableDate(health.maintenance?.endsAt ?? null);

  const status = (
    <span className="project-health-state">
      <span className="project-health-indicator" aria-hidden="true" />
      <span>{health.label}</span>
    </span>
  );

  if (compact) {
    return (
      <div
        className="project-health project-health--compact"
        data-health={health.status}
      >
        {status}
        {checkedAt && (
          <span className="project-health-time">
            Verificação em{" "}
            <time
              dateTime={checkedAt.toISOString()}
              aria-label={absoluteDate.format(checkedAt)}
            >
              {clockTime.format(checkedAt)}
            </time>
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className="project-health project-health--detail"
      data-health={health.status}
    >
      <h3 className="project-health-heading">Demonstração e disponibilidade</h3>
      {status}
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
      {health.maintenance && (
        <aside
          className="project-health-maintenance"
          aria-label="Manutenção informada"
        >
          <strong>Manutenção informada</strong>
          <p>{health.maintenance.message}</p>
          {maintenanceEndsAt && (
            <p className="project-health-maintenance-end">
              Previsão de término:{" "}
              <time dateTime={maintenanceEndsAt.toISOString()}>
                {absoluteDate.format(maintenanceEndsAt)}
              </time>
            </p>
          )}
        </aside>
      )}
    </div>
  );
}
