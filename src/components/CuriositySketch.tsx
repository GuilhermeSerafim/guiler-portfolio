import { useEffect, useRef, useState } from "react";
import "./CuriositySketch.css";

type Subject = "cosmos" | "quadra" | "newton" | "tesla" | "davinci" | "einstein";

function SketchDrawing({ subject }: { subject: Subject }) {
  return (
    <svg className={`sketch-drawing sketch-drawing--${subject}`} viewBox="0 0 180 144" fill="none" aria-hidden="true" focusable="false">
      {subject === "cosmos" && <>
        <path className="sketch-guide" d="M20 72H160M90 17V127" />
        <ellipse className="sketch-faint" cx="90" cy="72" rx="65" ry="36" transform="rotate(-25 90 72)" />
        <ellipse cx="90" cy="72" rx="47" ry="25" transform="rotate(28 90 72)" />
        <circle className="sketch-center" cx="90" cy="72" r="7" />
        <circle className="sketch-faint" cx="90" cy="72" r="13" />
        <g className="sketch-orbiter">
          <circle className="sketch-planet" cx="144" cy="42" r="5" />
        </g>
        <path className="sketch-faint" d="M28 115h18m-9-9v18M149 104h8m-4-4v8" />
      </>}
      {subject === "quadra" && <>
        <path className="sketch-faint" d="M25 129V24h130v105H25Z" />
        <path d="M60 24v63h60V24M60 87a30 30 0 0 0 60 0" />
        <path className="sketch-faint" d="M34 24v18a56 56 0 0 0 112 0V24M73 129a17 17 0 0 1 34 0" />
        <path d="M79 32h22M83 42l3 14h8l3-14" />
        <ellipse cx="90" cy="41" rx="8" ry="2.5" />
        <path className="sketch-guide" d="M137 114Q147 12 93 40" />
        <g className="sketch-ball">
          <circle className="sketch-planet" cx="93" cy="40" r="6" />
          <path d="M87 40h12M93 34q-5 6 0 12" />
        </g>
      </>}
      {subject === "newton" && <>
        <path className="sketch-guide" d="M91 14v29M39 121h101" />
        <path className="sketch-faint" d="M135 58v44m-4-44h8m-8 44h8" />
        <g className="sketch-apple">
          <path className="sketch-apple-body" d="M91 70C106 54 127 70 119 90C114 106 107 112 99 108C93 104 91 104 84 108C76 112 66 99 64 86C59 68 77 56 91 70Z" />
          <path d="M91 69q-5-13 2-23M93 57q15-14 23-8q-8 15-23 8" />
          <path className="sketch-faint" d="M75 78q-4 9 4 17" />
        </g>
        <path d="M78 121h26" />
      </>}
      {subject === "tesla" && <>
        <path className="sketch-guide" d="M90 18v17M90 128v7M35 127h110" />
        <g className="sketch-electric-field sketch-faint">
          <path d="M60 62q-12 21 0 41M120 62q12 21 0 41M48 55q-20 30 0 55M132 55q20 30 0 55" />
        </g>
        <path d="M82 56v54M98 56v54M82 63l16-5M82 70l16-5M82 77l16-5M82 84l16-5M82 91l16-5M82 98l16-5M82 105l16-5" />
        <ellipse cx="90" cy="49" rx="25" ry="8" />
        <ellipse className="sketch-faint" cx="90" cy="47" rx="18" ry="3" />
        <ellipse cx="90" cy="110" rx="22" ry="6" />
        <path d="M68 110v6q22 12 44 0v-6M61 122h58v6H61z" />
        <path className="sketch-discharge" pathLength="100" d="M107 43l10-12 10 3 8-17 14 5M73 44L60 33l-7 5-11-15-12 3" />
        <path className="sketch-discharge sketch-faint" pathLength="100" d="M126 33l12 7 12-6M53 38l-12 9-11-4" />
      </>}
      {subject === "davinci" && <>
        <path className="sketch-guide" d="M90 13v118M15 80h150M24 102q66 20 132 0" />
        <g className="sketch-wing sketch-wing--left">
          <path d="M88 71C65 46 42 29 14 28L25 63l25 9 23 12 15-4Z" />
          <path className="sketch-faint" d="M88 75L14 28M88 75L25 63M88 75L38 36M88 75L50 72M88 75L63 51" />
        </g>
        <g className="sketch-wing sketch-wing--right">
          <path d="M92 71c23-25 46-42 74-43l-11 35-25 9-23 12-15-4Z" />
          <path className="sketch-faint" d="M92 75l74-47M92 75l63-12M92 75l50-39M92 75l38-3M92 75l25-24" />
        </g>
        <path d="M90 48l-6 18v30l6 15 6-15V66ZM90 96l-18 21 18-6 18 6Z" />
        <circle className="sketch-planet" cx="90" cy="75" r="4" />
        <path className="sketch-faint" d="M26 15h30m-30-3v6m30-6v6M125 117h24m-12-4v8" />
      </>}
      {subject === "einstein" && <>
        <g className="sketch-spacetime sketch-faint">
          <path d="M22 32h136M22 52q74 4 136 0M22 72q74 30 136 0M22 92q74 36 136 0M22 112q74 15 136 0" />
          <path d="M34 22v101M62 22q-7 68 0 106M90 22q-26 65 0 108M118 22q17 67 0 106M146 22v101" />
        </g>
        <circle className="sketch-planet" cx="96" cy="85" r="12" />
        <path className="sketch-faint" d="M89 78q10-5 14 5M87 87q8 9 16 2" />
        <path className="sketch-guide" d="M18 34h40" />
        <path className="sketch-light-ray" pathLength="100" d="M18 34C64 34 83 44 109 67S130 102 160 111" />
        <circle className="sketch-photon sketch-center" r="3" />
        <path className="sketch-faint" d="M153 107l7 4-8 3" />
      </>}
    </svg>
  );
}

export function CuriositySketch({ subject }: { subject: Subject }) {
  const element = useRef<HTMLDivElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const node = element.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || typeof IntersectionObserver === "undefined") return;

    // The drawing is complete by default. Motion is a single, optional accent.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setPlayed(true);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      className={`curiosity-sketch curiosity-sketch--${subject}`}
      data-play={played}
      aria-hidden="true"
    >
      <SketchDrawing subject={subject} />
    </div>
  );
}
