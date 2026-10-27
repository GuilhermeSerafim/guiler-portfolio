import type { Experience, Project } from "./data";

type ProjectContent = Pick<
  Project,
  | "eyebrow"
  | "title"
  | "description"
  | "stage"
  | "problem"
  | "approach"
  | "decisions"
  | "outcome"
  | "resultHighlight"
  | "demoNotice"
>;

// Project names, category keys, technologies and destinations remain in data.ts.
export const englishProjectContent: Record<Project["id"], ProjectContent> = {
  georisk: {
    eyebrow: "APPLIED AI / GEOSPATIAL TECHNOLOGY",
    title: "Geospatial data. Clearer decisions.",
    description:
      "Flood risk analysis with maps and explanations to support decisions about an area.",
    stage: "Geospatial analysis prototype",
    problem:
      "Analyzing flood risk requires bringing together information from different sources and making the reasoning clear to the people making decisions.",
    approach:
      "I developed the workflow that starts with an area on a map, gathers geospatial data, calculates the risk components, and presents a classification with an explanation. Next.js connects the interface to the FastAPI API and PostGIS. OrbTalus is the public demonstration of this workflow.",
    decisions: [
      "Calculate a heuristic index: Python rules combine topography, historical water frequency, and permeability using fixed weights.",
      "Separate risk calculation from explanation: LangChain and OpenAI provide context for the calculated results.",
      "Display the index components alongside the classification and map. The index supports analysis; it does not represent a validated probability of flooding.",
    ],
    outcome:
      "I structured the analysis around three traceable components — topography, historical water frequency, and permeability — combining spatial queries, Python rules, and explanations with LangChain/OpenAI. The project won the OpenAI Hackathon. Its classifications do not replace a technical assessment of the area.",
    demoNotice:
      "OrbTalus is an interactive demonstration with synthetic data and local processing. It illustrates the solution's workflow; it does not run the original product's geospatial analysis or AI.",
  },
  "seven-tools": {
    eyebrow: "FULL STACK / BUSINESS TOOLS",
    title: "AI for everyday sales workflows.",
    description:
      "A hub of AI tools for proposals, sales diagnostics, and lead qualification.",
    stage: "Professional project · partial implementation",
    problem:
      "Sales operations involve tasks that depend on context: drafting proposals, identifying bottlenecks, and prioritizing opportunities. The challenge was to bring these tools into one environment for members of the SEVEN ecosystem.",
    approach:
      "I implemented interfaces, APIs, and integrations for proposals, sales diagnostics, and lead qualification using React/TypeScript, Python/FastAPI, and PostgreSQL. The hub uses a shared chat interface with persisted conversation history and access for approved members.",
    decisions: [
      "Return the user and company in a single session response, removing a redundant HTTP request when initializing an authenticated session.",
      "Load modules by route and keep authentication and favorites providers off the public page.",
      "Persist conversation history and separate AI interpretation from lead qualification scoring, calculated in the backend using company-specific criteria.",
      "Design and implement Seven Plus eligibility through ClickUp: approve registrations whose email matches the company's contact in the member database and route the others for review.",
    ],
    outcome:
      "I reduced the API calls needed to load the user and company at authenticated session startup from two to one by combining them in a single response. I also implemented the ClickUp eligibility integration, approving registrations by email match and routing the rest for review.",
    resultHighlight: {
      value: "2 → 1",
      label: "session API calls",
      context: "User and company loaded at authenticated session startup.",
    },
    demoNotice:
      "This demonstration uses sample scenarios and data, separate from the original product's accounts and data.",
  },
  playsenac: {
    eyebrow: "WEB PRODUCT / SCHEDULING",
    title: "Bookings and time slots in one workflow.",
    description:
      "A court booking system for managing reservations, schedules, and blocked time slots.",
    stage: "Team project",
    problem:
      "Court management needs to bring together availability, bookings, and administrative blocks, with clear information for the people making reservations and managing schedules.",
    approach:
      "I worked on the Angular frontend of a system built as a team, integrated with a Spring Boot API. My contribution includes booking and administration interfaces, forms, dialogs, responsive layouts, and HTTP communication. The team's backend handles conflict rules, time slot blocks, and persistence.",
    decisions: [
      "Integrate booking creation, retrieval, updates, and deletion with the API while maintaining typed contracts in the frontend.",
      "Use validated forms, dialogs, and loading and error feedback to guide the booking workflow.",
      "Update lists reactively with RxJS and paginate the administrative booking view.",
    ],
    outcome:
      "I integrated booking management operations into the Angular frontend, connecting the API to validated forms and reactive list updates. The team's system brings together bookings, court administration, and blocked time slots.",
    demoNotice:
      "A demonstration with synthetic courts and bookings for exploring the scheduling rules. Operations run locally and do not create real reservations.",
  },
  mesa: {
    eyebrow: "FRONTEND / SALES EXPERIENCE",
    title: "From value proposition to application.",
    description:
      "A landing page introducing Mesa de Negócios, with a direct path to apply for a place.",
    stage: "Published landing page",
    problem:
      "The offer needed to communicate its value proposition, participation criteria, and credibility, with a clear path to apply for a place across devices.",
    approach:
      "I built and improved the Grupo SEVEN / Grupo Nakamura landing page in React and TypeScript, using Tailwind CSS and shadcn/ui. I organized the sales narrative, resource pages, and application flow, with a Respondi form adapted to each device.",
    decisions: [
      "Direct all calls to action to a single step: a Respondi form in a modal on desktop and direct navigation on mobile.",
      "Split the code, load the form on demand, and defer mounting secondary sections to reduce the entry JavaScript file.",
      "Automate linting, tests, and builds with GitHub Actions and connect the repository to Vercel.",
    ],
    outcome:
      "I reduced the entry JavaScript file size by 52.4%, from 540.93 to 257.50 kB, through code splitting, on-demand loading, and deferred mounting of React components. The measurement compares the entry file from two builds recorded on May 15, 2026.",
    resultHighlight: {
      value: "−52.4%",
      label: "entry JavaScript",
      context: "540.93 → 257.50 kB across two builds on May 15, 2026.",
    },
  },
};

export const englishExperience: Experience[] = [
  {
    company: "Naka&Co",
    role: "Full Stack Developer",
    period: "FEB — AUG 2026",
    field: "SALES TOOLS / AI",
    number: "01",
    description:
      "Interfaces, APIs, and integrations for AI sales tools, alongside improvements to customer acquisition pages.",
    contributions: [
      "Reduced Mesa de Negócios entry JavaScript by 52.4% between builds.",
      "Initialized SEVEN Tools sessions with one API call instead of two.",
      "Built features for proposals, sales diagnostics, and lead qualification.",
    ],
    stack: "React / TypeScript / Python / FastAPI / PostgreSQL / SQLAlchemy / Alembic / OpenAI API",
  },
  {
    company: "Quipux",
    role: "Mid-level Full Stack Developer",
    period: "APR — SEP 2025",
    field: "E-GOVERNMENT",
    number: "02",
    description:
      "Modernized systems used in day-to-day public service delivery.",
    contributions: [
      "Migrated from AngularJS to Angular 17+.",
      "Optimized 12+ REST endpoints with Spring Boot and SQL.",
      "Reviewed legacy queries, indexes, and dependencies.",
    ],
    stack: "Java / Spring Boot / Angular / SQL",
  },
  {
    company: "Tokio Marine",
    role: "Full Stack Developer",
    period: "AUG 2023 — NOV 2024",
    field: "INSURANCE",
    number: "03",
    description:
      "Architecture and performance work on an insurance billing platform.",
    contributions: [
      "Restructured the platform with .NET 7, Onion Architecture, and SOLID.",
      "Optimized 15+ stored procedures and queries.",
      "Modernized the interface with React and Material UI.",
    ],
    stack: "C# / .NET / React / SQL Server",
  },
];
