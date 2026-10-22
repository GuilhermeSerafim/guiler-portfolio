import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PhotoScene } from '../../components/photos/PhotoScene';
import { usePhotoPlayback } from '../../components/photos/usePhotoPlayback';
import './PhotoAperture.css';

export function PhotoAperture({ replayToken = 0 }: { replayToken?: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const finishRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });
      const cards = scene.querySelectorAll<HTMLElement>('.photo-study-card');

      cards.forEach((card, index) => {
        const image = card.querySelector('.photo-study-image');
        const shutters = card.querySelectorAll('.photo-study-shutter');
        const left = card.querySelector('.photo-study-shutter--left');
        const right = card.querySelector('.photo-study-shutter--right');
        const start = index * 0.18;

        // The paper never becomes opaque, so the photograph stays present.
        timeline.fromTo(shutters, { xPercent: 0, opacity: 0 }, {
          opacity: 0.82,
          duration: 0.1,
          ease: 'power1.out',
          immediateRender: false,
        }, start);
        timeline.to(left, {
          xPercent: -104,
          duration: 0.76,
          ease: 'power3.inOut',
        }, start + 0.035);
        timeline.to(right, {
          xPercent: 104,
          duration: 0.76,
          ease: 'power3.inOut',
        }, start + 0.035);
        timeline.to(shutters, {
          opacity: 0,
          duration: 0.32,
          ease: 'power2.out',
        }, start + 0.43);
        timeline.fromTo(image, { scale: 1.035 }, {
          scale: 1,
          duration: 1.08,
          ease: 'power2.out',
          immediateRender: false,
        }, start);
      });

      playRef.current = () => {
        if (!timeline.isActive()) timeline.restart();
      };
      finishRef.current = () => {
        timeline.progress(1).pause();
      };

      // Before entry (and under reduced motion), render the complete photos.
      finishRef.current();
    }, scene);

    return () => {
      playRef.current = () => {};
      finishRef.current = () => {};
      context.revert();
    };
  }, []);

  usePhotoPlayback(sceneRef, replayToken, playRef, finishRef);

  return <PhotoScene variant="aperture" sceneRef={sceneRef} withShutters />;
}
