"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const items = [
  { n: "01", label: "Home", id: "home" },
  { n: "02", label: "About", id: "about" },
  { n: "03", label: "Projects", id: "projects" },
  { n: "04", label: "Experience", id: "experience" },
  { n: "05", label: "Contact", id: "contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10">
        <a href="#home" className="font-display text-2xl tracking-wide" aria-label="Abdullah Shafique, home">
          AS
        </a>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-fg/25 px-5 py-2 text-sm font-semibold backdrop-blur hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-fg"
          >
            Let&apos;s Talk
          </a>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-fg/25 px-4 py-2 text-sm md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <nav aria-label="Sections" className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <ul className="flex flex-col gap-5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={active === it.id ? "true" : undefined}
                className={`group flex items-center gap-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-fg ${
                  active === it.id ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${active === it.id ? "bg-fg" : "bg-fg/30"}`} />
                <span>{it.n}</span>
                <span className="hidden group-hover:inline">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        id="mobile-menu"
        aria-label="Mobile sections"
        hidden={!open}
        className="fixed inset-x-0 top-16 z-40 bg-bg/95 p-6 backdrop-blur md:hidden"
      >
        <ul className="flex flex-col gap-4 text-lg">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} onClick={() => setOpen(false)}>
                {it.n} {it.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
