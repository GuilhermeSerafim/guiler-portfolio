import { useEffect, useState } from "react";
import { ContinuityDiagram, IntegrationDiagram } from "./EngineeringDiagrams";
import "./EngineeringExamples.css";

/** Educational scenarios, deliberately separate from the measured project results. */
export default function EngineeringExamples({ visible }: { visible: boolean }) {
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

  return <div className="engineering-examples" aria-label="Demonstrações interativas de engenharia" aria-hidden={!visible}>
    <article className="engineering-example engineering-example--evolve">
      <span className="engineering-example-label">EXEMPLO 01</span>
      <h3>Menos retrabalho.</h3>
      <p>Trocar uma integração mantendo as regras do produto.</p>
      <IntegrationDiagram provider={provider} pulseKey={swaps} />
      <span className="engineering-example-status" role="status" aria-live="polite">
        Serviço {provider.toUpperCase()} conectado
        <span className="engineering-example-sr">. As regras do produto e o contrato permanecem iguais.</span>
      </span>
      <button className="engineering-example-action" type="button" disabled={!visible} onClick={() => { setProvider(value => value === "a" ? "b" : "a"); setSwaps(value => value + 1); }}>
        Trocar integração <span aria-hidden="true">↔</span>
      </button>
    </article>
    <article className="engineering-example engineering-example--continuity" data-phase={phase}>
      <span className="engineering-example-label">EXEMPLO 02</span>
      <h3>Menos interrupções.</h3>
      <p>Se um servidor falha, outro pode continuar atendendo.</p>
      <ContinuityDiagram phase={phase} pulseKey={attempts} />
      <span className="engineering-example-status" role="status" aria-live="polite">
        {phase === "healthy" ? "Servidor A ativo" : phase === "detecting" ? "Detectando falha…" : "Servidor B assumiu"}
      </span>
      <button className="engineering-example-action" type="button" disabled={!visible || phase === "detecting"} onClick={() => { setPhase(value => value === "healthy" ? "detecting" : "healthy"); setAttempts(value => value + 1); }}>
        {phase === "healthy" ? "Simular falha" : phase === "detecting" ? "Detectando…" : "Restaurar"} <span aria-hidden="true">↗</span>
      </button>
    </article>
  </div>;
}
