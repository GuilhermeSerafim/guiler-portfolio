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

const PhotosPreview = import.meta.env.DEV && /^\/__preview\/photos(?:\/[abc])?\/?$/.test(window.location.pathname)
  ? React.lazy(() => import("./preview/PhotosPreview"))
  : null;

const ScrollExpandPreview = import.meta.env.DEV && /^\/__preview\/scroll-expand(?:\/[ab])?\/?$/.test(window.location.pathname)
  ? React.lazy(() => import("./preview/ScrollExpandPreview"))
  : null;

const ScrollJourneyPreview = import.meta.env.DEV && /^\/__preview\/(?:scroll-journey|globe-story)\/?$/.test(window.location.pathname)
  ? React.lazy(() => import("./preview/ScrollJourneyPreview"))
  : null;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      {ScrollJourneyPreview ? (
        <React.Suspense fallback={null}>
          <ScrollJourneyPreview />
        </React.Suspense>
      ) : ScrollExpandPreview ? (
        <React.Suspense fallback={null}>
          <ScrollExpandPreview />
        </React.Suspense>
      ) : PhotosPreview ? (
        <React.Suspense fallback={null}>
          <PhotosPreview />
        </React.Suspense>
      ) : TrophyPreview ? (
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
