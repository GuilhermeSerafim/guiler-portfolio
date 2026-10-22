import { useLayoutEffect, useRef } from 'react';
import { createScope, createTimeline } from 'animejs';
import { PhotoScene } from './PhotoScene';
import { usePhotoPlayback } from './usePhotoPlayback';
import './PhotoMemories.css';

export function PhotoMemories({ replayToken = 0 }: { replayToken?: number }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<() => void>(() => {});
  const finishRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let playing = false;
    let disposed = false;
    let sequence: ReturnType<typeof createTimeline> | undefined;

    const scope = createScope({ root: scene }).add(() => {
      sequence = createTimeline({
        autoplay: false,
        defaults: { ease: 'out(3)' },
        onComplete: () => { playing = false; },
      });

      // The prints begin together, fan out, then settle without scaling faces.
      sequence.add('.photo-study-card--main', {
        translateX: [
          { from: 14, to: -1.5, duration: 620 },
          { to: 0, duration: 400, ease: 'out(2)' },
        ],
        translateY: [
          { from: 12, to: -2, duration: 580 },
          { to: 0, duration: 440, ease: 'out(2)' },
        ],
        rotate: [
          { from: -0.5, to: -3.45, duration: 620 },
          { to: -3, duration: 400, ease: 'out(2)' },
        ],
        '--memory-lift': { from: 1, to: 0, duration: 1020 },
      }, 0);

      sequence.add('.photo-study-card--secondary', {
        translateX: [
          { from: -22, to: 2, duration: 620 },
          { to: 0, duration: 430, ease: 'out(2)' },
        ],
        translateY: [
          { from: -18, to: -1, duration: 620 },
          { to: 0, duration: 430, ease: 'out(2)' },
        ],
        rotate: [
          { from: 1.5, to: 5.6, duration: 630 },
          { to: 5, duration: 420, ease: 'out(2)' },
        ],
        '--memory-lift': { from: 1, to: 0, duration: 1050 },
      }, 100);

      sequence.add('.photo-study-card--main .photo-study-caption', {
        '--memory-line': { from: 0, to: 1, duration: 420, ease: 'inOut(2)' },
      }, 660);

      sequence.add('.photo-study-card--secondary .photo-study-caption', {
        '--memory-line': { from: 0, to: 1, duration: 420, ease: 'inOut(2)' },
      }, 840);
    });

    const finish = () => {
      if (!sequence || disposed) return;
      sequence.pause().seek(sequence.duration, true);
      playing = false;
    };

    playRef.current = () => {
      if (!sequence || disposed || playing) return;
      playing = true;
      sequence.restart();
    };
    finishRef.current = finish;

    // Rest is painted first; viewport and accessibility policy live in the hook.
    finish();

    return () => {
      disposed = true;
      playRef.current = () => {};
      finishRef.current = () => {};
      scope.revert();
    };
  }, []);

  usePhotoPlayback(sceneRef, replayToken, playRef, finishRef);

  return <PhotoScene variant="memories" sceneRef={sceneRef} />;
}
