import { useEffect, useState } from "react";
import { ContinuityDiagram, IntegrationDiagram } from "./EngineeringDiagrams";
import { useTranslation } from "../../i18n";
import "./EngineeringExamples.css";

/** Educational scenarios, deliberately separate from the measured project results. */
export default function EngineeringExamples({ visible }: { visible: boolean }) {
  const { t } = useTranslation();
  const [provider, setProvider] = useState<"a" | "b">("a");
  const [swaps, setSwaps] = useState(0);
  const [phase, setPhase] = useState<"healthy" | "detecting" | "rerouted">("healthy");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (visible) return;
    setProvider("a"); setSwaps(0); setPhase("healthy"); setAttempts(0);
  }, [visible]);

  useEffect(() => {
    if (!visible || phase !== "detecting") return;
    // Illustrates detection before rerouting; this is not a measured failover time.
    const timer = window.setTimeout(() => setPhase("rerouted"), 750);
    return () => window.clearTimeout(timer);
  }, [phase, visible]);

  return <div className="engineering-examples" aria-label={t("Demonstrações interativas de engenharia", "Interactive engineering demonstrations")} aria-hidden={!visible}>
    <article className="engineering-example engineering-example--evolve">
      <span className="engineering-example-label">{t("EXEMPLO 01", "EXAMPLE 01")}</span>
      <h3>{t("Menos retrabalho.", "Less rework.")}</h3>
      <p>{t("Trocar uma integração mantendo as regras do produto.", "Swap integrations while keeping the product rules.")}</p>
      <IntegrationDiagram provider={provider} pulseKey={swaps} />
      <span className="engineering-example-status" role="status" aria-live="polite">
        {t(`Serviço ${provider.toUpperCase()} conectado`, `Service ${provider.toUpperCase()} connected`)}
        <span className="engineering-example-sr">{t(". As regras do produto e o contrato permanecem iguais.", ". The product rules and contract remain unchanged.")}</span>
      </span>
      <button className="engineering-example-action" type="button" disabled={!visible} onClick={() => { setProvider(value => value === "a" ? "b" : "a"); setSwaps(value => value + 1); }}>
        {t("Trocar integração", "Switch integration")} <span aria-hidden="true">↔</span>
      </button>
    </article>
    <article className="engineering-example engineering-example--continuity" data-phase={phase}>
      <span className="engineering-example-label">{t("EXEMPLO 02", "EXAMPLE 02")}</span>
      <h3>{t("Menos interrupções.", "Fewer interruptions.")}</h3>
      <p>{t("Se um servidor falha, outro pode continuar atendendo.", "If one server fails, another can keep serving requests.")}</p>
      <ContinuityDiagram phase={phase} pulseKey={attempts} />
      <span className="engineering-example-status" role="status" aria-live="polite">
        {phase === "healthy" ? t("Servidor A ativo", "Server A active") : phase === "detecting" ? t("Detectando falha…", "Detecting failure…") : t("Servidor B assumiu", "Server B took over")}
      </span>
      <button className="engineering-example-action" type="button" disabled={!visible || phase === "detecting"} onClick={() => { setPhase(value => value === "healthy" ? "detecting" : "healthy"); setAttempts(value => value + 1); }}>
        {phase === "healthy" ? t("Simular falha", "Simulate failure") : phase === "detecting" ? t("Detectando…", "Detecting…") : t("Restaurar", "Restore")} <span aria-hidden="true">↗</span>
      </button>
    </article>
  </div>;
}
