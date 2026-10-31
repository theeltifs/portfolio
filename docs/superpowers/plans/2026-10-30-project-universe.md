# Project Universe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Featured Projects grid with a pinned, scroll-scrubbed "Project Universe" (CSS orb, four projects), with a stacked fallback for mobile, touch and reduced motion.

**Architecture:** `FeaturedProjects` becomes a client wrapper that resolves a mode (`universe` / `stacked` / `stacked-reduced`) with `matchMedia`. Universe mode builds one paused GSAP timeline (one labelled segment per project) driven by a single pinned `ScrollTrigger`. Panels, orb and progress are small focused components shared across modes. SSR emits the stacked markup so all content and links exist without JS.

**Tech Stack:** Next 16.4 (App Router, React 19.3, React Compiler), Tailwind v4, `gsap` 3.15 + `@gsap/react`, Lenis (existing), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-30-project-universe-design.md`

## Global Constraints

- No new dependencies; no three.js / R3F / canvas for the orb.
- Animate only `transform`, `opacity` and the `--orb` CSS variable. No layout properties; no animated `filter`.
- No scroll hijacking: no wheel/touch handlers, no `snap`. Native scroll + existing Lenis only.
- Pin length is `projects.length * innerHeight` (about 100vh per project, 4 projects).
- Segment fractions per project: expand 0.20, burst 0.10, reveal 0.20, hold 0.30, collapse 0.20 (sum 1.0).
- 12 particles, fixed precomputed angles (no `Math.random` at render time).
- Mode breakpoint: universe only when width >= 768px AND `(pointer: fine)` AND no `prefers-reduced-motion: reduce`. SSR and first client render use stacked markup.
- Stacked reduced motion: opacity fades only, no pin, no particles, no parallax.
- Light theme only; reuse `GlassCard`, `TechChip`, `Button`, `ProjectVideo`, existing accent variables. Section keeps `id="projects"`.
- Each project appears as exactly ONE `a[href="/projects/<slug>"]` in the server HTML (existing e2e asserts count 1).
- Inactive universe panels get `inert` and `aria-hidden="true"`.
- Per `AGENTS.md`, read the relevant Next.js guide in `node_modules/next/dist/docs/` before writing client-component code.
- Follow existing style: `"use client"` where needed, `@/` imports, `useGSAP(..., { scope, dependencies })`, `useReducedMotion`.
- Commit messages end with the line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Test command: `npx vitest run <file>`. Full gate: `npm run lint && npm test && npm run build`.

## Review Focus

1. Resize across 768px or toggling reduced motion while scrolled inside the section: the pin must be killed and inline styles reverted; no leftover spacer, no stuck `inert`. (Task 8)
2. JavaScript disabled / server HTML: all four projects and exactly one link per slug present. (Task 9, existing e2e)
3. Progress exactly at 0 and 1 (top of page / past the end): active index clamps to 0 and `count-1`, never `count`. (Task 6)
4. Focus lands on an element inside an inactive panel (browser find, programmatic focus): section scrolls to that project's segment. (Task 8)
5. A project with no `video`/`poster` (all four today): gradient fallback renders inside the panel without errors. (Task 4)

---

## Prerequisites (before Task 1)

- [ ] Hero-intro work is committed by the user, and the tree is clean.
- [ ] Create the branch: `git checkout -b feat/project-universe`.
- [ ] Read the Next.js 16 client-component and hydration guides in `node_modules/next/dist/docs/`.

---

### Task 1: Project copy

**Files:**
- Modify: `src/content/projects.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: `Project` type in `src/content/types.ts` (unchanged).
- Produces: `projects` with real `subtitle`, `pitch` (max 2 sentences), `stack` (1 to 6 chips), and `bullets` for all four.

- [ ] **Step 1: Draft copy from the CV text in the spec (section 4) and show it to the user.** Do not write it to the file until the user approves wording.
- [ ] **Step 2: Add failing tests to `content.test.ts`:**
  - `no project copy contains PLACEHOLDER`: `JSON.stringify(projects)` does not contain `"PLACEHOLDER"`.
  - `stacks have 1 to 6 chips`: for each project `stack.length` is between 1 and 6.
  - `chartli is described as a medical scribe`: `getProject("chartli")?.subtitle` matches `/medical scribe/i`.
- [ ] **Step 3: Run `npx vitest run tests/unit/content.test.ts`.** Expected: the three new tests FAIL.
- [ ] **Step 4: Replace the placeholder fields in `projects.ts` with the approved copy.** Keep `slug`, `accent`, `origin`, `links`. Keep Chartli's "89% backend test coverage" bullet.
- [ ] **Step 5: Run the file again.** Expected: all PASS (existing content tests included).
- [ ] **Step 6: Commit** `git add src/content/projects.ts tests/unit/content.test.ts && git commit -m "feat: real project copy for the universe section"`.

### Task 2: Universe mode hook

**Files:**
- Create: `src/components/sections/universe/use-universe-mode.ts`
- Test: `tests/unit/universe-mode.test.tsx`

**Interfaces:**
- Produces: `export type UniverseMode = "universe" | "stacked" | "stacked-reduced"` and `export function useUniverseMode(): UniverseMode`.

- [ ] **Step 1: Write failing tests** using `renderHook` and a `mockMatchMedia({ reduced, narrow, coarse })` helper like the one in `motion.test.tsx` (answers `prefers-reduced-motion`, `(min-width: 768px)` and `(pointer: fine)` queries):
  - `returns "stacked-reduced" when reduced motion is preferred`.
  - `returns "stacked" when narrow` and `returns "stacked" when pointer is coarse`.
  - `returns "universe" when wide, fine pointer, motion allowed`.
  - `server snapshot is "stacked"`: `renderToString` of a component that prints the mode gives `stacked`.
- [ ] **Step 2: Run** `npx vitest run tests/unit/universe-mode.test.tsx`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement `useUniverseMode`** with `useSyncExternalStore` subscribing to all three media queries; server snapshot `"stacked"`. Reduced motion wins over everything. Reuse `useReducedMotion` only if it keeps the three subscriptions in one store; otherwise read the query directly.
- [ ] **Step 4: Run the file.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: universe mode hook`.

### Task 3: Orb styles

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces CSS classes: `.orb` (stage-level, reads `var(--orb)`), `.orb-core`, `.orb-glow`, `.orb-ring`, `.orb-particle`, `.orb-static` (non-animated variant sized by its parent), `.orb-wash` (very subtle tinted background using `color-mix(in srgb, var(--orb) 8%, transparent)`), and `.fade-in-view` (opacity-only fade, see below). Default `--orb: var(--accent-green)`.

- [ ] **Step 1: Add the classes** after the existing `glass-card` rules. Core is a radial gradient from a white highlight to `var(--orb)`; glow is a `box-shadow` plus a blurred pseudo-element on a static layer; rings are 1px borders at low opacity. No `animation` on `.orb-static`.
- [ ] **Step 2: Add `.fade-in-view`** inside `@media (prefers-reduced-motion: reduce)`: an opacity-only keyframe using `animation-timeline: view()` and `animation-range: entry 0% entry 40%`, wrapped in `@supports (animation-timeline: view())`. Without support the element is simply visible.
- [ ] **Step 3: Run `npm run build`.** Expected: succeeds (CSS parses).
- [ ] **Step 4: Commit** `feat: orb styles`.

### Task 4: Orb and ProjectPanel

**Files:**
- Create: `src/components/sections/universe/Orb.tsx`
- Create: `src/components/sections/universe/ProjectPanel.tsx`
- Test: `tests/unit/universe-parts.test.tsx`

**Interfaces:**
- Produces:
  - `export const ORB_PARTICLES: readonly { angle: number; distance: number }[]` (length 12, fixed values).
  - `export function Orb(props: { live?: boolean; accent?: AccentKey; className?: string })`. Root has `aria-hidden="true"` and `data-orb`. When `live` it renders 12 `[data-particle]` elements; otherwise none and adds `orb-static`. When `accent` is set it sets `style={{ "--orb": \`var(--accent-${accent})\` }}`.
  - `export function ProjectPanel(props: { project: Project; headingId?: string })`. Renders `h3` (id = `headingId`), `pitch`, `TechChip` per stack item, `ProjectVideo`, and one `Button variant="outline"` "View case study" to `/projects/<slug>`.
- Consumes: `Project`, `AccentKey`, `ProjectVideo`, `TechChip`, `Button`.

- [ ] **Step 1: Write failing tests:**
  - `Orb live renders 12 aria-hidden particles`; `Orb static renders none and has orb-static`.
  - `ORB_PARTICLES has 12 entries with finite numbers`.
  - `ProjectPanel renders title, chips and exactly one case-study link` for `getProject("chartli")`.
  - `ProjectPanel renders the gradient fallback when the project has no video` (`[data-fallback]` present, no `<video>`).
- [ ] **Step 2: Run** `npx vitest run tests/unit/universe-parts.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement both components.** Orb layers in order: glow, core, two rings, particles. ProjectPanel is a server-safe component (no hooks).
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: orb and project panel`.

### Task 5: Stacked projects

**Files:**
- Create: `src/components/sections/universe/StackedProjects.tsx`
- Test: `tests/unit/stacked-projects.test.tsx`

**Interfaces:**
- Produces: `export function StackedProjects(props: { reduced: boolean })`. Renders a `<ul>` of four `<li>`; each has a static `Orb` (accent), then `GlassCard` containing `ProjectPanel`. Not reduced: each `li` wrapped in `Reveal`. Reduced: each `li` has class `fade-in-view` and no `Reveal`.
- Consumes: `Orb`, `ProjectPanel`, `GlassCard`, `Reveal`, `projects`.

- [ ] **Step 1: Write failing tests:**
  - `renders four cards with one link per slug` (loop the four slugs, `querySelectorAll` length 1).
  - `static orbs only, no particles` (`[data-particle]` count 0).
  - `reduced mode applies fade-in-view and not Reveal wrappers` (class present on each `li`).
- [ ] **Step 2: Run, expect FAIL. Step 3: Implement. Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `feat: stacked projects fallback`.

### Task 6: Timeline builder and pure helpers

**Files:**
- Create: `src/components/sections/universe/universe-timeline.ts`
- Test: `tests/unit/universe-timeline.test.ts`

**Interfaces:**
- Produces:
  - `export const SEGMENT = { expand: 0.2, burst: 0.1, reveal: 0.2, hold: 0.3, collapse: 0.2 } as const`.
  - `export function activeIndexFor(progress: number, count: number): number` (clamped to `0..count-1`).
  - `export function segmentScrollTop(start: number, end: number, index: number, count: number): number`.
  - `export type TimelineTargets = { stage: HTMLElement; orb: HTMLElement; particles: HTMLElement[]; panels: HTMLElement[] }`.
  - `export function buildUniverseTimeline(targets: TimelineTargets, accents: string[]): gsap.core.Timeline`: paused, `duration() === accents.length`, labels `project-0` to `project-<n-1>` at integer times.
- Consumes: `gsap` from `@/lib/motion/gsap`. `accents` are resolved color strings (one per project).

- [ ] **Step 1: Write failing tests:**
  - `activeIndexFor(0,4)===0`, `(0.25,4)===1`, `(0.999,4)===3`, `(1,4)===3`, `(-0.1,4)===0`, `(1.2,4)===3`.
  - `SEGMENT fractions sum to 1`.
  - `segmentScrollTop(1000, 5000, 2, 4)===3000`.
  - `buildUniverseTimeline` with detached `div`s: `tl.duration()===4`, `tl.labels` has `project-0`..`project-3` at 0,1,2,3.
  - Seeking `tl.progress(0.375)` (mid reveal/hold of project 1) leaves panel 1 `opacity` close to 1 and panel 0 `opacity` 0.
  - Seeking `tl.progress(0)` sets every panel `opacity` to 0 and the stage `--orb` to `accents[0]`; then seeking forward and back to 0 restores the same values (reversibility).
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** One `gsap.timeline({ paused: true, defaults: { ease: "none" } })`. For each project `i`, at `i + offset`: orb scale idle 1 -> 1.5 (expand) -> 1.1 (burst, particles scatter by `ORB_PARTICLES` and fade out) -> 1 (collapse); panel opacity/y 0 -> 1 over reveal, stays through hold, back to 0 over collapse. Tween `--orb` on `stage` from `accents[i]` to `accents[i+1]` starting at `i + 0.8`, duration `0.3` (skipped for the last project). Particles reset opacity 0 at each segment start. Set initial state with `tl.set` at time 0 so seeking back is exact.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `feat: universe timeline builder`.

### Task 7: Progress dots

**Files:**
- Create: `src/components/sections/universe/UniverseProgress.tsx`
- Test: add to `tests/unit/universe-parts.test.tsx`

**Interfaces:**
- Produces: `export function UniverseProgress(props: { projects: Project[]; activeIndex: number; onSelect: (index: number) => void })`. Renders a `<nav aria-label="Project progress">` with one `<button type="button" aria-label="Go to <title>">` per project (`aria-current="step"` on the active one) and a counter `01 / 04` plus active title. Buttons only; no anchors (keeps one link per slug).

- [ ] **Step 1: Failing tests:** four buttons with names `Go to Chartli`, ...; counter shows `02 / 04` for `activeIndex=1`; clicking the third calls `onSelect(2)`; active has `aria-current="step"`.
- [ ] **Step 2: Run, FAIL. Step 3: Implement. Step 4: Run, PASS.**
- [ ] **Step 5: Commit** `feat: universe progress dots`.

### Task 8: ProjectUniverse (pinned stage)

**Files:**
- Create: `src/components/sections/universe/ProjectUniverse.tsx`
- Test: `tests/unit/project-universe.test.tsx`

**Interfaces:**
- Consumes: `buildUniverseTimeline`, `activeIndexFor`, `segmentScrollTop`, `Orb`, `ProjectPanel`, `UniverseProgress`, `gsap`/`ScrollTrigger`/`useGSAP`.
- Produces: `export function ProjectUniverse()`. DOM: `<section id="projects" aria-labelledby="projects-heading">` containing a skip link (`href="#experience"`, visually hidden until focus, text "Skip projects"), the pinned stage, heading `h2#projects-heading` "Featured Projects", orb wrapper (parallax target) with `<Orb live />`, four panel wrappers (`data-panel`), `UniverseProgress`, and a polite live region (`role="status"`) announcing `Project N of 4: <title>` on active-index change only. Inactive panel wrappers: `inert` and `aria-hidden="true"`.
- ScrollTrigger config: `ScrollTrigger.create({ id: "project-universe", trigger: sectionRef, pin: true, start: "top top", end: () => "+=" + window.innerHeight * projects.length, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true, animation: tl, onUpdate: (self) => setActive(activeIndexFor(self.progress, projects.length)) })`. Everything lives in `useGSAP` with `scope`, so cleanup reverts the pin.
- Behaviors: dot `onSelect(i)` calls `window.scrollTo({ top: segmentScrollTop(st.start, st.end, i, n), behavior: "smooth" })` using `ScrollTrigger.getById("project-universe")`; a `focusin` listener on the section scrolls to the segment of any hidden panel that received focus; on fine pointers a `gsap.quickTo` pair moves the orb wrapper by at most 12px toward the cursor and is removed on cleanup.

- [ ] **Step 1: Write failing tests.** Mock `@/lib/motion/gsap` with `vi.mock`, keeping real `gsap` and `useGSAP` (import actual) but overriding `ScrollTrigger` with a stub `{ create: vi.fn(() => fakeTrigger), getById: vi.fn(() => fakeTrigger), refresh: vi.fn(), update: vi.fn() }` where `fakeTrigger = { start: 1000, end: 5000, kill: vi.fn() }`. Mock `window.scrollTo`. Tests:
  - `creates one pinned trigger with pin, scrub, anticipatePin and no snap` (inspect `create.mock.calls[0][0]`).
  - `only the first panel is interactive initially` (panels 1-3 have `inert` and `aria-hidden="true"`; panel 0 has neither).
  - `onUpdate moves the active panel`: call the captured `onUpdate({ progress: 0.8 })`, expect panel 3 active and panel 0 inert; live region text `Project 4 of 4: Content Moderation Platform`.
  - `onUpdate at progress 1 keeps the last panel active` (never index 4).
  - `clicking a dot scrolls to its segment`: click `Go to Resolva` expects `scrollTo` with `top: 2000`.
  - `focusing a link inside an inactive panel scrolls to its segment`: focus the Bitcoin link (force `focusin`) expects `scrollTo` with `top: 3000`.
  - `skip link targets #experience`.
  - `unmount kills the trigger` (kill called; no leftover `inert` needed).
- [ ] **Step 2: Run** `npx vitest run tests/unit/project-universe.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement `ProjectUniverse`** per the interface block. Resolve accent color strings with `getComputedStyle(document.documentElement).getPropertyValue("--accent-<key>").trim()` and fall back to the hex values in `globals.css` if empty. Call `ScrollTrigger.refresh()` after fonts load (`document.fonts?.ready`).
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit** `feat: pinned project universe`.

### Task 9: Wire up FeaturedProjects, remove the grid

**Files:**
- Modify: `src/components/sections/FeaturedProjects.tsx`
- Delete: `src/components/sections/TiltCard.tsx`
- Modify: `tests/unit/projects.test.tsx`, `tests/e2e/site.spec.ts`

**Interfaces:**
- Produces: `export function FeaturedProjects()` (client): `useUniverseMode()`; `universe` -> `<ProjectUniverse />`; otherwise `<section id="projects" aria-labelledby="projects-heading">` with the same `h2#projects-heading` "Featured Projects" and `<StackedProjects reduced={mode === "stacked-reduced"} />`.

- [ ] **Step 1: Update `projects.test.tsx`** keeping its intent: `FeaturedProjects` (default mocked `matchMedia`, stacked) has exactly one link per slug; add `renders the Featured Projects heading and id="projects"`; add `renders Universe markup when the mode is universe` (mock `matchMedia` wide + fine pointer, assert `Skip projects` link exists).
- [ ] **Step 2: Run** `npx vitest run tests/unit/projects.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement the wrapper and delete `TiltCard.tsx`.** Confirm with `Grep` that nothing else references `TiltCard`. The "View All Projects" link is gone.
- [ ] **Step 4: Run the whole unit suite** `npm test`. Expected: PASS.
- [ ] **Step 5: Keep existing e2e valid.** In `tests/e2e/site.spec.ts`, `card opens case study: <slug>` clicks a link that is inert at desktop width when its panel is inactive. Update it to first click `Go to <title>` in the progress nav (or set a narrow viewport via `test.use`) and then click the link. The no-JS test needs no change (stacked markup, one link per slug). Do not add new e2e tests (decision: unit tests only).
- [ ] **Step 6: Commit** `feat: replace project grid with project universe`.

### Task 10: Verification

- [ ] **Step 1: Run `npm run lint && npm test && npm run build`.** Expected: all pass.
- [ ] **Step 2: Run the existing e2e suite** `npx playwright test`. Expected: pass.
- [ ] **Step 3: Manual pass in `npm run dev`** (use the `run` skill): scroll the section down and back up on desktop; confirm orb recolours green -> blue -> orange -> violet and exactly reverses; resize across 768px mid-section; toggle reduced motion in DevTools; keyboard-tab through the dots and the visible link; confirm the skip link works.
- [ ] **Step 4: Report results faithfully**, including anything not verified.

---

## Self-review notes

- **Spec coverage:** content (T1), modes/breakpoints/SSR (T2, T9), orb CSS/particles (T3, T4), stacked + reduced fades (T3, T5), timeline phases/recolour/reversibility (T6), progress dots (T7), pin, a11y (inert, live region, skip link, focus scroll), parallax (T8), grid and `TiltCard` removal, tests (T9). The spec's "cursor parallax disabled in stacked modes" holds since only `ProjectUniverse` implements it.
- **Known deviation to confirm with the user:** the existing e2e case-study click test must change (T9 step 5) even though no new e2e tests are added.
- **Names used across tasks:** `UniverseMode`, `useUniverseMode`, `ORB_PARTICLES`, `Orb`, `ProjectPanel`, `StackedProjects`, `SEGMENT`, `activeIndexFor`, `segmentScrollTop`, `buildUniverseTimeline`, `UniverseProgress`, `ProjectUniverse`, trigger id `"project-universe"`.
