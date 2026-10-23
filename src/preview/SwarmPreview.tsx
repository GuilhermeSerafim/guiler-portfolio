import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import FullSwarm from "./swarm/FullSwarm";
import SubtleSwarm from "./swarm/SubtleSwarm";
import "./SwarmPreview.css";

/** Local A/B experiment; this module is excluded from production. */
export default function SwarmPreview() {
  const root = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [mouseAvailable, setMouseAvailable] = useState(false);
  const variant = window.location.pathname.replace(/\/$/, "").endsWith("/b") ? "b" : "a";
  const Effect = variant === "a" ? FullSwarm : SubtleSwarm;

  useEffect(() => {
    const section = root.current?.querySelector<HTMLElement>(".globe-story");
    const surface = section?.querySelector<HTMLElement>(".globe-story-stage");
    if (!section || !surface) return;
    const oldTitle = document.title;
    document.title = `Swarm ${variant.toUpperCase()} · ${variant === "a" ? "Completo" : "Discreto"} · Estudo local | Guiler`;
    setStage(surface);
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const available = pointer.matches && !reduced.matches && section.dataset.reduced !== "true";
      setMouseAvailable(available);
      setEnabled(available && section.dataset.active === "true" && !document.hidden);
    };
    const observer = new MutationObserver(sync);
    observer.observe(section, {attributes:true,attributeFilter:["data-active","data-reduced"]});
    pointer.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    let cancelled = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => window.scrollTo({top:scrollY + section.getBoundingClientRect().top,behavior:"instant"}));
      });
    });
    return () => {
      cancelled = true; cancelAnimationFrame(frame); observer.disconnect();
      pointer.removeEventListener("change", sync); reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync); document.title = oldTitle;
    };
  }, [variant]);

  useEffect(() => {
    document.documentElement.dataset.swarmPreviewActive = String(enabled && cursorActive);
    return () => { delete document.documentElement.dataset.swarmPreviewActive; };
  }, [enabled, cursorActive]);

  return <div ref={root} className="swarm-preview" data-variant={variant}>
    <aside className="swarm-preview-toolbar" aria-label="Comparação local de cursores">
      <div className="swarm-preview-caption"><span>ESTUDO LOCAL · {variant.toUpperCase()}</span><strong>{variant === "a" ? "Swarm completo" : "Campo discreto"}</strong></div>
      <nav aria-label="Versões do cursor">
        <a href="/__preview/swarm/a" aria-current={variant === "a" ? "page" : undefined}>A · Completo</a>
        <a href="/__preview/swarm/b" aria-current={variant === "b" ? "page" : undefined}>B · Discreto</a>
        <a href="/__preview/globe-story">Sem efeito ↗</a>
      </nav>
      <span className="swarm-preview-instruction">{mouseAvailable ? variant === "a" ? "Mova, clique e explore os botões." : "Mova o mouse sobre o globo." : "Use um mouse e movimento ativado para comparar."}</span>
    </aside>
    <App />
    {stage && createPortal(<div className="swarm-preview-effect" data-variant={variant} aria-hidden="true"><Effect stage={stage} enabled={enabled} onActiveChange={setCursorActive} /></div>, stage)}
    <OrbitCursor />
  </div>;
}
