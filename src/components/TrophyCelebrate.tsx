import { useEffect, useId, useRef } from 'react';
import { createScope, createTimeline } from 'animejs';
import { useTranslation } from '../i18n';
import './TrophyCelebrate.css';

const sparks = [
  { x: 11, y: 18, dx: -3, dy: -3, gold: true, shape: 'cross' },
  { x: 19, y: 10, dx: -2, dy: -4, gold: false, shape: 'dot' },
  { x: 34, y: 11, dx: 3, dy: -4, gold: true, shape: 'dash' },
  { x: 41, y: 21, dx: 4, dy: -1, gold: false, shape: 'cross' },
  { x: 40, y: 34, dx: 3, dy: 3, gold: true, shape: 'dot' },
  { x: 11, y: 32, dx: -4, dy: 3, gold: false, shape: 'dash' },
] as const;

const cupPath = 'M18 16h16v7a8 8 0 0 1-16 0Z';

export function TrophyCelebrate({ replayToken = 0 }: { replayToken?: number }) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playRef = useRef<() => void>(() => {});
  const previousReplayToken = useRef(replayToken);
  const clipId = `trophy-celebrate-cup-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference.matches;
    let inView = false;
    let entered = false;
    let playing = false;
    let disposed = false;
    let sequence: ReturnType<typeof createTimeline> | undefined;

    // One reusable timeline per mount keeps repeat interactions bounded.
    const scope = createScope({ root: button }).add(() => {
      sequence = createTimeline({
        autoplay: false,
        defaults: { ease: 'out(3)' },
        onComplete: () => { playing = false; },
      });

      sequence.add('.trophy-celebrate__trophy', {
        translateY: [
          { from: 0, to: -3.5, duration: 210 },
          { to: -2.5, duration: 150 },
          { to: 0, duration: 420, ease: 'out(4)' },
        ],
        rotate: [
          { from: 0, to: -5, duration: 210 },
          { to: 3, duration: 190 },
          { to: 0, duration: 380, ease: 'out(4)' },
        ],
      }, 0);

      sequence.add('.trophy-celebrate__shadow', {
        scaleX: [
          { from: 1, to: 0.68, duration: 210 },
          { to: 1, duration: 570 },
        ],
        opacity: [
          { from: 0.12, to: 0.06, duration: 210 },
          { to: 0.12, duration: 570 },
        ],
      }, 0);

      sequence.add('.trophy-celebrate__halo', {
        scale: { from: 0.72, to: 1.04, duration: 590 },
        opacity: [
          { from: 0, to: 0.28, duration: 120 },
          { to: 0, duration: 470 },
        ],
      }, 90);

      sequence.add('.trophy-celebrate__shine', {
        translateX: { from: -15, to: 19, duration: 400, ease: 'inOut(2)' },
        opacity: [
          { from: 0, to: 0.9, duration: 110 },
          { to: 0.9, duration: 140 },
          { to: 0, duration: 150 },
        ],
      }, 140);

      sparks.forEach((spark, index) => {
        sequence?.add(`.trophy-celebrate__spark-${index}`, {
          translateX: { from: 0, to: spark.dx, duration: 560 },
          translateY: { from: 0, to: spark.dy, duration: 560 },
          rotate: { from: 0, to: index % 2 === 0 ? 18 : -18, duration: 560 },
          scale: [
            { from: 0.3, to: 1, duration: 160 },
            { to: 0.65, duration: 400 },
          ],
          opacity: [
            { from: 0, to: 1, duration: 110 },
            { to: 0, duration: 450 },
          ],
        }, 160 + index * 18);
      });
    });

    const stop = () => {
      sequence?.pause().seek(0, true);
      playing = false;
    };

    const play = () => {
      // Focus, hover and click can arrive together; finish one celebration first.
      if (disposed || reducedMotion || document.hidden || !inView || playing) return;
      playing = true;
      sequence?.restart();
    };
    playRef.current = play;

    const enter = () => {
      if (inView && !entered) {
        entered = true;
        play();
      }
    };

    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      ([entry]) => {
        if (disposed || document.hidden || !entry) return;
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        if (inView) enter();
        else stop();
      },
      { threshold: [0, 0.4] },
    );

    const observe = () => {
      if (document.hidden) return;
      if (observer) observer.observe(button);
      else {
        inView = true;
        enter();
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        inView = false;
        observer?.disconnect();
        stop();
      } else observe();
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) stop();
    };

    motionPreference.addEventListener('change', handleMotionPreference);
    document.addEventListener('visibilitychange', handleVisibility);
    observe();

    return () => {
      disposed = true;
      playRef.current = () => {};
      observer?.disconnect();
      motionPreference.removeEventListener('change', handleMotionPreference);
      document.removeEventListener('visibilitychange', handleVisibility);
      scope.revert();
    };
  }, []);

  useEffect(() => {
    if (previousReplayToken.current === replayToken) return;
    previousReplayToken.current = replayToken;
    playRef.current();
  }, [replayToken]);

  return (
    <button
      ref={buttonRef}
      className="trophy-celebrate"
      type="button"
      aria-label={t('Animar troféu: Conquista', 'Animate achievement trophy')}
      onClick={() => playRef.current()}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') playRef.current();
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) playRef.current();
      }}
    >
      <svg className="trophy-celebrate__art" viewBox="0 0 52 52" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <path d={cupPath} />
          </clipPath>
        </defs>
        <circle className="trophy-celebrate__halo" cx="26" cy="26" r="23" />
        <ellipse className="trophy-celebrate__shadow" cx="26" cy="40" rx="8" ry="1.5" />
        <g className="trophy-celebrate__trophy">
          <path className="trophy-celebrate__outline" d="M18 18h-4v3a6 6 0 0 0 6 6m14-9h4v3a6 6 0 0 1-6 6" />
          <path className="trophy-celebrate__cup" d={cupPath} />
          <g clipPath={`url(#${clipId})`}>
            <path className="trophy-celebrate__shine" d="m21 12-8 23h5l8-23Z" />
          </g>
          <path className="trophy-celebrate__outline" d="M26 31v6m-5 1h10" />
          <path className="trophy-celebrate__crest" d="m26 19 1.1 2.2 2.4.3-1.8 1.8.4 2.4-2.1-1.1-2.1 1.1.4-2.4-1.8-1.8 2.4-.3Z" />
        </g>
        {sparks.map((spark, index) => (
          <g
            key={index}
            className={`trophy-celebrate__spark trophy-celebrate__spark-${index}${spark.gold ? ' trophy-celebrate__spark--gold' : ''}`}
          >
            {spark.shape === 'cross' ? (
              <path d={`M${spark.x - 1.5} ${spark.y}h3M${spark.x} ${spark.y - 1.5}v3`} />
            ) : spark.shape === 'dot' ? (
              <circle cx={spark.x} cy={spark.y} r="1" />
            ) : (
              <path d={`m${spark.x - 1} ${spark.y + 1} 2-2`} />
            )}
          </g>
        ))}
      </svg>
    </button>
  );
}
