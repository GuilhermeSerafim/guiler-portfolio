import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { track } from "../analytics/client";
import "./ResumeDownloadLink.css";

export function ResumeDownloadLink({ location }: { location: "hero" | "contact" }) {
  const [requested, setRequested] = useState(false);
  const [pulse, setPulse] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();
  const label = location === "hero" ? "Baixar currículo" : "Currículo";

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleClick = () => {
    track({ name: "resume_download", params: { asset_id: "resume_fullstack", ui_location: location } });
    clearTimeout(resetTimer.current);
    setRequested(true);
    setPulse(value => value + 1);
    resetTimer.current = setTimeout(() => setRequested(false), 2000);
    // Keep the native anchor action: no fetch, delay or claim of completion.
  };

  const icon = <svg className="resume-download-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <g key={pulse} className={requested ? "resume-download-arrow resume-download-arrow--requested" : "resume-download-arrow"}>
      <path d="m7 10 5 5 5-5M12 15V3" />
    </g>
  </svg>;

  return <>
    <a
      className={`resume-download${location === "hero" ? " resume-link" : ""}`}
      href="/GuilhermeSerafim_Fullstack.pdf"
      download="Guilherme_Serafim_Fullstack.pdf"
      aria-label={requested ? "Download solicitado. Baixar currículo novamente" : "Baixar currículo"}
      data-feedback-state={requested ? "requested" : "idle"}
      data-resume-location={location}
      onClick={handleClick}
    >
      {location === "contact" && icon}
      <span className="resume-download-label" aria-hidden="true">
        <span className="resume-download-label-default">{label}</span>
        <span className="resume-download-label-requested">Download solicitado</span>
      </span>
      {location === "hero" ? icon : <ArrowDown size={16} aria-hidden="true" />}
    </a>
    <span className="resume-feedback-sr" role="status" aria-atomic="true">{requested ? "Download do currículo solicitado." : ""}</span>
  </>;
}
