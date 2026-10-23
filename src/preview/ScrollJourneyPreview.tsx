import { useEffect, useRef } from "react";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import "./ScrollJourneyPreview.css";

export default function ScrollJourneyPreview() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = root.current?.querySelector(".globe-story");
    if (!section) return;
    const previousTitle = document.title;
    document.title = "Globo → conexões → engenharia · Estudo local | Guiler";
    let cancelled = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top, behavior: "instant" }));
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); document.title = previousTitle; };
  }, []);
  return <div ref={root} className="journey-preview">
    <aside className="journey-preview-toolbar" aria-label="Estudo local de transição">
      <span>GUI / ESTUDO LOCAL · GLOBO → CONEXÕES → ENGENHARIA</span>
      <a href="/__preview/scroll-expand/a">Comparar com a versão A ↗</a>
    </aside>
    <App globeSwarm={false} />
    <OrbitCursor />
  </div>;
}
