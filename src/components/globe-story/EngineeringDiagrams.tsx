import { useTranslation } from "../../i18n";

type IntegrationDiagramProps = {
  provider: "a" | "b";
  pulseKey: number;
};

type ContinuityDiagramProps = {
  phase: "healthy" | "detecting" | "rerouted";
  pulseKey: number;
};

const accent = "#a7b9ff";
const primaryRoute = "M32 47H78Q86 47 86 39V25H151";
const backupRoute = "M32 47H78Q86 47 86 55V70H151";

/** A stable product and contract, with an interchangeable service behind them. */
export function IntegrationDiagram({ provider, pulseKey }: IntegrationDiagramProps) {
  const { t } = useTranslation();
  return <svg
    className="demo-diagram demo-diagram--integration"
    viewBox="0 0 240 94"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path className="demo-route" data-current="true" data-failed="false" d="M77 47H102M136 47H157" opacity=".65" />

    <g className="demo-product">
      <rect x="8" y="25" width="69" height="44" rx="5" />
      <path d="M15 34H25" opacity=".45" />
      <text x="42.5" y="53" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="var(--mono, monospace)" fontSize="13">{t("produto", "product")}</text>
    </g>

    <g className="demo-contract" stroke={accent}>
      <rect x="102" y="34" width="34" height="26" rx="3" />
      <path d="M117 34V42H123V50H117V60" />
      <path d="M98 42V52M140 42V52" opacity=".4" />
    </g>

    {(["a", "b"] as const).map(option => <g
      key={option}
      className="demo-provider"
      data-provider={option}
      data-selected={provider === option}
      opacity={provider === option ? 1 : 0}
      stroke={accent}
    >
      <rect x="157" y="25" width="75" height="44" rx="5" />
      <path d="M166 35H175M166 59H175" opacity=".45" />
      <text x="195" y="54" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="var(--mono, monospace)" fontSize="20">{option.toUpperCase()}</text>
      <path d="M216 41V53" opacity=".45" />
    </g>)}

    {pulseKey > 0 && <path
      key={pulseKey}
      className="demo-pulse"
      d="M77 47H157"
      pathLength="100"
      stroke={accent}
      strokeWidth="3"
      strokeDasharray="8 92"
    />}
  </svg>;
}

/** Execution switches to a healthy service after the primary stops responding. */
export function ContinuityDiagram({ phase, pulseKey }: ContinuityDiagramProps) {
  const primaryHealthy = phase === "healthy";
  const backupCurrent = phase === "rerouted";

  return <svg
    className="demo-diagram demo-diagram--continuity"
    data-phase={phase}
    viewBox="0 0 240 94"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <g className="demo-user">
      <circle cx="18" cy="36" r="6" />
      <path d="M7 60V55C7 49 12 46 18 46S29 49 29 55V60H7Z" />
    </g>

    <path
      className="demo-route"
      data-route="a"
      data-current={primaryHealthy}
      data-failed={!primaryHealthy}
      d={primaryRoute}
      stroke={primaryHealthy ? accent : "currentColor"}
      strokeDasharray={primaryHealthy ? undefined : "3 4"}
      opacity={primaryHealthy ? .9 : .25}
    />
    <path
      className="demo-route"
      data-route="b"
      data-current={backupCurrent}
      data-failed="false"
      d={backupRoute}
      stroke={backupCurrent ? accent : "currentColor"}
      opacity={backupCurrent ? .9 : .25}
    />

    <g className="demo-server" data-server="a" data-current={primaryHealthy} data-failed={!primaryHealthy} opacity={primaryHealthy ? 1 : .45}>
      <rect x="151" y="9" width="51" height="32" rx="4" />
      <text x="164" y="31" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="var(--mono, monospace)" fontSize="17">A</text>
      <path d="M178 20H193M178 29H193" opacity=".55" />
    </g>

    <g className="demo-server" data-server="b" data-current={backupCurrent} data-failed="false" opacity={backupCurrent ? 1 : .4}>
      <rect x="151" y="54" width="51" height="32" rx="4" />
      <text x="164" y="76" fill="currentColor" stroke="none" textAnchor="middle" fontFamily="var(--mono, monospace)" fontSize="17">B</text>
      <path d="M178 65H193M178 74H193" opacity=".55" />
    </g>

    <g className="demo-detection" data-active={phase === "detecting"} opacity={phase === "detecting" ? 1 : 0} stroke={accent}>
      <circle cx="107" cy="47" r="9" strokeDasharray="2 3" />
      <path d="M103 47H103.2M107 47H107.2M111 47H111.2" strokeWidth="2" />
    </g>

    <g className="demo-response" data-server="a" data-active={primaryHealthy} opacity={primaryHealthy ? 1 : 0} stroke={accent}>
      <path d="M214 25L218 29L226 20" strokeWidth="2" />
    </g>
    <g className="demo-failure" data-active={!primaryHealthy} opacity={primaryHealthy ? 0 : 1}>
      <path d="M215 20L225 30M225 20L215 30" strokeWidth="2" />
    </g>
    <g className="demo-response" data-server="b" data-active={backupCurrent} opacity={backupCurrent ? 1 : 0} stroke={accent}>
      <path d="M214 70L218 74L226 65" strokeWidth="2" />
    </g>

    {pulseKey > 0 && phase !== "detecting" && <path
      key={`${pulseKey}-${phase}`}
      className="demo-pulse"
      data-route={backupCurrent ? "b" : "a"}
      d={backupCurrent ? backupRoute : primaryRoute}
      pathLength="100"
      stroke={accent}
      strokeWidth="3"
      strokeDasharray="8 92"
    />}
  </svg>;
}
