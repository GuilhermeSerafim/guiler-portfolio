import { useId } from "react";
import type { Project } from "../data";
import "./ProjectVisual.css";

type ProjectVisualProps = {
  project: Project;
};

const contour =
  "M-155 340C-147 203-43 179 30 205S132 289 198 253 219 114 159 58 169-63 284-70";

function GeoRiskVisual() {
  const id = useId().replace(/:/g, "");

  return (
    <div className="pv-cover pv-cover--geo" aria-hidden="true">
      <svg
        className="pv-art pv-map"
        viewBox="0 0 700 460"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`${id}-blocks`}
            width="68"
            height="55"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-24)"
          >
            <rect width="68" height="55" fill="#e4e9de" />
            <rect x="5" y="5" width="57" height="44" rx="3" fill="#f0f0e7" />
            <path d="M0 0H68V55" stroke="#faf9ef" strokeWidth="7" />
            <path d="M0 0H68V55" stroke="#d2dcd1" strokeWidth=".7" />
          </pattern>
          <linearGradient
            id={`${id}-river`}
            x1="175"
            y1="20"
            x2="485"
            y2="490"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#689cc1" />
            <stop offset="1" stopColor="#397fba" />
          </linearGradient>
          <radialGradient id={`${id}-zone`}>
            <stop stopColor="#eab66d" stopOpacity=".65" />
            <stop offset=".68" stopColor="#eab66d" stopOpacity=".24" />
            <stop offset="1" stopColor="#eab66d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="700" height="460" fill="#dce5d9" />
        <path
          d="M244-25 744-20V470H313C371 410 206 352 250 277S357 178 308 117 275 55 244-25Z"
          fill={`url(#${id}-blocks)`}
        />
        <path
          d="M-20 348C77 297 44 199 135 175S196 84 169-15H-20Z"
          fill="#c6d9c6"
        />
        <path d="M582-16C540 81 585 119 706 132V-16Z" fill="#c6d9c6" />
        <path
          d="M-8 434C71 388 90 328 160 326S224 368 275 438L270 478H-8Z"
          fill="#ccddcc"
        />

        <g stroke="#a7c0ac" strokeWidth="1" opacity=".62">
          {Array.from({ length: 11 }, (_, index) => (
            <path
              key={index}
              d={contour}
              transform={`translate(${index * 11 - 32} ${index * 10 - 45})`}
            />
          ))}
          <path d="M519-25C491 31 516 92 564 121S670 122 713 179M537-26C511 22 535 81 581 102S676 109 716 156M555-23C534 20 553 65 594 86S680 91 716 135M577-23C550 17 578 60 612 71S682 74 719 111" />
        </g>

        <path
          d="M248-40C196 53 285 93 267 155S195 218 227 282 371 306 379 368 329 431 397 494"
          stroke="#f6f5ea"
          strokeWidth="46"
        />
        <path
          d="M248-40C196 53 285 93 267 155S195 218 227 282 371 306 379 368 329 431 397 494"
          stroke={`url(#${id}-river)`}
          strokeWidth="32"
        />
        <path
          d="M248-40C196 53 285 93 267 155S195 218 227 282 371 306 379 368 329 431 397 494"
          stroke="#b4d0db"
          strokeWidth="1"
          strokeDasharray="4 9"
          opacity=".8"
        />

        <g strokeLinecap="round">
          <path
            d="M133 473 314 31M-40 318 737 52M69 498 718 251"
            stroke="#d0d7ca"
            strokeWidth="13"
          />
          <path
            d="M133 473 314 31M-40 318 737 52M69 498 718 251"
            stroke="#fcfaee"
            strokeWidth="10"
          />
          <path
            d="M191 237 265 212M328 397 398 370"
            stroke="#98ada0"
            strokeWidth="15"
          />
          <path
            d="M191 237 265 212M328 397 398 370"
            stroke="#fbf9ee"
            strokeWidth="9"
          />
        </g>

        <circle cx="304" cy="154" r="70" fill={`url(#${id}-zone)`} />
        <circle cx="177" cy="285" r="58" fill={`url(#${id}-zone)`} />
        <circle cx="379" cy="312" r="67" fill={`url(#${id}-zone)`} />

        <g className="pv-map-pin">
          {[
            [304, 154],
            [177, 285],
            [379, 312],
          ].map(([x, y], index) => (
            <g key={x}>
              <circle
                cx={x}
                cy={y}
                r="23"
                fill="#2546ef"
                fillOpacity=".09"
                stroke="#2546ef"
                strokeOpacity=".25"
              />
              <circle
                cx={x}
                cy={y}
                r="12"
                fill="#2546ef"
                stroke="#f8f8ec"
                strokeWidth="3"
              />
              <circle cx={x} cy={y} r="3" fill="#fff" />
              <text
                x={x + 21}
                y={y - 22}
                fill="#244e46"
                fontSize="9"
                letterSpacing="1.2"
              >
                ÁREA 0{index + 1}
              </text>
            </g>
          ))}
        </g>

        <g transform="translate(648 55)" stroke="#34594b" strokeWidth="1.2">
          <path d="M0 32V-8M-7 1 0-8 7 1" />
          <text
            y="-17"
            fill="#34594b"
            stroke="none"
            fontSize="10"
            textAnchor="middle"
          >
            N
          </text>
          <circle cy="12" r="20" strokeOpacity=".3" />
        </g>
        <path
          d="M38 385H86M38 381V389M62 382V388M86 381V389"
          stroke="#34594b"
          strokeWidth="1.3"
        />
      </svg>

      <div className="pv-brand pv-brand--geo">
        <svg viewBox="0 0 28 28" fill="none">
          <path
            d="m14 2 11 6v12l-11 6L3 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m3 8 11 6 11-6M14 14v12M8.5 5l11 6v6l-5.5 3-5.5-3v-6L14 8"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        <span>
          GeoRisk<span className="pv-brand-dot">.</span>
        </span>
      </div>

      <div className="pv-report">
        <div className="pv-report-kicker">
          <span className="pv-status-dot" /> INTELIGÊNCIA TERRITORIAL
        </div>
        <h3>
          Análise
          <br />
          geoespacial<span>.</span>
        </h3>
        <p>IA + dados reais</p>
        <div className="pv-report-line" />
        <div className="pv-report-footer">
          <span className="pv-report-symbol">◎</span>
          <span>
            Uma nova perspectiva
            <br />
            sobre o território.
          </span>
        </div>
      </div>
      <div className="pv-caption pv-caption--geo">
        <span className="pv-caption-square" /> VISUAL CONCEITUAL
      </div>
      <div className="pv-coordinate">TERRITÓRIO → INTELIGÊNCIA</div>
    </div>
  );
}

function PlaySenacVisual() {
  return (
    <div className="pv-cover pv-cover--play" aria-hidden="true">
      <svg
        className="pv-art pv-court"
        viewBox="0 0 700 460"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-25 88 364-33M-7 171 570-10M-12 259 701 36M-20 351 720 121M-17 444 720 214M178 476 739 305"
          stroke="#eab699"
          strokeOpacity=".24"
        />
        <g transform="translate(49 128) rotate(-13 250 131)">
          <rect
            x="-7"
            y="16"
            width="508"
            height="269"
            rx="2"
            fill="#9c422b"
            opacity=".3"
          />
          <rect x="-12" y="-12" width="518" height="288" fill="#e7a47e" />
          <rect width="492" height="262" fill="#a7472e" />
          <rect
            x="16"
            y="16"
            width="460"
            height="230"
            stroke="#f8e8d5"
            strokeWidth="2.5"
          />
          <path d="M246 16V246" stroke="#f8e8d5" strokeWidth="2.5" />
          <circle cx="246" cy="131" r="39" stroke="#f8e8d5" strokeWidth="2.5" />
          <circle cx="246" cy="131" r="3" fill="#f8e8d5" />
          <path
            d="M16 65H91V197H16M476 65H401V197H476"
            stroke="#f8e8d5"
            strokeWidth="2.5"
          />
          <path
            d="M91 96a35 35 0 0 1 0 70M401 96a35 35 0 0 0 0 70"
            stroke="#f8e8d5"
            strokeWidth="2.5"
          />
          <path
            d="M16 39C179 39 179 223 16 223M476 39C313 39 313 223 476 223"
            stroke="#f8e8d5"
            strokeWidth="2.5"
          />
          <path d="M30 109v44M462 109v44" stroke="#f8e8d5" strokeWidth="3" />
          <circle cx="38" cy="131" r="6" stroke="#f8e8d5" strokeWidth="2" />
          <circle cx="454" cy="131" r="6" stroke="#f8e8d5" strokeWidth="2" />
          <path
            d="M153 16V246M339 16V246M16 48H476M16 214H476"
            stroke="#f8e8d5"
            strokeWidth="1.2"
            strokeOpacity=".4"
          />
        </g>

        <g transform="translate(177 297) rotate(-13)">
          <ellipse cy="16" rx="20" ry="6" fill="#783a28" opacity=".28" />
          <circle r="18" fill="#edbc77" />
          <path
            d="M-17-5C-5 2 7 1 17-6M-15 10C-3 5 9 5 16 9M-5-17C3-7 4 5-1 18M7-16C-2-7-7 5-6 16"
            stroke="#8f4d31"
            strokeWidth="1.3"
          />
        </g>
        <path
          d="m583 97 27-10-10 27M610 87l-38 38"
          stroke="#f8ead8"
          strokeWidth="2"
        />
      </svg>

      <div className="pv-brand pv-brand--play">
        <svg viewBox="0 0 28 28" fill="none">
          <path
            d="m6 4 19 10L6 24V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="m12 8-6 16M17 10 6 18"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
        <span>
          play<span className="pv-brand-senac">senac</span>
        </span>
      </div>

      <div className="pv-schedule">
        <div className="pv-schedule-top">
          <span>ESPORTE NO CAMPUS</span>
          <span className="pv-schedule-mark">↗</span>
        </div>
        <h3>
          Sua próxima
          <br />
          partida<span>.</span>
        </h3>
        <div className="pv-schedule-day">
          <span>QUADRA POLIESPORTIVA</span>
          <span>◷</span>
        </div>
        <div className="pv-time-row">
          <span>16:00</span>
          <span className="pv-time-line" />
          <span>17:00</span>
        </div>
        <div className="pv-time-row pv-time-row--featured">
          <span>17:00</span>
          <span className="pv-time-line" />
          <span>18:00</span>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="pv-time-row">
          <span>18:00</span>
          <span className="pv-time-line" />
          <span>19:00</span>
        </div>
        <div className="pv-schedule-note">
          <span className="pv-status-dot" /> MAIS JOGO. MENOS ESPERA.
        </div>
      </div>
      <div className="pv-caption pv-caption--play">
        <span className="pv-caption-square" /> VISUAL CONCEITUAL
      </div>
      <div className="pv-play-edition">ENCONTRE SEU JOGO.</div>
    </div>
  );
}

export function ProjectVisual({ project }: ProjectVisualProps) {
  if (project.preview) {
    return (
      <div className="pv-cover pv-cover--website" aria-hidden="true">
        <div className="pv-website-frame">
          <div className="pv-browser-bar">
            <span className="pv-browser-dots">
              <i />
              <i />
              <i />
            </span>
            <span>{new URL(project.demo).hostname}</span>
            <span>↗</span>
          </div>
          <img
            className="pv-website-image"
            src={project.preview.src}
            alt=""
            width={project.preview.width}
            height={project.preview.height}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="pv-caption pv-caption--website">
          <span className="pv-caption-square" /> INTERFACE PUBLICADA
        </div>
      </div>
    );
  }
  return project.id === "georisk" ? <GeoRiskVisual /> : <PlaySenacVisual />;
}
