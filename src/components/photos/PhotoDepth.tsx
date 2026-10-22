import { useLayoutEffect, useRef } from "react";
import { animate } from "motion";
import { PhotoScene } from "./PhotoScene";
import { usePhotoPlayback } from "./usePhotoPlayback";
import "./PhotoDepth.css";

export function PhotoDepth({ replayToken = 0 }: { replayToken?: number }) {
  const scene = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const finishRef = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    const node = scene.current;
    if (!node) return;
    const cards = Array.from(node.querySelectorAll<HTMLElement>(".photo-study-card"));
    const images = Array.from(node.querySelectorAll<HTMLElement>(".photo-study-image"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let controls: { stop: () => void }[] = [];
    let lastPlay = -Infinity;
    let pointerFrame = 0;
    let pointerX = 0, pointerY = 0;
    const cancelPointerFrame = () => { cancelAnimationFrame(pointerFrame); pointerFrame = 0; };
    const stop = () => { controls.forEach(control => control.stop()); controls = []; };
    const reset = () => {
      cancelPointerFrame();
      stop();
      cards.forEach(card => { card.style.transform = ""; });
      images.forEach(img => { img.style.transform = ""; });
    };
    const spring = { type: "spring" as const, stiffness: 210, damping: 24, mass: 0.7 };
    playRef.current = () => {
      if (performance.now() - lastPlay < 700) return;
      lastPlay = performance.now();
      stop();
      cards.forEach((card, index) => {
        controls.push(animate(card, { y: [index ? 8 : 12, 0], rotateZ: [index ? 7 : -5, index ? 5 : -3], rotateX: [4, 0], rotateY: [index ? -3 : 3, 0] }, { duration: 0.8, ease: "easeOut", delay: index * 0.08 }));
      });
    };
    finishRef.current = reset;
    const updatePointer = () => {
      pointerFrame = 0;
      if (preference.matches || document.hidden || !finePointer.matches) return;
      const rect = node.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (pointerX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (pointerY - rect.top) / rect.height * 2 - 1));
      stop();
      cards.forEach((card, index) => {
        controls.push(animate(card, { rotateX: -y * 3, rotateY: x * 4, rotateZ: (index ? 5 : -3) + x * (index ? -0.8 : 0.8), y: index ? -3 : -5 }, spring));
        controls.push(animate(images[index], { scale: 1.035, x: x * (index ? -2 : 2), y: y * 2 }, spring));
      });
    };
    const move = (event: PointerEvent) => {
      if (preference.matches || document.hidden || event.pointerType !== "mouse" || !finePointer.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      cancelPointerFrame();
      if (preference.matches || document.hidden) { reset(); return; }
      stop();
      cards.forEach((card, index) => {
        controls.push(animate(card, { rotateX: 0, rotateY: 0, rotateZ: index ? 5 : -3, y: 0 }, spring));
        controls.push(animate(images[index], { scale: 1, x: 0, y: 0 }, spring));
      });
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
      reset();
      playRef.current = finishRef.current = () => {};
    };
  }, []);
  usePhotoPlayback(scene, replayToken, playRef, finishRef);
  return <PhotoScene variant="depth" sceneRef={scene} />;
}
