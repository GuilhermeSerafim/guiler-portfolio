import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CuriositySketch } from "./CuriositySketch";
import "./TechnologyCatalog.css";

type Technology = { name: string; icon: string };

const areas = [
  {
    name: "Interface",
    note: "Da ideia à interação.",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Angular", icon: "angular" },
      { name: "TypeScript", icon: "typescript" },
    ],
  },
  {
    name: "Sistemas",
    note: "Estrutura para crescer.",
    items: [
      { name: "Java", icon: "java" },
      { name: "Spring Boot", icon: "spring" },
      { name: "C#", icon: "csharp" },
      { name: ".NET", icon: "dotnetcore" },
    ],
  },
  {
    name: "Dados & IA",
    note: "Informação vira aplicação.",
    items: [
      { name: "Python", icon: "python" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "LangChain", icon: "langchain" },
    ],
  },
];

const icons = import.meta.glob<string>("../assets/technologies/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function TechnologyItem({ item }: { item: Technology }) {
  return (
    <span className="tech-item">
      <img
        src={icons[`../assets/technologies/${item.icon}.svg`]}
        alt=""
        width="28"
        height="28"
      />
      <span>{item.name}</span>
    </span>
  );
}

function CatalogRow({
  area,
  index,
  reducedMotion,
}: {
  area: (typeof areas)[number];
  index: number;
  reducedMotion: boolean;
}) {
  const row = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: row,
    offset: ["start end", "end start"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 ? -12 : 12, 0, index % 2 ? 12 : -12],
  );

  return (
    <div className="tech-catalog-row" ref={row}>
      <div className="tech-area-label">
        <span className="tech-area-number">0{index + 1}</span>
        <div>
          <h4>{area.name}</h4>
          <p>{area.note}</p>
        </div>
      </div>
      <motion.ul
        style={reducedMotion ? undefined : { x }}
        className="tech-catalog-items"
      >
        {area.items.map((item) => (
          <li key={item.icon}>
            <TechnologyItem item={item} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

export function TechnologyCatalog() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="tecnologias"
      aria-labelledby="catalog-title"
      className="technology-catalog"
      data-static={reducedMotion}
    >
      <header className="technology-catalog-header">
        <div>
          <h3 id="catalog-title">Minha caixa de ferramentas.</h3>
        </div>
        <div className="technology-catalog-aside">
          <CuriositySketch subject="einstein" />
        </div>
      </header>
      <div className="tech-catalog">
        {areas.map((area, index) => (
          <CatalogRow
            key={area.name}
            area={area}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
