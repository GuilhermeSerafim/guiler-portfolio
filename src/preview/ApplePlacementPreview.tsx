import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { CuriositySketch } from "../components/CuriositySketch";
import "./ApplePlacementPreview.css";

const options = [
  { id: "01", title: "Uma ideia no hero", area: "Apresentação", description: "A maçã substitui a pequena seta ao lado da apresentação.", target: ".hero-intro", after: null, size: "64 / 48 px" },
  { id: "02", title: "Assinatura do retrato", area: "Apresentação", description: "Centralizada sob a foto, entre as duas legendas.", target: ".portrait-bottomline", after: ":scope > span:first-child", size: "80 / 60 px" },
  { id: "03", title: "Ideias em construção", area: "Projetos", description: "Ao lado do texto introdutório, acima dos filtros.", target: ".work-heading-side", after: ":scope > p", size: "88 / 64 px" },
  { id: "04", title: "Mais experimentos", area: "Projetos", description: "Centralizada no encerramento dos projetos, com desenho menor.", target: ".work-footer", after: ":scope > p", size: "72 / 52 px" },
  { id: "05", title: "Uma pausa na trajetória", area: "Experiência", description: "Na margem direita entre Quipux e Tokio Marine, em branco.", target: ".timeline", after: ":scope > div:first-child", size: "76 / 60 px" },
  { id: "06", title: "Além do editor", area: "Sobre", description: "Um detalhe na abertura da seção, antes das fotos e do texto.", target: ".about-section > .section-top", after: ":scope > span:first-child", size: "72 / 56 px" },
  { id: "07", title: "Curioso por natureza", area: "Sobre", description: "Como assinatura do texto pessoal, junto ao link do LinkedIn.", target: ".about-copy", after: ":scope > p:last-of-type", size: "88 / 64 px" },
  { id: "08", title: "A próxima ideia", area: "Contato", description: "Na abertura azul do contato, acima do convite para conversar.", target: ".contact-section .section-top", after: ":scope > span:first-child", size: "96 / 64 px" },
  { id: "09", title: "Conexões e descobertas", area: "Contato", description: "Ao lado das redes sociais, distante do título e do e-mail.", target: ".contact-socials", after: ":scope > a:last-child", size: "88 / 72 px" },
  { id: "10", title: "Pequena assinatura", area: "Rodapé", description: "Um detalhe junto à marca guiler., no final da página.", target: ".site-footer", after: ":scope > .wordmark", size: "56 / 44 px" },
] as const;

function previewUrl(id: string) { return `/__preview/maca/${id}`; }

function focusApple() {
  document.getElementById("apple-placement")?.scrollIntoView({ behavior: "instant", block: "center" });
}

function ApplePreview() {
  const id = location.pathname.split("/").filter(Boolean)[2];
  const option = options.find(item => item.id === id);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [replay, setReplay] = useState(0);
  const [ready, setReady] = useState(false);
  const toolbar = useRef<HTMLElement>(null);

  function toggleToolbar(next: boolean) {
    setCollapsed(next);
    requestAnimationFrame(() => toolbar.current?.querySelector<HTMLButtonElement>(
      next ? "button" : '[aria-label="Recolher comparação"]',
    )?.focus());
  }

  useEffect(() => {
    document.body.dataset.applePreview = option?.id ?? "index";
    const previousTitle = document.title;
    document.title = option ? `${option.id} · ${option.title} | Guiler — prévia local` : "Maçã · 10 composições | Guiler";
    if (!option) return () => { delete document.body.dataset.applePreview; document.title = previousTitle; };

    let cancelled = false;
    let frame = 0;
    let host: HTMLDivElement | undefined;
    const attach = () => {
      const target = document.querySelector(option.target);
      if (!target) { frame = requestAnimationFrame(attach); return; }
      host = document.createElement("div");
      host.className = `apple-preview-slot apple-preview-slot--${option.id}`;
      host.id = "apple-placement";
      host.setAttribute("aria-hidden", "true");
      const anchor = option.after ? target.querySelector(option.after) : null;
      if (anchor) anchor.after(host); else target.prepend(host);
      setSlot(host);
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        frame = requestAnimationFrame(() => {
          if (cancelled) return;
          focusApple();
          setReady(true);
        });
      });
    };
    attach();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      host?.remove();
      delete document.body.dataset.applePreview;
      document.title = previousTitle;
    };
  }, [option]);

  if (!option) return (
    <main className="apple-gallery">
      <a href="/" className="wordmark">guiler.</a>
      <p className="apple-gallery-kicker">ESTUDO LOCAL / NEWTON</p>
      <h1>Uma maçã.<br /><span>Dez possibilidades.</span></h1>
      <p className="apple-gallery-lead">Abra cada composição no portfólio completo. Os links levam direto ao desenho; você pode continuar rolando para avaliar o conjunto.</p>
      <div className="apple-gallery-grid">
        {options.map(item => <a className="apple-gallery-card" href={previewUrl(item.id)} key={item.id}>
          <span className="apple-gallery-number">{item.id} <span>↗</span></span>
          <p className="apple-gallery-area">{item.area}</p>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <small>Desktop / celular · {item.size}</small>
        </a>)}
      </div>
      <p className="apple-gallery-note">Prévia para escolha. Nenhuma das opções foi publicada.</p>
    </main>
  );

  const index = options.indexOf(option);
  return <>
    {slot && createPortal(<CuriositySketch subject="newton" key={replay} />, slot)}
    <aside ref={toolbar} className={`apple-preview-toolbar ${collapsed ? "is-collapsed" : ""}`} aria-label="Comparar posições da maçã" data-ready={ready}>
      {collapsed ? <button onClick={() => toggleToolbar(false)} aria-expanded={false}>Opção {option.id} · Comparar ↗</button> : <>
        <div className="apple-preview-info"><span>PRÉVIA LOCAL · {option.id}/10</span><strong>{option.title}</strong></div>
        <label className="apple-preview-select">Posição
          <select value={option.id} onChange={event => location.assign(previewUrl(event.target.value))}>
            {options.map(item => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}
          </select>
        </label>
        <nav aria-label="Alternar opções">
          <a href={previewUrl(options[(index + 9) % 10].id)} aria-label="Opção anterior">←</a>
          <a href={previewUrl(options[(index + 1) % 10].id)} aria-label="Próxima opção">→</a>
          <button onClick={() => { focusApple(); setReplay(value => value + 1); }}>Ver maçã</button>
          <a href="/__preview/maca">As 10</a>
          <button onClick={() => toggleToolbar(true)} aria-label="Recolher comparação" aria-expanded={true}>×</button>
        </nav>
      </>}
    </aside>
  </>;
}

export function mountApplePreview() {
  const container = document.createElement("div");
  container.id = "apple-preview-root";
  document.body.append(container);
  const root = createRoot(container);
  root.render(<ApplePreview />);
  if (import.meta.hot) import.meta.hot.dispose(() => { root.unmount(); container.remove(); });
}
