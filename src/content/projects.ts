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
    links: {},
  },
  {
    slug: "bitcoin-prediction",
    title: "Bitcoin Price Prediction",
    subtitle: "Machine-learning price forecasting",
    pitch:
      "Hybrid LSTM, ARIMA and XGBoost models on Bitcoin, commodity and news data, tuned and compared on MAE and RMSE. Offers best-model, individual and averaged-ensemble predictions.",
    accent: "orange",
    stack: ["LSTM", "ARIMA", "XGBoost", "Python"],
    bullets: [
      "Combined Bitcoin, commodities and news data as model inputs.",
      "Tuned and compared models on MAE and RMSE.",
      "Supports best-model, individual and averaged-ensemble predictions.",
    ],
    origin: "personal",
    links: {},
  },
  {
    slug: "content-moderation",
    title: "Content Moderation Platform",
    subtitle: "Built at Orzeh Technologies",
    pitch:
      "Python agents for moderation, conversation summarization, proactive risk detection and a RAG Q&A chatbot on a local Ollama LLM over Mattermost data. Async FastAPI with JWT and role-based access, plus a React monitoring dashboard.",
    accent: "violet",
    stack: ["FastAPI", "Ollama", "sentence-transformers", "React", "Chart.js"],
    bullets: [
      "Map-reduce conversation summarization and a RAG chatbot with message-level citations.",
      "Multi-phase risk detection: regex PII and leetspeak, VADER sentiment, LLM verification.",
      "Async FastAPI with JWT, role-based access and auto-scheduling; React dashboard with agent monitoring, Chart.js and PDF export.",
    ],
    origin: "orzeh",
    links: {},
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
