import { CursorLayer } from "./CursorLayer";
import "./OrbitCursor.css";

/** Approved orbit: subtle ring, with a plus only on project covers. */
export function OrbitCursor() {
  return (
    <CursorLayer variant="a">
      <span className="portfolio-cursor-ring" />
      <span className="portfolio-cursor-plus" />
    </CursorLayer>
  );
}
