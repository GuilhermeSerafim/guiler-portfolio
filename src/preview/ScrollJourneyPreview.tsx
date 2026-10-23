import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import GlobeStory from "./globe-story/GlobeStory";
import "./ScrollJourneyPreview.css";

export default function ScrollJourneyPreview() {
  const root = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const section = root.current?.querySelector("#sobre");
    if (!section) return;
    const previousTitle = document.title;
    document.title = "Globo → conexões → engenharia · Estudo local | Guiler";
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
        frame = requestAnimationFrame(() => window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top, behavior: "instant" }));
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [target]);
  return <div ref={root} className="journey-preview">
    <aside className="journey-preview-toolbar" aria-label="Estudo local de transição">
      <span>GUI / ESTUDO LOCAL · GLOBO → CONEXÕES → ENGENHARIA</span>
      <a href="/__preview/scroll-expand/a">Comparar com a versão A ↗</a>
    </aside>
    <App />
    {target && createPortal(<GlobeStory />, target)}
    <OrbitCursor />
  </div>;
}
