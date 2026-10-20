import { useEffect, useRef, useState } from "react";
import "./HeroEntry.css";

function canAnimateEntry() {
  if (typeof window === "undefined") return false;
  const navigation = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  return (
    window.location.pathname === "/" &&
    !window.location.hash &&
    navigation?.type !== "back_forward" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** One document entrance, never a prerequisite for reading or using the hero. */
export function useHeroEntry() {
  const heroRef = useRef<HTMLElement>(null);
  const [animate, setAnimate] = useState(canAnimateEntry);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      // Also update the DOM synchronously before a possible bfcache snapshot.
      if (heroRef.current) heroRef.current.dataset.entry = "static";
      setAnimate(false);
    };
    const onPreference = () => {
      if (preference.matches) finish();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) finish();
    };

    onPreference();
    preference.addEventListener("change", onPreference);
    window.addEventListener("pagehide", finish);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("hashchange", finish);
    window.addEventListener("popstate", finish);
    return () => {
      preference.removeEventListener("change", onPreference);
      window.removeEventListener("pagehide", finish);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("hashchange", finish);
      window.removeEventListener("popstate", finish);
    };
  }, []);

  return { heroRef, entry: animate ? "animate" : "static" } as const;
}

/** Original construction stroke: a small orbital gesture leading into the photo. */
export function EntryStroke() {
  return (
    <svg
      className="entry-stroke"
      viewBox="0 0 180 112"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="entry-stroke-line"
        pathLength="1"
        d="M8 99C38 102 67 86 71 58C75 28 46 18 39 39C30 68 89 83 156 28"
      />
      <path className="entry-stroke-tip" d="m146 27 12-2-3 12" />
      <circle cx="8" cy="99" r="2" />
    </svg>
  );
}
