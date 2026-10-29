import type { Project } from "./types";

// PLACEHOLDER: stacks, bullets and narrative below must be replaced with CV copy.
export const projects: Project[] = [
  {
    slug: "chartli",
    title: "Chartli",
    subtitle: "Chart creation platform",
    pitch: "PLACEHOLDER: one-line pitch for Chartli.",
    accent: "green",
    stack: ["PLACEHOLDER: stack"],
    bullets: [
      "Reached 89% backend test coverage.",
      "PLACEHOLDER: remaining Chartli bullets from CV (duplicate bullet merged).",
    ],
    origin: "final-year",
    links: {},
  },
  {
    slug: "resolva",
    title: "Resolva",
    subtitle: "PLACEHOLDER: subtitle",
    pitch: "PLACEHOLDER: one-line pitch for Resolva.",
    accent: "blue",
    stack: ["PLACEHOLDER: stack"],
    bullets: ["PLACEHOLDER: Resolva bullets from CV."],
    origin: "personal",
    links: {},
  },
  {
    slug: "bitcoin-prediction",
    title: "Bitcoin Price Prediction",
    subtitle: "Machine-learning price forecasting",
    pitch: "PLACEHOLDER: one-line pitch for Bitcoin Price Prediction.",
    accent: "orange",
    stack: ["PLACEHOLDER: stack"],
    bullets: ["PLACEHOLDER: Bitcoin Price Prediction bullets from CV."],
    origin: "personal",
    links: {},
  },
  {
    slug: "content-moderation",
    title: "Content Moderation Platform",
    subtitle: "Built at Orzeh Technologies",
    pitch: "PLACEHOLDER: one-line pitch for the Content Moderation Platform.",
    accent: "violet",
    stack: ["PLACEHOLDER: stack"],
    bullets: ["PLACEHOLDER: Content Moderation bullets from CV."],
    origin: "orzeh",
    links: {},
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
