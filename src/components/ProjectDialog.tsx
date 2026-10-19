import { useEffect, useRef } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import type { Project } from "../data";
import { track } from "../analytics/client";

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!project || !dialog.current) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    element.scrollTop = 0;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      element.close();
    };
  }, [project]);

  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      aria-labelledby="case-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <>
          <div className="case-top">
            <span className="eyebrow">POR DENTRO DO PROJETO</span>
            <button
              autoFocus
              className="icon-button"
              onClick={onClose}
              aria-label="Fechar projeto"
            >
              <X size={22} />
            </button>
          </div>
          <div className="case-content">
            <p className="case-category eyebrow">{project.eyebrow}</p>
            <h2 id="case-title">
              {project.name}
              <span aria-hidden="true">↗</span>
            </h2>
            <p className="case-lead">{project.title}</p>
            <div className="tags">
              {(project.technologies ?? project.tags).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {project.preview && (
              <figure className="case-preview">
                <img
                  src={project.preview.src}
                  alt={project.preview.alt}
                  width={project.preview.width}
                  height={project.preview.height}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>Captura da página publicada</figcaption>
              </figure>
            )}
            <section>
              <h3>O problema</h3>
              <p>{project.problem}</p>
            </section>
            <section>
              <h3>Minha contribuição</h3>
              <p>{project.approach}</p>
            </section>
            <section>
              <h3>Decisões de engenharia</h3>
              <ul>
                {project.decisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>O resultado</h3>
              <p>{project.outcome}</p>
            </section>
            <div className="case-links">
              <a
                className="button button-blue"
                href={project.demo}
                onClick={() => track({ name: "project_visit", params: { project_id: project.id, ui_location: "project_dialog" } })}
                target="_blank"
                rel="noreferrer"
              >
                Abrir projeto <ArrowUpRight size={18} />
              </a>
              {project.github && (
                <a
                  className="text-link"
                  href={project.github}
                  onClick={() => track({ name: "link_click", params: { link_id: "project_code", destination_id: "project_repository", project_id: project.id, ui_location: "project_dialog" } })}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} /> Ver código <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
