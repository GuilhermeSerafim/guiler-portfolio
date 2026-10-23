import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NotebookDrawing, OrbitDrawing } from "./JourneyArtwork";
import notebook960 from "../scroll-expand/assets/notebook-960.webp";
import notebook1600 from "../scroll-expand/assets/notebook-1600.webp";
import notebook2200 from "../scroll-expand/assets/notebook-2200.webp";
import "./ScrollJourney.css";

const staticQuery = "(max-width: 700px), (max-height: 500px) and (pointer: coarse), (prefers-reduced-motion: reduce)";
const srcSet = `${notebook960} 960w, ${notebook1600} 1600w, ${notebook2200} 2200w`;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (from: number, to: number, progress: number) => {
  const t = clamp((progress - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/** Local art direction study: original SVG layers, native scroll, no WebGL. */
export default function ScrollJourney() {
  const root = useRef<HTMLElement>(null);
  const [staticMode, setStaticMode] = useState(() => matchMedia(staticQuery).matches);
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });

  useEffect(() => {
    const query = matchMedia(staticQuery);
    const update = () => setStaticMode(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const measure = () => setSize(previous => {
      const width = section.clientWidth;
      const height = innerHeight;
      return previous.width === width && previous.height === height ? previous : { width, height };
    });
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section || staticMode) return;
    let frame = 0;
    let lastTime = 0;
    let current = 0;
    let target = 0;
    let visible = false;
    const set = (name: string, value: number | string) => section.style.setProperty(`--journey-${name}`, String(value));
    const draw = (p: number) => {
      const approach = ease(0, .43, p);
      const blueprint = ease(.19, .67, p);
      const reveal = ease(.48, .87, p);
      const radius = Math.hypot(size.width * .62, size.height * .66) + 2;
      set("orbit-scale", 1 + approach * 4.8);
      set("orbit-rotation", `${-10 + approach * 29}deg`);
      set("orbit-opacity", 1 - ease(.27, .44, p));
      set("drawing-scale", .50 + blueprint * .50);
      set("drawing-opacity", ease(.15, .34, p) * (1 - ease(.59, .78, p)));
      set("grid-opacity", ease(.13, .32, p) * (1 - ease(.54, .77, p)) * .17);
      set("photo-opacity", ease(.48, .64, p));
      set("photo-radius", `${reveal * radius}px`);
      set("photo-scale", 1.045 - reveal * .045);
      set("intro-opacity", 1 - ease(.12, .29, p));
      set("intro-y", `${-ease(.08, .29, p) * 32}px`);
      set("middle-opacity", ease(.27, .39, p) * (1 - ease(.53, .66, p)));
      set("middle-y", `${(1 - ease(.27, .39, p)) * 24 - ease(.53, .66, p) * 24}px`);
      set("end-opacity", ease(.86, .95, p));
      set("hint-opacity", 1 - ease(.08, .20, p));
      section.dataset.phase = p < .30 ? "orbit" : p < .66 ? "blueprint" : "photo";
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; };
    const read = () => clamp(-section.getBoundingClientRect().top / (size.height * 1.8));
    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const delta = Math.max(0, time - lastTime) / 1000;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-delta / .085));
      if (Math.abs(target - current) < .0003) { current = target; draw(current); lastTime = 0; return; }
      draw(current);
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!visible || document.hidden) return;
      target = read();
      if (frame) return;
      if (Math.abs(target - current) < .0003) { current = target; draw(current); return; }
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const reconcile = () => { stop(); target = read(); current = target; draw(current); };
    const onVisibility = () => {
      section.dataset.active = String(visible && !document.hidden);
      if (document.hidden) stop(); else reconcile();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      section.dataset.active = String(visible && !document.hidden);
      if (visible) reconcile(); else stop();
    });
    reconcile();
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); observer.disconnect(); window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", onVisibility); };
  }, [staticMode, size]);

  const planeWidth = Math.max(size.width, size.height * 1600 / 1068);
  const style = {
    "--journey-height": `${size.height}px`,
    "--journey-plane-width": `${planeWidth}px`,
    "--journey-plane-left": `${(size.width - planeWidth) * .60}px`,
  } as CSSProperties;

  return <section ref={root} className="scroll-journey" style={style} data-static={staticMode} aria-labelledby="journey-title">
    <h2 id="journey-title" className="journey-reader-title">Da curiosidade à construção.</h2>
    {staticMode ? <figure className="journey-static">
      <img src={notebook960} srcSet={srcSet} sizes="100vw" width={1600} height={1068} alt="Guilherme Serafim concentrado diante do notebook." loading="lazy" decoding="async" />
      <figcaption>Curiosidade que vira construção.</figcaption>
    </figure> : <div className="journey-stage">
      <div className="journey-ambient" aria-hidden="true" />
      <div className="journey-grid" aria-hidden="true" />
      <div className="journey-orbit-layer" aria-hidden="true">
        <div className="journey-orbit-position"><div className="journey-orbit-drift"><OrbitDrawing /></div></div>
      </div>
      <div className="journey-blueprint-layer" aria-hidden="true">
        <div className="journey-media-plane"><NotebookDrawing /></div>
      </div>
      <div className="journey-photo-layer">
        <img src={notebook1600} srcSet={srcSet} sizes={`${Math.ceil(planeWidth)}px`} width={1600} height={1068} alt="Guilherme Serafim concentrado diante do notebook, no ambiente real por trás dos projetos." loading="lazy" decoding="async" />
      </div>
      <div className="journey-caption journey-caption--intro" aria-hidden="true">
        <span className="journey-eyebrow">01 / EXPLORAR</span>
        <p>Curiosidade<br />em movimento<span>.</span></p>
        <small>Um olhar para o que ainda pode existir.</small>
      </div>
      <div className="journey-caption journey-caption--middle" aria-hidden="true">
        <span className="journey-eyebrow">02 / EXPERIMENTAR</span>
        <p>Dar forma<br />às ideias<span>.</span></p>
      </div>
      <div className="journey-end" aria-hidden="true"><span className="journey-eyebrow">03 / CONSTRUIR</span><p>Do lado de cá do código.</p></div>
      <span className="journey-scroll-hint" aria-hidden="true">ROLE PARA APROXIMAR <span>↓</span></span>
    </div>}
  </section>;
}
