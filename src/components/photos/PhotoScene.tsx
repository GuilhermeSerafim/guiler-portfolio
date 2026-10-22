import type { RefObject } from "react";
import { Plus } from "lucide-react";
import "./PhotoScene.css";

export function PhotoScene({ variant, sceneRef, withShutters = false }: { variant: string; sceneRef: RefObject<HTMLDivElement>; withShutters?: boolean }) {
  return <div className={`photo-scene photo-scene--${variant}`} ref={sceneRef}>
    <figure className="photo-study-card photo-study-card--main">
      <button className="photo-study-hit" type="button" aria-label="Animar foto de Guilherme trabalhando em um evento de desenvolvimento">
        <span className="photo-study-viewport">
          <img className="photo-study-image" src="/images/building.webp" width="1100" height="733" loading="lazy" alt="Guilherme trabalhando no computador durante um evento de desenvolvimento" />
          {withShutters && <><span className="photo-study-shutter photo-study-shutter--left" aria-hidden="true" /><span className="photo-study-shutter photo-study-shutter--right" aria-hidden="true" /></>}
        </span>
      </button>
      <figcaption className="photo-study-caption"><span>APRENDER. CONSTRUIR. COMPARTILHAR.</span><Plus size={12} aria-hidden="true" /></figcaption>
    </figure>
    <figure className="photo-study-card photo-study-card--secondary">
      <button className="photo-study-hit" type="button" aria-label="Animar foto de Guilherme com participantes no Devs de Impacto">
        <span className="photo-study-viewport">
          <img className="photo-study-image" src="/images/community.webp" width="1200" height="800" loading="lazy" alt="Guilherme com participantes no palco do evento Devs de Impacto" />
          {withShutters && <><span className="photo-study-shutter photo-study-shutter--left" aria-hidden="true" /><span className="photo-study-shutter photo-study-shutter--right" aria-hidden="true" /></>}
        </span>
      </button>
      <figcaption className="photo-study-caption">Boas ideias crescem em comunidade.</figcaption>
    </figure>
  </div>;
}
