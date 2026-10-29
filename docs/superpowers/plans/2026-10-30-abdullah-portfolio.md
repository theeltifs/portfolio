# Abdullah Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the cinematic, dark, scroll-driven portfolio for Abdullah Shafique with four video-led case-study pages.

**Architecture:** Next.js 16 App Router site. All copy lives in typed files under `src/content/`; server-rendered sections read it; motion (GSAP + Lenis) and the two WebGL scenes are isolated client components behind a `SceneGate` that falls back to static art. No runtime backend.

**Tech Stack:** Next.js 16.4.3, React 19.3, Tailwind 4, TypeScript, GSAP + `@gsap/react`, Lenis, three + `@react-three/fiber@9` + drei, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-30-abdullah-portfolio-design.md`

## Global Constraints
- Dark only; tokens `--bg #07080b`, white text, ~60% muted, per-project accent tokens (green, blue, orange, violet).
- Hero stats exactly: `4 Projects Shipped`, `3 Roles`, `89% Backend Test Coverage`, `95%+ CSAT`. Never "5+ projects" or "2+ years".
- **No phone number** anywhere in source or rendered output (`+92…`, `0305…`).
- Contact = email (`abdullahshafiqueofficiall@gmail.com`), LinkedIn, GitHub only.
- Content Moderation Platform is labelled as Orzeh Technologies work, not a personal project.
- Roles: Amazon Tech Support Specialist (Mar 2026–Aug 2026); Orzeh Technologies AI Engineer (Jul 2025–Feb 2026); Evaxone Software Engineering Intern (Apr 2024–Jun 2024). Education: BS Computer Science, Government College University, Lahore, 2021–2025.
- 3D: only `HeroField` and `StackOrbit`; lazy, client-only, DPR capped at 1.5, paused off-screen.
- `prefers-reduced-motion`: no Lenis, no ScrollTrigger scrubbing, no canvas.
- `next.config.ts` has `cacheComponents: true`, `reactCompiler: true`; keep pages static, avoid request-time APIs, and check each page builds with `npm run build`.
- Unknown copy is a visible `PLACEHOLDER:` string in content files, never invented fact.
- Verify GSAP/Lenis/R3F usage matches current docs: Lenis `autoRaf:false` + `gsap.ticker.add(t => lenis.raf(t*1000))` + `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.lagSmoothing(0)`; `useGSAP({scope})`; R3F v9 pairs with React 19; `<Canvas frameloop="demand" dpr={[1,1.5]}>`.

## Review Focus
1. JS disabled / before hydration: hero headline, projects and contact links are in server HTML (test fetches HTML).
2. Missing video/poster file: `ProjectVideo` shows gradient fallback, no broken element.
3. Reduced motion on: no `<canvas>`, no Lenis class on `<html>`.
4. Unknown `/projects/does-not-exist`: returns 404, not a crash.
5. WebGL unavailable or context lost: `SceneGate` renders the fallback.

## File Structure
```
src/content/{types,profile,projects,experience,skills}.ts
src/lib/{webgl.ts, motion/{gsap.ts,use-reduced-motion.ts}}
src/components/providers/SmoothScroll.tsx
src/components/ui/{Button,GlassCard,TechChip,StatBar,ScriptNote,Reveal}.tsx
src/components/layout/{Nav,Footer}.tsx
src/components/media/ProjectVideo.tsx
src/components/three/{SceneGate,HeroField,StackOrbit}.tsx
src/components/sections/{Hero,About,FeaturedProjects,Experience,Approach,Skills,Contact}.tsx
src/app/{layout.tsx,page.tsx,globals.css,not-found.tsx,projects/[slug]/page.tsx}
tests/{unit,e2e}/…   vitest.config.ts   playwright.config.ts
```

---

### Task 1: Tooling, tokens, fonts, layout shell

**Files:**
- Modify: `package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/unit/layout.test.tsx`

**Interfaces:**
- Produces: CSS tokens `--bg --fg --muted --glass --accent-green --accent-blue --accent-orange --accent-violet`; Tailwind classes `bg-bg text-fg text-muted font-display font-body font-script`; `npm test` runs Vitest.

- [ ] **Step 1:** Install: `npm i gsap @gsap/react lenis three @react-three/fiber @react-three/drei` and `npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @types/three @playwright/test`; run `npx playwright install chromium`.
- [ ] **Step 2: Failing test** `tests/unit/layout.test.tsx`: renders `RootLayout` children and asserts `document.documentElement` class list does not contain a light theme and metadata `title` equals `"Abdullah Shafique — AI Engineer & Software Developer"` (export `metadata` from layout and assert on it).
- [ ] **Step 3:** Run `npx vitest run tests/unit/layout.test.tsx` → FAIL (title is "Create Next App").
- [ ] **Step 4:** Configure `vitest.config.ts` (jsdom, `tests/setup.ts` imports jest-dom, alias `@` → `src`), add `"test": "vitest run"` script. Replace globals.css with dark tokens above (remove light/`prefers-color-scheme` block, set body bg/fg). In `layout.tsx` load via `next/font/google`: `Anton` → `--font-display`, `Inter` → `--font-body`, `Caveat` → `--font-script`; update `metadata`; reduce `page.tsx` to a `<main>` stub.
- [ ] **Step 5:** Run `npm test` → PASS; `npm run build` → success.
- [ ] **Step 6: Commit** `git add -A && git commit -m "chore: tooling, dark tokens, fonts, layout shell"`

### Task 2: Typed content layer

**Files:**
- Create: `src/content/types.ts`, `profile.ts`, `projects.ts`, `experience.ts`, `skills.ts`, `tests/unit/content.test.ts`

**Interfaces:**
- Produces (`types.ts`):
  ```ts
  export type AccentKey = "green" | "blue" | "orange" | "violet";
  export type Stat = { value: string; label: string };
  export type Project = { slug: "chartli"|"resolva"|"bitcoin-prediction"|"content-moderation"; title: string; subtitle: string; pitch: string; accent: AccentKey; stack: string[]; bullets: string[]; origin: "personal"|"final-year"|"orzeh"; video?: string; poster?: string; links: { github?: string; live?: string } };
  export type Role = { company: string; title: string; start: string; end: string; bullets: string[] };
  export type SkillGroup = { label: string; items: string[] };
  export type Profile = { name: string; role: string; headline: string[]; intro: string; email: string; linkedin: string; github: string; resumeHref: string; stats: Stat[]; education: { degree: string; school: string; years: string }; certifications: { name: string; issuer: string }[] };
  ```
  `profile: Profile`, `projects: Project[]`, `getProject(slug: string): Project | undefined`, `experience: Role[]`, `skills: SkillGroup[]`.

- [ ] **Step 1: Failing tests** in `content.test.ts`: (a) `projects` has 4 entries with unique slugs, non-empty `stack`, a valid `accent`; (b) `profile.stats.map(s=>s.value+" "+s.label)` equals `["4 Projects Shipped","3 Roles","89% Backend Test Coverage","95%+ CSAT"]`; (c) `JSON.stringify` of all content contains no `+92` and no `0305`; (d) `getProject("content-moderation").origin === "orzeh"`; (e) `getProject("nope")` is `undefined`; (f) `experience` order is Amazon, Orzeh, Evaxone.
- [ ] **Step 2:** `npx vitest run tests/unit/content.test.ts` → FAIL (modules missing).
- [ ] **Step 3:** Implement the files from the CV (spec §5, §7). Accents: chartli green, resolva blue, bitcoin-prediction orange, content-moderation violet. Merge Chartli's duplicated bullet. `linkedin`/`github` are `""` with a `// PLACEHOLDER` comment; `video`/`poster` omitted until supplied. Case-study narrative beyond CV bullets uses `PLACEHOLDER:` strings.
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5: Commit** `git commit -am "feat: typed content layer from CV"` (after `git add`).

### Task 3: Motion foundation

**Files:**
- Create: `src/lib/motion/gsap.ts`, `src/lib/motion/use-reduced-motion.ts`, `src/components/providers/SmoothScroll.tsx`, `src/components/ui/Reveal.tsx`, `tests/unit/motion.test.tsx`
- Modify: `src/app/layout.tsx` (wrap children in `SmoothScroll`)

**Interfaces:**
- Produces: `useReducedMotion(): boolean` (SSR-safe, false on server, subscribes to `matchMedia("(prefers-reduced-motion: reduce)")`); `gsap.ts` exports `{ gsap, ScrollTrigger, useGSAP }` with plugins registered once; `SmoothScroll({children}): JSX` (adds class `lenis` to `<html>` only when motion allowed); `Reveal({children, delay?: number, className?: string})`.

- [ ] **Step 1: Failing tests:** with `matchMedia` mocked to reduce → `useReducedMotion()` returns `true`, `SmoothScroll` does not add `lenis` class to `document.documentElement`, and `Reveal` renders children visible (no inline `opacity:0`). With no-preference → `SmoothScroll` adds `lenis`.
- [ ] **Step 2:** Run `npx vitest run tests/unit/motion.test.tsx` → FAIL.
- [ ] **Step 3:** Implement. `SmoothScroll`: create `Lenis({ autoRaf:false })`, `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)`; cleanup removes ticker fn and `lenis.destroy()`. `Reveal`: `useGSAP` fade/translate-in via ScrollTrigger; skip when reduced; content visible by default in markup (animate *from*, applied after mount) so no-JS shows content.
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5: Commit** `feat: lenis+gsap motion foundation with reduced-motion handling`.

### Task 4: UI primitives

**Files:**
- Create: `src/components/ui/{Button,GlassCard,TechChip,StatBar,ScriptNote}.tsx`, `tests/unit/ui.test.tsx`

**Interfaces:**
- Produces: `Button({href, variant: "solid"|"outline", icon?: ReactNode, children}): JSX` (renders `<a>`); `GlassCard({accent?: AccentKey, className?, children})`; `TechChip({children})`; `StatBar({stats: Stat[]})`; `ScriptNote({children, rotate?: number, className?})` (uses `font-script`, `aria-hidden`).

- [ ] **Step 1: Failing tests:** `Button` with `href="/x"` renders an `<a href="/x">` with accessible name; `StatBar` renders each stat's value and label; `ScriptNote` is `aria-hidden="true"`; `GlassCard accent="green"` sets `data-accent="green"`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement with Tailwind (glass: translucent surface, 1px low-opacity border, accent glow via CSS var from `data-accent`). Visible `:focus-visible` ring on `Button`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `feat: ui primitives`.

### Task 5: Nav and Footer

**Files:**
- Create: `src/components/layout/{Nav,Footer}.tsx`, `tests/unit/nav.test.tsx`
- Modify: `src/app/page.tsx` or `layout.tsx` to include `Nav`

**Interfaces:**
- Produces: `Nav(): JSX` (client). Desktop left dot-nav with entries `01 Home #home`, `02 About #about`, `03 Projects #projects`, `04 Experience #experience`, `05 Contact #contact`; top bar with logo "AS" and `Let's Talk` (`mailto:` profile email); mobile hamburger menu toggling `aria-expanded`. Active item set via IntersectionObserver. `Footer(): JSX`.

- [ ] **Step 1: Failing tests:** Nav renders five links with the hrefs above; `Let's Talk` href equals `mailto:abdullahshafiqueofficiall@gmail.com`; clicking the hamburger toggles `aria-expanded` `false→true`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `feat: nav and footer`.

### Task 6: Hero (static) with code card and tech rail

**Files:**
- Create: `src/components/sections/Hero.tsx`, `public/media/hero.jpg` (crop of reference image as stand-in), `tests/unit/hero.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Button`, `ScriptNote`, `StatBar`, `GlassCard`, `TechChip`.
- Produces: `Hero(): JSX` (server component, `id="home"`). Contains `<h1>` with the three headline lines "BUILDING", "INTELLIGENT", "SOLUTIONS"; greeting "Hi, I'm Abdullah Shafique"; subtitle "AI Engineer & Software Developer"; CTAs `View My Work → #projects`, `Download Resume → profile.resumeHref` (with `download`); script notes "From Ideas to Impact" and "AI Systems, Products, Real People"; floating "Multi-Agent System" code card (static Python snippet from reference); tech rail Python, FastAPI, LangGraph, Ollama, React, PostgreSQL; `StatBar` with `profile.stats`. Slot: `<div data-hero-field>` for Task 7.

- [ ] **Step 1: Failing tests:** `h1` text contains all three words; both CTAs present with expected hrefs; stat texts match Global Constraints; portrait `<img>` has non-empty `alt`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement per reference layout (condensed display type, left text column, portrait right, code card and rail overlapping). **Step 4:** Run → PASS.
- [ ] **Step 5:** Wire `<Hero/>` into `page.tsx`; run `npm run dev`, view at 1440px against the reference image.
- [ ] **Step 6: Commit** `feat: hero section`.

### Task 7: SceneGate and HeroField 3D

**Files:**
- Create: `src/lib/webgl.ts`, `src/components/three/SceneGate.tsx`, `src/components/three/HeroField.tsx`, `tests/unit/scene-gate.test.tsx`
- Modify: `Hero.tsx` (mount `HeroField` in the slot via `SceneGate`)

**Interfaces:**
- Produces: `hasWebGL(): boolean`; `SceneGate({children, fallback}: {children: ReactNode; fallback: ReactNode}): JSX` (client; renders `children` only if `hasWebGL()` and `!useReducedMotion()` and viewport ≥ 768px; also swaps to `fallback` on `webglcontextlost`); `HeroField(): JSX` — `<Canvas frameloop="demand" dpr={[1,1.5]}>` with a particle/neural-node field reacting to pointer and scroll, `frameloop` paused when off-screen via IntersectionObserver; loaded with `next/dynamic({ssr:false})` from a client wrapper.

- [ ] **Step 1: Failing tests:** `hasWebGL` mocked false → fallback rendered, no `canvas`; reduced motion → fallback; `innerWidth` 500 → fallback; all clear → children rendered; dispatching `webglcontextlost` on the wrapper swaps to fallback.
- [ ] **Step 2:** Run `npx vitest run tests/unit/scene-gate.test.tsx` → FAIL. **Step 3:** Implement `SceneGate`, `hasWebGL` (try creating a context on a detached canvas), then `HeroField` (drei `Points`, subtle accent-tinted colour; fallback is a CSS radial-gradient + static dotted SVG). **Step 4:** Run → PASS.
- [ ] **Step 5:** Manually verify in browser: field moves with pointer, scroll; DevTools "Emulate prefers-reduced-motion" shows fallback.
- [ ] **Step 6: Commit** `feat: SceneGate and hero 3D field`.

### Task 8: About and Skills

**Files:**
- Create: `src/components/sections/{About,Skills}.tsx`, `tests/unit/about-skills.test.tsx`

**Interfaces:**
- Produces: `About()` (`id="about"`: summary paragraph from CV, education, certifications); `Skills()` (five groups from `skills`, each a labelled list).

- [ ] **Step 1: Failing tests:** About contains "Government College University" and both certification issuers (Accenture, BCG X); Skills renders group labels `Languages, AI/ML, ML Frameworks, Data, Backend/Tools` and every item in `skills` data appears as text (e.g. "TensorFlow", "Docker").
- [ ] **Step 2–4:** Run → FAIL; implement; run → PASS. **Step 5: Commit** `feat: about and skills`.

### Task 9: ProjectVideo and FeaturedProjects

**Files:**
- Create: `src/components/media/ProjectVideo.tsx`, `src/components/sections/FeaturedProjects.tsx`, `tests/unit/projects.test.tsx`

**Interfaces:**
- Produces: `ProjectVideo({src?: string; poster?: string; accent: AccentKey; title: string}): JSX` (client; no `src` → gradient fallback `div[data-fallback]`; with `src` → `<video muted loop playsInline preload="none">` that plays in view/hover; `onError` swaps to fallback); `FeaturedProjects()` (`id="projects"`; four cards linking `/projects/{slug}` with title, subtitle, pitch, stack chips, accent glow, tilt on pointer-fine devices only; "View All Projects" link).

- [ ] **Step 1: Failing tests:** `ProjectVideo` without `src` renders `[data-fallback]` and no `<video>`; with `src` then firing `error` on the video swaps to fallback; `FeaturedProjects` renders 4 links with hrefs `/projects/chartli`, `/projects/resolva`, `/projects/bitcoin-prediction`, `/projects/content-moderation`.
- [ ] **Step 2–4:** Run → FAIL; implement; run → PASS. **Step 5: Commit** `feat: featured projects and video component`.

### Task 10: Experience timeline

**Files:**
- Create: `src/components/sections/Experience.tsx`, `tests/unit/experience.test.tsx`

**Interfaces:**
- Produces: `Experience()` (`id="experience"`; vertical timeline; line draws on scroll via `useGSAP` unless reduced motion).

- [ ] **Step 1: Failing test:** renders three roles in order with date ranges `Mar 2026 – Aug 2026`, `Jul 2025 – Feb 2026`, `Apr 2024 – Jun 2024`; each role's first bullet appears.
- [ ] **Step 2–4:** Run → FAIL; implement; run → PASS. **Step 5: Commit** `feat: experience timeline`.

### Task 11: Approach and StackOrbit

**Files:**
- Create: `src/components/sections/Approach.tsx`, `src/components/three/StackOrbit.tsx`, `tests/unit/approach.test.tsx`

**Interfaces:**
- Consumes: `SceneGate` (Task 7).
- Produces: `Approach()` (heading "CODE DESIGN SOLVE REPEAT"; script note "Better Systems, Happier People"); `StackOrbit()` (R3F orbit of Ideas → Build → Test → Deploy nodes around the stack, `frameloop="demand"`, DPR ≤1.5, paused off-screen); fallback is a static four-step list that is also the accessible text version, always in the DOM.

- [ ] **Step 1: Failing tests:** four steps `Ideas, Build, Test, Deploy` present as text even when `SceneGate` shows fallback; no canvas under reduced motion.
- [ ] **Step 2–4:** Run → FAIL; implement; run → PASS.
- [ ] **Step 5:** Manual browser check of the orbit. **Step 6: Commit** `feat: approach section and stack orbit`.

### Task 12: Contact and resume

**Files:**
- Create: `src/components/sections/Contact.tsx`, `public/Abdullah-Shafique-Resume.pdf` (placeholder PDF until supplied), `tests/unit/contact.test.tsx`

**Interfaces:**
- Produces: `Contact()` (`id="contact"`): `mailto:` email link, LinkedIn and GitHub links rendered only when the profile URL is non-empty, resume download link.

- [ ] **Step 1: Failing tests:** email link href is `mailto:abdullahshafiqueofficiall@gmail.com`; with empty `linkedin` no LinkedIn link renders; rendered HTML has no `+92`/`tel:`.
- [ ] **Step 2–4:** Run → FAIL; implement; run → PASS. **Step 5:** assemble all sections in `page.tsx` in order Hero, About, FeaturedProjects, Experience, Approach, Skills, Contact. **Step 6: Commit** `feat: contact section and page assembly`.

### Task 13: Case-study pages

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx`, `tests/unit/case-study.test.tsx`

**Interfaces:**
- Consumes: `getProject`, `projects`, `ProjectVideo`.
- Produces: `generateStaticParams(): {slug: string}[]` from `projects`; page renders hero `ProjectVideo`, pitch, bullets, stack chips, optional GitHub/live links, "Next project" link cycling through `projects`; unknown slug calls `notFound()`; `generateMetadata` per project.

- [ ] **Step 1: Failing tests:** `generateStaticParams()` returns the four slugs; the page for `resolva` shows "Resolva" and a link to the next project; for `does-not-exist` it throws Next's not-found error (assert via `notFound` mock called).
- [ ] **Step 2–4:** Run → FAIL; implement; run → PASS; `npm run build` shows four static `/projects/*` routes. **Step 5: Commit** `feat: case-study pages`.

### Task 14: E2E, accessibility, responsive and performance pass

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write e2e tests** (webServer `npm run build && npm start`): (a) with JS disabled (`javaScriptEnabled:false`), home HTML contains "INTELLIGENT", all four project links and the mailto link; (b) clicking a dot-nav entry scrolls `#projects` into view; (c) clicking each project card lands on its case-study page with the project title as `h1`; (d) `emulateMedia({reducedMotion:"reduce"})` → `locator("canvas")` count is 0 and `html` lacks class `lenis`; (e) `/projects/does-not-exist` returns status 404; (f) at 375px width `document.documentElement.scrollWidth <= innerWidth`; (g) page text contains no `+92`.
- [ ] **Step 2:** Run `npx playwright test` → fix any failures (not by weakening assertions).
- [ ] **Step 3:** Run Lighthouse on `/` (desktop); expected LCP < 2.5s, CLS < 0.1, accessibility ≥ 95; fix regressions (image sizing, font display, lazy 3D).
- [ ] **Step 4:** Manual visual check at 375 / 768 / 1440 against the reference image.
- [ ] **Step 5: Commit** `test: e2e, a11y and performance pass`.

---

## Self-Review
- **Spec coverage:** §5 sections → Tasks 6, 8–12; §6 case studies → 13; §8 visual system → 1, 4; §9 fallbacks → 7, 9, 11; §10 performance → 7, 11, 14; §11 testing → every task + 14; §13 open items → `PLACEHOLDER:` markers (Task 2), placeholder resume (Task 12).
- **Type consistency:** `Project`, `Role`, `SkillGroup`, `Stat`, `AccentKey` defined in Task 2 and used unchanged in 4, 6, 8–13; `SceneGate` defined in Task 7 and consumed in 11; `useReducedMotion` defined in Task 3 and consumed in 7, 10, 11.
- **Review Focus coverage:** item 1 → Task 14(a); 2 → Task 9; 3 → Tasks 3, 7, 14(d); 4 → Tasks 13, 14(e); 5 → Task 7.
