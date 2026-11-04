import type { Role } from "./types";

export const experience: Role[] = [
  {
    company: "Amazon",
    title: "Tech Support Specialist",
    start: "Mar 2026",
    end: "Aug 2026",
    bullets: [
      "Resolved complex customer grievances and technical issues, maintaining a 95%+ customer satisfaction rating while meeting strict timelines.",
      "Guided customers through self-service knowledge bases to reduce repetitive ticket volume.",
      "Worked with team leads and QA specialists to improve communication protocols and raise First-Contact Resolution by 12%.",
      "Used CRM, ticketing, and diagnostic tools to investigate, document, and escalate platform bugs to backend engineering teams.",
    ],
  },
  {
    company: "Orzeh Technologies",
    title: "AI Engineer",
    start: "Jul 2025",
    end: "Feb 2026",
    bullets: [
      "Built Python agents for content moderation, map-reduce conversation summaries, proactive risk detection, and RAG-based Q&A using Ollama.",
      "Implemented semantic retrieval over Mattermost conversations with sentence-transformer embeddings, cosine similarity, and message-level citations.",
      "Combined regex-based PII and leetspeak checks, VADER sentiment analysis, and LLM verification in a multi-phase moderation workflow.",
      "Developed an asynchronous FastAPI backend with JWT authentication, role-based access, and scheduling, plus a React dashboard for agent monitoring, charts, and PDF export.",
    ],
  },
  {
    company: "Evaxone",
    title: "Software Engineering Intern (onsite)",
    start: "Apr 2024",
    end: "Jun 2024",
    bullets: [
      "Processed and validated hundreds of dataset entries to maintain accurate, consistent project data.",
      "Investigated workflow issues, documented fixes, and recommended process improvements.",
      "Supported QA and regression checks across more than five application modules.",
    ],
  },
];
