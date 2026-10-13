export type Project = {
  id: "georisk" | "seven-tools" | "playsenac" | "mesa";
  name: string;
  category: "IA aplicada" | "Produto web" | "Landing page";
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  technologies?: string[];
  problem: string;
  approach: string;
  decisions: string[];
  outcome: string;
  demo: string;
  github?: string;
  preview?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
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
    id: "seven-tools",
    name: "SEVEN Tools",
    category: "IA aplicada",
    eyebrow: "FULL STACK / FERRAMENTAS EMPRESARIAIS",
    title: "IA aplicada à rotina comercial.",
    description:
      "Hub do ecossistema SEVEN com IA para criar propostas, diagnosticar a operação comercial e qualificar leads, em uma experiência integrada.",
    tags: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Bun",
      "FastAPI",
      "Python",
      "Docker",
      "PostgreSQL",
      "Alembic",
    ],
    problem:
      "A operação comercial reúne tarefas que exigem contexto: elaborar propostas, identificar gargalos e priorizar oportunidades. O desafio era organizar essas ferramentas em um único ambiente para os membros do ecossistema SEVEN.",
    approach:
      "Desenvolvi a interface em React e TypeScript, integrada a uma API em Python com FastAPI e PostgreSQL. O hub organiza os recursos por área de negócio, com foco inicial em Comercial, e reúne ferramentas de IA em uma interface de chat com histórico persistente e acesso restrito a membros aprovados.",
    decisions: [
      "Compartilhar a estrutura de chat entre as ferramentas, com configurações e adaptadores próprios para cada agente.",
      "Orquestrar a IA no backend com chamadas de ferramentas e contexto específico para criar, editar e revisar propostas ou conduzir diagnósticos.",
      "Separar a interpretação da IA do cálculo de qualificação: o backend pontua os leads com critérios e pesos configuráveis por empresa.",
    ],
    outcome:
      "Uma plataforma que reúne propostas comerciais, diagnósticos e qualificação de leads, com conversas recuperáveis e dados persistidos. A organização por áreas mantém um ponto de acesso comum para as ferramentas do ecossistema SEVEN.",
    demo: "https://seven-tools.vercel.app/",
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
  {
    id: "mesa",
    name: "Mesa de Negócios",
    category: "Landing page",
    eyebrow: "FRONT-END / EXPERIÊNCIA COMERCIAL",
    title: "Da proposta de valor à solicitação de vaga.",
    description:
      "Landing page do Grupo SEVEN / Grupo Nakamura para apresentar a metodologia Mesa de Negócios e conduzir interessados ao formulário de solicitação de vaga.",
    tags: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    problem:
      "A oferta precisava comunicar sua proposta, critérios de participação e autoridade, com um caminho claro para solicitar uma vaga em diferentes dispositivos.",
    approach:
      "Implementei o front-end em React e TypeScript, com Vite 6, Tailwind CSS e shadcn/ui, traduzindo a narrativa comercial em seções reutilizáveis e um fluxo consistente de solicitação de vaga.",
    decisions: [
      "Centralizar os CTAs em uma única ação: formulário Respondi em modal no desktop e navegação direta no mobile.",
      "Carregar seções secundárias e o formulário sob demanda, priorizando o conteúdo inicial.",
      "Automatizar lint, testes e build com GitHub Actions e integrar o repositório à Vercel.",
    ],
    outcome:
      "Uma landing page publicada em domínio próprio, com apresentação da metodologia, formulário de solicitação de vaga integrado e validação automatizada para apoiar a evolução do site.",
    demo: "https://dennisnakamura.com/mesa-de-negocios",
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
