export type Project = {
  id: "georisk" | "seven-tools" | "playsenac" | "mesa";
  name: string;
  category: "IA aplicada" | "Produto web" | "Landing page";
  eyebrow: string;
  title: string;
  description: string;
  stage: string;
  tags: string[];
  technologies?: string[];
  problem: string;
  approach: string;
  decisions: string[];
  outcome: string;
  resultHighlight?: {
    value: string;
    label: string;
    context: string;
  };
  demo: string;
  demoNotice?: string;
  github?: string;
  frontendGithub?: string;
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
      "Análise de risco de alagamento com mapas e explicações para apoiar decisões sobre o território.",
    stage: "Protótipo de análise geoespacial",
    tags: ["Next.js", "Python", "PostGIS", "LangChain"],
    problem:
      "Analisar risco de alagamento exige reunir informações de fontes diferentes e tornar o raciocínio compreensível para quem precisa decidir.",
    approach:
      "Desenvolvi o fluxo que parte de uma área no mapa, reúne dados do território, calcula os componentes do risco e apresenta a classificação com uma explicação. Next.js conecta a interface à API FastAPI e ao PostGIS. OrbTalus é a demonstração pública desse fluxo.",
    decisions: [
      "Calcular um índice heurístico: regras em Python combinam topografia, frequência histórica de água e permeabilidade com pesos fixos.",
      "Separar o cálculo de risco da explicação: LangChain e OpenAI apresentam o contexto dos resultados calculados.",
      "Exibir os componentes do índice junto à classificação e ao mapa. O índice apoia a análise; não representa uma probabilidade validada de alagamento.",
    ],
    outcome:
      "Estruturei a análise em três componentes rastreáveis — topografia, frequência histórica de água e permeabilidade —, combinando consultas espaciais, regras em Python e explicações com LangChain/OpenAI. Projeto vencedor do Hackathon OpenAI. As classificações não substituem uma avaliação técnica do território.",
    demo: "https://orbtalus-demo.guiler.chatgpt.site/",
    demoNotice:
      "OrbTalus é uma demonstração interativa com dados sintéticos e processamento local. Ela apresenta o fluxo da solução; não executa a análise geoespacial e a IA do produto original.",
  },
  {
    id: "seven-tools",
    name: "SEVEN Tools",
    category: "IA aplicada",
    eyebrow: "FULL STACK / FERRAMENTAS EMPRESARIAIS",
    title: "IA aplicada à rotina comercial.",
    description:
      "Hub de ferramentas com IA para propostas, diagnóstico comercial e qualificação de leads.",
    stage: "Projeto profissional · implementação parcial",
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
      "Implementei interfaces, APIs e integrações para as frentes de propostas, diagnóstico comercial e qualificação de leads, com React/TypeScript, Python/FastAPI e PostgreSQL. O hub compartilha uma interface de chat com histórico persistido e acesso de membros aprovados.",
    decisions: [
      "Reunir usuário e empresa em uma única resposta de sessão, eliminando a chamada HTTP redundante na inicialização autenticada.",
      "Carregar módulos por rota e manter os providers de autenticação e favoritos fora da página pública.",
      "Persistir o histórico das conversas e separar a interpretação da IA do cálculo de qualificação dos leads, executado no backend com critérios por empresa.",
      "Arquitetar e implementar a elegibilidade do Seven Plus via ClickUp: aprovar cadastros cujo e-mail corresponde ao contato da empresa na base de membros e encaminhar os demais para revisão.",
    ],
    outcome:
      "Reduzi de duas para uma as chamadas à API para carregar usuário e empresa na inicialização da sessão autenticada, consolidando ambos em uma resposta. Também implementei a integração de elegibilidade com o ClickUp, com aprovação por correspondência de e-mail e revisão dos demais cadastros.",
    resultHighlight: {
      value: "2 → 1",
      label: "chamadas de sessão",
      context: "Usuário e empresa no início da sessão autenticada.",
    },
    demo: "https://seven-tools-demo.guiler.chatgpt.site/",
    demoNotice:
      "Demonstração com cenários e dados sintéticos para explorar os fluxos do hub, separada das contas e dos dados do produto original. A disponibilidade indicada se refere a esta demo.",
  },
  {
    id: "playsenac",
    name: "Play Senac",
    category: "Produto web",
    eyebrow: "PRODUTO WEB / AGENDAMENTO",
    title: "Reservas e horários, no mesmo fluxo.",
    description:
      "Sistema de reservas de quadras para organizar agendamentos, horários e bloqueios.",
    stage: "Projeto em equipe",
    tags: ["Java", "Spring Boot", "Angular", "SQL"],
    problem:
      "A gestão de quadras precisa reunir disponibilidade, reservas e bloqueios administrativos, com informações claras para quem agenda e para quem organiza os horários.",
    approach:
      "Trabalhei no frontend Angular de um sistema desenvolvido em equipe, integrado à API Spring Boot. Minha contribuição inclui interfaces de reserva e administração, formulários, diálogos, responsividade e comunicação HTTP. O backend da equipe concentra as regras de conflito, bloqueios e persistência.",
    decisions: [
      "Integrar criação, consulta, alteração e exclusão de reservas à API, mantendo contratos tipados no frontend.",
      "Usar formulários validados, diálogos e feedback de carregamento e erro para orientar o fluxo de reserva.",
      "Atualizar as listas de forma reativa com RxJS e paginar a visualização administrativa das reservas.",
    ],
    outcome:
      "Integrei as operações de gestão de reservas ao frontend Angular, conectando a API a formulários validados e à atualização reativa das listas. O sistema da equipe reúne reservas, administração de quadras e bloqueios de horários.",
    demo: "https://play-senac-demo.guiler.chatgpt.site/",
    demoNotice:
      "Demonstração com quadras e reservas sintéticas para explorar as regras de agendamento. As operações são locais e não criam reservas reais.",
    github: "https://github.com/GuilhermeSerafim/play-senac-api",
    frontendGithub: "https://github.com/GuilhermeSerafim/play-senac",
  },
  {
    id: "mesa",
    name: "Mesa de Negócios",
    category: "Landing page",
    eyebrow: "FRONT-END / EXPERIÊNCIA COMERCIAL",
    title: "Da proposta de valor à solicitação de vaga.",
    description:
      "Página de apresentação da Mesa de Negócios, com um caminho direto para solicitar uma vaga.",
    stage: "Landing page publicada",
    tags: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    problem:
      "A oferta precisava comunicar sua proposta, critérios de participação e autoridade, com um caminho claro para solicitar uma vaga em diferentes dispositivos.",
    approach:
      "Desenvolvi e evoluí a landing do Grupo SEVEN / Grupo Nakamura em React e TypeScript, com Tailwind CSS e shadcn/ui. Organizei a narrativa comercial, as páginas de materiais e o caminho até a solicitação de vaga, com formulário Respondi adaptado a cada dispositivo.",
    decisions: [
      "Centralizar os CTAs em uma única ação: formulário Respondi em modal no desktop e navegação direta no mobile.",
      "Dividir o código, carregar o formulário sob demanda e adiar a montagem de seções secundárias para reduzir o arquivo JavaScript de entrada.",
      "Automatizar lint, testes e build com GitHub Actions e integrar o repositório à Vercel.",
    ],
    outcome:
      "Reduzi em 52,4% o tamanho do arquivo JavaScript de entrada, de 540,93 para 257,50 kB, aplicando divisão de código, carregamento sob demanda e montagem adiada de componentes em React. A medição considera o arquivo de entrada dos dois builds registrados em 15/05/2026.",
    resultHighlight: {
      value: "−52,4%",
      label: "JavaScript de entrada",
      context: "540,93 → 257,50 kB entre dois builds de 15/05/2026.",
    },
    demo: "https://dennisnakamura.com/mesa-de-negocios",
  },
];

export const experience = [
  {
    company: "Naka&Co",
    role: "Desenvolvedor Full Stack",
    period: "FEV — AGO 2026",
    field: "FERRAMENTAS COMERCIAIS / IA",
    number: "01",
    description:
      "Interfaces, APIs e integrações para ferramentas comerciais com IA e evolução de páginas de aquisição.",
    contributions: [
      "Redução de 52,4% no JavaScript de entrada da Mesa de Negócios entre builds.",
      "Inicialização da sessão no SEVEN Tools com uma chamada à API em vez de duas.",
      "Funcionalidades para propostas, diagnóstico comercial e qualificação de leads.",
    ],
    stack: "React / TypeScript / Python / FastAPI / PostgreSQL / SQLAlchemy / Alembic / OpenAI API",
  },
  {
    company: "Quipux",
    role: "Desenvolvedor Full Stack Pleno",
    period: "ABR — SET 2025",
    field: "E-GOVERNMENT",
    number: "02",
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
    number: "03",
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
