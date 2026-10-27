import { useEffect, useRef } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import type { Project } from "../data";
import { track } from "../analytics/client";
import { useTranslation } from "../i18n";
import { ProjectResult } from "./ProjectResult";
import "./ProjectDialog.css";

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
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
            <span className="eyebrow">{t("POR DENTRO DO PROJETO", "INSIDE THE PROJECT")}</span>
            <button
              autoFocus
              className="icon-button"
              onClick={onClose}
              aria-label={t("Fechar projeto", "Close project")}
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
            <p className="case-stage">{project.stage}</p>
            <div className="case-access">
              <h3>{t("Acesso ao projeto", "Explore the project")}</h3>
              {project.demoNotice && (
                <p className="case-access-summary">
                  {t("Explore os principais fluxos deste projeto em uma demonstração interativa.", "Explore this project's main workflows in an interactive demonstration.")}
                </p>
              )}
              <div className="case-links">
                <a
                  className="button button-blue"
                  href={project.demo}
                  aria-describedby={project.demoNotice ? "case-demo-notice" : undefined}
                  onClick={() => track({ name: "project_visit", params: { project_id: project.id, ui_location: "project_dialog" } })}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.demoNotice ? t("Explorar demonstração", "Explore demo") : t("Visitar site", "Visit website")} <ArrowUpRight size={18} />
                </a>
                {project.github && (
                  <div className="case-repositories">
                    {[
                      ...(project.frontendGithub ? [{ label: "Frontend", url: project.frontendGithub }] : []),
                      { label: project.frontendGithub ? "Backend" : t("Ver código", "View code"), url: project.github },
                    ].map((repository) => (
                      <a
                        key={repository.url}
                        className="text-link"
                        href={repository.url}
                        onClick={() => track({ name: "link_click", params: { link_id: "project_code", destination_id: "project_repository", project_id: project.id, ui_location: "project_dialog" } })}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github size={18} /> {repository.label} <ArrowUpRight size={16} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {project.demoNotice && <p id="case-demo-notice" className="case-demo-notice">{project.demoNotice}</p>}
            </div>
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
                <figcaption>{t("Captura da página publicada", "Screenshot of the published page")}</figcaption>
              </figure>
            )}
            <section>
              <h3>{t("O problema", "The problem")}</h3>
              <p>{project.problem}</p>
            </section>
            <section>
              <h3>{t("Minha contribuição", "My contribution")}</h3>
              <p>{project.approach}</p>
            </section>
            <section>
              <h3>{t("Decisões de engenharia", "Engineering decisions")}</h3>
              <ul>
                {project.decisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>{t("O resultado", "The outcome")}</h3>
              <ProjectResult project={project} />
              <p>{project.outcome}</p>
            </section>
          </div>
        </>
      )}
    </dialog>
  );
}
