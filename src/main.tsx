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

// Temporary local comparison; Vite removes this branch from production builds.
const TechnologyPreview = import.meta.env.DEV && /^\/__preview\/tecnologias\/[abc]\/?$/.test(window.location.pathname)
  ? React.lazy(() => import("./preview/TechnologyPreview"))
  : null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      {TechnologyPreview ? (
        <React.Suspense fallback={null}>
          <TechnologyPreview />
        </React.Suspense>
      ) : <App />}
    </MotionConfig>
  </React.StrictMode>,
);
