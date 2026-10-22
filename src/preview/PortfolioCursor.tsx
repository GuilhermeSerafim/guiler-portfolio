import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./PortfolioCursor.css";

type CursorVariant = "a" | "b" | "c";
type CursorTarget = "default" | "interactive" | "project" | "project-cover";

const projectSelector = ".project-cover, .project-image-button, .project-title-row h3 button, .project-details";
const controlSelector = "a[href], button, [role='button'], [role='link'], input, select, summary";
const dialogSelector = "dialog[open], [role='dialog'][aria-modal='true']:not([hidden]):not([aria-hidden='true'])";
const creamSelector = [
  ".experience-section", ".contact-section", ".button-blue",
  ".builder-seal", ".project-filters .active", ".project-code:hover",
  ".project-cover-action", ".pv-cover--mesa", ".pv-website-image",
  ".pv-cover--seven", ".cursor-preview-bar [aria-current='page']",
].join(", ");
const textInputTypes = new Set([
  "text", "search", "email", "url", "tel", "password", "number",
  "date", "datetime-local", "month", "time", "week",
]);

function isEditable(element: Element | null) {
  if (!element) return false;
  if (element.closest("textarea, select, [role='textbox']")) return true;
  const input = element.closest("input");
  if (input && textInputTypes.has(input.type)) return true;
  const editable = element.closest<HTMLElement>("[contenteditable]");
  return Boolean(editable?.isContentEditable);
}

function getTone(element: Element) {
  const explicitTone = element.closest<HTMLElement>("[data-cursor-tone]")?.dataset.cursorTone;
  if (explicitTone === "blue" || explicitTone === "cream") return explicitTone;
  if (element.closest(".contact-arrow:hover, .pv-seven-hub-face")) return "blue";
  return element.closest(creamSelector) ? "cream" : "blue";
}

/** Decorative local study: the browser's native cursor is always preserved. */
export function PortfolioCursor({ variant }: { variant: CursorVariant }) {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const follower = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const dotElement = dot.current;
    const followerElement = follower.current;
    if (!element || !dotElement || !followerElement) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let visible = false;
    let focused = document.hasFocus();
    let dialogOpen = Boolean(document.querySelector(dialogSelector));
    let hoveredElement: Element | null = null;
    let target: CursorTarget = "default";
    let editable = false;
    let frame = 0;
    let previousTime = 0;
    let x = 0;
    let y = 0;
    let followingX = 0;
    let followingY = 0;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    function hide(reason: string) {
      visible = false;
      hoveredElement = null;
      previousTime = 0;
      element!.dataset.visible = "false";
      element!.dataset.state = reason;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function updateTarget(hit: Element) {
      hoveredElement = hit;
      editable = isEditable(hit);
      const control = hit.closest(controlSelector);
      const disabled = Boolean(control?.matches(":disabled, [aria-disabled='true']"));
      const project = disabled ? null : hit.closest(projectSelector);
      target = project
        ? project.matches(".project-cover, .project-image-button") ? "project-cover" : "project"
        : control && !disabled ? "interactive" : "default";
      element!.dataset.target = target;
      element!.dataset.tone = getTone(hit);
    }

    function renderFrame(time: number) {
      frame = 0;
      if (!visible || !enabled) return;
      dotElement!.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (variant === "b") {
        // The pill has a fixed 126 × 32 px size, so placement needs no layout reads.
        const labelX = x + 18 + 126 > viewportWidth - 8 ? x - 18 - 126 : x + 18;
        const labelY = y + 18 + 32 > viewportHeight - 8 ? y - 18 - 32 : y + 18;
        followingX = Math.max(8, Math.min(labelX, viewportWidth - 134));
        followingY = Math.max(8, Math.min(labelY, viewportHeight - 40));
      } else {
        const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
        const progress = 1 - Math.exp(-elapsed / (variant === "a" ? 80 : 55));
        followingX += (x - followingX) * progress;
        followingY += (y - followingY) * progress;
      }

      followerElement!.style.transform = `translate3d(${followingX}px, ${followingY}px, 0)`;
      element!.dataset.visible = "true";
      previousTime = time;
      if (variant !== "b" && Math.hypot(x - followingX, y - followingY) > 0.1) {
        frame = window.requestAnimationFrame(renderFrame);
      }
    }

    function onMove(event: PointerEvent) {
      if (!enabled) return;
      if (event.pointerType !== "mouse") return hide("non-mouse");
      if (event.buttons !== 0) return hide("drag");
      if (!focused) return hide("blur");
      if (document.hidden) return hide("hidden");
      if (dialogOpen) return hide("dialog");
      const hit = event.target instanceof Element ? event.target : null;
      if (!hit) return hide("leave");
      if (hit !== hoveredElement) updateTarget(hit);
      if (editable || isEditable(document.activeElement)) return hide("editable");
      if (variant === "b" && target !== "project" && target !== "project-cover") {
        return hide("outside-project");
      }

      x = event.clientX;
      y = event.clientY;
      if (!visible) {
        followingX = x;
        followingY = y;
        previousTime = 0;
      }
      visible = true;
      element!.dataset.state = "tracking";
      if (!frame) frame = window.requestAnimationFrame(renderFrame);
    }

    function updateMedia() {
      enabled = finePointer.matches && !reducedMotion.matches;
      element!.dataset.enabled = String(enabled);
      hide(enabled ? "idle" : "disabled");
    }

    function onBlur() { focused = false; hide("blur"); }
    function onFocus() { focused = true; }
    function onLeave() { hide("leave"); }
    function onScroll() { hide("scroll"); }
    function onVisibility() { hide(document.hidden ? "hidden" : "idle"); }
    function onResize() {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      hide("resize");
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Tab") hide("keyboard");
    }
    function onDown(event: PointerEvent) {
      hide(event.pointerType === "mouse" ? "drag" : "non-mouse");
    }
    function onFocusIn(event: FocusEvent) {
      dialogOpen = Boolean(document.querySelector(dialogSelector));
      if (dialogOpen) hide("dialog");
      else if (isEditable(event.target instanceof Element ? event.target : null)) hide("editable");
    }

    // Native dialogs toggle their `open` attribute; project filters can remove a hovered card.
    // Neither observation watches animation styles or performs geometry reads.
    const observer = new MutationObserver(() => {
      dialogOpen = Boolean(document.querySelector(dialogSelector));
      if (dialogOpen) hide("dialog");
      else if (hoveredElement && !hoveredElement.isConnected) hide("target-removed");
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open", "aria-modal", "aria-hidden", "hidden"],
    });

    updateMedia();
    finePointer.addEventListener("change", updateMedia);
    reducedMotion.addEventListener("change", updateMedia);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointercancel", onLeave);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      hide("unmounted");
      observer.disconnect();
      finePointer.removeEventListener("change", updateMedia);
      reducedMotion.removeEventListener("change", updateMedia);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointercancel", onLeave);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [variant]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={root}
      className="portfolio-cursor"
      data-variant={variant}
      data-enabled="false"
      data-visible="false"
      data-target="default"
      data-tone="blue"
      data-state="idle"
      aria-hidden="true"
    >
      <span ref={dot} className="portfolio-cursor-dot"><span /></span>
      <span ref={follower} className="portfolio-cursor-follower">
        <span className="portfolio-cursor-ring" />
        <span className="portfolio-cursor-plus" />
        <span className="portfolio-cursor-reticle">
          <i /><i /><i /><i />
        </span>
        <span className="portfolio-cursor-label">Ver projeto <span>↗</span></span>
      </span>
    </div>,
    document.body,
  );
}
