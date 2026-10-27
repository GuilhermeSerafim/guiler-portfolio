import type { RefObject } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "../../i18n";
import "./PhotoScene.css";

export function PhotoScene({ variant, sceneRef, withShutters = false }: { variant: string; sceneRef: RefObject<HTMLDivElement>; withShutters?: boolean }) {
  const { t } = useTranslation();
  return <div className={`photo-scene photo-scene--${variant}`} ref={sceneRef}>
    <figure className="photo-study-card photo-study-card--main">
      <button className="photo-study-hit" type="button" aria-label={t("Animar foto de Guilherme trabalhando em um evento de desenvolvimento", "Animate photo of Guilherme working at a developer event")}>
        <span className="photo-study-viewport">
          <img className="photo-study-image" src="/images/building.webp" width="1100" height="733" loading="lazy" alt={t("Guilherme trabalhando no computador durante um evento de desenvolvimento", "Guilherme working on his computer during a developer event")} />
          {withShutters && <><span className="photo-study-shutter photo-study-shutter--left" aria-hidden="true" /><span className="photo-study-shutter photo-study-shutter--right" aria-hidden="true" /></>}
        </span>
      </button>
      <figcaption className="photo-study-caption"><span>{t("APRENDER. CONSTRUIR. COMPARTILHAR.", "LEARN. BUILD. SHARE.")}</span><Plus size={12} aria-hidden="true" /></figcaption>
    </figure>
    <figure className="photo-study-card photo-study-card--secondary">
      <button className="photo-study-hit" type="button" aria-label={t("Animar foto de Guilherme com participantes no Devs de Impacto", "Animate photo of Guilherme with participants at Devs de Impacto")}>
        <span className="photo-study-viewport">
          <img className="photo-study-image" src="/images/community.webp" width="1200" height="800" loading="lazy" alt={t("Guilherme com participantes no palco do evento Devs de Impacto", "Guilherme with participants on stage at the Devs de Impacto event")} />
          {withShutters && <><span className="photo-study-shutter photo-study-shutter--left" aria-hidden="true" /><span className="photo-study-shutter photo-study-shutter--right" aria-hidden="true" /></>}
        </span>
      </button>
      <figcaption className="photo-study-caption">{t("Boas ideias crescem em comunidade.", "Great ideas grow in community.")}</figcaption>
    </figure>
  </div>;
}
