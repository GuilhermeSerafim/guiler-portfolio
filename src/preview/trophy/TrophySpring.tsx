import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { Trophy } from "lucide-react";
import "./TrophySpring.css";

export function TrophySpring({ replayToken = 0 }: { replayToken?: number }) {
  const root = useRef<HTMLButtonElement>(null);
  const cup = useAnimationControls();
  const halo = useAnimationControls();
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const generation = useRef(0);
  const startedAt = useRef(-Infinity);
  const visible = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  const stop = useCallback(() => {
    generation.current++;
    cup.stop();
    halo.stop();
    cup.set({ rotate: 0, y: 0, scale: 1 });
    halo.set({ opacity: 0, scale: 1 });
  }, [cup, halo]);

  const play = useCallback(() => {
    if (reduced || document.hidden || !root.current || !visible.current) return;
    if (performance.now() - startedAt.current < 250) return;
    startedAt.current = performance.now();
    const current = ++generation.current;
    cup.stop();
    halo.stop();
    void halo.start({ opacity: [0, 0.45, 0], scale: [0.88, 1.1, 1.28], transition: { duration: 0.8, ease: "easeOut" } });
    void cup.start({ rotate: -13, y: -3, scale: 1.08, transition: { type: "spring", stiffness: 650, damping: 28, mass: 0.55, restDelta: 0.05, restSpeed: 0.5 } }).then(() => {
      if (current !== generation.current) return;
      return cup.start({ rotate: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 13, mass: 0.6, restDelta: 0.05, restSpeed: 0.5 } });
    });
  }, [reduced, cup, halo]);

  useEffect(() => {
    if (reduced) { stop(); return; }
    const node = root.current;
    if (!node) return;
    let entered = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (visible.current && !entered) { entered = true; play(); }
      else if (!visible.current) stop();
    }, { threshold: 0.5 });
    observer.observe(node);
    const onHidden = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
      generation.current++;
      visible.current = false;
      cup.stop();
      halo.stop();
    };
  }, [play, reduced, stop]);

  useEffect(() => { if (replayToken) play(); }, [replayToken, play]);

  return (
    <button
      ref={root}
      type="button"
      className="trophy-spring"
      aria-label="Animar troféu: Pulso"
      onPointerEnter={event => { if (event.pointerType === "mouse") play(); }}
      onFocus={event => { if (event.currentTarget.matches(":focus-visible")) play(); }}
      onClick={play}
    >
      <motion.svg className="trophy-spring-halo" viewBox="0 0 56 56" aria-hidden="true" animate={halo} initial={{ opacity: 0 }}>
        <circle cx="28" cy="28" r="23" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </motion.svg>
      <motion.div className="trophy-spring-cup" animate={cup}>
        <Trophy size={24} strokeWidth={1.5} aria-hidden="true" />
      </motion.div>
      <svg className="trophy-spring-dot" width="4" height="4" aria-hidden="true"><circle cx="2" cy="2" r="2" fill="currentColor" /></svg>
    </button>
  );
}
