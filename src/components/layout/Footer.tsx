import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-fg/10 px-6 py-8 text-sm text-muted">
      © {profile.name}
    </footer>
  );
}
