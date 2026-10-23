import { useEffect, useRef } from "react";
import SwarmCursor from "./vendor/SwarmCursor";

type FullSwarmProps = {
  stage: HTMLElement;
  enabled: boolean;
  onActiveChange: (active: boolean) => void;
};

/** Full React Bits appearance; eligibility and section visibility come from the host. */
export default function FullSwarm({ stage, enabled, onActiveChange }: FullSwarmProps) {
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    if (!enabled) {
      onActiveChangeRef.current(false);
      return;
    }

    let active = false;
    const setActive = (next: boolean) => {
      if (next === active) return;
      active = next;
      onActiveChangeRef.current(next);
    };
    const enter = (event: PointerEvent) => setActive(event.pointerType === "mouse");
    const leave = () => setActive(false);

    // A mode change can mount this while the mouse is already in the section.
    setActive(stage.matches(":hover"));
    stage.addEventListener("pointerenter", enter, { passive: true });
    stage.addEventListener("pointermove", enter, { passive: true });
    stage.addEventListener("pointerleave", leave, { passive: true });
    window.addEventListener("blur", leave);

    return () => {
      stage.removeEventListener("pointerenter", enter);
      stage.removeEventListener("pointermove", enter);
      stage.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      onActiveChangeRef.current(false);
    };
  }, [enabled, stage]);

  if (!enabled) return null;

  return (
    <SwarmCursor
      interactionRoot={stage}
      hideCursor={false}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
