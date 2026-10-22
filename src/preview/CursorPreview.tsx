import App from "../App";
import { PortfolioCursor } from "./PortfolioCursor";
import "./CursorPreview.css";

const options = [
  { id: "a", label: "A · Órbita", description: "Um aro leve acompanha o mouse. Nas capas dos projetos, ele revela um sinal de mais." },
  { id: "b", label: "B · Contextual", description: "O cursor fica como está. Uma etiqueta aparece apenas nos elementos que abrem os projetos." },
  { id: "c", label: "C · Mira", description: "Quatro cantos discretos acompanham o mouse e se expandem sobre os controles." },
] as const;

export default function CursorPreview() {
  const variant = window.location.pathname.match(/\/cursor\/([abc])/)?.[1] as "a" | "b" | "c";
  const option = options.find(item => item.id === variant) ?? options[0];

  return (
    <>
      <aside className="cursor-preview-bar" aria-label="Comparação local de cursores">
        <div className="cursor-preview-heading">
          <span>ESTUDO LOCAL · CURSOR</span>
          <nav aria-label="Versões do cursor">
            <a href="/">Atual</a>
            {options.map(item => <a key={item.id} href={`/__preview/cursor/${item.id}`} aria-current={item.id === option.id ? "page" : undefined}>{item.label}</a>)}
          </nav>
        </div>
        <p>{option.description} <a href="#projetos">Testar nos projetos ↗</a></p>
        <span className="cursor-preview-device-note">Use o mouse para comparar. No toque ou com movimento reduzido, o efeito fica desativado.</span>
      </aside>
      <App />
      <PortfolioCursor variant={option.id} />
    </>
  );
}
