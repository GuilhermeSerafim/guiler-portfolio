import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import ScrollJourney from "./scroll-journey/ScrollJourney";
import "./ScrollJourneyPreview.css";

export default function ScrollJourneyPreview() {
  const root = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const section = root.current?.querySelector("#sobre");
    if (!section) return;
    const previousTitle = document.title;
    document.title = "Órbita → construção · Estudo local | Guiler";
    const slot = document.createElement("div");
    slot.id = "journey-study";
    section.before(slot);
    setTarget(slot);
    return () => { slot.remove(); document.title = previousTitle; };
  }, []);
  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" }));
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [target]);
  return <div ref={root} className="journey-preview">
    <aside className="journey-preview-toolbar" aria-label="Estudo local de transição">
      <span>GUI / ESTUDO LOCAL · ÓRBITA → CONSTRUÇÃO</span>
      <a href="/__preview/scroll-expand/a">Comparar com a versão A ↗</a>
    </aside>
    <App />
    {target && createPortal(<ScrollJourney />, target)}
    <OrbitCursor />
  </div>;
}
