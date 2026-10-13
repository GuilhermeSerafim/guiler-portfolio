import "./SevenToolsVisual.css";

export function SevenToolsVisual() {
  return (
    <div className="pv-cover pv-cover--seven" aria-hidden="true">
      <div className="pv-seven-brand">
        <span>SEVEN</span>
        <span className="pv-seven-brand-tools">Tools<span>.</span></span>
      </div>
      <div className="pv-seven-edition">HUB DE<br />NEGÓCIOS</div>

      <div className="pv-seven-system">
        <svg
          className="pv-seven-connections"
          viewBox="0 0 100 100"
          fill="none"
          preserveAspectRatio="none"
        >
          <path className="pv-seven-guide" d="M0 59H100M63.5 0V100" />
          <path d="M34 40H43V59H50M83 30V34H63.5V37M44 85H47V74H50" />
          <g className="pv-seven-junctions">
            <circle cx="43" cy="59" r=".65" />
            <circle cx="63.5" cy="34" r=".65" />
            <circle cx="47" cy="74" r=".65" />
          </g>
        </svg>

        <div className="pv-seven-tool pv-seven-tool--proposals">
          <div className="pv-seven-tool-top">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M14 3H5v18h14V8l-5-5Z M14 3v5h5 M9 12h6 M9 16h4" />
            </svg>
            <span>01</span>
          </div>
          <span className="pv-seven-tool-label">Propostas</span>
        </div>

        <div className="pv-seven-tool pv-seven-tool--diagnosis">
          <div className="pv-seven-tool-top">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3 M22 12h-3 M12 22v-3 M2 12h3" />
            </svg>
            <span>02</span>
          </div>
          <span className="pv-seven-tool-label">Diagnóstico</span>
        </div>

        <div className="pv-seven-hub">
          <div className="pv-seven-hub-face">
            <span className="pv-seven-hub-title">HUB</span>
            <svg className="pv-seven-mark" viewBox="0 0 56 56" fill="none">
              <path d="M9 8h39v8L28 48H15l20-29H9V8Z" fill="currentColor" />
              <path d="M9 27h14" stroke="#ff8800" strokeWidth="4" />
            </svg>
            <span className="pv-seven-hub-foot">INTELIGÊNCIA APLICADA</span>
          </div>
        </div>

        <div className="pv-seven-tool pv-seven-tool--leads">
          <div className="pv-seven-tool-top">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="3" />
              <path d="M6 21v-3a6 6 0 0 1 12 0v3 M5 5a3 3 0 0 0 0 6 M19 5a3 3 0 0 1 0 6 M2 19v-2a5 5 0 0 1 3-4 M22 19v-2a5 5 0 0 0-3-4" />
            </svg>
            <span>03</span>
          </div>
          <span className="pv-seven-tool-label">Leads</span>
        </div>
      </div>

      <div className="pv-caption pv-caption--seven">
        <span className="pv-caption-square" /> VISUAL CONCEITUAL
      </div>
    </div>
  );
}
