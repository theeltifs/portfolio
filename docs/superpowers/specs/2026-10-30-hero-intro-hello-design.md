# Hero Intro "Hello" Overlay — Design Spec

Date: 2026-10-30
Status: Implemented. Revised after review: typed "Hello" (no period), placed above the video

## Goal
When the intro video starts playing, show a large, elegant "Hello" (no period) typed out letter by letter above the video, held briefly, then faded out. Minimal, premium, responsive. The existing video and layout are unaffected.

## Current state
- `src/components/media/HeroIntro.tsx`: full-screen `fixed inset-0 z-[100]` overlay playing `/media/look-down.mp4`.
- Overlay fades out after `MAX_MS` (4500ms) or on video `ended`; fade duration `FADE_MS` (600ms).
- Returns `null` when `prefers-reduced-motion` is set.
- Display font: Anton via `font-display` (`--font-display`).

## Design

### Placement
Wrap the `<video>` in a `relative` div inside the existing overlay. The hello is an absolutely positioned child of that wrapper, placed **above the video**: `absolute inset-x-0 bottom-full mb-[1.5vh] flex justify-center pointer-events-none`. It is out of flow. The video's `max-h` drops from `80vh` to `68vh` to leave room above it. The overlay's `aria-hidden="true"` already covers it.

### Trigger
Start on the video's `onPlaying` event, not on mount, so the text appears when playback actually begins.
- State `helloOn` (boolean), set `true` in `onPlaying` (idempotent, so repeated events do not restart it).
- Hydration race: with SSR'd `autoPlay`, `playing` can fire before React attaches the handler. A ref callback on the `<video>` also sets `helloOn` if it is already playing (`!paused && currentTime > 0`) when it mounts.
- If autoplay is blocked, `playing` never fires and the text never shows.

### Animation
- **Typing (JS):** `HelloTyped` reveals `Hello` one letter every `TYPE_MS` (130ms), about 0.65s. Untyped letters render in an `opacity-0` span so the width never shifts. The typed part is `[data-hello-typed]`.
- **Hold and fade (CSS):** keyframe `hello-hold-out` in `src/app/globals.css`, class `.hello-in-out`, 2.6s, `ease-out`, `fill-mode: both`: opacity 1 from 0% to 70%, then 0 at 100%. Roughly 0.65s typing, ~1.2s hold, ~0.8s fade.
- No new dependencies.

### Typography
- `font-display`, text exactly `Hello` (no period).
- Size `clamp(3rem, min(9vw, 12vh), 8rem)`, `leading-none`; scales with width and is capped by height so it fits above the video.
- Foreground colour token (`text-fg`), `letter-spacing: -0.02em`.
- Faint `text-shadow` for legibility over bright frames.

### Timing vs. the intro
Intro lasts at most 4.5s; hello takes ~2.6s, so it completes first. If the video ends early, the overlay fade takes the hello with it.

### Reduced motion / accessibility
No change required: the component already returns `null` under reduced motion, so the hello never renders. Text is decorative and inside an `aria-hidden` container.

## Out of scope
- Video source, `MAX_MS`, `FADE_MS`. (Video `max-h` is changed to `68vh` to make room for the text.)
- `Hero` section and the body scroll lock.
- Audio, new libraries.

## Files to touch (at implementation)
- `src/components/media/HeroIntro.tsx`
- `src/app/globals.css` (1 keyframe + 1 class)
- Existing HeroIntro test, if any (add cases below)

## Verification
- Unit: hello absent before a `playing` event, present after.
- Visual at 375px, 768px, 1440px: video box unchanged, text centred, no overflow or horizontal scroll.
- Animation completes; overlay still unmounts as before.

## Resolved questions
1. Placement: originally centred over the video; changed after review to **above the video**.
2. Hold time: ~1s is acceptable.
3. Text: typed letter by letter, `Hello` with no period (changed after review).
