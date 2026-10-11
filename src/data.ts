export type Project = {
  id: "georisk" | "playsenac";
  name: string;
  category: "IA aplicada" | "Produto web";
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  problem: string;
  approach: string;
  decisions: string[];
  outcome: string;
  demo: string;
  github?: string;
};

export const projects: Project[] = [
  {
    id: "georisk",
    name: "GeoRisk",
    category: "IA aplicada",
    eyebrow: "IA APLICADA / GEOTECNOLOGIA",
    title: "Dados do território. Decisões mais claras.",
    description:
      "Inteligência artificial e dados geoespaciais juntos para apoiar a análise de risco de alagamento.",
    tags: ["Next.js", "Python", "PostGIS", "LangChain"],
    problem:
      "Analisar risco de alagamento exige reunir informações de fontes diferentes e tornar o raciocínio compreensível para quem precisa decidir.",
    approach:
      "Desenvolvi uma plataforma que conecta uma experiência de mapa a um pipeline de dados geoespaciais e IA. FastAPI e PostGIS sustentam a análise; Next.js e Mapbox tornam o território explorável.",
    decisions: [
      "Integrar dados de cobertura do solo, localização e elevação ao contexto da análise.",
      "Usar LangChain e GPT-4o para apresentar justificativas junto às classificações de risco.",
      "Conectar a camada geoespacial ao produto, da consulta de dados à visualização no mapa.",
    ],
    outcome:
      "Projeto vencedor do Hackathon OpenAI. A proposta é apoiar a análise com contexto e justificativas; as classificações não substituem uma avaliação técnica do território.",
    demo: "https://geo-risk-front.vercel.app/",
  },
  {
    id: "playsenac",
    name: "Play Senac",
    category: "Produto web",
    eyebrow: "PRODUTO WEB / AGENDAMENTO",
    title: "Menos conflito de horário. Mais jogo.",
    description:
      "Uma plataforma para organizar reservas de quadras, participantes e disponibilidade em um só lugar.",
    tags: ["Java", "Spring Boot", "Angular", "SQL"],
    problem:
      "Agendar uma quadra envolve mais do que escolher um horário: é preciso respeitar prioridades, evitar conflitos e validar quem participa.",
    approach:
      "Construí um sistema de gerenciamento e agendamento com Angular na interface e Spring Boot no back-end, trazendo as regras da operação para o fluxo de reserva.",
    decisions: [
      "Modelar regras de prioridade e bloqueio de horários no back-end.",
      "Validar participantes e reservas com Bean Validation e persistência JPA/Hibernate.",
      "Organizar a interface com Angular e RxJS para consultar disponibilidade e acompanhar agendamentos.",
    ],
    outcome:
      "Uma experiência centralizada de reserva, com regras explícitas e validações que ajudam a organizar o uso das quadras.",
    demo: "https://play-senac.vercel.app/",
    github: "https://github.com/GuilhermeSerafim/play-senac-api",
  },
];

export const experience = [
  {
    company: "Quipux",
    role: "Desenvolvedor Full Stack Pleno",
    period: "ABR — SET 2025",
    field: "E-GOVERNMENT",
    number: "01",
    description:
      "Modernização de sistemas que fazem parte da rotina de atendimento público.",
    contributions: [
      "Migração de AngularJS para Angular 17+.",
      "Otimização de 12+ endpoints REST com Spring Boot e SQL.",
      "Revisão de consultas, índices e dependências do legado.",
    ],
    stack: "Java / Spring Boot / Angular / SQL",
  },
  {
    company: "Tokio Marine",
    role: "Desenvolvedor Full Stack",
    period: "AGO 2023 — NOV 2024",
    field: "SEGUROS",
    number: "02",
    description:
      "Arquitetura e performance em uma plataforma de cobrança de seguros.",
    contributions: [
      "Reestruturação com .NET 7, Onion Architecture e SOLID.",
      "Otimização de 15+ stored procedures e consultas.",
      "Modernização da interface com React e Material UI.",
    ],
    stack: "C# / .NET / React / SQL Server",
  },
];
