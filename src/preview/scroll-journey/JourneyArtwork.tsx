/** Original line drawings for the local Guiler scroll study. No external artwork. */
type ArtworkProps = { className?: string };
type Point = { x: number; y: number; z: number };

const TAU = Math.PI * 2;
const fixed = (value: number) => value.toFixed(2);

/** Orthographic projection, tilted like an armillary instrument. */
function project({ x, y, z }: Point): Point {
  const inclination = -.43;
  const bearing = -.36;
  const py = y * Math.cos(inclination) - z * Math.sin(inclination);
  const pz = y * Math.sin(inclination) + z * Math.cos(inclination);
  return {
    x: 500 + (x * Math.cos(bearing) - py * Math.sin(bearing)) * 255,
    y: 400 + (x * Math.sin(bearing) + py * Math.cos(bearing)) * 255,
    z: pz,
  };
}

function projectedLine(pointAt: (angle: number) => Point, front: boolean) {
  let path = '';
  let previousVisible = false;
  for (let step = 0; step <= 112; step++) {
    const point = project(pointAt(step / 112 * TAU));
    const visible = front ? point.z >= 0 : point.z < 0;
    if (visible) path += `${previousVisible ? 'L' : 'M'}${fixed(point.x)},${fixed(point.y)} `;
    previousVisible = visible;
  }
  return path.trim();
}

const sphereCurves = [
  ...Array.from({ length: 9 }, (_, index) => {
    const longitude = index / 9 * Math.PI;
    return (angle: number): Point => ({
      x: Math.cos(angle) * Math.cos(longitude),
      y: Math.sin(angle),
      z: Math.cos(angle) * Math.sin(longitude),
    });
  }),
  ...[-60, -40, -20, 0, 20, 40, 60].map(degrees => {
    const latitude = degrees / 180 * Math.PI;
    return (angle: number): Point => ({
      x: Math.cos(latitude) * Math.cos(angle),
      y: Math.sin(latitude),
      z: Math.cos(latitude) * Math.sin(angle),
    });
  }),
];

const rearMesh = sphereCurves.map(curve => projectedLine(curve, false));
const frontMesh = sphereCurves.map(curve => projectedLine(curve, true));

export function OrbitDrawing({ className = '' }: ArtworkProps) {
  return (
    <svg className={`journey-orbit-art ${className}`.trim()} viewBox="0 0 1000 800" fill="none" aria-hidden="true" focusable="false">
      <g className="journey-orbit-guides" stroke="currentColor" strokeWidth=".7" opacity=".2">
        <path d="M500 98V160M500 640V702M198 400H260M740 400H802" />
        <path d="M493 100H507M493 700H507M200 393V407M800 393V407" />
        <path d="M390 121 610 679" strokeDasharray="3 8" />
        <circle cx="500" cy="400" r="278" strokeDasharray="1 11" />
      </g>
      <g className="journey-orbit-back" stroke="currentColor" strokeWidth=".85" opacity=".16">
        {rearMesh.map((path, index) => <path key={index} d={path} />)}
      </g>
      <g className="journey-orbit-front" stroke="currentColor" strokeWidth="1.15" opacity=".72">
        {frontMesh.map((path, index) => <path key={index} d={path} />)}
        <circle cx="500" cy="400" r="255" strokeWidth="1.4" />
      </g>
      <g className="journey-orbit-rings" stroke="var(--journey-accent, #345bff)" strokeWidth="1.25">
        <ellipse cx="500" cy="400" rx="344" ry="92" transform="rotate(-27 500 400)" opacity=".8" />
        <ellipse cx="500" cy="400" rx="320" ry="119" transform="rotate(43 500 400)" opacity=".28" />
      </g>
      <g className="journey-orbit-point" transform="rotate(-27 500 400)">
        <circle cx="824.85" cy="369.93" r="6" fill="var(--journey-accent, #345bff)" />
        <circle cx="824.85" cy="369.93" r="14" stroke="var(--journey-accent, #345bff)" strokeWidth=".8" opacity=".7" />
      </g>
    </svg>
  );
}

export function NotebookDrawing({ className = '' }: ArtworkProps) {
  return (
    <svg className={`journey-notebook-art ${className}`.trim()} viewBox="0 0 1600 1068" fill="none" aria-hidden="true" focusable="false">
      <g className="journey-notebook-construction" stroke="currentColor" strokeWidth=".8" opacity=".18">
        <path d="M0 840H539M1301 840H1600" />
        <path d="M75 995 530 810M1530 990 1315 815" />
        <path d="M925 395V1068M370 575H1450M370 1040H1450" strokeDasharray="3 10" />
        <path d="M526 505V1068M1320 505V1068" strokeDasharray="2 8" />
      </g>
      <g className="journey-notebook-dimensions" stroke="currentColor" strokeWidth=".95" opacity=".48">
        <path d="M526 532H1320M526 519V545M1320 519V545" />
        <path d="M481 575V1040M468 575H494M468 1040H494" />
        <path d="M1364 578V1040M1351 578H1377M1351 1040H1377" />
        <path d="M549 1060H1287M549 1052V1068M1287 1052V1068" />
      </g>
      <g className="journey-notebook-body" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M526 575 1320 578 1287 1040 548 1040Z" strokeWidth="2.1" />
        <path d="M536 585 1309 588 1278 1029 558 1029Z" strokeWidth=".8" opacity=".42" />
        <path d="M548 1040 554 1048 1281 1048 1287 1040M554 1048 558 1029M1281 1048 1278 1029" strokeWidth="1.25" opacity=".72" />
        <path d="M526 575 522 568 1325 571 1320 578" strokeWidth=".9" opacity=".5" />
        <path d="M894 1035H943" strokeWidth="1.1" opacity=".65" />
      </g>
      <g className="journey-notebook-detail" stroke="var(--journey-accent, #345bff)" strokeWidth="1.2">
        <path d="M526 604V575H555M1291 578H1320V607M548 1011V1040H577M1258 1040H1287V1011" />
        <path d="M910 806H940M925 791V821" opacity=".8" />
        <circle cx="925" cy="806" r="28" strokeWidth=".65" strokeDasharray="2 7" opacity=".45" />
      </g>
    </svg>
  );
}
