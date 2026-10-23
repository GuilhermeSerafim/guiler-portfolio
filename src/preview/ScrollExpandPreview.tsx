import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import ScrollExpand from "./scroll-expand/ScrollExpand";
import notebook960 from "./scroll-expand/assets/notebook-960.webp";
import notebook1600 from "./scroll-expand/assets/notebook-1600.webp";
import notebook2200 from "./scroll-expand/assets/notebook-2200.webp";
import "./ScrollExpandPreview.css";

type Variant = "a" | "b";
const sourceSet = `${notebook960} 960w, ${notebook1600} 1600w, ${notebook2200} 2200w`;
const photoAlt = "Guilherme Serafim concentrado diante do notebook, com as mãos juntas.";
const staticPhotoQuery = "(max-width: 700px), (max-height: 500px) and (pointer: coarse), (prefers-reduced-motion: reduce)";

function PhotoExperiment({ variant, toolbarHeight }: { variant: Variant; toolbarHeight: number }) {
  const root = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, viewportHeight: window.innerHeight });
  const [staticMode, setStaticMode] = useState(() => window.matchMedia(staticPhotoQuery).matches);
  useEffect(() => {
    const preference = window.matchMedia(staticPhotoQuery);
    const update = () => setStaticMode(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const measure = () => {
      const next = { width: node.clientWidth, viewportHeight: window.innerHeight };
      setSize(previous => previous.width === next.width && previous.viewportHeight === next.viewportHeight ? previous : next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);window.addEventListener("resize", measure);measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  const stageHeight = Math.round(variant === "a"
    ? Math.max(260, Math.min((size.viewportHeight - toolbarHeight - 24) * .8, size.width * .64, 720))
    : Math.max(220, Math.min(size.width / 1.45, size.viewportHeight - toolbarHeight - 48, 480)));
  const sizes = variant === "a" ? "100vw" : "(max-width: 700px) 90vw, 50vw";
  return <section ref={root} className={`scroll-photo-experiment scroll-photo-experiment--${variant}`} aria-label="Guiler construindo no computador" data-static={staticMode}>
    {variant === "a" && <div className="scroll-photo-intro container"><span className="eyebrow">DO LADO DE CÁ DO CÓDIGO</span><h2>Entre ideias e versões.</h2></div>}
    {staticMode || !size.width ? <figure className="scroll-photo-static">
      <img src={notebook960} srcSet={sourceSet} sizes={sizes} alt={photoAlt} width={1600} height={1068} loading="lazy" decoding="async" />
    </figure> : <ScrollExpand
      src={notebook1600} srcSet={sourceSet} sizes={sizes} alt={photoAlt} width={1600} height={1068}
      stageHeight={stageHeight} stickyTop={toolbarHeight + 12}
      startWidth={variant === "a" ? 74 : 88} startHeight={98}
      startRadius={variant === "a" ? 28 : 18} endRadius={variant === "a" ? 0 : 6}
      mediaZoom={1} objectPosition="60% 0%" scrollDistance={variant === "a" ? .65 : .45} holdDistance={0} smoothing={.08}
    />}
    <p className="scroll-photo-caption">Construindo, aprendendo, repetindo.</p>
  </section>;
}

export default function ScrollExpandPreview() {
  const variant: Variant = /\/b\/?$/.test(window.location.pathname) ? "b" : "a";
  const root = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(80);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `Scroll Expand ${variant.toUpperCase()} · Estudo local | Guiler`;
    const section = root.current?.querySelector<HTMLElement>(variant === "a" ? "#sobre" : ".about-photos");
    if (!section) return;
    const slot = document.createElement("div");
    slot.id = "scroll-expand-study";slot.className = "scroll-lab-slot";
    if (variant === "a") section.before(slot);else section.appendChild(slot);
    setTarget(slot);
    return () => { document.title = originalTitle;slot.remove(); };
  }, [variant]);
  useEffect(() => {
    if (!toolbar.current) return;
    const measure = () => setToolbarHeight(toolbar.current?.offsetHeight ?? 80);
    const observer = new ResizeObserver(measure);observer.observe(toolbar.current);measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const anchor = variant === "a" ? target : root.current?.querySelector("#sobre");
          if (anchor) window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top - (toolbar.current?.offsetHeight ?? 80) - 28, behavior: "instant" });
        });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [target, variant]);
  const seeExperiment = () => {
    if (!target) return;
    const anchor = variant === "a" ? target : root.current?.querySelector("#sobre");
    if (anchor) window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top - toolbarHeight - 28, behavior: "instant" });
  };
  return <div ref={root} className={`scroll-lab scroll-lab--${variant}`} style={{ "--scroll-lab-toolbar-height": `${toolbarHeight}px` } as React.CSSProperties}>
    <aside ref={toolbar} className="scroll-lab-toolbar" aria-label="Experimento local Scroll Expand">
      <div><span className="scroll-lab-label">GUI / ESTUDO LOCAL</span><strong>{variant === "a" ? "A — Transição ampla" : "B — Foto integrada"}</strong></div>
      <nav aria-label="Comparar posições do Scroll Expand">
        <a href="/__preview/scroll-expand/a" aria-current={variant === "a" ? "page" : undefined}>A · Transição</a>
        <a href="/__preview/scroll-expand/b" aria-current={variant === "b" ? "page" : undefined}>B · Integrado</a>
        <button type="button" onClick={seeExperiment}>Ver efeito ↓</button>
      </nav>
      <p>{variant === "a" ? "A foto se amplia antes de Além do editor." : "A expansão ocupa o lugar das fotos em Além do editor."} No celular e com movimento reduzido, a foto fica estática.</p>
    </aside>
    <App />
    {target && createPortal(<PhotoExperiment variant={variant} toolbarHeight={toolbarHeight} />, target)}
    <OrbitCursor />
  </div>;
}
