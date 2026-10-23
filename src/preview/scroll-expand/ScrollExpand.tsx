/**
 * ScrollExpand — adapted for a local photo experiment from ScrollExpand by David Haz.
 *
 * MIT + Commons Clause License Condition v1.0
 * Copyright (c) 2026 David Haz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, and distribute the Software as part of an
 * application, website, or product, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * Commons Clause Restriction
 * You may use this Software, including for any commercial purpose, so long as
 * you do not sell, sublicense, or redistribute the components themselves—whether
 * alone, in a bundle, or as a ported version.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { useCallback, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

import './ScrollExpand.css';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const finiteOr = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const SETTLED_THRESHOLD = 0.0004;

export interface ScrollExpandProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  /** Intrinsic image dimensions; the displayed image remains responsive. */
  width: number;
  height: number;
  /** Initial visible dimensions, as percentages of the stage. */
  startWidth?: number;
  startHeight?: number;
  /** Corner radii in pixels. */
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  /** Expansion and final hold distances, in multiples of the stage height. */
  scrollDistance?: number;
  holdDistance?: number;
  /** Exponential smoothing time constant in seconds; zero follows scroll immediately. */
  smoothing?: number;
  className?: string;
  objectPosition?: CSSProperties['objectPosition'];
  /** Stage height in pixels; defaults to the viewport height minus stickyTop. */
  stageHeight?: number;
  /** Sticky offset from the viewport top, in pixels. */
  stickyTop?: number;
}

type ScrollExpandStyle = CSSProperties & Record<`--scroll-expand-${string}`, string | number>;

/** The caller supplies a static image for mobile and reduced-motion preferences. */
export default function ScrollExpand({
  src,
  srcSet,
  sizes = '100vw',
  alt,
  width,
  height,
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.08,
  className = '',
  objectPosition = 'center',
  stageHeight,
  stickyTop = 0,
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);

  const initialWidth = clamp(finiteOr(startWidth, 42), 0, 100);
  const initialHeight = clamp(finiteOr(startHeight, 58), 0, 100);
  const initialRadius = Math.max(0, finiteOr(startRadius, 24));
  const finalRadius = Math.max(0, finiteOr(endRadius, 0));
  const initialZoom = Math.max(0.01, finiteOr(mediaZoom, 1.35));
  const expansionDistance = Math.max(0.01, finiteOr(scrollDistance, 1.2));
  const finalHoldDistance = Math.max(0, finiteOr(holdDistance, 0.35));
  const smoothingSeconds = Math.max(0, finiteOr(smoothing, 0.08));
  const top = Math.max(0, finiteOr(stickyTop, 0));
  const explicitStageHeight = stageHeight === undefined ? undefined : Math.max(1, finiteOr(stageHeight, 1));

  const applyProgress = useCallback((progress: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;

    const p = clamp(progress, 0, 1);
    const eased = p * p * (3 - 2 * p);
    const visibleWidth = initialWidth + (100 - initialWidth) * eased;
    const visibleHeight = initialHeight + (100 - initialHeight) * eased;
    const insetX = Math.max(0, (100 - visibleWidth) / 2);
    const insetY = Math.max(0, (100 - visibleHeight) / 2);
    const radius = initialRadius + (finalRadius - initialRadius) * eased;

    frame.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
    media.style.transform = `scale(${initialZoom + (1 - initialZoom) * eased})`;
  }, [initialWidth, initialHeight, initialRadius, finalRadius, initialZoom]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    let raf = 0;
    let previousTime = 0;
    let current = 0;
    let target = 0;
    let measuredStageHeight = 1;

    const stop = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      previousTime = 0;
    };

    const measure = () => {
      measuredStageHeight = Math.max(1, explicitStageHeight ?? window.innerHeight - top);
      stage.style.height = `${measuredStageHeight}px`;
      track.style.height = `${measuredStageHeight * (1 + expansionDistance + finalHoldDistance)}px`;
    };

    const readProgress = () => clamp(
      (top - track.getBoundingClientRect().top) / (measuredStageHeight * expansionDistance),
      0,
      1,
    );

    const tick = (time: number) => {
      raf = 0;
      if (document.hidden) {
        previousTime = 0;
        return;
      }

      const deltaSeconds = Math.max(0, time - previousTime) / 1000;
      previousTime = time;
      const blend = smoothingSeconds <= 0 ? 1 : 1 - Math.exp(-deltaSeconds / smoothingSeconds);
      current += (target - current) * blend;
      if (Math.abs(target - current) < SETTLED_THRESHOLD) {
        current = target;
        previousTime = 0;
        applyProgress(current);
        return;
      }

      applyProgress(current);
      raf = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (document.hidden) return;
      if (smoothingSeconds <= 0 || Math.abs(target - current) < SETTLED_THRESHOLD) {
        stop();
        current = target;
        applyProgress(current);
      } else if (!raf) {
        previousTime = performance.now();
        raf = window.requestAnimationFrame(tick);
      }
    };

    const reconcile = () => {
      stop();
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else reconcile();
    };

    reconcile();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', reconcile);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const resizeObserver = new ResizeObserver(reconcile);
    resizeObserver.observe(root);

    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', reconcile);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver.disconnect();
    };
  }, [applyProgress, expansionDistance, finalHoldDistance, smoothingSeconds, explicitStageHeight, top]);

  const style: ScrollExpandStyle = {
    '--scroll-expand-stage-height': explicitStageHeight === undefined
      ? `max(1px, calc(100svh - ${top}px))`
      : `${explicitStageHeight}px`,
    '--scroll-expand-track-height': `calc(var(--scroll-expand-stage-height) * ${1 + expansionDistance + finalHoldDistance})`,
    '--scroll-expand-sticky-top': `${top}px`,
    '--scroll-expand-inset-x': `${(100 - initialWidth) / 2}%`,
    '--scroll-expand-inset-y': `${(100 - initialHeight) / 2}%`,
    '--scroll-expand-start-radius': `${initialRadius}px`,
    '--scroll-expand-media-zoom': initialZoom,
  };

  return (
    <div ref={rootRef} className={`scroll-expand ${className}`.trim()} style={style}>
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            <img
              ref={mediaRef}
              className="scroll-expand__media"
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              alt={alt}
              width={width}
              height={height}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ objectPosition }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
