# Abdullah Shafique Portfolio — Design Spec

Date: 2026-10-30 · Status: awaiting user review · Path: architectural

## 1. Purpose and success criteria
A cinematic, dark, scroll-driven portfolio for **Abdullah Shafique, AI Engineer & Software Developer**.

- **Audience (assumption, to confirm):** primary = recruiters/hiring managers at AI and software companies; secondary = freelance clients. Primary CTA: *View My Work*, then *Download Resume*; secondary CTA: *Let's Talk* (email).
- **Success:** a visitor understands within the first screen who Abdullah is and what he builds, can open any project's case study with video, and can download the resume or email him in ≤2 clicks. Site feels like a film, stays smooth on a mid-range laptop, and degrades gracefully on mobile and reduced-motion.

## 2. Decisions carried from brainstorm
| Topic | Decision |
|---|---|
| Motion | Scroll-driven storytelling: pinned hero, scrubbed parallax, section reveals, smooth scroll |
| 3D | Two spots only: hero background field, tech-stack/approach orbit |
| Theme | Dark only; per-project accent glows |
| Content | From CV only. Stats: 4 Projects Shipped · 3 Roles · 89% Backend Test Coverage (Chartli) · 95%+ CSAT (Amazon). Reference's "5+ projects / 2+ years" dropped |
| Contact | Email, LinkedIn, GitHub. No phone number |
| Projects | Dedicated case-study pages with hero video |
| Hero image | Reference image used as stand-in; real photos/videos added later to `public/media/` |
| Visual reference | `54e9c55b-0315-43f0-8653-a4a5d32d1758.png` (layout); arhambashirportfolio.vercel.app (motion feel; not inspected, client-rendered) |

## 3. Approaches considered
1. **GSAP + Lenis + React Three Fiber on Next.js (chosen).** Best control for pinned/scrubbed scenes; mature; R3F isolates 3D in two lazy components.
2. Framer Motion only + CSS. Simpler, but weak for scrubbed pinned timelines and video scrubbing.
3. One continuous R3F scene as the whole page. Most dramatic, but poor accessibility/SEO/mobile performance and heavy to maintain.

Library APIs (GSAP, Lenis, R3F, Next 16) will be verified against current docs during planning.

## 4. Architecture
Next.js 16 App Router, React 19, Tailwind 4, TypeScript (already scaffolded). Server components by default; client components only where motion/3D/video need them.

```
src/
  app/
    layout.tsx            fonts, metadata, SmoothScroll provider
    page.tsx              composes home sections
    projects/[slug]/page.tsx   case-study template (static params from data)
  components/
    layout/   Nav (dot-nav + mobile), Footer
    sections/ Hero, About, FeaturedProjects, Experience, Approach, Skills, Contact
    ui/       GlassCard, TechChip, StatBar, Button, ScriptNote
    three/    HeroField.tsx, StackOrbit.tsx   (lazy, client-only)
    media/    ProjectVideo.tsx (poster, lazy, hover/inview play)
  lib/
    motion/   smooth-scroll.ts, reveal.ts, use-reduced-motion.ts
  content/
    profile.ts, projects.ts, experience.ts, skills.ts   (typed data, single source of truth)
public/
  media/      hero, project videos/posters (user-supplied)
  Abdullah-Shafique-Resume.pdf
```

Each unit has one purpose: **content/** holds all copy as typed data; **sections/** render it; **three/** and **media/** isolate heavy features behind simple props; **lib/motion/** centralises scroll and reduced-motion logic.

## 5. Sections (home)
1. **Hero** — "Hi, I'm Abdullah Shafique", condensed headline "BUILDING INTELLIGENT SOLUTIONS", subtitle, intro, CTAs, script annotations, floating Multi-Agent code card, tech rail (Python, FastAPI, LangGraph, Ollama, React, PostgreSQL), glass stats bar. `HeroField` 3D behind the portrait, reacting to pointer and scroll.
2. **About** — CV summary; education (BS CS, GCU Lahore, 2021–2025); certifications (Accenture Data Analytics & Visualization; BCG X Data Science simulation).
3. **Featured Projects** — four cards with accent glows: Chartli (green), Resolva (blue), Bitcoin Price Prediction (orange), Content Moderation Platform (red/purple). Tilt on hover; video preview once supplied. "View All Projects" link.
4. **Experience** — timeline: Amazon Tech Support Specialist (Mar–Aug 2026), Orzeh Technologies AI Engineer (Jul 2025–Feb 2026), Evaxone Software Engineering Intern (Apr–Jun 2024).
5. **Approach** — "CODE DESIGN SOLVE REPEAT" with `StackOrbit` (Ideas → Build → Test → Deploy around the stack).
6. **Skills** — Languages, AI/ML, ML Frameworks, Data, Backend/Tools.
7. **Contact** — email, LinkedIn, GitHub, resume download.

Left dot-nav: 01 Home · 02 About · 03 Projects · 04 Experience · 05 Contact.

## 6. Case-study pages
`/projects/{chartli, resolva, bitcoin-prediction, content-moderation}`: hero video (or poster until supplied), one-line pitch, problem, how it works (CV bullets as base; expanded copy supplied later), stack chips, results, GitHub/live links when provided, next-project link.

## 7. Content notes
- Content Moderation Platform is work done at Orzeh Technologies; shown as such, not as a personal project.
- Chartli's duplicated CV bullet is merged.
- Case-study narrative beyond CV bullets is placeholder until Abdullah supplies it; placeholders are visibly marked in content files, not invented as fact.

## 8. Visual system
- **Type:** ultra-condensed heavy display for headlines, clean grotesk for body, handwritten script for annotations (via `next/font`).
- **Tokens:** `--bg #07080b`, glass surface, white text, ~60% muted, per-project accent tokens.
- **Surfaces:** glassmorphism cards, 1px low-opacity borders, soft glows.
- **Accessibility:** WCAG AA contrast, visible focus, semantic landmarks, alt text, keyboard-operable nav and videos.

## 9. Data flow and error handling
- Content files → typed objects → sections/case-study pages (static generation via `generateStaticParams`). No runtime backend.
- Missing video/photo: component renders poster or gradient fallback; never a broken element.
- WebGL unsupported, low-power, or `prefers-reduced-motion`: 3D components render a static image/CSS fallback; scroll scrubbing and smooth scroll disabled.
- Resume/contact links are plain `<a>` (`mailto:`, PDF), so they work without JS.

## 10. Performance and responsiveness
- 3D lazy-loaded (`dynamic`, no SSR), DPR capped, render paused off-screen, simplified on mobile.
- Videos: poster first, `preload="none"`, play only in view; compressed MP4/WebM.
- Mobile: dot-nav becomes top menu; hero stacks; stats bar 2×2; tilt and pointer effects off.
- Targets: LCP < 2.5s desktop, CLS < 0.1, smooth ~60fps scroll on mid-range laptop.

## 11. Testing
- Unit: content-schema validation (every project has slug, title, stack, accent).
- Component: sections render from data; fallbacks appear when media is missing.
- E2E (Playwright): nav anchors, case-study routes, resume link, reduced-motion mode shows no 3D canvas.
- Manual: visual check at 375 / 768 / 1440 widths; Lighthouse pass.

## 12. Out of scope (v1)
Blog, CMS, light theme, contact-form backend, analytics.

## 13. Open items (needed from Abdullah)
- Confirm audience/CTA priority (§1).
- Real photos and videos in `public/media/`; clean resume PDF.
- LinkedIn and GitHub URLs; per-project live/GitHub links.
- Expanded case-study copy (problem, architecture, results).
