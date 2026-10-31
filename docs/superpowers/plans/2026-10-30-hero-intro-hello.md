# Hero Intro "Hello" Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** Task 1 implemented and passing (47/47 tests). Task 2 (visual check) still open: the Chrome extension was not connected. Revised after review: the text is `Hello` (no period), typed letter by letter, and placed above the video.

**Goal:** Type "Hello" letter by letter above the intro video once playback starts, hold ~1s, then fade it out.

**Architecture:** The `<video>` sits in a `relative` wrapper inside the existing `HeroIntro` overlay. When the video is playing, a `pointer-events-none` element is rendered at `bottom-full` of that wrapper (above the video). A small `HelloTyped` component types the text with an interval; one CSS keyframe holds then fades it. No new dependencies.

**Tech Stack:** Next.js (read `node_modules/next/dist/docs/` first per `AGENTS.md`), React, Tailwind (`@theme inline` tokens), Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-30-hero-intro-hello-design.md`

## Global Constraints

- Text is exactly `Hello` (no period), typed one letter per `TYPE_MS = 130` ms.
- Keyframe `hello-hold-out`, class `.hello-in-out`: 2.6s, `ease-out`, `fill-mode: both`; opacity 1 for 0%-70%, 0 at 100%. Opacity only, no transform.
- Font `font-display`, `leading-none`, size `clamp(3rem, min(9vw, 12vh), 8rem)`, `text-fg`, `letter-spacing: -0.02em`, `text-shadow: 0 2px 24px rgb(0 0 0 / 0.35)`.
- Placement: above the video, `absolute inset-x-0 bottom-full mb-[1.5vh] flex justify-center pointer-events-none` inside a `relative` wrapper around the video. Video `max-h` is `68vh` (was `80vh`) to leave room.
- Trigger: video `onPlaying`, plus a ref-callback check (`!paused && currentTime > 0`) for when `playing` fires before hydration.
- Out of scope: video source, `MAX_MS`, `FADE_MS`, `Hero` section, body scroll lock.
- Reduced motion: `HeroIntro` already returns `null`; no change.

## Review Focus

- Video `playing` fires more than once: hello must not restart or duplicate. Pinned in Task 1.
- `playing` fires before hydration (hello never appears on a fast load): handled by the ref-callback check; confirm visually in Task 2 with a hard reload.
- Autoplay blocked, so `playing` never fires: no hello rendered.
- Reduced motion: no overlay and no hello. Pinned in Task 1.
- Short or narrow viewport (375px wide, ~600px tall): text must fit above the video with no clipping or horizontal scroll. Verified in Task 2.
- Overlay unmounts before the hello finishes: no stray hello left in DOM (existing unmount path).

---

### Task 1: Typed hello, keyframe, and unit tests (done)

**Files:**
- Create: `tests/unit/hero-intro.test.tsx`
- Modify: `src/components/media/HeroIntro.tsx`
- Modify: `src/app/globals.css` (after the reduced-motion block)

**Interfaces:**
- Consumes: `useReducedMotion` from `@/lib/motion/use-reduced-motion` (mocked in tests, as in `tests/unit/scene-gate.test.tsx`).
- Produces: `[data-hero-hello]` wrapper containing `Hello` (typed part in `[data-hello-typed]`), rendered only once the video is playing.

- [x] **Step 1: Write the failing tests** in `tests/unit/hero-intro.test.tsx` (mutable `state.reduced`, video via `container.querySelector("video")`):
  - `hello is absent before the video plays`: `[data-hero-hello]` is `null`.
  - `hello appears after the playing event`: after `fireEvent.playing(video)`, `[data-hero-hello]` has `textContent` `"Hello"`.
  - `repeated playing events render a single hello`: two `playing` events, length 1.
  - `types hello letter by letter`: fake timers; `[data-hello-typed]` is `""`, then `"He"` after 260ms, then `"Hello"` after 1300ms more.
  - `no hello under reduced motion`: `container.firstChild` is `null`.
- [x] **Step 2: Run to verify failure**: `npx vitest run tests/unit/hero-intro.test.tsx`. Expected: the "appears" and "single hello" tests FAIL.
- [x] **Step 3: CSS**: `@keyframes hello-hold-out` and `.hello-in-out { animation: hello-hold-out 2.6s ease-out both; }` in `src/app/globals.css`.
- [x] **Step 4: Implement** in `HeroIntro.tsx`: `HelloTyped()` (interval every `TYPE_MS`, typed letters in `[data-hello-typed]`, untyped letters in an `opacity-0` span so width is stable); `helloOn` state set by `onPlaying` and by a `ref` callback on the `<video>`; the video wrapped in a `relative` div with the hello element before it.
- [x] **Step 5: Run to verify pass**: `npx vitest run tests/unit/hero-intro.test.tsx`. Expected: 5 PASS.
- [x] **Step 6: Full suite**: `npm test`. Expected: all PASS (47/47). `npm run lint` shows one error that predates this work (`setPhase("done")` in an effect in `HeroIntro.tsx`).
- [ ] **Step 7: Commit** (skipped: the folder is not a git repo).

### Task 2: Visual verification (open)

**Files:** none modified (fix Task 1 files if a check fails).

**Interfaces:**
- Consumes: Task 1's `[data-hero-hello]` element.

- [ ] **Step 1: Start the dev server**: `npm run dev`. Expected: listening on `http://localhost:3000` (or the next free port).
- [ ] **Step 2: Check at 375px, 768px, 1440px and a short window (~600px tall)**: "Hello" types in above the video once it starts, holds ~1s, fades by ~2.6s; text is not clipped and does not overlap the video; no horizontal scroll at 375px.
- [ ] **Step 3: Hard-reload 10 times** (and once with throttled CPU): the hello appears every time.
- [ ] **Step 4: Confirm overlay lifecycle**: the intro still fades and unmounts at ≤4.5s (or on video end), and `[data-hero-intro]` is gone from the DOM afterwards.
