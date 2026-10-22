import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./TrophyTrace.css";

type TrophyTraceProps = { replayToken?: number };

/** A finite, replayable drafting sequence. The SVG is complete without animation. */
export function TrophyTrace({ replayToken = 0 }: TrophyTraceProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const replayRef = useRef<() => void>(() => {});
  const previousReplayToken = useRef(replayToken);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: gsap.core.Timeline;
    let entered = false;
    let visible = false;

    const context = gsap.context(() => {
      timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

      timeline
        .fromTo(
          ".trophy-trace__registration",
          { opacity: 0 },
          { opacity: 0.58, duration: 0.18 },
          0,
        )
        .fromTo(
          ".trophy-trace__guides",
          { opacity: 0 },
          { opacity: 0.22, duration: 0.16 },
          0.04,
        )
        .fromTo(
          ".trophy-trace__rim",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.25, ease: "power1.inOut" },
          0.08,
        )
        .fromTo(
          ".trophy-trace__handle",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.42, stagger: 0.06, ease: "power1.inOut" },
          0.15,
        )
        .fromTo(
          ".trophy-trace__bowl",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.57, ease: "power1.inOut" },
          0.2,
        )
        .fromTo(
          ".trophy-trace__fill",
          { opacity: 0 },
          { opacity: 1, duration: 0.38 },
          0.48,
        )
        .fromTo(
          ".trophy-trace__stem",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.28, ease: "power1.inOut" },
          0.64,
        )
        .fromTo(
          ".trophy-trace__base",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.25, ease: "power1.inOut" },
          0.8,
        )
        .to(".trophy-trace__guides", { opacity: 0, duration: 0.22 }, 0.64)
        .fromTo(
          ".trophy-trace__glint",
          { opacity: 0, scale: 0.35, svgOrigin: "38 11" },
          { opacity: 1, scale: 1, duration: 0.2 },
          0.82,
        )
        .to(".trophy-trace__glint", { opacity: 0, scale: 0.7, duration: 0.24 }, 1.02)
        .to(".trophy-trace__registration", { opacity: 0.28, duration: 0.3 }, 0.95);

      // Prepare the reveal before paint; reduced motion keeps the completed drawing.
      timeline.progress(motionPreference.matches ? 1 : 0).pause();
    }, button);

    const complete = () => timeline.progress(1).pause();

    const replay = () => {
      if (document.hidden || !visible) return;
      if (motionPreference.matches) {
        complete();
        return;
      }
      // Reuse one timeline, even after repeated hover, focus, or tap events.
      timeline.restart();
    };
    replayRef.current = replay;

    const onMotionPreferenceChange = () => {
      if (motionPreference.matches) complete();
    };
    motionPreference.addEventListener("change", onMotionPreferenceChange);

    const enterOnce = () => {
      if (!entered && visible && !document.hidden) {
        entered = true;
        replay();
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) complete();
      else enterOnce();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (visible) enterOnce();
        else complete();
      },
      { threshold: 0.5 },
    );
    observer.observe(button);

    return () => {
      replayRef.current = () => {};
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionPreference.removeEventListener("change", onMotionPreferenceChange);
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (previousReplayToken.current !== replayToken) {
      previousReplayToken.current = replayToken;
      replayRef.current();
    }
  }, [replayToken]);

  return (
    <button
      ref={buttonRef}
      className="trophy-trace"
      type="button"
      aria-label="Animar troféu: Traço"
      title="Repetir animação Traço"
      onClick={() => replayRef.current()}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) replayRef.current();
      }}
      onPointerEnter={(event) => {
        if (
          event.pointerType === "mouse" &&
          window.matchMedia("(hover: hover) and (pointer: fine)").matches
        ) {
          replayRef.current();
        }
      }}
    >
      <svg className="trophy-trace__art" viewBox="0 0 52 52" fill="none" aria-hidden="true" focusable="false">
        <path
          className="trophy-trace__registration"
          d="M9 13V9H13M39 9H43V13M43 39V43H39M13 43H9V39"
        />
        <path className="trophy-trace__guides" d="M26 7V44M8 26H44" />
        <g className="trophy-trace__fill">
          <path className="trophy-trace__cup-tint" d="M18 14H34V20C34 26.8 30.4 30.5 26 30.5C21.6 30.5 18 26.8 18 20Z" />
          <path className="trophy-trace__cup-light" d="M21.5 18V20C21.5 23.5 22.6 26 24.4 27.1" />
        </g>
        <g className="trophy-trace__outline">
          <path className="trophy-trace__handle" pathLength="1" d="M18 17H13V20C13 24.3 15.5 26.3 20.1 26.3" />
          <path className="trophy-trace__handle" pathLength="1" d="M34 17H39V20C39 24.3 36.5 26.3 31.9 26.3" />
          <path className="trophy-trace__bowl" pathLength="1" d="M18 14V20C18 26.8 21.6 30.5 26 30.5C30.4 30.5 34 26.8 34 20V14" />
          <path className="trophy-trace__rim" pathLength="1" d="M17 14H35" />
          <path className="trophy-trace__stem" pathLength="1" d="M26 30.5V36.5M22 36.5H30" />
          <path className="trophy-trace__base" pathLength="1" d="M20 39H32" />
        </g>
        <path className="trophy-trace__glint" d="M38 7.5V14.5M34.5 11H41.5" />
      </svg>
    </button>
  );
}
