import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

// TiltedPortrait and Magnetic adapt React Bits by David Haz.
// Source URLs and the full MIT + Commons Clause notice are in THIRD-PARTY-NOTICES.txt.
const spring = { damping: 30, stiffness: 120 };
const clamp = (value: number) => Math.max(-1, Math.min(1, value));

function usePointerMotion() {
  const reducedMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return finePointer && !reducedMotion;
}

type TiltedPortraitProps = { src: string; alt: string; children?: ReactNode };

export function TiltedPortrait({ src, alt, children }: TiltedPortraitProps) {
  const enabled = usePointerMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const scale = useSpring(1, spring);

  useEffect(() => {
    if (!enabled) {
      rotateX.jump(0);
      rotateY.jump(0);
      scale.jump(1);
    }
  }, [enabled, rotateX, rotateY, scale]);

  function move(event: PointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    rotateX.set(
      -clamp((event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) *
        4,
    );
    rotateY.set(
      clamp((event.clientX - rect.left - rect.width / 2) / (rect.width / 2)) *
        4,
    );
    scale.set(1.015);
  }

  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  return (
    <figure
      className="tilted-portrait"
      style={{ perspective: 900 }}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        className="portrait-surface"
        style={{ rotateX, rotateY, scale }}
      >
        <img
          className="portrait-image"
          src={src}
          alt={alt}
          width={840}
          height={1100}
          loading="eager"
          {...{ fetchpriority: "high" }}
          draggable={false}
        />
        {children}
      </motion.div>
    </figure>
  );
}

type ChildrenProps = { children: ReactNode; className?: string };

export function Magnetic({ children, className }: ChildrenProps) {
  const enabled = usePointerMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (!enabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [enabled, x, y]);

  function move(event: PointerEvent<HTMLSpanElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(offsetX, offsetY);
    const strength = distance ? Math.min(0.12, 5 / distance) : 0;
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <span
      className={className ? `magnetic ${className}` : "magnetic"}
      style={{ display: "inline-flex" }}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onFocusCapture={reset}
    >
      <motion.span style={{ display: "inline-flex", x, y }}>
        {children}
      </motion.span>
    </span>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: ChildrenProps & { delay?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.6,
        delay: reducedMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
