import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/latin-400.css";
import App from "./App";
import "./styles.css";
import { initializeAnalytics } from "./analytics/client";
import { publicConfig } from "./analytics/config";

initializeAnalytics(publicConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);

// Temporary local comparison routes. Vite excludes this module from production.
if (import.meta.env.DEV && /^\/__preview\/maca(?:\/|$)/.test(location.pathname)) {
  void import("./preview/ApplePlacementPreview").then(({ mountApplePreview }) => mountApplePreview());
}
