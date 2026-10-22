import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import { TrophySpring } from "./trophy/TrophySpring";
import { TrophyTrace } from "./trophy/TrophyTrace";
import { TrophyCelebrate } from "../components/TrophyCelebrate";
import "./TrophyPreview.css";

const options: { id: string; name: string; library: string; description: string; component: ComponentType<{ replayToken?: number }> }[] = [
  { id: "a", name: "Pulso", library: "Motion", description: "Uma pequena inclinação, retorno com mola e um aro que se dissipa. A opção mais discreta.", component: TrophySpring },
  { id: "b", name: "Traço", library: "GSAP", description: "O troféu se desenha como um pequeno estudo técnico. Mais próximo dos traços e das invenções do portfólio.", component: TrophyTrace },
  { id: "c", name: "Conquista", library: "Anime.js", description: "Um breve movimento de celebração, com brilho e faíscas ao redor do troféu. A opção mais expressiva.", component: TrophyCelebrate },
];

export default function TrophyPreview() {
  const variant = window.location.pathname.match(/\/trophy\/([abc])\/?$/)?.[1];
  const option = options.find(item => item.id === variant);
  const root = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [replayToken, setReplayToken] = useState(0);
  useEffect(() => {
    if (option) setTarget(root.current?.querySelector<HTMLElement>(".hero-proof .proof-icon") ?? null);
    const originalTitle = document.title;
    document.title = option ? `Troféu ${option.id.toUpperCase()} · ${option.name} | Guiler` : "Troféu · Comparar versões | Guiler";
    return () => { document.title = originalTitle; };
  }, [option]);
  const Component = option?.component;

  return (
    <div className={`trophy-lab${option ? " trophy-lab--context" : ""}`} ref={root}>
      <aside className="trophy-lab-toolbar" aria-label="Comparação local do troféu">
        <div className="trophy-lab-toolbar-top">
          <a className="trophy-lab-label" href="/__preview/trophy">GUI / ESTUDOS DE MOVIMENTO</a>
          <nav aria-label="Versões do troféu">
            <a href="/__preview/trophy" aria-current={!option ? "page" : undefined}>Comparar</a>
            {options.map(item => <a key={item.id} href={`/__preview/trophy/${item.id}`} aria-current={item.id === variant ? "page" : undefined}>{item.id.toUpperCase()} · {item.name}</a>)}
          </nav>
          <button type="button" className="trophy-lab-replay" onClick={() => setReplayToken(value => value + 1)}><RotateCcw size={15} aria-hidden="true" /> Repetir</button>
        </div>
        <p>{option ? option.description : "Três interpretações para o mesmo reconhecimento."} Passe o mouse, foque pelo teclado ou toque no troféu.</p>
      </aside>
      {option ? <>
        <App />
        {target && Component && createPortal(<div className="trophy-lab-live-preview"><Component replayToken={replayToken} /></div>, target)}
        <OrbitCursor />
      </> : (
        <main className="trophy-lab-gallery">
          <div className="trophy-lab-intro">
            <p className="trophy-lab-eyebrow">01 / RECONHECIMENTO EM MOVIMENTO</p>
            <h1>Uma conquista.<br />Três jeitos de <em>sentir.</em></h1>
            <p>Compare os movimentos aqui. Depois, abra cada versão para ver como ela se encaixa no início do portfólio.</p>
          </div>
          <div className="trophy-lab-grid">
            {options.map(({ id, name, library, description, component: TrophyComponent }) => (
              <article className={`trophy-lab-card trophy-lab-card--${id}`} key={id}>
                <div className="trophy-lab-card-top"><span>{id.toUpperCase()} / {name}</span><span>{library}</span></div>
                <div className="trophy-lab-stage"><TrophyComponent replayToken={replayToken} /></div>
                <div className="trophy-lab-caption"><span>Ideias testadas. Trabalho reconhecido.</span><strong>Vencedor do Hackathon OpenAI</strong></div>
                <p>{description}</p>
                <a className="trophy-lab-context-link" href={`/__preview/trophy/${id}`}>Ver no portfólio <ArrowUpRight size={18} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
          <p className="trophy-lab-footnote">Somente local. Com movimento reduzido, os troféus permanecem estáticos. Nenhuma versão foi publicada.</p>
        </main>
      )}
    </div>
  );
}
