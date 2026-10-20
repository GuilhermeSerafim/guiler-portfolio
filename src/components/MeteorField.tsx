import { useEffect, useRef, type CSSProperties } from "react";
import "./MeteorField.css";

// Original CSS composition. The reference study is documented in docs/research/personality.
const stars = [
  [3, 8], [17, 4], [36, 9], [51, 5], [65, 7], [83, 3], [96, 10],
  [5, 34], [55, 31], [63, 48], [97, 44], [2, 65], [44, 68],
  [54, 76], [6, 88], [23, 91], [39, 87], [69, 91], [91, 88],
];
const trails = [
  { left: "66%", top: "4%", delay: ".2s", duration: "1.7s" },
  { left: "44%", top: "61%", delay: "1.45s", duration: "1.6s" },
  { left: "92%", top: "15%", delay: "2.65s", duration: "1.65s" },
];

/** A finite opening gesture; never a recurring background loop. */
export function MeteorField() {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = field.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      element.dataset.active = String(visible && !document.hidden && !preference.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="meteor-field" ref={field} data-active="false" aria-hidden="true">
      {stars.map(([x, y], index) => (
        <span
          key={index}
          className={`meteor-star${index % 5 === 0 ? " meteor-star--cross" : ""}`}
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
      {trails.map((trail, index) => (
        <span
          key={index}
          className="meteor-travel"
          style={{
            left: trail.left,
            top: trail.top,
            "--meteor-delay": trail.delay,
            "--meteor-duration": trail.duration,
          } as CSSProperties}
        >
          <span className="meteor-tail" />
        </span>
      ))}
    </div>
  );
}
