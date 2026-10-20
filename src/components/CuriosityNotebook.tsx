import { useId, useRef, useState, type KeyboardEvent } from "react";
import "./CuriosityNotebook.css";

const entries = [
  {
    id: "cosmos",
    label: "Cosmos",
    title: "Olhar um pouco além.",
    text: "Astronomia me faz querer entender o que existe além do que a gente vê.",
  },
  {
    id: "quadra",
    label: "Quadra",
    title: "Ler o movimento.",
    text: "Basquete, movimento e as possibilidades de uma boa jogada.",
  },
  {
    id: "ideias",
    label: "Ideias",
    title: "Questionar o óbvio.",
    text: "Da Vinci, Einstein e Newton: gosto de quem olha para o óbvio e faz outra pergunta.",
  },
] as const;
type Subject = (typeof entries)[number]["id"];

function NotebookDrawing({ subject }: { subject: Subject }) {
  return (
    <svg className={`notebook-drawing notebook-drawing--${subject}`} viewBox="0 0 180 144" fill="none" aria-hidden="true" focusable="false">
      {subject === "cosmos" && <>
        <path className="notebook-guide" d="M20 72H160M90 17V127" />
        <ellipse className="notebook-faint" cx="90" cy="72" rx="65" ry="36" transform="rotate(-25 90 72)" />
        <ellipse cx="90" cy="72" rx="47" ry="25" transform="rotate(28 90 72)" />
        <circle className="notebook-center" cx="90" cy="72" r="7" />
        <circle className="notebook-faint" cx="90" cy="72" r="13" />
        <g className="notebook-orbiter">
          <circle className="notebook-planet" cx="144" cy="42" r="5" />
        </g>
        <path className="notebook-faint" d="M28 115h18m-9-9v18M149 104h8m-4-4v8" />
      </>}
      {subject === "quadra" && <>
        <path className="notebook-faint" d="M25 129V24h130v105H25Z" />
        <path d="M60 24v63h60V24M60 87a30 30 0 0 0 60 0" />
        <path className="notebook-faint" d="M34 24v18a56 56 0 0 0 112 0V24M73 129a17 17 0 0 1 34 0" />
        <path d="M79 32h22M83 42l3 14h8l3-14" />
        <ellipse cx="90" cy="41" rx="8" ry="2.5" />
        <path className="notebook-guide" d="M137 114Q147 12 93 40" />
        <g className="notebook-ball">
          <circle className="notebook-planet" cx="93" cy="40" r="6" />
          <path d="M87 40h12M93 34q-5 6 0 12" />
        </g>
      </>}
      {subject === "ideias" && <>
        <path className="notebook-guide" d="M91 14v29M39 121h101" />
        <path className="notebook-faint" d="M135 58v44m-4-44h8m-8 44h8" />
        <g className="notebook-apple">
          <path className="notebook-apple-body" d="M91 70C106 54 127 70 119 90C114 106 107 112 99 108C93 104 91 104 84 108C76 112 66 99 64 86C59 68 77 56 91 70Z" />
          <path d="M91 69q-5-13 2-23M93 57q15-14 23-8q-8 15-23 8" />
          <path className="notebook-faint" d="M75 78q-4 9 4 17" />
        </g>
        <path d="M78 121h26" />
      </>}
    </svg>
  );
}

export function CuriosityNotebook() {
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const [selected, setSelected] = useState(0);
  const [gesture, setGesture] = useState(0);
  const entry = entries[selected];
  const tabId = (index: number) => `${id}-tab-${index}`;
  const panelId = `${id}-panel`;

  function select(index: number) {
    setSelected(index);
    setGesture(value => value + 1);
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % entries.length; break;
      case "ArrowLeft": next = (index + entries.length - 1) % entries.length; break;
      case "Home": next = 0; break;
      case "End": next = entries.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(next);
    buttons.current[next]?.focus();
  }

  return (
    <section className="curiosity-notebook" aria-label="Interesses além do código">
      <div className="notebook-topline">
        <span className="eyebrow">CADERNO DE CURIOSIDADES</span>
        <span className="notebook-page" aria-hidden="true">0{selected + 1} / 03</span>
      </div>
      <div className="notebook-tabs" role="tablist" aria-label="Explorar interesses">
        {entries.map((item, index) => (
          <button
            key={item.id}
            ref={node => { buttons.current[index] = node; }}
            id={tabId(index)}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls={panelId}
            tabIndex={selected === index ? 0 : -1}
            onKeyDown={event => navigate(event, index)}
            onClick={() => select(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id={panelId} role="tabpanel" tabIndex={0} aria-labelledby={tabId(selected)} className="notebook-panel">
        <div key={`${entry.id}-${gesture}`} className="notebook-sheet" data-play={gesture > 0}>
          <NotebookDrawing subject={entry.id} />
          <div className="notebook-note">
            <h3>{entry.title}</h3>
            <p>{entry.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
