import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Github,
  Linkedin,
  Menu,
  Plus,
  Trophy,
  X,
} from "lucide-react";
import { getProjects, getExperience, type Project } from "./data";
import { Magnetic, Reveal, TiltedPortrait } from "./components/Interactions";
import { ProjectVisual } from "./components/ProjectVisual";
import { ProjectDialog } from "./components/ProjectDialog";
import { MeteorField } from "./components/MeteorField";
import { EntryStroke, useHeroEntry } from "./components/HeroEntry";
import { CuriositySketch } from "./components/CuriositySketch";
import { TechnologyCatalog } from "./components/TechnologyCatalog";
import { TechText } from "./components/TechText";
import { TrajectoryMark } from "./components/TrajectoryMark";
import { AnalyticsPreferences } from "./components/AnalyticsPreferences";
import { ResumeDownloadLink } from "./components/ResumeDownloadLink";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { PhotoDepth } from "./components/photos/PhotoDepth";
import { TrophyCelebrate } from "./components/TrophyCelebrate";
import GlobeStory from "./components/globe-story/GlobeStory";
import { track } from "./analytics/client";
import type { ProjectOpenLocation } from "./analytics/events";
import { useTranslation } from "./i18n";

const email = "guilerstudies@gmail.com";
const filters = [
  "Todos",
  "IA aplicada",
  "Produto web",
  "Landing page",
] as const;
type Filter = (typeof filters)[number];

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M50 4v92M4 50h92M17.5 17.5l65 65M17.5 82.5l65-65"
        stroke="currentColor"
        strokeWidth="15"
      />
    </svg>
  );
}

function ExpertiseStrip() {
  const { t } = useTranslation();
  const specialties = t(
    ["Full Stack", "Arquitetura", "IA aplicada", "Produto"],
    ["Full Stack", "Architecture", "Applied AI", "Product"],
  );

  return (
    <section className="expertise-strip" aria-label={t("Especialidades", "Specialties")}>
      <div className="expertise-window">
        <div className="expertise-track">
          {[0, 1].map((copy) => (
            <ul
              className="expertise-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {specialties.map((specialty) => (
                <li className="expertise-item" key={specialty}>
                  <span>{specialty}</span>
                  <Asterisk />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function App({ globeSwarm = true }: { globeSwarm?: boolean }) {
  const { t, locale } = useTranslation();
  const projects = getProjects(locale);
  const experience = getExperience(locale);
  const hackathonProject = projects.find(project => project.id === "georisk");
  const filterLabels: Record<Filter, string> = {
    "Todos": t("Todos", "All"),
    "IA aplicada": t("IA aplicada", "Applied AI"),
    "Produto web": t("Produto web", "Web product"),
    "Landing page": "Landing page",
  };
  const { heroRef, entry } = useHeroEntry();
  const [showMeteorField] = useState(
    () => new URLSearchParams(window.location.search).get("visual") !== "original",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const [filter, setFilter] = useState<Filter>("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation?.type === "back_forward") return;

    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;

    let cancelled = false;
    let frame = 0;
    const events = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
    const cancel = () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      events.forEach((event) => window.removeEventListener(event, cancel));
    };
    events.forEach((event) =>
      window.addEventListener(event, cancel, { passive: true }),
    );

    // Native fragment navigation can run before React mounts the section.
    // Wait for fonts to settle its position, without overriding user input.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = window.requestAnimationFrame(() => {
        if (!cancelled && window.location.hash === hash) {
          target.scrollIntoView({ behavior: "instant", block: "start" });
        }
        cancel();
      });
    });

    return cancel;
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggle.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 4500);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  function openProject(project: Project, uiLocation: ProjectOpenLocation) {
    track({ name: "project_open", params: { project_id: project.id, ui_location: uiLocation } });
    setSelectedProject(project);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      track({ name: "contact_intent", params: { contact_method: "email_copy", ui_location: "contact_copy" } });
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  const visibleProjects = projects.filter(
    (project) => filter === "Todos" || project.category === filter,
  );

  return (
    <>
      <a href="#conteudo" className="skip-link">
        {t("Pular para o conteúdo", "Skip to content")}
      </a>
      {!reducedMotion && (
        <motion.div
          className="scroll-progress"
          style={{ scaleX }}
          aria-hidden="true"
        />
      )}
      <header className="site-header container">
        <a className="wordmark" href="#inicio" aria-label={t("Guiler, início", "Guiler, home")}>
          guiler<span>.</span>
        </a>
        <span className="header-note eyebrow">{t("DESENVOLVEDOR FULL STACK", "FULL STACK DEVELOPER")}</span>
        <nav className="desktop-nav" aria-label={t("Navegação principal", "Main navigation")}>
          <a href="#projetos">{t("Projetos", "Projects")}</a>
          <a href="#trajetoria">{t("Trajetória", "Experience")}</a>
          <a href="#sobre">{t("Sobre", "About")}</a>
        </nav>
        <a className="header-contact" href="#contato">
          {t("Vamos conversar", "Let's talk")} <ArrowUpRight size={17} />
        </a>
        <LanguageSwitcher />
        <button
          ref={menuToggle}
          className="menu-toggle icon-button"
          aria-label={menuOpen ? t("Fechar menu", "Close menu") : t("Abrir menu", "Open menu")}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label={t("Navegação móvel", "Mobile navigation")}
          >
            {[
              [t("Projetos", "Projects"), "#projetos"],
              [t("Trajetória", "Experience"), "#trajetoria"],
              [t("Sobre", "About"), "#sobre"],
              [t("Contato", "Contact"), "#contato"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={20} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="conteudo">
        <section
          ref={heroRef}
          id="inicio"
          className="hero hero-entry container"
          data-entry={entry}
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <div>
              <p className="eyebrow hero-eyebrow">
                <span className="status-dot" /> GUILHERME SERAFIM · SÃO PAULO,
                BR
              </p>
            </div>
            <div>
              <h1 id="hero-title">
                <span className="entry-title-line">{t("Código que", "Code that")}</span>
                <br />
                <span className="entry-title-line">
                  {t("vira", "drives")}{" "}
                  <span className="impact-word">
                    {t("impacto", "impact")}
                    <svg
                      viewBox="0 0 440 24"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className="impact-stroke"
                        pathLength="1"
                        d="M4 16Q180 0 433 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        className="impact-stroke-echo"
                        pathLength="1"
                        d="M30 22Q220 10 407 16"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                    </svg>
                  </span>
                  <span className="hero-period">.</span>
                </span>
              </h1>
            </div>
            <div>
              <div className="hero-intro">
                <span className="intro-mark" aria-hidden="true">
                  ↳
                </span>
                <p>
                  {t(
                    <>Sou Guiler, desenvolvedor <strong>Full Stack</strong>.</>,
                    <>I'm Guiler, a <strong>Full Stack</strong> developer.</>,
                  )}<br />
                  {t(
                    "Construo interfaces, APIs e produtos com IA, com experiência em seguros, serviços públicos e ferramentas comerciais.",
                    "I build interfaces, APIs and AI-powered products, with experience in insurance, public services and business tools.",
                  )}
                </p>
              </div>
            </div>
            <div>
              <div className="hero-actions">
                <Magnetic>
                  <a className="button button-blue button-trajectory" href="#projetos">
                    {t("Explorar projetos", "Explore projects")} <TrajectoryMark />
                  </a>
                </Magnetic>
                <ResumeDownloadLink location="hero" />
              </div>
            </div>
            <div>
              <div className="hero-proof">
                <div className="proof-icon">
                  <TrophyCelebrate />
                </div>
                <div className="hero-proof-copy">
                  {hackathonProject ? (
                    <button
                      type="button"
                      className="hero-award-link"
                      aria-label={t("Conhecer o GeoRisk, vencedor do Hackathon OpenAI", "Explore GeoRisk, winner of the OpenAI Hackathon")}
                      onClick={() => openProject(hackathonProject, "hero_award")}
                    >
                      <span>{t("Ideias testadas. Trabalho reconhecido.", "Ideas tested. Work recognized.")}</span>
                      <strong>
                        {t("Vencedor do Hackathon OpenAI", "OpenAI Hackathon winner")} <ArrowUpRight size={13} aria-hidden="true" />
                      </strong>
                    </button>
                  ) : (
                    <>
                      <span>{t("Ideias testadas. Trabalho reconhecido.", "Ideas tested. Work recognized.")}</span>
                      <strong>{t("Vencedor do Hackathon OpenAI", "OpenAI Hackathon winner")}</strong>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <EntryStroke />
            <div className="portrait-topline eyebrow">
              <span>{t("UM BUILDER, DE PONTA A PONTA.", "A BUILDER, FROM START TO FINISH.")}</span>
              <Plus size={14} />
            </div>
            <TiltedPortrait
              src="/images/portrait.webp"
              alt={t("Guilherme Serafim, desenvolvedor Full Stack, de camiseta preta e braços cruzados", "Guilherme Serafim, Full Stack developer, wearing a black T-shirt with his arms crossed")}
            >
              <div className="portrait-caption">
                <span>
                  Guilherme
                  <br />
                  <strong>Serafim.</strong>
                </span>
                <ArrowUpRight size={32} strokeWidth={1.3} />
              </div>
            </TiltedPortrait>
            <div className="builder-seal" aria-label={t("Da ideia ao deploy", "From idea to deployment")}>
              <Code2 size={32} strokeWidth={1.5} />
              <span>
                {t("DA IDEIA", "FROM IDEA")}
                <br />
                {t("AO DEPLOY", "TO DEPLOY")}
              </span>
            </div>
            <div className="portrait-bottomline eyebrow">
              <span>SOFTWARE ENGINEER</span>
              <span>23°33′ S / 46°38′ W</span>
            </div>
          </div>
          <div className="hero-bottom eyebrow">
            <span>{t("BOAS IDEIAS MERECEM SAIR DO PAPEL.", "GOOD IDEAS DESERVE TO COME TO LIFE.")}</span>
            <a href="#projetos">
              {t("ROLE PARA EXPLORAR", "SCROLL TO EXPLORE")} <ArrowDown size={14} />
            </a>
          </div>
        </section>

        <ExpertiseStrip />

        <section
          id="projetos"
          className="work-section container section-space"
          aria-labelledby="work-title"
        >
          <CuriositySketch subject="cosmos" />
          <div className="section-top">
            <span className="eyebrow">{t("01 / TRABALHOS SELECIONADOS", "01 / SELECTED WORK")}</span>
            <span className="eyebrow muted">{t("IDEIA → CÓDIGO → PRODUTO", "IDEA → CODE → PRODUCT")}</span>
          </div>
          <div className="section-heading">
            <h2 id="work-title">
              <TechText>{t("Construir.", "Build.")}</TechText>
              <br />
              <span className="muted">{t("Fazer acontecer.", "Make it happen.")}</span>
            </h2>
            <div className="work-heading-side">
              <p>
                {t("Problemas diferentes.", "Different challenges.")} <br />{t("O mesmo cuidado em cada entrega.", "The same care in every delivery.")}
              </p>
              <div
                className="project-filters"
                role="group"
                aria-label={t("Filtrar projetos", "Filter projects")}
              >
                {filters.map((item) => (
                  <button
                    key={item}
                    className={filter === item ? "active" : ""}
                    aria-pressed={filter === item}
                    onClick={() => setFilter(item)}
                  >
                    {filterLabels[item]}
                    {item === "Todos" && (
                      <span>{String(projects.length).padStart(2, "0")}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div
            className={`project-grid ${visibleProjects.length === 1 ? "single-project" : ""}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  layout={!reducedMotion}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.25 }}
                  className={`project-card project-${project.id} ${
                    visibleProjects.length > 1 &&
                    visibleProjects.length % 2 !== 0 &&
                    index === visibleProjects.length - 1
                      ? "project-card--wide"
                      : ""
                  }`}
                >
                  <button
                    className="project-cover"
                    onClick={() => openProject(project, "project_cover")}
                    aria-label={t(`Conhecer o projeto ${project.name}`, `Explore the ${project.name} project`)}
                    onPointerEnter={(event) => {
                      if (reducedMotion || event.pointerType !== "mouse")
                        return;
                      const rect = event.currentTarget.getBoundingClientRect();
                      const x = (event.clientX - rect.left) / rect.width - 0.5;
                      const y = (event.clientY - rect.top) / rect.height - 0.5;
                      const horizontal = Math.abs(x) > Math.abs(y);
                      event.currentTarget.style.setProperty(
                        "--cover-x",
                        horizontal ? `${Math.sign(x) * -6}px` : "0px",
                      );
                      event.currentTarget.style.setProperty(
                        "--cover-y",
                        horizontal ? "0px" : `${Math.sign(y) * -6}px`,
                      );
                    }}
                    onPointerLeave={(event) => {
                      event.currentTarget.style.setProperty("--cover-x", "0px");
                      event.currentTarget.style.setProperty("--cover-y", "0px");
                    }}
                  >
                    <ProjectVisual project={project} />
                    <span className="project-cover-action">
                      <ArrowUpRight size={23} />
                    </span>
                  </button>
                  <div className="project-information">
                    <div className="project-meta">
                      <span className="eyebrow">{project.eyebrow}</span>
                      {project.id === "georisk" ? (
                        <span className="project-recognition">
                          <Trophy size={11} /> {t("HACKATHON OPENAI", "OPENAI HACKATHON")}
                        </span>
                      ) : (
                        <span className="eyebrow muted">
                          {String(
                            projects.findIndex(
                              (item) => item.id === project.id,
                            ) + 1,
                          ).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <div className="project-title-row">
                      <h3>
                        <button onClick={() => openProject(project, "project_title")}>
                          {project.name}
                        </button>
                      </h3>
                      <button
                        className="project-details"
                        onClick={() => openProject(project, "project_details")}
                        aria-label={t(`Ver detalhes de ${project.name}`, `View details of ${project.name}`)}
                      >
                        <ArrowUpRight size={25} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-bottom">
                      <div className="tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          <div className="work-footer work-footer--with-newton">
            <p>{t("Outras ideias, experimentos e código aberto.", "More ideas, experiments and open-source code.")}</p>
            <CuriositySketch subject="newton" />
            <a
              className="text-link"
              href="https://github.com/GuilhermeSerafim"
              onClick={() => track({ name: "link_click", params: { link_id: "github", destination_id: "github_profile", ui_location: "projects_footer" } })}
              target="_blank"
              rel="noreferrer"
            >
              {t("Explore meu GitHub", "Explore my GitHub")} <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <section
          id="trajetoria"
          className="experience-section"
          aria-labelledby="experience-title"
        >
          <div className="container section-space">
            <div className="section-top">
              <span className="eyebrow">{t("02 / EXPERIÊNCIA EM PRODUÇÃO", "02 / PRODUCTION EXPERIENCE")}</span>
              <span className="experience-status eyebrow">
                <span className="status-dot" /> {t("SISTEMAS REAIS. RESPONSABILIDADE REAL.", "REAL SYSTEMS. REAL RESPONSIBILITY.")}
              </span>
            </div>
            <div className="experience-layout">
              <div className="experience-intro">
                <Reveal>
                  <h2 id="experience-title">
                    {t("Onde o código", "Where code")}
                    <br />
                    {t("encontra o", "meets the")} <br />
                    <span>{t("mundo real.", "real world.")}</span>
                  </h2>
                  <p>
                    {t(
                      "Da cobrança de seguros ao atendimento público. Engenharia para operações que precisam funcionar.",
                      "From insurance billing to public services. Engineering for operations that need to work.",
                    )}
                  </p>
                  <CuriositySketch subject="tesla" />
                </Reveal>
              </div>
              <div className="timeline">
                {experience.map((job) => (
                  <Reveal key={job.company}>
                    <article className="experience-item">
                      <div className="experience-date eyebrow">
                        <span>{job.period}</span>
                        <span>{job.field}</span>
                      </div>
                      <div className="experience-company">
                        <h3>{job.company}</h3>
                        <ArrowUpRight size={27} aria-hidden="true" />
                      </div>
                      <p className="experience-role">{job.role}</p>
                      <p className="experience-description">
                        {job.description}
                      </p>
                      <ul>
                        {job.contributions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="eyebrow experience-stack">{job.stack}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <GlobeStory swarm={globeSwarm} />

        <section
          id="sobre"
          className="about-section container section-space"
          aria-labelledby="about-title"
        >
          <div className="section-top">
            <span className="eyebrow">{t("03 / ALÉM DO EDITOR", "03 / BEYOND THE EDITOR")}</span>
            <span className="eyebrow muted">{t("PESSOAS ANTES DE PIXELS.", "PEOPLE BEFORE PIXELS.")}</span>
          </div>
          <div className="about-layout">
            <Reveal className="about-photos">
              <PhotoDepth />
              <CuriositySketch subject="davinci" />
            </Reveal>
            <Reveal className="about-copy">
              <h2 id="about-title">
                {t("Curioso por natureza.", "Curious by nature.")}
                <br />
                <span className="muted"><TechText>Builder</TechText> {t("por escolha.", "by choice.")}</span>
              </h2>
              <p>
                {t("Sou Guilherme Serafim. Pode me chamar de", "I'm Guilherme Serafim. You can call me")} <strong>Guiler</strong>
                .
              </p>
              <p>
                {t(
                  "Gosto de entender o problema antes de abrir o editor. De questionar a arquitetura, encontrar o gargalo e cuidar da experiência de quem está do outro lado da tela.",
                  "I like to understand the problem before opening the editor. I question the architecture, find bottlenecks and focus on the experience of the person on the other side of the screen.",
                )}
              </p>
              <p>
                {t(
                  "Hoje, meu foco está em conectar engenharia de software e IA aplicada. Construo, experimento e compartilho o que aprendo pelo caminho.",
                  "Today, I focus on connecting software engineering with applied AI. I build, experiment and share what I learn along the way.",
                )}
              </p>
              <a
                href="https://www.linkedin.com/in/guiserafim/"
                onClick={() => track({ name: "link_click", params: { link_id: "linkedin", destination_id: "linkedin_profile", ui_location: "about" } })}
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                {t("Me acompanhe no LinkedIn", "Follow me on LinkedIn")} <ArrowUpRight size={18} />
              </a>
            </Reveal>
          </div>
          <TechnologyCatalog />
        </section>

        <section
          id="contato"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="section-top">
              <span className="eyebrow">{t("04 / A PRÓXIMA CONVERSA", "04 / THE NEXT CONVERSATION")}</span>
              <span className="eyebrow">{t("SÃO PAULO, BRASIL ↗ MUNDO", "SÃO PAULO, BRAZIL ↗ WORLD")}</span>
            </div>
            <Reveal>
              <div className="contact-heading">
                <h2 id="contact-title">
                  {t("Tem um desafio?", "Have a challenge?")}
                  <br />
                  <span>{t("Vamos", "Let's")} <TechText>{t("construir.", "build.")}</TechText></span>
                </h2>
                <Magnetic className="contact-arrow-wrap">
                  <a
                    className="contact-arrow"
                    href={`mailto:${email}`}
                    onClick={() => track({ name: "contact_intent", params: { contact_method: "email_open", ui_location: "contact_arrow" } })}
                    aria-label={t("Enviar um e-mail para Guilherme", "Send Guilherme an email")}
                  >
                    <ArrowUpRight strokeWidth={1} />
                  </a>
                </Magnetic>
              </div>
            </Reveal>
            <div className="contact-bottom">
              <div>
                <p>
                  {t("Um produto, um sistema complexo ou uma boa ideia.", "A product, a complex system or a good idea.")}
                  <br />
                  {t("Quero ouvir o que você está construindo.", "I'd love to hear what you're building.")}
                </p>
                <div className="email-row">
                  <a href={`mailto:${email}`} onClick={() => track({ name: "contact_intent", params: { contact_method: "email_open", ui_location: "contact_email" } })}>{email}</a>
                  <button
                    className="copy-button"
                    onClick={copyEmail}
                    aria-label={
                      copyStatus === "copied"
                        ? t("E-mail copiado", "Email copied")
                        : t("Copiar e-mail", "Copy email")
                    }
                  >
                    {copyStatus === "copied" ? (
                      <Check size={19} />
                    ) : (
                      <Copy size={19} />
                    )}
                  </button>
                </div>
                <p className="copy-status" role="status">
                  {copyStatus === "copied"
                    ? t("E-mail copiado!", "Email copied!")
                    : copyStatus === "error"
                      ? t("Selecione o endereço para copiar ou clique para enviar um e-mail.", "Select the address to copy it, or click to send an email.")
                      : "\u00a0"}
                </p>
              </div>
              <div className="contact-socials">
                <a
                  href="https://github.com/GuilhermeSerafim"
                  onClick={() => track({ name: "link_click", params: { link_id: "github", destination_id: "github_profile", ui_location: "contact" } })}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={17} /> GitHub <ArrowUpRight size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/guiserafim/"
                  onClick={() => track({ name: "link_click", params: { link_id: "linkedin", destination_id: "linkedin_profile", ui_location: "contact" } })}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={17} /> LinkedIn <ArrowUpRight size={16} />
                </a>
                <ResumeDownloadLink location="contact" />
              </div>
            </div>
            <footer className="site-footer">
              {showMeteorField && <MeteorField />}
              <a className="wordmark" href="#inicio">
                guiler.
              </a>
              <span className="eyebrow">
                © {new Date().getFullYear()} GUILHERME SERAFIM
              </span>
              <a className="eyebrow" href="#inicio">
                {t("DE VOLTA AO TOPO", "BACK TO TOP")} <ArrowRight size={15} className="up-arrow" />
              </a>
            </footer>
            <AnalyticsPreferences />
          </div>
        </section>
      </main>
      <ProjectDialog
        project={selectedProject ? projects.find(project => project.id === selectedProject.id) ?? selectedProject : null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default App;
