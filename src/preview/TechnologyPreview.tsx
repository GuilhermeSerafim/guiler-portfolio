import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Grid2X2, MoveRight } from "lucide-react";
import App from "../App";
import { CuriositySketch } from "../components/CuriositySketch";
import "./TechnologyPreview.css";

type Technology = { name: string; icon: string };
const areas = [
  { name: "Interface", note: "Da ideia à interação.", items: [
    { name: "React", icon: "react" }, { name: "Next.js", icon: "nextjs" },
    { name: "Angular", icon: "angular" }, { name: "TypeScript", icon: "typescript" },
  ] },
  { name: "Sistemas", note: "Estrutura para crescer.", items: [
    { name: "Java", icon: "java" }, { name: "Spring Boot", icon: "spring" },
    { name: "C#", icon: "csharp" }, { name: ".NET", icon: "dotnetcore" },
  ] },
  { name: "Dados & IA", note: "Informação vira aplicação.", items: [
    { name: "Python", icon: "python" }, { name: "FastAPI", icon: "fastapi" },
    { name: "PostgreSQL", icon: "postgresql" }, { name: "LangChain", icon: "langchain" },
  ] },
];
const all = areas.flatMap(area => area.items);
const variants = {
  a: { title: "Faixa contínua", description: "Ícones nas cores das tecnologias. Uma faixa enxuta, sem categorias ou frases repetidas." },
  b: { title: "Trilhos por área", description: "Três trilhos, três áreas. Movimento com a organização da sua stack." },
  c: { title: "Catálogo em movimento", description: "Todas as tecnologias à vista. O deslocamento sutil acompanha a rolagem." },
} as const;
type Variant = keyof typeof variants;
const icons = import.meta.glob<string>("./technology-assets/*.svg", { eager: true, query: "?url", import: "default" });

function Tech({ item }: { item: Technology }) {
  return <span className="tech-item">
    <img src={icons[`./technology-assets/${item.icon}.svg`]} alt="" width="28" height="28" />
    <span>{item.name}</span>
  </span>;
}

function Rail({ items, reverse = false, duration = 48 }: { items: Technology[]; reverse?: boolean; duration?: number }) {
  return <div className="tech-rail-window">
    <div className="tech-rail-track" style={{ "--rail-duration": `${duration}s`, "--rail-direction": reverse ? "reverse" : "normal" } as CSSProperties}>
      {[0, 1, 2].map(copy => <ul className="tech-rail-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
        {items.map(item => <li key={item.icon}><Tech item={item} /></li>)}
      </ul>)}
    </div>
  </div>;
}

function CatalogRow({ area, index }: { area: typeof areas[number]; index: number }) {
  const row = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: row, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 ? -12 : 12, 0, index % 2 ? 12 : -12]);
  return <div className="tech-catalog-row" ref={row}>
    <div className="tech-area-label"><span className="tech-area-number">0{index + 1}</span><div><h4>{area.name}</h4><p>{area.note}</p></div></div>
    <motion.ul style={reduced ? undefined : { x }} className="tech-catalog-items">
      {area.items.map(item => <li key={item.icon}><Tech item={item} /></li>)}
    </motion.ul>
  </div>;
}

function TechnologyStudy({ variant }: { variant: Variant }) {
  const [showAll, setShowAll] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const staticMode = showAll || Boolean(reduced);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let active = true;
    const observer = new IntersectionObserver(entries => {
      // Rapid scroll/resize can queue exit and entry in the same delivery.
      // Use the latest observation, and ignore callbacks after cleanup.
      const latest = entries.filter(entry => entry.target === element).sort((a, b) => a.time - b.time).at(-1);
      if (active && latest) setVisible(latest.isIntersecting);
    }, { threshold: 0 });
    observer.observe(element);
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <section id="tecnologias" ref={root} aria-labelledby="tech-study-title" className={`tech-study tech-study--${variant}`} data-static={staticMode} data-visible={visible}>
    <header className="tech-study-header">
      <div>
        {variant === "a" ? <h3 id="tech-study-title">Minha caixa de ferramentas.</h3> : <>
          <span className="eyebrow">MINHA CAIXA DE FERRAMENTAS</span>
          <h3 id="tech-study-title">A tecnologia certa<br /><span>para cada problema.</span></h3>
        </>}
      </div>
      <div className="tech-study-aside">
        <CuriositySketch subject="einstein" />
        {variant !== "c" && !reduced && <button className="tech-view-button" type="button" aria-pressed={showAll} onClick={() => setShowAll(value => !value)}>
          {showAll ? <MoveRight size={15} /> : <Grid2X2 size={15} />}{showAll ? "Ver em movimento" : "Ver todas"}
        </button>}
      </div>
    </header>
    {variant === "a" && <Rail items={all} duration={64} />}
    {variant === "b" && <div className="tech-area-rails">{areas.map((area, index) => <div className="tech-area-row" key={area.name}>
      <div className="tech-area-label"><span className="tech-area-number">0{index + 1}</span><div><h4>{area.name}</h4><p>{area.note}</p></div></div>
      <Rail items={area.items} reverse={index === 1} duration={34 + index * 5} />
    </div>)}</div>}
    {variant === "c" && <div className="tech-catalog">{areas.map((area, index) => <CatalogRow key={area.name} area={area} index={index} />)}</div>}
    {variant !== "a" && <div className="tech-study-footnote"><span>Ferramentas mudam. O critério fica.</span><span className="eyebrow">ENGENHARIA + CURIOSIDADE <ArrowUpRight size={13} /></span></div>}
  </section>;
}

export default function TechnologyPreview() {
  const variant = window.location.pathname.split("/").filter(Boolean).at(-1) as Variant;
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const current = document.querySelector<HTMLElement>(".about-section .toolkit");
    if (!current) return;
    const mount = document.createElement("div");
    mount.className = "tech-preview-mount";
    current.before(mount);
    current.hidden = true;
    setHost(mount);
    return () => { current.hidden = false; mount.remove(); };
  }, []);
  useEffect(() => {
    if (!host || window.location.hash !== "#tecnologias") return;
    let cancelled = false;
    const cancel = () => { cancelled = true; };
    const events = ["wheel", "pointerdown", "touchstart", "keydown"] as const;
    events.forEach(event => window.addEventListener(event, cancel, { passive: true }));
    void document.fonts.ready.then(() => {
      if (!cancelled) document.getElementById("tecnologias")?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => { cancelled = true; events.forEach(event => window.removeEventListener(event, cancel)); };
  }, [host]);
  return <>
    <aside className="tech-preview-bar" aria-label="Comparar propostas locais">
      <a className="tech-preview-brand" href="/#sobre">guiler<span>.</span><small>ESTUDO LOCAL</small></a>
      <nav aria-label="Propostas">{(Object.keys(variants) as Variant[]).map(key => <a href={`/__preview/tecnologias/${key}#tecnologias`} aria-current={key === variant ? "page" : undefined} key={key}>
        <b>{key.toUpperCase()}</b><span>{variants[key].title}</span>
      </a>)}</nav>
      <a className="tech-preview-current" href="/#sobre">Atual <ArrowUpRight size={13} /></a>
    </aside>
    <App />
    {host && createPortal(<TechnologyStudy variant={variant} />, host)}
    <div className="tech-preview-note" role="note"><b>{variant.toUpperCase()} · {variants[variant].title}</b><span>{variants[variant].description}</span></div>
  </>;
}
