import type { Role } from "./types";

export const experience: Role[] = [
  {
    company: "Altif",
    title: "Software Engineer",
    start: "Aug 2026",
    end: "Present",
    bullets: [
      "Design and develop responsive websites, web applications, and custom digital solutions for local and international businesses.",
      "Translate business goals and client workflows into clear requirements, product flows, and practical technical plans.",
      "Build end-to-end features across frontend, backend, APIs, and third-party integrations, choosing an approach that fits each project.",
      "Work with clients through delivery, testing, and feedback to refine usability, reliability, and performance.",
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
