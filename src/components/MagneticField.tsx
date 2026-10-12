import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  opacity: number;
  register: boolean;
  ink: boolean;
};

const FRAME_INTERVAL = 1000 / 30;
const smoothstep = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** A quiet dot lattice: only the area near the pointer leaves its register. */
export function MagneticField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let motionReduced = reducedMotion.matches;
    let pointerFine = finePointer.matches;
    const copy = host.querySelector<HTMLElement>(".hero-copy");
    let width = 0;
    let height = 0;
    let radius = 150;
    let visible = false;
    let frame = 0;
    let lastPaint = 0;
    let disposed = false;
    let dots: Dot[] = [];
    const pointer = { x: 0, y: 0, active: false };

    const canAnimate = () =>
      !motionReduced && pointerFine && visible && !document.hidden;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const displacement = Math.min(1, Math.hypot(dot.dx, dot.dy) / 22);
        context.fillStyle = dot.ink && displacement < 0.1 ? "#222320" : "#2546ef";
        context.globalAlpha = Math.min(0.85, dot.opacity * (1 + displacement * 0.6));
        context.beginPath();
        context.arc(
          dot.x + dot.dx,
          dot.y + dot.dy,
          (dot.register ? 1.45 : 0.95) + displacement * 0.28,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastPaint = 0;
    };

    const tick = (timestamp: number) => {
      frame = 0;
      if (!canAnimate()) return;
      const elapsed = timestamp - lastPaint;
      if (lastPaint && elapsed < FRAME_INTERVAL) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      // Two short physics steps keep the return stable, including after a slow frame.
      const step = Math.min(lastPaint ? elapsed / 1000 : 1 / 30, 0.05) / 2;
      lastPaint = timestamp;
      let unsettled = false;
      for (const dot of dots) {
        const px = dot.x - pointer.x;
        const py = dot.y - pointer.y;
        const distance = Math.hypot(px, py);
        const falloff = pointer.active ? smoothstep(1 - distance / radius) : 0;
        const force = falloff * 38;
        // A deterministic direction also gives the dot directly under the cursor a home.
        const targetX = distance > 0.01 ? (px / distance) * force : force;
        const targetY = distance > 0.01 ? (py / distance) * force : 0;
        for (let substep = 0; substep < 2; substep += 1) {
          dot.vx += ((targetX - dot.dx) * 105 - dot.vx * 18) * step;
          dot.vy += ((targetY - dot.dy) * 105 - dot.vy * 18) * step;
          dot.dx += dot.vx * step;
          dot.dy += dot.vy * step;
        }
        if (
          Math.abs(targetX - dot.dx) + Math.abs(targetY - dot.dy) > 0.025 ||
          Math.abs(dot.vx) + Math.abs(dot.vy) > 0.025
        ) {
          unsettled = true;
        } else {
          dot.dx = targetX;
          dot.dy = targetY;
          dot.vx = 0;
          dot.vy = 0;
        }
      }
      draw();
      // No perpetual loop: a settled lattice waits for the next pointer movement.
      if (unsettled) frame = window.requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame && canAnimate()) frame = window.requestAnimationFrame(tick);
    };

    const resetDots = () => {
      pointer.active = false;
      for (const dot of dots) dot.dx = dot.dy = dot.vx = dot.vy = 0;
    };

    const sync = () => {
      motionReduced = reducedMotion.matches;
      pointerFine = finePointer.matches;
      stop();
      resetDots();
      canvas.dataset.motion = motionReduced
        ? "reduced"
        : !visible || document.hidden
          ? "suspended"
          : "running";
      if (!document.hidden) draw();
    };

    const resize = () => {
      if (disposed) return;
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      radius = Math.min(170, Math.max(115, width * 0.14));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const spacing = width < 700 ? 20 : 22;
      const columns = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      const originX = (width - columns * spacing) / 2;
      const originY = (height - rows * spacing) / 2;
      // Protect the actual content, leaving the editorial whitespace full of dots.
      // offset* ignores entrance transforms; the mask stays put as text reveals.
      const quietAreas = Array.from(
        host.querySelectorAll<HTMLElement>(
          ".hero-eyebrow, #hero-title, .hero-intro, .hero-actions, .hero-proof, .portrait-topline, .portrait-bottomline, .hero-bottom",
        ),
      ).filter((element) => element.offsetHeight > 0).map((element) => {
        let left = 0;
        let top = 0;
        let ancestor: HTMLElement | null = element;
        while (ancestor && ancestor !== host) {
          left += ancestor.offsetLeft;
          top += ancestor.offsetTop;
          ancestor = ancestor.offsetParent as HTMLElement | null;
        }
        const range = document.createRange();
        range.selectNodeContents(element);
        const contentBounds = range.getBoundingClientRect();
        const elementBounds = element.getBoundingClientRect();
        left += contentBounds.left - elementBounds.left;
        top += contentBounds.top - elementBounds.top;
        return {
          left,
          top,
          right: left + contentBounds.width,
          bottom: top + contentBounds.height,
        };
      });
      dots = [];
      for (let row = 0; row <= rows; row += 1) {
        for (let column = 0; column <= columns; column += 1) {
          const x = originX + column * spacing;
          const y = originY + row * spacing;
          const edge = smoothstep(Math.min(x, width - x, y, height - y) / 46);
          const copyDistance = Math.min(
            ...quietAreas.map((area) => Math.hypot(
              Math.max(area.left - x, 0, x - area.right),
              Math.max(area.top - y, 0, y - area.bottom),
            )),
          );
          const copyFade = 0.085 + 0.915 * smoothstep(copyDistance / 46);
          const register = row % 6 === 0 && column % 6 === 0;
          const ink = (column + row) % 4 === 0 && !register;
          const opacity = (register ? 0.6 : ink ? 0.24 : 0.43) * edge * copyFade;
          dots.push({ x, y, dx: 0, dy: 0, vx: 0, vy: 0, opacity, register, ink });
        }
      }
      sync();
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !canAnimate()) return;
      const bounds = host.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      wake();
    };
    const leave = () => {
      pointer.active = false;
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    resizeObserver.observe(host);
    if (copy) resizeObserver.observe(copy);
    intersectionObserver.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    resize();
    void document.fonts.ready.then(() => {
      if (!disposed) resize();
    });

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={canvasRef} className="magnetic-field" aria-hidden="true" />;
}
