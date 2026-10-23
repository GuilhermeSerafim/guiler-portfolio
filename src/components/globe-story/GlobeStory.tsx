import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import GlobeField from "./GlobeField";
import SystemPlane from "./SystemPlane";
import EngineeringExamples from "./EngineeringExamples";
import "./GlobeStory.css";

const GlobeSwarm = lazy(() => import("./swarm/GlobeSwarm"));
const finePointerQuery = "(hover: hover) and (pointer: fine)";
const clamp = (value: number) => Math.max(0, Math.min(1, value));
// Short, narrow windows (including browser zoom) need the same readable flow.
const staticLayoutQuery = "(prefers-reduced-motion: reduce), (max-width: 640px) and (max-height: 500px)";
const smooth = (from: number, to: number, progress: number) => {
  const p = clamp((progress - from) / (to - from));
  return p * p * (3 - 2 * p);
};
/** A continuous field connecting curiosity to interactive engineering examples. */
export default function GlobeStory({ swarm = true }: { swarm?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(false);
  const [examplesVisible, setExamplesVisible] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia(staticLayoutQuery).matches);
  const [height, setHeight] = useState(innerHeight);
  const [finePointer, setFinePointer] = useState(() => matchMedia(finePointerQuery).matches);
  useEffect(() => {
    const query = matchMedia(staticLayoutQuery);
    const pointer = matchMedia(finePointerQuery);
    const pointerPreference = () => setFinePointer(pointer.matches);
    const preference = () => setReduced(query.matches);
    const resize = () => setHeight(innerHeight);
    query.addEventListener("change", preference);
    pointer.addEventListener("change", pointerPreference);
    window.addEventListener("resize", resize);
    return () => { query.removeEventListener("change", preference); pointer.removeEventListener("change", pointerPreference); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const section = root.current;
    if (!section || reduced) { setActive(false); return; }
    let visible = false;
    let frame = 0;
    let current = 0;
    let target = 0;
    let lastTime = 0;
    const set = (key: string, value: number | string) => section.style.setProperty(`--globe-${key}`, String(value));
    const draw = (p: number) => {
      progress.current = p;
      const system = smooth(.48, .73, p);
      set("intro-opacity", 1 - smooth(.13, .23, p));
      set("intro-y", `${-smooth(.10, .23, p) * 26}px`);
      set("bridge-opacity", smooth(.22, .30, p) * (1 - smooth(.49, .60, p)));
      set("bridge-y", `${(1 - smooth(.22, .30, p)) * 22}px`);
      set("system-opacity", system * (1 - smooth(.86, 1, p) * .15));
      set("system-scale", .74 + system * .26);
      set("system-left", `${50 + smooth(.55, .85, p) * 10}%`);
      set("system-x", `${46 - system * 28}deg`);
      set("system-y", `${-23 + smooth(.55, 1, p) * 40}deg`);
      set("route-progress", 100 * (1 - smooth(.63, .81, p)));
      set("end-opacity", smooth(.80, .93, p));
      set("end-y", `${(1 - smooth(.80, .93, p)) * 22}px`);
      set("veil-opacity", smooth(.82, 1, p) * .28);
      set("hint-opacity", 1 - smooth(.05, .14, p));
      const showExamples = p >= .68;
      if (section.dataset.examples !== String(showExamples)) {
        section.dataset.examples = String(showExamples);
        setExamplesVisible(showExamples);
      }
      section.dataset.phase = p < .25 ? "globe" : p < .58 ? "field" : "system";
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; };
    const read = () => clamp(-section.getBoundingClientRect().top / (height * 2.6));
    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = Math.max(0, time - lastTime) / 1000;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-dt / .085));
      if (Math.abs(target - current) < .00025) { current = target; draw(current); return; }
      draw(current);
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!visible || document.hidden) return;
      target = read();
      if (!frame && Math.abs(target - current) > .00025) { lastTime = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const reconcile = () => { stop(); target = read(); current = target; draw(current); };
    const syncVisibility = () => {
      const playing = visible && !document.hidden;
      section.dataset.active = String(playing);
      setActive(playing);
      if (playing) reconcile(); else stop();
    };
    const observer = new IntersectionObserver(entries => {
      // A direct anchor jump can queue both exit and entry in one delivery.
      // Use the latest observation, otherwise the whole scene stays paused.
      visible = entries[entries.length - 1].isIntersecting;
      syncVisibility();
    });
    reconcile(); observer.observe(section);
    window.addEventListener("scroll", onScroll, {passive:true});
    document.addEventListener("visibilitychange", syncVisibility);
    return () => { stop(); observer.disconnect(); window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", syncVisibility); };
  }, [height, reduced]);

  return <section ref={root} className="globe-story" data-reduced={reduced} style={{"--globe-height":`${height}px`} as CSSProperties} aria-labelledby="globe-story-heading">
    <div ref={setStage} className="globe-story-stage">
      {!reduced && <GlobeField active={active} progressRef={progress} />}
      <div className="globe-scene-shade" aria-hidden="true" />
      <div className="globe-story-intro">
        <span className="globe-eyebrow">CURIOSIDADE</span>
        <h2 id="globe-story-heading">Olhar além.<br />Entender por dentro<span>.</span></h2>
        <p>O que conecta uma ideia a algo que funciona?</p>
      </div>
      <div className="globe-story-bridge" aria-hidden="true"><span className="globe-eyebrow">CONEXÕES</span><p>Chegar perto.<br />Encontrar as conexões.</p></div>
      <div className="globe-system-plane" aria-hidden="true"><SystemPlane /></div>
      <div className="globe-end-veil" aria-hidden="true" />
      <div className="globe-story-end"><span className="globe-eyebrow">PRINCÍPIOS EM AÇÃO</span><p>Dar estrutura.<br />Gerar resultado<span>.</span></p><span className="globe-end-note">Demonstrações interativas.</span></div>
      <EngineeringExamples visible={reduced || examplesVisible} />
      <span className="globe-story-hint" aria-hidden="true">CONTINUE PARA EXPLORAR <b>↓</b></span>
      {swarm && active && !reduced && finePointer && stage && <Suspense fallback={null}><GlobeSwarm stage={stage} /></Suspense>}
    </div>
  </section>;
}
