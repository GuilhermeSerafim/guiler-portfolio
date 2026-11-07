import { projects } from "../data";
import type { HealthTargets } from "./contract";

// Match health evidence only to the official destinations shown in the portfolio.
// The feed never supplies navigation URLs.
export const healthTargets: HealthTargets = {
  georisk: { url: projects.find(project => project.id === "georisk")!.demo, role: "original", coverage: "http-content" },
  "seven-tools": { url: projects.find(project => project.id === "seven-tools")!.demo, role: "original", coverage: "http-content" },
  playsenac: { url: projects.find(project => project.id === "playsenac")!.demo, role: "original", coverage: "http-content" },
  mesa: { url: projects.find(project => project.id === "mesa")!.demo, role: "original", coverage: "http-content" },
};

export const healthFeedUrl = import.meta.env.VITE_PROJECT_HEALTH_URL === undefined
  ? "https://guilhermeserafim.github.io/portfolio-health/status.json"
  : import.meta.env.VITE_PROJECT_HEALTH_URL.trim() || null;
