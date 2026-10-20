import "./TrajectoryMark.css";

/** Original line drawing: a small trajectory, with a clear direction. */
export function TrajectoryMark() {
  return (
    <svg className="trajectory-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path className="trajectory-arc" pathLength="1" d="M3 19C4 6 14 3 21 9" />
      <path className="trajectory-arrow" d="m15 9 6 0 0-6" />
      <circle className="trajectory-origin" cx="3" cy="19" r="1.2" />
    </svg>
  );
}
