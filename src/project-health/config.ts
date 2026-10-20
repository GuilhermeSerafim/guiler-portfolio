import { projects } from "../data";
import type { HealthTargets } from "./contract";

// Only destinations confirmed by the demo release owner are monitored.
// The feed never supplies navigation URLs.
export const healthTargets: HealthTargets = {
  georisk: { url: projects.find(project => project.id === "georisk")!.demo, role: "demo", coverage: "http-content" },
  mesa: { url: projects.find(project => project.id === "mesa")!.demo, role: "original", coverage: "http-content" },
};

export const healthFeedUrl = import.meta.env.VITE_PROJECT_HEALTH_URL === undefined
  ? "https://guilhermeserafim.github.io/portfolio-health/status.json"
  : import.meta.env.VITE_PROJECT_HEALTH_URL.trim() || null;
