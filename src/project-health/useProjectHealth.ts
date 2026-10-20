import { useEffect, useState } from "react";
import { projectHealthViews } from "./contract";
import { healthFeedUrl, healthTargets } from "./config";
import { startProjectHealthMonitor } from "./monitor";

export function useProjectHealth() {
  const [views, setViews] = useState(() => projectHealthViews(null, healthTargets));
  useEffect(() => startProjectHealthMonitor({
    url: healthFeedUrl,
    targets: healthTargets,
    onChange: setViews,
  }), []);
  return views;
}
