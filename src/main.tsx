import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "motion/react";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "@fontsource/ibm-plex-mono/latin-400.css";
import App from "./App";
import { OrbitCursor } from "./components/OrbitCursor";
import "./styles.css";
import { initializeAnalytics } from "./analytics/client";
import { publicConfig } from "./analytics/config";

initializeAnalytics(publicConfig);

// Local design comparison only; excluded from production by Vite.
const CursorPreview = import.meta.env.DEV && /^\/__preview\/cursor\/[abc]\/?$/.test(window.location.pathname)
  ? React.lazy(() => import("./preview/CursorPreview"))
  : null;

const TrophyPreview = import.meta.env.DEV && /^\/__preview\/trophy(?:\/[abc])?\/?$/.test(window.location.pathname)
  ? React.lazy(() => import("./preview/TrophyPreview"))
  : null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      {TrophyPreview ? (
        <React.Suspense fallback={null}>
          <TrophyPreview />
        </React.Suspense>
      ) : CursorPreview ? (
        <React.Suspense fallback={null}>
          <CursorPreview />
        </React.Suspense>
      ) : <><App /><OrbitCursor /></>}
    </MotionConfig>
  </React.StrictMode>,
);
