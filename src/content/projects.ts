import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "chartli",
    title: "Chartli",
    subtitle: "AI Medical Scribe & Clinical Documentation Platform",
    pitch:
      "Chartli brings patient context, visit workflows, and AI-assisted clinical documentation into one responsive platform. Clinicians can start with typed notes, dictation, or a doctor–patient conversation and turn the encounter into a structured SOAP note, alongside a plain-language summary for the patient.",
    accent: "green",
    stack: ["FastAPI", "SQLAlchemy", "React", "Groq", "Whisper"],
    bullets: [
      "Three documentation modes: typed notes, solo dictation, and doctor–patient conversation recording.",
      "Structured SOAP documentation plus a patient-friendly summary from the same encounter.",
      "Patient directory, longitudinal visit history, vitals, chronic conditions, and prominent allergy indicators.",
      "PIN-protected doctor access and a separate patient portal for shared summaries.",
      "89% backend test coverage.",
    ],
    origin: "final-year",
    poster: "/media/projects/chartli.jpg",
    orb: "#1fb5b0",
    links: {},
  },
  {
    slug: "resolva",
    title: "Resolva",
    subtitle: "AI Customer Support Agent",
    pitch:
      "Resolva answers customer questions from company knowledge bases, shows a confidence score with every response, and routes uncertain conversations to human support. It combines AI chat, document ingestion, ticket management, and support analytics in one platform.",
    accent: "blue",
    stack: ["React", "FastAPI", "Python", "LangGraph", "Groq", "ChromaDB", "Sentence Transformers", "SQLAlchemy", "SQLite"],
    bullets: [
      "Grounds customer answers in company documents and displays a confidence score with every response.",
      "Routes uncertain conversations into a human-reviewed support ticket instead of guessing.",
      "Supports PDF and text uploads, with separate knowledge bases for different companies.",
      "Includes ticket filtering and resolution workflows plus a dashboard for support performance.",
    ],
    origin: "personal",
    poster: "/media/projects/resolva.jpg",
    orb: "#6a3df0",
    links: {},
  },
  {
    slug: "getaura",
    title: "Getaura",
    subtitle: "Ergonomic Gaming & Workstation Store",
    pitch: "GETAURA is a premium ecommerce platform for ergonomic gaming and workstation essentials. It brings product discovery, shopping, checkout, customer accounts, and store administration together in a responsive storefront, with a refined visual identity built around considered workspace setups.",
    accent: "orange",
    stack: ["React", "Node.js", "Express", "MongoDB", "Mongoose", "Redux Toolkit", "React Bootstrap", "JWT", "PayPal"],
    bullets: [
      "Responsive storefront and catalogue for gaming and workstation products.",
      "Product search, pagination, ratings, customer reviews, and shopping bag.",
      "Customer registration, profiles, order history, and multi-step checkout.",
      "PayPal and card-payment integration.",
      "Admin tools for products, users, orders, image uploads, and inventory.",
    ],
    origin: "personal",
    poster: "/media/projects/getaura.jpg",
    orb: "#2f5d3f",
    links: {},
  },
  {
    slug: "asta",
    title: "Asta",
    subtitle: "Real-Time Luxury Auction Platform",
    pitch:
      "ASTA is a premium auction marketplace where bidders browse curated listings, follow live countdowns, and place real-time bids. Sellers manage their listings, while administrators oversee users, auctions, and flagged bidding activity.",
    accent: "violet",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.IO", "Tailwind CSS", "JWT", "Google OAuth", "Stripe", "PayFast"],
    bullets: [
      "Real-time bidding, countdowns, viewer activity, and bid history powered by Socket.IO.",
      "Role-based bidder, seller, and administrator experiences, including listing and user management.",
      "Searchable catalogue with filters, pagination, live prices, and closing times.",
      "JWT and Google sign-in, image uploads, email notifications, and Stripe and PayFast-oriented payment flows.",
      "Administrator tools for reviewing flagged and suspicious bidding activity.",
    ],
    origin: "personal",
    poster: "/media/projects/asta.jpg",
    orb: "#6b1e2e",
    links: {},
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
