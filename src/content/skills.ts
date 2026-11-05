import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["Python", "C/C++", "JavaScript", "TypeScript", "SQL"] },
  { label: "AI/ML", items: ["RAG", "LangGraph", "Ollama", "Groq", "ChromaDB", "Sentence Transformers", "LLM Prompt Engineering"] },
  { label: "ML Frameworks", items: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"] },
  { label: "Data & Analytics", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Power BI", "MongoDB", "PostgreSQL", "SQLite"] },
  { label: "Frontend", items: ["React", "React Router", "Redux Toolkit", "Tailwind CSS", "React Bootstrap"] },
  { label: "Backend & Tools", items: ["FastAPI", "Django", "Node.js", "Express", "SQLAlchemy", "Mongoose", "Docker", "Jupyter Notebook"] },
];
