# Project Universe: Design Spec

Date: 2026-10-30
Status: Draft for review
Branch: new branch from `feat/portfolio`, created after the hero-intro work is committed

## 1. Goal

Replace the 2x2 Featured Projects grid with a scroll-driven "Project Universe". A glowing CSS orb expands, bursts into a few particles and reveals the active project's title, description, tech stack and optional visual. On further scroll the content collapses back into the orb, which recolours and becomes the next project. Projects, in order: Chartli, Resolva, Bitcoin Price Prediction, Content Moderation Platform.

### Success criteria
- Scrubbed, fully reversible animation driven by one pinned GSAP ScrollTrigger.
- No scroll hijacking: native scroll (with the existing Lenis) is never intercepted or snapped.
- No new dependencies and no WebGL or three.js for the orb.
- Looks native to the existing design system (light theme, four accent colours, display/body fonts, `GlassCard`, `TechChip`).
- Usable on phones and with `prefers-reduced-motion`, without the pin.
- Keyboard and screen-reader users can reach every project.

### Non-goals
- A projects index page or "View All Projects" link (dropped).
- Dark theme for the section.
- Changes to the `/projects/[slug]` case-study pages beyond the content they read.
- New media assets (videos or screenshots are optional and added later).

## 2. Existing code this builds on

- `src/components/sections/FeaturedProjects.tsx`: current grid, `id="projects"` (Nav links to `#projects`). Server component.
- `src/content/projects.ts` and `types.ts`: `Project` type with `slug`, `title`, `subtitle`, `pitch`, `accent`, `stack`, `bullets`, `video?`, `poster?`. Accents already map: Chartli green, Resolva blue, Bitcoin orange, Content Moderation violet.
- `src/lib/motion/gsap.ts`: registers `gsap`, `ScrollTrigger`, `useGSAP`.
- `src/components/providers/SmoothScroll.tsx`: Lenis driven by `gsap.ticker`, calling `ScrollTrigger.update`. Disabled for reduced motion.
- `src/lib/motion/use-reduced-motion.ts`: `useReducedMotion()` hook.
- `GlassCard`, `TechChip`, `Reveal`, `ProjectVideo` (with gradient fallback).
- `TiltCard` is used only by `FeaturedProjects`, so it is removed with the grid.
- `tests/unit/projects.test.tsx` asserts four links to `/projects/<slug>`; this must keep passing (updated as needed, intent preserved).

Per `AGENTS.md`, Next.js 16 has breaking changes. Before implementation, read the relevant guides in `node_modules/next/dist/docs/` (client components, hydration, `use client` boundaries).

## 3. Architecture

`FeaturedProjects.tsx` keeps `id="projects"` and becomes a thin client wrapper that picks a mode:

| Mode | Condition | Experience |
|---|---|---|
| `universe` | width >= 768px, fine pointer, no reduced motion | Pinned, scrubbed orb sequence |
| `stacked` | width < 768px, or `(pointer: coarse)` | Stacked cards, small static orb accent, `Reveal` on scroll |
| `stacked-reduced` | `prefers-reduced-motion: reduce` (any size) | Same stacked layout, opacity fades only, no movement or scaling |

Mode is resolved after mount via `matchMedia`. The server and first client render emit the stacked markup (all content present, no pin), then upgrade to `universe` when eligible. This keeps SSR content complete and avoids hydration mismatch. The mode listens to `matchMedia` changes so resizing or toggling the OS setting cleans up and rebuilds correctly (`useGSAP` with `dependencies` and `revertOnUpdate`).

### Files (new, under `src/components/sections/universe/`)
- `ProjectUniverse.tsx`: pinned version; owns the master timeline and ScrollTrigger.
- `Orb.tsx`: CSS orb layers and particle dots.
- `ProjectPanel.tsx`: title, description, chips, `ProjectVideo`, case-study link. Shared by all modes.
- `UniverseProgress.tsx`: dots plus `01 / 04` counter.
- `StackedProjects.tsx`: simple version.
- `use-universe-mode.ts`: resolves mode from `matchMedia` and `useReducedMotion`.

### Removed
- `TiltCard.tsx` and the "View All Projects" link.

## 4. Content

`projects.ts` copy is drafted from the CV and approved before it is finalized. Draft shown per project: title, 2-sentence description (`pitch`), up to 6 chips (`stack`), "View case study" link. Bullets stay in the data for the case-study pages.

Source material:
- **Chartli**: AI medical scribe turning typed notes, dictated audio or conversations into structured SOAP notes. Llama 3.3 70B via Groq, Whisper Large v3 Turbo, FastAPI, SQLAlchemy, React/Vite, PIN-based access, 89% backend test coverage. Subtitle is corrected from "Chart creation platform" to the medical-scribe description.
- **Resolva**: confidence-scored AI support agent with RAG; low-confidence answers escalate to human agents by email via Resend. LangGraph, ChromaDB, sentence-transformers, Groq-hosted LLaMA 3.1 70B, FastAPI, React/Vite (chat, tickets, analytics, KB upload).
- **Bitcoin Price Prediction** (final-year project): hybrid ML. LSTM, ARIMA and XGBoost on Bitcoin, commodities and news data; tuned and compared on MAE and RMSE; best-model, individual and averaged-ensemble options.
- **Content Moderation Platform** (Orzeh Technologies): Python agents for moderation, map-reduce conversation summarization, proactive risk detection and a RAG Q&A chatbot on a local Ollama LLM. sentence-transformers embeddings with cosine search over Mattermost conversations, with message-level citations. Multi-phase detection (regex PII and leetspeak, VADER sentiment, LLM verification). Async FastAPI with JWT, role-based access and auto-scheduling; React frontend with agent monitoring, Chart.js and PDF export.

Open item: confirm Orzeh permits describing the Content Moderation Platform at this level.

The `Project` type already allows the origin tags; `origin` values are reviewed against the final copy.

## 5. Universe mode (desktop)

### Layout
A full-viewport pinned stage (`100svh`). Orb on the left, content on the right (split layout). Section heading "Featured Projects" sits top-left. `UniverseProgress` sits at the bottom. All four `ProjectPanel`s are stacked in the same grid cell; only the active one is visible.

### Scroll length
About 100vh per project, so about 400vh of scroll in total: `end: () => "+=" + innerHeight * projects.length`. `pin: true`, `scrub: true` (or a small number such as 0.6 for smoothing), `anticipatePin: 1`, `invalidateOnRefresh: true`. No `snap` and no wheel handlers.

### Master timeline
One `gsap.timeline` with `defaults: { ease: "none" }` and one labelled segment of equal length per project. Per segment:
1. **Expand** (about 20%): orb scales up, glow intensity rises.
2. **Burst** (about 10%): about 12 particles fly outward on transforms and fade; orb eases to a smaller size.
3. **Reveal** (about 20%): panel fades and slides in (opacity and transform only), staggered title, description, chips, visual.
4. **Hold** (about 30%): content readable, orb breathes at low amplitude.
5. **Collapse** (about 20%): panel fades and moves back toward the orb; orb returns to idle size.
6. **Recolour**: during collapse and the start of the next expand, the `--orb` CSS variable tweens from this accent to the next (smooth blend). The last project skips the recolour out.

Because the whole thing is one scrubbed timeline, reverse scrolling replays it exactly mirrored. A short intro (the first project's expand) and outro (the last project's collapse) are included so entering and leaving the section feels continuous.

### Orb (CSS only)
Layered elements, no canvas or WebGL:
- Core: radial gradient from a soft white highlight to `--orb`.
- Glow: `box-shadow` and a blurred pseudo-element using `color-mix(in srgb, var(--orb) ..., transparent)`.
- Rings: one or two thin border rings with low opacity.
- Light wash: a very subtle tinted radial gradient on the section background that follows `--orb`, keeping the section light.

Colour comes from `--orb`, tweened by the timeline from the existing accent variables. `will-change` is limited to `transform, opacity` and is only applied while the section is in view. No layout or paint-heavy property is animated. `filter: blur` is used on a static layer only and never animated.

### Particles
12 absolutely-positioned dots (small circles in `--orb`), positioned and scattered by the timeline via transforms and opacity. They are decorative (`aria-hidden`), with fixed pre-computed angles and distances (no randomness at render time, so SSR and hydration stay stable).

### Cursor parallax
On fine pointers only, the orb shifts a few pixels toward the cursor. Implemented with `gsap.quickTo` on a wrapper element, throttled by the GSAP ticker. Disabled in the stacked modes and for reduced motion, and removed on cleanup. Parallax acts on a wrapper so it never conflicts with the timeline's transforms on the orb itself.

### Progress
`UniverseProgress` shows four dot buttons and a `01 / 04` counter with the project title. The active dot follows `onUpdate` progress. Each dot is a real `<button>` with an accessible name ("Go to Chartli"); activating it scrolls to that segment's start via `lenis`/`window.scrollTo` to the computed position. Smooth scroll comes from the existing Lenis; no custom scroll-jacking.

### Accessibility in universe mode
- All four panels remain in the DOM in reading order. Inactive panels get `inert` and `aria-hidden="true"` (updated from the timeline's active-index callback), so only the visible panel is focusable.
- The section is a labelled landmark (`aria-labelledby` on the heading). The active project is announced through a polite live region (project name and position) that updates only when the active index changes.
- Tabbing onto a dot or the visible panel's link works naturally. If focus lands on an element in a hidden panel (for example through browser find), the section scrolls to that project's segment.
- A "Skip projects" link is visually hidden until focused, placed before the pinned stage, and targets the element after the section.
- Visible focus rings reuse the existing `focus-visible:outline-2 outline-fg` style.

## 6. Stacked modes (mobile, touch, reduced motion)

`StackedProjects` renders four `GlassCard`s in a single column (two columns for `md` reduced-motion on a large screen). Each card shows a small static orb in its accent colour above the title (a still glow with no pulsing), then description, chips, optional `ProjectVideo`, and the case-study link.
- Mobile and touch: cards use the existing `Reveal` on scroll.
- Reduced motion: opacity fades only (no translate, scale or parallax), no pin, no particles, `ProjectVideo` does not autoplay on scroll.
- Neither mode creates a pinned ScrollTrigger.

## 7. Performance and robustness

- Animate only `transform` and `opacity` (plus one CSS variable on the stage). Nothing animates layout.
- One ScrollTrigger and one timeline; created and reverted inside `useGSAP` scope with `dependencies` including the mode, so mode changes clean up fully.
- `ProjectVideo` already pauses when off screen; the pinned stage only mounts the active panel's video as `preload="none"` plays when visible.
- Window resize and font load call `ScrollTrigger.refresh`; `invalidateOnRefresh` recalculates the scroll distance.
- Content is complete in the initial HTML, so there is no content loss if JS fails.

## 8. Testing (unit only, Vitest + Testing Library)

New and updated in `tests/unit/`:
- All four projects render with titles, chips and a link to `/projects/<slug>` (keeps the existing assertion's intent).
- Stacked mode renders when `matchMedia` reports a narrow or coarse pointer, with no pin created.
- Reduced-motion mode renders stacked with no motion classes and no `ScrollTrigger` pin.
- Universe mode marks only the active panel as not `inert`, and updates it when the active index changes (GSAP mocked, following the pattern in `motion.test.tsx`).
- Progress dots are buttons with accessible names; clicking one requests a scroll to the right segment.
- Skip link present and targets the next section.

Manual verification (not automated, per the testing decision): scroll through the whole section on desktop in both directions, resize across 768px, toggle reduced motion, and tab through the section.

## 9. Open items

1. Final approved copy for each project (drafted from the CV, pending your review).
2. Confirm the Content Moderation description is OK to publish.
3. The hero-intro work needs to be committed before the implementation branch is created.
4. Whether `Project.video` and `poster` get real assets later (the gradient fallback covers the gap).
