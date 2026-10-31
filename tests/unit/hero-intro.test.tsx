import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";

const state = { reduced: false };
vi.mock("@/lib/motion/use-reduced-motion", () => ({ useReducedMotion: () => state.reduced }));

import { HeroIntro } from "@/components/media/HeroIntro";

describe("HeroIntro hello", () => {
  beforeEach(() => {
    state.reduced = false;
  });

  it("hello is absent before the video plays", () => {
    const { container } = render(<HeroIntro />);
    expect(container.querySelector("[data-hero-hello]")).toBeNull();
  });

  it("hello appears after the playing event", () => {
    const { container } = render(<HeroIntro />);
    fireEvent.playing(container.querySelector("video")!);
    expect(container.querySelector("[data-hero-hello]")?.textContent).toBe("Hello");
  });

  it("repeated playing events render a single hello", () => {
    const { container } = render(<HeroIntro />);
    const video = container.querySelector("video")!;
    fireEvent.playing(video);
    fireEvent.playing(video);
    expect(container.querySelectorAll("[data-hero-hello]")).toHaveLength(1);
  });

  it("types hello letter by letter", () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<HeroIntro />);
      fireEvent.playing(container.querySelector("video")!);
      const typed = () => container.querySelector("[data-hello-typed]")!.textContent;
      expect(typed()).toBe("");
      act(() => void vi.advanceTimersByTime(130 * 2));
      expect(typed()).toBe("He");
      act(() => void vi.advanceTimersByTime(130 * 10));
      expect(typed()).toBe("Hello");
    } finally {
      vi.useRealTimers();
    }
  });

  it("no hello under reduced motion", () => {
    state.reduced = true;
    const { container } = render(<HeroIntro />);
    expect(container.firstChild).toBeNull();
  });
});

describe("HeroIntro is mandatory", () => {
  beforeEach(() => {
    state.reduced = false;
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("stays up for the whole video, well past 4.5s", () => {
    const { container } = render(<HeroIntro />);
    fireEvent.playing(container.querySelector("video")!);
    act(() => void vi.advanceTimersByTime(60_000));
    const overlay = container.querySelector("[data-hero-intro]");
    expect(overlay).not.toBeNull();
    expect(overlay!.classList.contains("opacity-0")).toBe(false);
  });

  it("leaves only after the video ends", () => {
    const { container } = render(<HeroIntro />);
    fireEvent.playing(container.querySelector("video")!);
    fireEvent.ended(container.querySelector("video")!);
    act(() => void vi.advanceTimersByTime(700));
    expect(container.querySelector("[data-hero-intro]")).toBeNull();
  });

  it("fails open if the video errors", () => {
    const { container } = render(<HeroIntro />);
    fireEvent.error(container.querySelector("video")!);
    act(() => void vi.advanceTimersByTime(700));
    expect(container.querySelector("[data-hero-intro]")).toBeNull();
  });

  it("fails open if the video never starts playing", () => {
    const { container } = render(<HeroIntro />);
    act(() => void vi.advanceTimersByTime(10_000));
    act(() => void vi.advanceTimersByTime(700));
    expect(container.querySelector("[data-hero-intro]")).toBeNull();
  });

  it("flags the document so site chrome is hidden, then clears it", () => {
    const { container } = render(<HeroIntro />);
    expect(document.documentElement.dataset.intro).toBe("on");
    fireEvent.ended(container.querySelector("video")!);
    act(() => void vi.advanceTimersByTime(700));
    expect(document.documentElement.dataset.intro).toBeUndefined();
  });
});
