import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "chartli",
    title: "Chartli",
    subtitle: "AI medical scribe",
    pitch:
      "Turns typed notes, dictated audio or conversations into structured SOAP notes. Llama 3.3 70B via Groq and Whisper Large v3 Turbo do the heavy lifting.",
    accent: "green",
    stack: ["FastAPI", "SQLAlchemy", "React", "Groq", "Whisper"],
    bullets: [
      "Reached 89% backend test coverage.",
      "Generates structured SOAP notes from typed notes, dictated audio or conversations.",
      "PIN-based access with a React/Vite front end.",
    ],
    origin: "final-year",
    poster: "/media/projects/chartli.jpg",
    links: {},
  },
  {
    slug: "resolva",
    title: "Resolva",
    subtitle: "Confidence-scored AI support agent",
    pitch:
      "A RAG support agent that answers from your knowledge base and escalates low-confidence answers to human agents by email.",
    accent: "blue",
    stack: ["LangGraph", "ChromaDB", "FastAPI", "React", "Groq", "Resend"],
    bullets: [
      "Retrieval-augmented answers with sentence-transformers and ChromaDB.",
      "Low-confidence answers escalate to human agents by email via Resend.",
      "React/Vite app with chat, tickets, analytics and knowledge-base upload.",
    ],
    origin: "personal",
    poster: "/media/projects/resolva.jpg",
    links: {},
  },
  {
    slug: "getaura",
    title: "Getaura",
    subtitle: "Better setups, built around you",
    pitch: "A premium storefront for ergonomic workspace setups: desks, chairs and accessories built around the person using them.",
    accent: "orange",
    stack: ["Web"],
    bullets: ["Premium brand and storefront experience for ergonomic workspace setups."],
    origin: "personal",
    poster: "/media/projects/getaura.jpg",
    links: {},
  },
  {
    slug: "asta",
    title: "Asta",
    subtitle: "Real-time auction platform",
    pitch:
      "A premium MERN auction experience built for live bidding, curated luxury lots and role-based management.",
    accent: "violet",
    stack: ["MongoDB", "Express", "React", "Node.js", "WebSockets"],
    bullets: [
      "Live bidding over WebSockets.",
      "Seller dashboard and admin controls with role-based management.",
      "Secure payments for curated luxury auction lots.",
    ],
    origin: "personal",
    poster: "/media/projects/asta.jpg",
    links: {},
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
