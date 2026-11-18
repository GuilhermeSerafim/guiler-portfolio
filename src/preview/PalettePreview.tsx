import { useLayoutEffect, useState } from "react";
import App from "../App";
import { OrbitCursor } from "../components/OrbitCursor";
import "./PalettePreview.css";

const variants = [
  { id: "original", label: "A · Atual", colors: ["#2546EF", "#F7F6F2", "#C5DA9C"] },
  { id: "blue", label: "B · Só azul", colors: ["#0131CD", "#F7F6F2", "#C5DA9C"] },
  { id: "lime", label: "C · Azul + lima", colors: ["#0131CD", "#F7F6F2", "#B9FC01"] },
] as const;

export default function PalettePreview() {
  const [variant, setVariant] = useState("lime");
  useLayoutEffect(() => {
    document.documentElement.dataset.palettePreview = variant;
    return () => { delete document.documentElement.dataset.palettePreview; };
  }, [variant]);
  return <>
    <App />
    <OrbitCursor />
    <aside className="palette-comparison" aria-label="Comparativo local de paletas">
      <span className="palette-comparison-title">ESTUDO DE COR</span>
      <div className="palette-comparison-options">
        {variants.map(option => <button key={option.id} type="button"
          aria-pressed={variant === option.id} onClick={() => setVariant(option.id)}>
          <span className="palette-swatches" aria-hidden="true">{option.colors.map(color =>
            <i key={color} style={{ backgroundColor: color }} />)}</span>
          {option.label}
        </button>)}
      </div>
      <p>Mesma página, mesma posição. Alterne para comparar.</p>
    </aside>
  </>;
}
