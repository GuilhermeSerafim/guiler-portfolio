import { useEffect, useRef, type MutableRefObject } from "react";

type GlobeFieldProps = {
  active: boolean;
  progressRef: MutableRefObject<number>;
};

const TAU = Math.PI * 2;
const COLUMNS = 24;
const ROWS = 12;
const STRIDE = COLUMNS + 1;
const COUNT = STRIDE * (ROWS + 1);
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const between = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

// A shared latitude/longitude topology. The same vertices open into the final plane.
const vertices = Array.from({ length: COUNT }, (_, index) => {
  const column = index % STRIDE;
  const row = Math.floor(index / STRIDE);
  const u = column / COLUMNS;
  const v = row / ROWS;
  const longitude = (u - .5) * TAU;
  const latitude = (v - .5) * Math.PI;
  return {
    x: Math.cos(latitude) * Math.sin(longitude),
    y: Math.sin(latitude),
    z: Math.cos(latitude) * Math.cos(longitude),
    u,
    v,
  };
});

const edges: [number, number][] = [];
for (let row = 0; row <= ROWS; row++) {
  for (let column = 0; column <= COLUMNS; column++) {
    const index = row * STRIDE + column;
    if (column < COLUMNS) edges.push([index, index + 1]);
    if (row < ROWS) edges.push([index, index + STRIDE]);
  }
}

const route = [[2, 8], [5, 8], [5, 6], [10, 6], [10, 4], [15, 4], [15, 6], [19, 6], [19, 3], [23, 3]]
  .map(([column, row]) => row * STRIDE + column);

/** Original, continuous spherical-to-planar drawing; no photography or iris mask. */
export default function GlobeField({ active, progressRef }: GlobeFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const points = new Float32Array(COUNT * 3);
    const lengths = new Float32Array(route.length - 1);
    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let previousTime = 0;
    let phase = "";

    const render = () => {
      const p = clamp(progressRef.current);
      const seconds = elapsedRef.current;
      const mobile = width <= 960;
      const travel = between(.04, .28, p);
      const unfold = between(.24, .58, p);
      const settle = between(.55, .85, p);
      const late = between(.78, .95, p);
      const centerX = width * mix(mobile ? .55 : .70, .50, travel) + width * .10 * settle;
      const centerY = height * mix(mobile ? .66 : .50, .50, unfold);
      const radius = (mobile ? Math.min(width * .38, height * .26) : Math.min(width, height) * .29) * mix(1, 2.6, between(.04, .32, p));
      const yaw = .3 + seconds * TAU / 40 + travel * .30;
      const pitch = mix(-.36, .16, travel);
      const sinYaw = Math.sin(yaw), cosYaw = Math.cos(yaw);
      const sinPitch = Math.sin(pitch), cosPitch = Math.cos(pitch);
      const bearing = mix(-.22, .03, travel);
      const sinBearing = Math.sin(bearing), cosBearing = Math.cos(bearing);
      const planeYaw = mix(-.17, .19, settle);
      const planePitch = mix(-.18, -.52, settle);
      const cosPlaneY = Math.cos(planeYaw), sinPlaneY = Math.sin(planeYaw);
      const cosPlaneX = Math.cos(planePitch), sinPlaneX = Math.sin(planePitch);
      const distance = Math.max(width, height) * 2.3;
      const planeWidth = Math.max(width * 1.5, height * .95);
      const planeHeight = height * 1.45;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      context.lineJoin = "round";

      for (let index = 0; index < COUNT; index++) {
        const source = vertices[index];
        const sx = source.x * cosYaw + source.z * sinYaw;
        const sz = -source.x * sinYaw + source.z * cosYaw;
        const sy = source.y * cosPitch - sz * sinPitch;
        const depth = source.y * sinPitch + sz * cosPitch;
        const sphereX = (sx * cosBearing - sy * sinBearing) * radius;
        const sphereY = (sx * sinBearing + sy * cosBearing) * radius;

        const px = (source.u - .5) * planeWidth;
        const py = (source.v - .5) * planeHeight;
        const pz = Math.sin(source.u * TAU + seconds * .28) * Math.cos(source.v * Math.PI) * 12 * settle;
        const rx = px * cosPlaneY + pz * sinPlaneY;
        const rz = -px * sinPlaneY + pz * cosPlaneY;
        const ry = py * cosPlaneX - rz * sinPlaneX;
        const finalZ = py * sinPlaneX + rz * cosPlaneX;
        const perspective = distance / (distance + finalZ);
        points[index * 3] = centerX + mix(sphereX, rx * perspective, unfold);
        points[index * 3 + 1] = centerY + mix(sphereY, ry * perspective, unfold);
        points[index * 3 + 2] = depth;
      }

      const strokeMesh = (front: boolean) => {
        if (unfold === 1 && !front) return;
        context.beginPath();
        for (const [a, b] of edges) {
          if (unfold < 1 && ((points[a * 3 + 2] + points[b * 3 + 2]) >= 0) !== front) continue;
          context.moveTo(points[a * 3], points[a * 3 + 1]);
          context.lineTo(points[b * 3], points[b * 3 + 1]);
        }
        context.lineWidth = mix(front ? .95 : .7, .8, unfold);
        context.strokeStyle = "#d0dbdd";
        context.globalAlpha = mix(front ? .67 : .14, .23, unfold) * mix(1, .78, late);
        context.stroke();
      };
      strokeMesh(false);
      strokeMesh(true);

      // The route lives on that same plane. It unfolds as a sequence of connections.
      const routeProgress = between(.55, .85, p);
      let totalLength = 0;
      for (let index = 0; index < route.length - 1; index++) {
        const a = route[index] * 3, b = route[index + 1] * 3;
        const length = Math.hypot(points[b] - points[a], points[b + 1] - points[a + 1]);
        lengths[index] = length;
        totalLength += length;
      }
      const traceRoute = (limit: number) => {
        context.beginPath();
        context.moveTo(points[route[0] * 3], points[route[0] * 3 + 1]);
        let remaining = totalLength * limit;
        for (let index = 0; index < route.length - 1 && remaining > 0; index++) {
          const a = route[index] * 3, b = route[index + 1] * 3;
          const portion = Math.min(1, remaining / Math.max(1, lengths[index]));
          context.lineTo(mix(points[a], points[b], portion), mix(points[a + 1], points[b + 1], portion));
          remaining -= lengths[index];
        }
      };
      if (routeProgress > 0) {
        const gradient = context.createLinearGradient(0, height * .7, width, height * .3);
        gradient.addColorStop(0, "#345bff");
        gradient.addColorStop(.6, "#94b6ff");
        gradient.addColorStop(1, "#5278eb");
        context.strokeStyle = gradient;
        context.lineWidth = 1.7;
        context.globalAlpha = routeProgress * mix(.85, .40, late);
        traceRoute(routeProgress);
        context.stroke();

        let remaining = ((seconds / 9) % 1) * totalLength * routeProgress;
        for (let index = 0; index < lengths.length; index++) {
          if (remaining <= lengths[index]) {
            const a = route[index] * 3, b = route[index + 1] * 3;
            const portion = remaining / Math.max(1, lengths[index]);
            context.beginPath();
            context.arc(mix(points[a], points[b], portion), mix(points[a + 1], points[b + 1], portion), 2.5, 0, TAU);
            context.fillStyle = "#c8d9ff";
            context.fill();
            break;
          }
          remaining -= lengths[index];
        }
      }

      // A low-contrast scan travels through the constructed field, not through the copy.
      if (late > 0) {
        const scan = (seconds * .8) % (ROWS + 4) - 2;
        context.strokeStyle = "#7697d7";
        context.lineWidth = 1.1;
        for (let row = 0; row <= ROWS; row++) {
          const strength = Math.exp(-Math.pow((row - scan) / .75, 2)) * late * .24;
          if (strength < .015) continue;
          context.globalAlpha = strength;
          context.beginPath();
          for (let column = 0; column <= COLUMNS; column++) {
            const index = (row * STRIDE + column) * 3;
            if (column === 0) context.moveTo(points[index], points[index + 1]);
            else context.lineTo(points[index], points[index + 1]);
          }
          context.stroke();
        }
      }

      // This target does not rotate with the spherical artwork: it carries the eye.
      const targetX = centerX + radius * .12 * (1 - unfold);
      const targetY = centerY - radius * .05 * (1 - unfold);
      const pulse = (seconds % 2.4) / 2.4;
      context.globalAlpha = mix(1, .5, late);
      context.fillStyle = "#6386ff";
      context.beginPath();
      context.arc(targetX, targetY, mix(4.5, 3.5, unfold), 0, TAU);
      context.fill();
      context.strokeStyle = "#6386ff";
      context.lineWidth = 1;
      context.globalAlpha = (1 - pulse) * .5 * mix(1, .5, late);
      context.beginPath();
      context.arc(targetX, targetY, 8 + pulse * 15, 0, TAU);
      context.stroke();
      context.globalAlpha = 1;

      const nextPhase = p < .24 ? "globe" : p < .58 ? "unfold" : p < .85 ? "network" : "signals";
      if (nextPhase !== phase) {
        phase = nextPhase;
        canvas.dataset.phase = phase;
        canvas.dataset.progress = p.toFixed(3);
      }
    };

    const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
    const tick = (time: number) => {
      frame = 0;
      if (!active || document.hidden) { previousTime = 0; return; }
      if (previousTime) elapsedRef.current += Math.min(.1, Math.max(0, time - previousTime) / 1000);
      previousTime = time;
      render();
      frame = requestAnimationFrame(tick);
    };
    const resume = () => { if (active && !document.hidden && !frame) frame = requestAnimationFrame(tick); };
    const resize = () => {
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      render();
    };
    const onVisibility = () => { if (document.hidden) stop(); else { render(); resume(); } };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    resume();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); observer.disconnect(); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVisibility); };
  }, [active, progressRef]);

  return <canvas ref={canvasRef} className="globe-field" data-active={active} aria-hidden="true" style={{ display: "block", width: "100%", height: "100%" }} />;
}
