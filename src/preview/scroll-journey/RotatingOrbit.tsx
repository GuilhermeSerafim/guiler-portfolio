import { useEffect, useRef } from "react";

type RotatingOrbitProps = { active: boolean; className?: string };
type Curve = { source: Float32Array; projected: Float32Array };

const TAU = Math.PI * 2;
const SEGMENTS = 60;
const RADIUS = 255;
const makeCurve = (point: (angle: number) => [number, number, number]): Curve => {
  const source = new Float32Array((SEGMENTS + 1) * 3);
  for (let index = 0; index <= SEGMENTS; index++) {
    source.set(point(index / SEGMENTS * TAU), index * 3);
  }
  return { source, projected: new Float32Array(source.length) };
};

/** Pure geometry is prepared once; each mounted canvas owns its projection buffers. */
const sphereGeometry = [
  ...Array.from({ length: 12 }, (_, index) => {
    const longitude = index / 12 * Math.PI;
    return makeCurve(angle => [Math.cos(angle) * Math.cos(longitude), Math.sin(angle), Math.cos(angle) * Math.sin(longitude)]).source;
  }),
  ...Array.from({ length: 11 }, (_, index) => {
    const latitude = (index - 5) * 15 / 180 * Math.PI;
    return makeCurve(angle => [Math.cos(latitude) * Math.cos(angle), Math.sin(latitude), Math.cos(latitude) * Math.sin(angle)]).source;
  }),
];

const orbitalPoint = (angle: number, radius: number, inclination: number, bearing: number): [number, number, number] => {
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius * Math.cos(inclination);
  return [
    x * Math.cos(bearing) - y * Math.sin(bearing),
    x * Math.sin(bearing) + y * Math.cos(bearing),
    Math.sin(angle) * radius * Math.sin(inclination),
  ];
};

const orbitalGeometry = [
  makeCurve(angle => orbitalPoint(angle, 1.35, 1.23, -.45)).source,
  makeCurve(angle => orbitalPoint(angle, 1.26, 1.16, .74)).source,
];

/**
 * A rotating spherical mesh, projected in Canvas 2D rather than rotating a flat SVG.
 * The parent controls visibility with `active`; no React render occurs per frame.
 */
export default function RotatingOrbit({ active, className = "" }: RotatingOrbitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const mesh = sphereGeometry.map(source => ({ source, projected: new Float32Array(source.length) }));
    const rings = orbitalGeometry.map(source => ({ source, projected: new Float32Array(source.length) }));
    const accent = getComputedStyle(canvas).getPropertyValue("--journey-accent").trim() || "#345bff";
    let frame = 0;
    let previousTime = 0;
    let pixelWidth = 0;
    let pixelHeight = 0;
    const inclination = -.43;
    const bearing = -.25;
    const sinTilt = Math.sin(inclination);
    const cosTilt = Math.cos(inclination);
    const sinBearing = Math.sin(bearing);
    const cosBearing = Math.cos(bearing);

    const project = (source: Float32Array, output: Float32Array, angle: number, tilt: boolean) => {
      const sine = Math.sin(angle);
      const cosine = Math.cos(angle);
      for (let index = 0; index < source.length; index += 3) {
        const x = source[index] * cosine + source[index + 2] * sine;
        const z = -source[index] * sine + source[index + 2] * cosine;
        const y = tilt ? source[index + 1] * cosTilt - z * sinTilt : source[index + 1];
        const depth = tilt ? source[index + 1] * sinTilt + z * cosTilt : z;
        const perspective = 1 + depth * .025;
        output[index] = 500 + (x * cosBearing - y * sinBearing) * RADIUS * perspective;
        output[index + 1] = 400 + (x * sinBearing + y * cosBearing) * RADIUS * perspective;
        output[index + 2] = depth;
      }
    };

    const strokeCurves = (curves: Curve[], front: boolean, color: string, opacity: number, width: number) => {
      context.beginPath();
      for (const { projected: points } of curves) {
        let connected = false;
        for (let index = 3; index < points.length; index += 3) {
          const depth = (points[index - 1] + points[index + 2]) / 2;
          const visible = front ? depth >= 0 : depth < 0;
          if (visible) {
            if (!connected) context.moveTo(points[index - 3], points[index - 2]);
            context.lineTo(points[index], points[index + 1]);
          }
          connected = visible;
        }
      }
      context.strokeStyle = color;
      context.globalAlpha = opacity;
      context.lineWidth = width;
      context.stroke();
      context.globalAlpha = 1;
    };

    const drawNode = (angle: number, ring: number, front: boolean) => {
      const point = ring === 0
        ? orbitalPoint(angle, 1.35, 1.23, -.45)
        : orbitalPoint(angle, 1.26, 1.16, .74);
      if ((point[2] >= 0) !== front) return;
      const perspective = 1 + point[2] * .025;
      const x = 500 + (point[0] * cosBearing - point[1] * sinBearing) * RADIUS * perspective;
      const y = 400 + (point[0] * sinBearing + point[1] * cosBearing) * RADIUS * perspective;
      const radius = (ring === 0 ? 4.8 : 3.3) * (1 + point[2] * .23);
      context.globalAlpha = front ? 1 : .25;
      context.fillStyle = accent;
      context.beginPath();
      context.arc(x, y, radius, 0, TAU);
      context.fill();
      context.globalAlpha = front ? .55 : .12;
      context.strokeStyle = accent;
      context.lineWidth = .9;
      context.beginPath();
      context.arc(x, y, radius + 7, 0, TAU);
      context.stroke();
      context.globalAlpha = 1;
    };

    const draw = () => {
      if (!pixelWidth || !pixelHeight) return;
      const seconds = elapsedRef.current;
      const spin = .45 + seconds * TAU / 30;
      context.setTransform(pixelWidth / 1000, 0, 0, pixelHeight / 800, 0, 0);
      context.clearRect(0, 0, 1000, 800);
      context.lineCap = "round";
      context.lineJoin = "round";
      for (const curve of mesh) project(curve.source, curve.projected, spin, true);
      for (const curve of rings) project(curve.source, curve.projected, 0, false);

      context.strokeStyle = "#c8d3d1";
      context.lineWidth = .7;
      context.globalAlpha = .18;
      context.setLineDash([1, 11]);
      context.beginPath();
      context.arc(500, 400, 278, 0, TAU);
      context.stroke();
      context.setLineDash([]);
      context.globalAlpha = 1;

      strokeCurves(rings, false, accent, .22, 1.3);
      drawNode(-.3 + seconds * TAU / 11, 0, false);
      drawNode(2.4 - seconds * TAU / 16, 1, false);
      strokeCurves(mesh, false, "#c8d3d1", .13, .9);
      strokeCurves(mesh, true, "#d6dfdc", .75, 1.15);
      context.beginPath();
      context.arc(500, 400, RADIUS, 0, TAU);
      context.strokeStyle = "rgba(214, 223, 220, .55)";
      context.lineWidth = 1.1;
      context.stroke();
      strokeCurves(rings, true, accent, .9, 1.4);
      drawNode(-.3 + seconds * TAU / 11, 0, true);
      drawNode(2.4 - seconds * TAU / 16, 1, true);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const tick = (time: number) => {
      frame = 0;
      if (!active || document.hidden) { previousTime = 0; return; }
      if (previousTime) elapsedRef.current += Math.min(.1, Math.max(0, time - previousTime) / 1000);
      previousTime = time;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (active && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const width = canvas.clientWidth;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      pixelWidth = Math.round(width * dpr);
      pixelHeight = Math.round(width * .8 * dpr);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      draw();
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else { draw(); resume(); }
    };

    resize();
    resume();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas
    ref={canvasRef}
    className={`journey-rotating-orbit ${className}`.trim()}
    data-active={active}
    width={1000}
    height={800}
    aria-hidden="true"
    style={{ display: "block", width: "100%", height: "auto", aspectRatio: "1000 / 800" }}
  />;
}
