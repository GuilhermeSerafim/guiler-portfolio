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
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  Github,
  Linkedin,
  Menu,
  Plus,
  Trophy,
  X,
} from "lucide-react";
import { projects, experience, type Project } from "./data";
import { Magnetic, Reveal, TiltedPortrait } from "./components/Interactions";
import { ProjectVisual } from "./components/ProjectVisual";
import { ProjectDialog } from "./components/ProjectDialog";

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
  const specialties = ["Full Stack", "Arquitetura", "IA aplicada", "Produto"];

  return (
    <section className="expertise-strip" aria-label="Especialidades">
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

function App() {
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

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
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
        Pular para o conteúdo
      </a>
      {!reducedMotion && (
        <motion.div
          className="scroll-progress"
          style={{ scaleX }}
          aria-hidden="true"
        />
      )}
      <header className="site-header container">
        <a className="wordmark" href="#inicio" aria-label="Guiler, início">
          guiler<span>.</span>
        </a>
        <span className="header-note eyebrow">DESENVOLVEDOR FULL STACK</span>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#projetos">Projetos</a>
          <a href="#trajetoria">Trajetória</a>
          <a href="#sobre">Sobre</a>
        </nav>
        <a className="header-contact" href="#contato">
          Vamos conversar <ArrowUpRight size={17} />
        </a>
        <button
          ref={menuToggle}
          className="menu-toggle icon-button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
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
            aria-label="Navegação móvel"
          >
            {[
              ["Projetos", "#projetos"],
              ["Trajetória", "#trajetoria"],
              ["Sobre", "#sobre"],
              ["Contato", "#contato"],
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
          id="inicio"
          className="hero container"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow hero-eyebrow">
                <span className="status-dot" /> GUILHERME SERAFIM · SÃO PAULO,
                BR
              </p>
            </Reveal>
            <Reveal delay={0.07}>
              <h1 id="hero-title">
                Código que
                <br />
                vira{" "}
                <span className="impact-word">
                  impacto
                  <svg
                    viewBox="0 0 440 24"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 16Q180 0 433 10M30 22Q220 10 407 16"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="hero-period">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="hero-intro">
                <span className="intro-mark" aria-hidden="true">
                  ↳
                </span>
                <p>
                  Sou Guiler, desenvolvedor <strong>Full Stack</strong>.<br />
                  Conecto arquitetura, interfaces e IA para transformar
                  problemas reais em software que faz diferença.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.21}>
              <div className="hero-actions">
                <Magnetic>
                  <a className="button button-blue" href="#projetos">
                    Explorar projetos <ArrowDownRight size={20} />
                  </a>
                </Magnetic>
                <a
                  className="resume-link"
                  href="/GuilhermeSerafim_Fullstack.pdf"
                  download
                >
                  Baixar currículo <Download size={17} />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="hero-proof">
                <div className="proof-icon">
                  <Trophy size={19} strokeWidth={1.6} />
                </div>
                <div>
                  <span>Ideias testadas. Trabalho reconhecido.</span>
                  <strong>
                    Vencedor do Hackathon OpenAI <ArrowUpRight size={13} />
                  </strong>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="hero-visual" delay={0.15}>
            <div className="portrait-topline eyebrow">
              <span>UM BUILDER, DE PONTA A PONTA.</span>
              <Plus size={14} />
            </div>
            <TiltedPortrait
              src="/images/portrait.webp"
              alt="Guilherme Serafim, desenvolvedor Full Stack, de camiseta preta e braços cruzados"
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
            <div className="builder-seal" aria-label="Da ideia ao deploy">
              <Code2 size={32} strokeWidth={1.5} />
              <span>
                DA IDEIA
                <br />
                AO DEPLOY
              </span>
            </div>
            <div className="portrait-bottomline eyebrow">
              <span>SOFTWARE ENGINEER</span>
              <span>23°33′ S / 46°38′ W</span>
            </div>
          </Reveal>
          <div className="hero-bottom eyebrow">
            <span>BOAS IDEIAS MERECEM SAIR DO PAPEL.</span>
            <a href="#projetos">
              ROLE PARA EXPLORAR <ArrowDown size={14} />
            </a>
          </div>
        </section>

        <ExpertiseStrip />

        <section
          id="projetos"
          className="work-section container section-space"
          aria-labelledby="work-title"
        >
          <div className="section-top">
            <span className="eyebrow">01 / TRABALHOS SELECIONADOS</span>
            <span className="eyebrow muted">IDEIA → CÓDIGO → PRODUTO</span>
          </div>
          <div className="section-heading">
            <h2 id="work-title">
              Construir.
              <br />
              <span className="muted">Fazer acontecer.</span>
            </h2>
            <div className="work-heading-side">
              <p>
                Problemas diferentes. <br />O mesmo cuidado em cada entrega.
              </p>
              <div
                className="project-filters"
                role="group"
                aria-label="Filtrar projetos"
              >
                {filters.map((item) => (
                  <button
                    key={item}
                    className={filter === item ? "active" : ""}
                    aria-pressed={filter === item}
                    onClick={() => setFilter(item)}
                  >
                    {item}
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
              {visibleProjects.map((project) => (
                <motion.article
                  key={project.id}
                  layout={!reducedMotion}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.25 }}
                  className={`project-card project-${project.id} ${project.id === "mesa" && visibleProjects.length > 1 ? "project-card--wide" : ""}`}
                >
                  <button
                    className="project-cover"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`Conhecer o projeto ${project.name}`}
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
                          <Trophy size={11} /> HACKATHON OPENAI
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
                        <button onClick={() => setSelectedProject(project)}>
                          {project.name}
                        </button>
                      </h3>
                      <button
                        className="project-details"
                        onClick={() => setSelectedProject(project)}
                        aria-label={`Ver detalhes de ${project.name}`}
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
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="project-code"
                          aria-label={`Código de ${project.name} no GitHub`}
                        >
                          <Github size={17} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          <div className="work-footer">
            <p>Outras ideias, experimentos e código aberto.</p>
            <a
              className="text-link"
              href="https://github.com/GuilhermeSerafim"
              target="_blank"
              rel="noreferrer"
            >
              Explore meu GitHub <ArrowUpRight size={18} />
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
              <span className="eyebrow">02 / EXPERIÊNCIA EM PRODUÇÃO</span>
              <span className="experience-status eyebrow">
                <span className="status-dot" /> SISTEMAS REAIS. RESPONSABILIDADE
                REAL.
              </span>
            </div>
            <div className="experience-layout">
              <div className="experience-intro">
                <Reveal>
                  <h2 id="experience-title">
                    Onde o código
                    <br />
                    encontra o <br />
                    <span>mundo real.</span>
                  </h2>
                  <p>
                    Da cobrança de seguros ao atendimento público. Engenharia
                    para operações que precisam funcionar.
                  </p>
                  <Asterisk className="experience-asterisk" />
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

        <section
          id="sobre"
          className="about-section container section-space"
          aria-labelledby="about-title"
        >
          <div className="section-top">
            <span className="eyebrow">03 / ALÉM DO EDITOR</span>
            <span className="eyebrow muted">PESSOAS ANTES DE PIXELS.</span>
          </div>
          <div className="about-layout">
            <Reveal className="about-photos">
              <figure className="about-photo-main">
                <img
                  src="/images/building.webp"
                  width="1100"
                  height="733"
                  loading="lazy"
                  alt="Guilherme trabalhando no computador durante um evento de desenvolvimento"
                />
                <figcaption className="eyebrow">
                  <span>APRENDER. CONSTRUIR. COMPARTILHAR.</span>
                  <Plus size={13} />
                </figcaption>
              </figure>
              <figure className="about-photo-secondary">
                <img
                  src="/images/community.webp"
                  width="1200"
                  height="800"
                  loading="lazy"
                  alt="Guilherme com participantes no palco do evento Devs de Impacto"
                />
                <figcaption>Boas ideias crescem em comunidade.</figcaption>
              </figure>
              <span className="photo-sticker" aria-hidden="true">
                Sempre
                <br />
                construindo. ↗
              </span>
            </Reveal>
            <Reveal className="about-copy">
              <h2 id="about-title">
                Curioso por natureza.
                <br />
                <span className="muted">Builder por escolha.</span>
              </h2>
              <p>
                Sou Guilherme Serafim. Pode me chamar de <strong>Guiler</strong>
                .
              </p>
              <p>
                Gosto de entender o problema antes de abrir o editor. De
                questionar a arquitetura, encontrar o gargalo e cuidar da
                experiência de quem está do outro lado da tela.
              </p>
              <p>
                Hoje, meu foco está em conectar engenharia de software e IA
                aplicada. Construo, experimento e compartilho o que aprendo pelo
                caminho.
              </p>
              <a
                href="https://www.linkedin.com/in/guiserafim/"
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                Me acompanhe no LinkedIn <ArrowUpRight size={18} />
              </a>
            </Reveal>
          </div>
          <div className="toolkit">
            <div>
              <span className="eyebrow">MINHA CAIXA DE FERRAMENTAS</span>
              <p>
                A tecnologia certa <br />
                para cada problema.
              </p>
            </div>
            <div className="toolkit-groups">
              <div>
                <span className="eyebrow muted">INTERFACE</span>
                <p>
                  React <span>·</span> Next.js <span>·</span> Angular{" "}
                  <span>·</span> TypeScript
                </p>
              </div>
              <div>
                <span className="eyebrow muted">SISTEMAS</span>
                <p>
                  Java <span>·</span> Spring Boot <span>·</span> C#{" "}
                  <span>·</span> .NET
                </p>
              </div>
              <div>
                <span className="eyebrow muted">DADOS & IA</span>
                <p>
                  Python <span>·</span> FastAPI <span>·</span> PostgreSQL{" "}
                  <span>·</span> LangChain
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contato"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="section-top">
              <span className="eyebrow">04 / A PRÓXIMA CONVERSA</span>
              <span className="eyebrow">SÃO PAULO, BRASIL ↗ MUNDO</span>
            </div>
            <Reveal>
              <div className="contact-heading">
                <h2 id="contact-title">
                  Tem um desafio?
                  <br />
                  <span>Vamos construir.</span>
                </h2>
                <Magnetic className="contact-arrow-wrap">
                  <a
                    className="contact-arrow"
                    href={`mailto:${email}`}
                    aria-label="Enviar um e-mail para Guilherme"
                  >
                    <ArrowUpRight strokeWidth={1} />
                  </a>
                </Magnetic>
              </div>
            </Reveal>
            <div className="contact-bottom">
              <div>
                <p>
                  Um produto, um sistema complexo ou uma boa ideia.
                  <br />
                  Quero ouvir o que você está construindo.
                </p>
                <div className="email-row">
                  <a href={`mailto:${email}`}>{email}</a>
                  <button
                    className="copy-button"
                    onClick={copyEmail}
                    aria-label={
                      copyStatus === "copied"
                        ? "E-mail copiado"
                        : "Copiar e-mail"
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
                    ? "E-mail copiado!"
                    : copyStatus === "error"
                      ? "Selecione o endereço para copiar ou clique para enviar um e-mail."
                      : "\u00a0"}
                </p>
              </div>
              <div className="contact-socials">
                <a
                  href="https://github.com/GuilhermeSerafim"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={17} /> GitHub <ArrowUpRight size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/guiserafim/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={17} /> LinkedIn <ArrowUpRight size={16} />
                </a>
                <a href="/GuilhermeSerafim_Fullstack.pdf" download>
                  <Download size={17} /> Currículo <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <footer className="site-footer">
              <a className="wordmark" href="#inicio">
                guiler.
              </a>
              <span className="eyebrow">
                © {new Date().getFullYear()} GUILHERME SERAFIM
              </span>
              <a className="eyebrow" href="#inicio">
                DE VOLTA AO TOPO <ArrowRight size={15} className="up-arrow" />
              </a>
            </footer>
          </div>
        </section>
      </main>
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default App;
