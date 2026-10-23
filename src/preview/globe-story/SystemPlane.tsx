/** Original architectural drawing for the local globe → software study. */
type SystemPlaneProps = { className?: string };

const routes = [
  "M312 224H428",
  "M550 296V435",
  "M672 224H726V397H780",
  "M672 493H726V420H780",
];

const modules = [
  { name: "interface", x: 82, y: 154, width: 230, height: 142 },
  { name: "api", x: 428, y: 154, width: 244, height: 142 },
  { name: "dados", x: 428, y: 435, width: 244, height: 116 },
  { name: "ia", x: 780, y: 334, width: 150, height: 126 },
];

export default function SystemPlane({ className = "" }: SystemPlaneProps) {
  return <svg
    className={`globe-system-art ${className}`.trim()}
    viewBox="0 0 1000 700"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g className="globe-system-grid" stroke="currentColor" strokeWidth=".55" opacity=".10">
      {[82, 197, 312, 428, 550, 672, 780, 930].map(x => <path key={`v${x}`} d={`M${x} 84V612`} />)}
      {[108, 154, 224, 296, 334, 397, 435, 493, 551, 588].map(y => <path key={`h${y}`} d={`M48 ${y}H952`} />)}
    </g>

    <g className="globe-system-guides" stroke="currentColor" strokeWidth=".8" opacity=".25">
      <path d="M58 130V108H82M930 108H954V132M58 564V588H82M930 588H954V564" />
      <path d="M82 126H312M82 119V133M312 119V133M428 126H672M428 119V133M672 119V133" />
      <path d="M397 154V296M390 154H404M390 296H404M397 435V551M390 435H404M390 551H404" />
      <path d="M780 488H930M780 481V495M930 481V495" />
      <path d="M550 84V130M550 574V612M48 397H102M952 397H976" strokeDasharray="3 7" />
    </g>

    <g className="globe-system-links" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" opacity=".38">
      {routes.map(route => <path key={route} d={route} />)}
      <path d="M305 224H319M550 289V303M665 224H679M550 428V442M665 493H679M773 397H787M773 420H787" strokeWidth="2" />
    </g>

    <g className="globe-system-modules" stroke="currentColor" strokeLinejoin="round">
      {modules.map(module => <g key={module.name} className={`globe-system-module globe-system-module--${module.name}`}>
        <rect x={module.x} y={module.y} width={module.width} height={module.height} rx="2" strokeWidth="1.25" opacity=".82" />
        <rect x={module.x + 6} y={module.y + 6} width={module.width - 12} height={module.height - 12} rx="1" strokeWidth=".6" opacity=".28" />
        <path d={`M${module.x + 6} ${module.y + 45}H${module.x + module.width - 6}`} strokeWidth=".7" opacity=".35" />
        <text
          x={module.x + 20}
          y={module.y + 29}
          fill="currentColor"
          stroke="none"
          fontFamily="var(--mono, monospace)"
          fontSize="13"
          letterSpacing="1.2"
        >{module.name}</text>
        <path
          d={`M${module.x} ${module.y + 14}V${module.y}H${module.x + 14}M${module.x + module.width - 14} ${module.y + module.height}H${module.x + module.width}V${module.y + module.height - 14}`}
          stroke="var(--globe-story-accent, var(--blue, #2546ef))"
          strokeWidth="1.5"
        />
      </g>)}
    </g>

    <g className="globe-system-detail" stroke="currentColor" strokeWidth=".8" opacity=".38">
      <rect x="105" y="216" width="62" height="56" rx="1" />
      <path d="M181 219H287M181 235H271M181 251H278M181 267H247" />
      <path d="M451 218H492M451 232H478M608 218H649M622 232H649M451 266H492M608 266H649" />
      <rect x="450" y="499" width="54" height="29" rx="1" />
      <rect x="521" y="499" width="54" height="29" rx="1" />
      <rect x="592" y="499" width="54" height="29" rx="1" />
      <path d="M804 403 831 385 859 409 891 391M804 403 829 429 859 409 891 432M831 385 829 429M891 391 891 432" />
      <circle cx="804" cy="403" r="3" />
      <circle cx="831" cy="385" r="3" />
      <circle cx="829" cy="429" r="3" />
      <circle cx="859" cy="409" r="3" />
      <circle cx="891" cy="391" r="3" />
      <circle cx="891" cy="432" r="3" />
    </g>

    <g className="globe-system-focus" stroke="var(--globe-story-accent, var(--blue, #2546ef))">
      <circle cx="550" cy="241" r="24" strokeWidth=".85" opacity=".65" />
      <circle cx="550" cy="241" r="33" strokeWidth=".65" strokeDasharray="2 7" opacity=".35" />
      <path d="M538 241H562M550 229V253" strokeWidth="1.2" />
      <path d="M550 197V204M550 278V285M506 241H513M587 241H594" strokeWidth=".8" opacity=".6" />
    </g>

    <g stroke="var(--globe-story-accent, var(--blue, #2546ef))" strokeWidth="1.5" strokeLinecap="round">
      {routes.map((route, index) => <path
        key={route}
        className={`globe-system-route globe-system-route--${index + 1}`}
        d={route}
        pathLength={100}
        strokeDasharray="9 91"
      />)}
    </g>
  </svg>;
}
