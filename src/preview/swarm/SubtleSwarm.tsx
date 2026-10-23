import { useEffect, useRef, useState } from "react";
import SwarmCursor from "./vendor/SwarmCursor";
import "./SubtleSwarm.css";

type SubtleSwarmProps = {
  stage: HTMLElement;
  enabled: boolean;
  onActiveChange: (active: boolean) => void;
};

// Keep the adaptation explicit: the shared vendor remains the original effect.
const PARTICLES = {
  count: 72,
  size: 1.4,
  spread: 62,
  speed: .42,
  swirl: .12,
  tail: .18,
  trail: .12,
  wander: .06,
  depth: .14,
  color: "#8da7ff",
  accentColor: "#a7b9ff",
} as const;
const EXIT_MS = 180;
const FADE_START = .16;
const FADE_END = .24;
const INTERACTIVE = "a, button, input, select, textarea, [role='button'], [contenteditable='true'], [data-swarm-ignore]";
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smooth = (from: number, to: number, progress: number) => {
  const value = clamp((progress - from) / (to - from));
  return value * value * (3 - 2 * value);
};

/** Preview-only, sphere-clipped tuning of the unmodified Swarm Cursor. */
export default function SubtleSwarm({ stage, enabled, onActiveChange }: SubtleSwarmProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeCallback = useRef(onActiveChange);
  const [running, setRunning] = useState(false);
  activeCallback.current = onActiveChange;

  useEffect(() => {
    const overlay = overlayRef.current;
    const section = stage.closest<HTMLElement>(".globe-story");
    if (!overlay || !section) return;

    let active = false;
    let ticking = false;
    let frame = 0;
    let exitTimer = 0;
    let current = 0;
    let target = 0;
    let lastTime = 0;
    let width = 1;
    let height = 1;
    let pointerKnown = false;
    let clientX = 0;
    let clientY = 0;

    const reportActive = (next: boolean) => {
      if (active === next) return;
      active = next;
      overlay.dataset.active = String(next);
      activeCallback.current(next);
    };
    const stopParticles = () => {
      window.clearTimeout(exitTimer);
      exitTimer = 0;
      ticking = false;
      setRunning(false);
    };
    const setPresence = (presence: number, immediate = false) => {
      const next = presence > 0;
      overlay.style.setProperty("--subtle-pointer-opacity", String(presence));
      reportActive(next);
      if (next) {
        window.clearTimeout(exitTimer);
        exitTimer = 0;
        if (!ticking) {
          ticking = true;
          setRunning(true);
        }
      } else if (immediate) {
        stopParticles();
      } else if (ticking && !exitTimer) {
        // Allow the short opacity exit, then stop the vendor's animation loop.
        exitTimer = window.setTimeout(stopParticles, EXIT_MS);
      }
    };

    overlay.dataset.active = "false";
    overlay.style.setProperty("--subtle-phase-opacity", "0");
    overlay.style.setProperty("--subtle-pointer-opacity", "0");
    setRunning(false);

    if (!enabled) {
      activeCallback.current(false);
      return;
    }

    // These formulas mirror GlobeField's sphere before its .24 unfold point.
    // A full-stage container preserves the vendor's pointer coordinate system.
    const update = () => {
      const mobile = width <= 960;
      const travel = smooth(.04, .28, current);
      const centerX = width * mix(mobile ? .55 : .70, .50, travel);
      const centerY = height * (mobile ? .66 : .50);
      const radius = (mobile ? Math.min(width * .38, height * .26) : Math.min(width, height) * .29)
        * mix(1, 2.6, smooth(.04, .32, current));
      const phaseOpacity = 1 - smooth(FADE_START, FADE_END, current);

      overlay.style.setProperty("--subtle-center-x", `${centerX}px`);
      overlay.style.setProperty("--subtle-center-y", `${centerY}px`);
      overlay.style.setProperty("--subtle-radius", `${radius}px`);
      overlay.style.setProperty("--subtle-mask-inner", `${radius * .88}px`);
      overlay.style.setProperty("--subtle-phase-opacity", String(phaseOpacity * .58));
      overlay.dataset.progress = current.toFixed(3);

      if (!pointerKnown || phaseOpacity === 0 || document.hidden) {
        setPresence(0, phaseOpacity === 0 || document.hidden);
        return;
      }

      const bounds = stage.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;
      const distance = Math.hypot(x - centerX, y - centerY) / radius;
      const hit = document.elementFromPoint(clientX, clientY);
      const insideStage = x >= 0 && y >= 0 && x <= width && y <= height;
      const unobstructed = hit !== null && stage.contains(hit) && !hit.closest(INTERACTIVE);
      const presence = insideStage && unobstructed && distance < 1 ? 1 - smooth(.88, 1, distance) : 0;
      setPresence(presence);
    };

    // Match GlobeStory's .085s scroll easing without a permanent observer loop.
    const readProgress = () => clamp(-section.getBoundingClientRect().top / (height * 2.6));
    const tick = (time: number) => {
      frame = 0;
      if (document.hidden) return;
      const dt = Math.max(0, time - lastTime) / 1000;
      lastTime = time;
      current += (target - current) * (1 - Math.exp(-dt / .085));
      const settled = Math.abs(target - current) < .00025;
      if (settled) current = target;
      update();
      if (!settled) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (document.hidden) return;
      target = readProgress();
      if (!frame && Math.abs(target - current) > .00025) {
        lastTime = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!frame) {
        update();
      }
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      width = Math.max(1, stage.clientWidth);
      height = Math.max(1, stage.clientHeight);
      current = target = readProgress();
      update();
    };
    const onMove = (event: PointerEvent) => {
      pointerKnown = event.pointerType === "mouse";
      clientX = event.clientX;
      clientY = event.clientY;
      update();
    };
    const onLeave = () => {
      pointerKnown = false;
      setPresence(0);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        pointerKnown = false;
        setPresence(0, true);
      } else {
        resize();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      overlay.style.setProperty("--subtle-phase-opacity", "0");
      overlay.style.setProperty("--subtle-pointer-opacity", "0");
      activeCallback.current(false);
    };
  }, [stage, enabled]);

  return <div ref={overlayRef} className="subtle-swarm-preview" aria-hidden="true" data-active="false">
    {enabled && <SwarmCursor
      {...PARTICLES}
      className="subtle-swarm-preview__field"
      enabled={running}
      shape="dot"
      targets=""
      idle="hide"
      clickEffect="none"
      hideCursor={false}
      intro={false}
      dpr={1.5}
    />}
  </div>;
}
