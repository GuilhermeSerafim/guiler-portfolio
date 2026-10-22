import { CursorLayer } from "../components/CursorLayer";
import { OrbitCursor } from "../components/OrbitCursor";
import "./PortfolioCursor.css";

/** Alternatives stay in the DEV comparator; A uses the public implementation. */
export function PortfolioCursor({ variant }: { variant: "a" | "b" | "c" }) {
  if (variant === "a") return <OrbitCursor />;

  return (
    <CursorLayer variant={variant}>
      <span className="portfolio-cursor-reticle"><i /><i /><i /><i /></span>
      <span className="portfolio-cursor-label">Ver projeto <span>↗</span></span>
    </CursorLayer>
  );
}
