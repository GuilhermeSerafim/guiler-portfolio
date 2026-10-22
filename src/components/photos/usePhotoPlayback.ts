import { useEffect, useRef, type RefObject, type MutableRefObject } from "react";

type Action = MutableRefObject<() => void>;

/** Photos stay visible when animation is disabled or outside the viewport. */
export function usePhotoPlayback(scene: RefObject<HTMLDivElement>, replayToken: number, playRef: Action, finishRef: Action) {
  const trigger = useRef<() => void>(() => {});
  const previousToken = useRef(replayToken);
  useEffect(() => {
    const node = scene.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, entered = false, disposed = false;
    const play = () => { if (!disposed && visible && !document.hidden && !preference.matches) playRef.current(); };
    trigger.current = play;
    const enter = () => {
      if (entered || !visible || document.hidden) return;
      entered = true;
      void Promise.all(Array.from(node.querySelectorAll("img")).map(img => img.decode().catch(() => {}))).then(play);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      if (visible) enter(); else finishRef.current();
    }, { threshold: [0, 0.2] });
    observer.observe(node);
    const onPreference = () => { if (preference.matches) finishRef.current(); };
    const onVisibility = () => { if (document.hidden) finishRef.current(); else enter(); };
    const onHover = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) play();
    };
    const onFocus = (event: FocusEvent) => { if ((event.currentTarget as HTMLElement).matches(":focus-visible")) play(); };
    const buttons = Array.from(node.querySelectorAll<HTMLButtonElement>(".photo-study-hit"));
    buttons.forEach(button => {
      button.addEventListener("pointerenter", onHover);
      button.addEventListener("focus", onFocus);
      button.addEventListener("click", play);
    });
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    onPreference();
    return () => {
      disposed = true;
      trigger.current = () => {};
      observer.disconnect();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      buttons.forEach(button => {
        button.removeEventListener("pointerenter", onHover);
        button.removeEventListener("focus", onFocus);
        button.removeEventListener("click", play);
      });
    };
  }, [scene, playRef, finishRef]);
  useEffect(() => {
    if (previousToken.current === replayToken) return;
    previousToken.current = replayToken;
    trigger.current();
  }, [replayToken]);
}
