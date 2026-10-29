export type AccentKey = "green" | "blue" | "orange" | "violet";
export type Stat = { value: string; label: string };
export type Project = {
  slug: "chartli" | "resolva" | "bitcoin-prediction" | "content-moderation";
  title: string;
  subtitle: string;
  pitch: string;
  accent: AccentKey;
  stack: string[];
  bullets: string[];
  origin: "personal" | "final-year" | "orzeh";
  video?: string;
  poster?: string;
  links: { github?: string; live?: string };
};
export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  bullets: string[];
};
export type SkillGroup = { label: string; items: string[] };
export type Profile = {
  name: string;
  role: string;
  headline: string[];
  intro: string;
  email: string;
  linkedin: string;
  github: string;
  resumeHref: string;
  stats: Stat[];
  education: { degree: string; school: string; years: string };
  certifications: { name: string; issuer: string }[];
};
