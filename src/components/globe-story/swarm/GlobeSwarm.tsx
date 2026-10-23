import { useEffect, useState } from "react";
import SubtleSwarm from "./SubtleSwarm";

/** The approved B variant loads only for a mouse while the globe section is active. */
export default function GlobeSwarm({ stage }: { stage: HTMLElement }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.globeSwarmActive = String(active);
    return () => { delete document.documentElement.dataset.globeSwarmActive; };
  }, [active]);

  return <div className="globe-swarm" aria-hidden="true">
    <SubtleSwarm stage={stage} enabled onActiveChange={setActive} />
  </div>;
}
