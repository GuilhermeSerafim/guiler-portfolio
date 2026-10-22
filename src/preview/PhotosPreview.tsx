import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import { PhotoDepth } from "../components/photos/PhotoDepth";
import { PhotoAperture } from "./photos/PhotoAperture";
import { PhotoMemories } from "./photos/PhotoMemories";
import "./TrophyPreview.css";
import "./PhotosPreview.css";

const options: { id: string; name: string; library: string; description: string; component: ComponentType<{ replayToken?: number }> }[] = [
  { id: "a", name: "Profundidade", library: "Motion", description: "As fotos acompanham o mouse com uma inclinação suave. No toque, um pequeno movimento de aproximação.", component: PhotoDepth },
  { id: "b", name: "Revelação", library: "GSAP", description: "Máscaras se abrem sobre as fotos, uma após a outra. Uma entrada mais editorial, com movimento contido.", component: PhotoAperture },
  { id: "c", name: "Memórias", library: "Anime.js", description: "As duas fotos se acomodam como lembranças sobre uma mesa. Um gesto leve, com o aspecto de papel preservado.", component: PhotoMemories },
];

export default function PhotosPreview() {
  const variant = window.location.pathname.match(/\/photos\/([abc])\/?$/)?.[1];
  const option = options.find(item => item.id === variant);
  const root = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [replayToken, setReplayToken] = useState(0);
  const Component = option?.component;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = option ? `Fotos ${option.id.toUpperCase()} · ${option.name} | Guiler` : "Fotos · Comparar movimentos | Guiler";
    if (option) setTarget(root.current?.querySelector<HTMLElement>(".about-photos") ?? null);
    const observer = new ResizeObserver(() => {
      root.current?.style.setProperty("--photo-lab-toolbar-height", `${toolbar.current?.offsetHeight ?? 100}px`);
    });
    if (toolbar.current) observer.observe(toolbar.current);
    return () => { document.title = originalTitle; observer.disconnect(); };
  }, [option]);
  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        const heading = root.current?.querySelector("#sobre .section-top");
        if (!heading) return;
        window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - (toolbar.current?.offsetHeight ?? 100) - 24, behavior: "instant" });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [target]);

  return <div className={`trophy-lab photo-lab${option ? " photo-lab--context" : ""}`} ref={root}>
    <aside className="trophy-lab-toolbar photo-lab-toolbar" aria-label="Comparação local das fotos" ref={toolbar}>
      <div className="trophy-lab-toolbar-top">
        <a className="trophy-lab-label" href="/__preview/photos">GUI / FOTOS EM MOVIMENTO</a>
        <nav aria-label="Versões das fotos">
          <a href="/__preview/photos" aria-current={!option ? "page" : undefined}>Comparar</a>
          {options.map(item => <a key={item.id} href={`/__preview/photos/${item.id}`} aria-current={item.id === variant ? "page" : undefined}>{item.id.toUpperCase()} · {item.name}</a>)}
        </nav>
        <button className="trophy-lab-replay" type="button" onClick={() => setReplayToken(value => value + 1)}><RotateCcw size={15} aria-hidden="true" /> Repetir</button>
      </div>
      <p>{option ? option.description : "Compare os três movimentos e depois veja cada um na seção completa."} Passe o mouse, toque nas fotos ou use Repetir.</p>
    </aside>
    {option ? <>
      <App />
      {target && Component && createPortal(<div className="photo-lab-live-preview"><Component replayToken={replayToken} /></div>, target)}
      <OrbitCursor />
    </> : <main className="trophy-lab-gallery photo-lab-gallery">
      <div className="trophy-lab-intro">
        <p className="trophy-lab-eyebrow">03 / ALÉM DO EDITOR · ESTUDOS LOCAIS</p>
        <h1>Cenas reais.<br /><em>Novos movimentos.</em></h1>
        <p>As mesmas fotos, três sensações diferentes. O foco continua nas pessoas e nas histórias por trás delas.</p>
      </div>
      <div className="photo-lab-grid">
        {options.map(({id, name, library, description, component: PhotoComponent}) => <article className="photo-lab-card" key={id}>
          <div className="trophy-lab-card-top"><span>{id.toUpperCase()} / {name}</span><span>{library}</span></div>
          <div className="photo-lab-stage"><PhotoComponent replayToken={replayToken} /></div>
          <p>{description}</p>
          <a className="trophy-lab-context-link" href={`/__preview/photos/${id}`}>Ver na seção <ArrowUpRight size={18} aria-hidden="true" /></a>
        </article>)}
      </div>
      <div className="photo-lab-footnote"><p>Estudos locais · Fotos originais · Movimento reduzido respeitado · Nada publicado</p><a href="/__preview/trophy">Voltar à comparação do troféu ↗</a></div>
    </main>}
  </div>;
}
