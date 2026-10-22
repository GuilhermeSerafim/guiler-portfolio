import type { Project } from "../data";
import "./ProjectResult.css";

/** A result keeps its unit and comparison beside the number. */
export function ProjectResult({ project }: { project: Project }) {
  const result = project.resultHighlight;
  if (!result) return null;

  return (
    <div className="project-result">
      <strong className="project-result-value">{result.value}</strong>
      <div className="project-result-description">
        <span className="project-result-label">{result.label}</span>
        <span className="project-result-context">{result.context}</span>
      </div>
    </div>
  );
}
