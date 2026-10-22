import { useEffect, useRef } from "react";
import "./TechText.css";

// Adapted from React Bits Tech Text by David Haz (MIT + Commons Clause).
// Source and full license: THIRD-PARTY-NOTICES.txt.
type Glyph = { left: number; right: number; top: number; bottom: number; art: HTMLCanvasElement; amount: number };
const PAD = 12;
const ease = (value: number, target: number, dt: number) => value + (target - value) * (1 - Math.exp(-dt / 0.085));

/** Inline HTML remains the source of truth; the canvas is only a hover decoration. */
export function TechText({ children }: { children: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const baselineRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    const baseline = baselineRef.current;
    const canvas = canvasRef.current;
    if (!root || !label || !baseline || !canvas || !CSS.supports("mask-image", "linear-gradient(black, black)")) return;
    const ctx = (() => { try { return canvas.getContext("2d"); } catch { return null; } })();
    if (!ctx) return;

    const pointerQuery = matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let visible = false;
    let alive = true;
    let broken = false;
    let dirty = true;
    let pressed = false;
    let raf = 0;
    let last = 0;
    let target = -1;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let ink = "";
    let glyphs: Glyph[] = [];
    const frame = { left: 0, right: 0, top: 0, bottom: 0, amount: 0 };

    const reset = () => {
      const painted = root.dataset.active === "true" || frame.amount > 0;
      cancelAnimationFrame(raf);
      raf = 0;
      target = -1;
      frame.amount = 0;
      for (const glyph of glyphs) glyph.amount = 0;
      label.style.removeProperty("mask-image");
      label.style.removeProperty("-webkit-mask-image");
      root.dataset.active = "false";
      delete root.dataset.letter;
      if (painted) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const measure = () => {
      const textNode = label.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return false;
      const style = getComputedStyle(label);
      const rect = label.getBoundingClientRect();
      const base = baseline.getBoundingClientRect().top - rect.top;
      const tracking = parseFloat(style.letterSpacing) || 0;
      // Without Canvas tracking support, preserve the exact HTML typography instead.
      if (tracking && !("letterSpacing" in ctx)) return false;
      width = rect.width;
      height = rect.height;
      if (!width || !height) return false;
      dpr = Math.min(devicePixelRatio || 1, 2);
      ink = style.color;
      canvas.width = Math.ceil((width + PAD * 2) * dpr);
      canvas.height = Math.ceil((height + PAD * 2) * dpr);
      canvas.style.width = `${width + PAD * 2}px`;
      canvas.style.height = `${height + PAD * 2}px`;
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const setFont = (context: CanvasRenderingContext2D) => {
        context.font = font;
        context.textBaseline = "alphabetic";
        context.fontKerning = "normal";
        if ("letterSpacing" in context) context.letterSpacing = `${tracking}px`;
      };
      setFont(ctx);
      const range = document.createRange();
      let offset = 0;
      glyphs = Array.from(children, (char) => {
        range.setStart(textNode, offset);
        offset += char.length;
        range.setEnd(textNode, offset);
        const box = range.getBoundingClientRect();
        const left = Math.max(0, box.left - rect.left);
        const right = Math.min(width, box.right - rect.left);
        const metrics = ctx.measureText(char);
        const art = document.createElement("canvas");
        art.width = Math.max(1, Math.ceil((right - left) * dpr));
        art.height = canvas.height;
        const paint = art.getContext("2d");
        if (!paint) throw new Error("Canvas unavailable");
        paint.setTransform(dpr, 0, 0, dpr, -left * dpr, PAD * dpr);
        setFont(paint);
        paint.strokeStyle = ink;
        paint.lineWidth = 1.7;
        paint.lineJoin = "round";
        paint.setLineDash([3, 2.5]);
        // Draw the shaped word, then clip it into glyph sprites: kerning stays intact.
        paint.strokeText(children, 0, base);
        paint.setLineDash([]);
        paint.globalCompositeOperation = "destination-out";
        paint.fillText(children, 0, base);
        return { left, right, top: base - metrics.actualBoundingBoxAscent, bottom: base + metrics.actualBoundingBoxDescent, art, amount: 0 };
      });
      dirty = false;
      return true;
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || !enabled || !visible || document.hidden) { reset(); return; }
      try {
        const dt = Math.min(0.05, (now - last) / 1000 || 1 / 60);
        last = now;
        let moving = false;
        const stops = ["black 0px"];
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        glyphs.forEach((glyph, index) => {
          const goal = index === target ? 1 : 0;
          glyph.amount = ease(glyph.amount, goal, dt);
          if (Math.abs(glyph.amount - goal) < 0.002) glyph.amount = goal;
          else moving = true;
          if (!glyph.amount) return;
          const alpha = (1 - glyph.amount).toFixed(4);
          stops.push(`black ${glyph.left}px`, `rgba(0,0,0,${alpha}) ${glyph.left}px`, `rgba(0,0,0,${alpha}) ${glyph.right}px`, `black ${glyph.right}px`);
          ctx.globalAlpha = glyph.amount;
          ctx.drawImage(glyph.art, (glyph.left + PAD) * dpr, 0);
        });
        const focus = glyphs[target];
        if (focus) {
          const next = { left: focus.left - 4, right: focus.right + 4, top: focus.top - 5, bottom: focus.bottom + 5 };
          for (const key of ["left", "right", "top", "bottom"] as const) {
            frame[key] = frame.amount < 0.01 ? next[key] : ease(frame[key], next[key], dt);
            if (Math.abs(frame[key] - next[key]) > 0.1) moving = true;
          }
        }
        const frameGoal = focus ? 1 : 0;
        frame.amount = ease(frame.amount, frameGoal, dt);
        if (Math.abs(frame.amount - frameGoal) < 0.002) frame.amount = frameGoal;
        else moving = true;
        if (frame.amount) {
          ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
          ctx.globalAlpha = frame.amount * 0.65;
          ctx.strokeStyle = ink;
          ctx.fillStyle = ink;
          ctx.lineWidth = 0.7;
          ctx.setLineDash([2, 3]);
          ctx.strokeRect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
          ctx.setLineDash([]);
          ctx.globalAlpha = frame.amount * 0.9;
          for (const x of [frame.left, frame.right]) for (const y of [frame.top, frame.bottom]) ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
        ctx.globalAlpha = 1;
        stops.push("black 100%");
        const mask = `linear-gradient(to right, ${stops.join(",")})`;
        label.style.setProperty("mask-image", mask);
        label.style.setProperty("-webkit-mask-image", mask);
        root.dataset.active = "true";
        if (moving) raf = requestAnimationFrame(tick);
        else if (target < 0) reset();
      } catch {
        broken = true;
        enabled = false;
        root.dataset.enabled = "false";
        reset();
      }
    };

    const wake = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    const move = (event: PointerEvent) => {
      if (!enabled || !visible || document.hidden || event.pointerType !== "mouse" || event.buttons || pressed || !window.getSelection()?.isCollapsed) { reset(); return; }
      try {
        if (dirty && !measure()) { reset(); return; }
        const box = label.getBoundingClientRect();
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        const next = glyphs.findIndex((glyph) => x >= glyph.left && x < glyph.right && y >= glyph.top - 12 && y <= glyph.bottom + 12);
        if (next === target) return;
        target = next;
        if (target >= 0) root.dataset.letter = Array.from(children)[target];
        else delete root.dataset.letter;
        wake();
      } catch { broken = true; enabled = false; root.dataset.enabled = "false"; reset(); }
    };
    const leave = () => { target = -1; delete root.dataset.letter; if (enabled && visible) wake(); };
    const refresh = () => { dirty = true; reset(); };
    const policy = () => {
      enabled = pointerQuery.matches && !motionQuery.matches && !broken;
      root.dataset.enabled = String(enabled);
      refresh();
    };
    const down = () => { pressed = true; reset(); };
    const up = () => { pressed = false; };
    const cancelInteraction = () => { pressed = false; reset(); };
    const onVisibility = () => { if (document.hidden) reset(); };
    const resizeObserver = new ResizeObserver(refresh);
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) reset(); });
    resizeObserver.observe(label);
    intersectionObserver.observe(root);
    pointerQuery.addEventListener("change", policy);
    motionQuery.addEventListener("change", policy);
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave, { passive: true });
    root.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", cancelInteraction, { passive: true });
    window.addEventListener("blur", cancelInteraction);
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("beforeprint", reset);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("selectionchange", reset);
    document.fonts?.addEventListener("loadingdone", refresh);
    void document.fonts?.ready.then(() => { if (alive) refresh(); });
    policy();
    return () => {
      alive = false;
      reset();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      pointerQuery.removeEventListener("change", policy);
      motionQuery.removeEventListener("change", policy);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancelInteraction);
      window.removeEventListener("blur", cancelInteraction);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("beforeprint", reset);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("selectionchange", reset);
      document.fonts?.removeEventListener("loadingdone", refresh);
    };
  }, [children]);

  return <span ref={rootRef} className="tech-text" data-enabled="false" data-active="false">
    <span ref={labelRef} className="tech-text__label">{children}</span>
    <span ref={baselineRef} className="tech-text__baseline" aria-hidden="true" />
    <canvas ref={canvasRef} className="tech-text__canvas" aria-hidden="true" />
  </span>;
}
