import { profile } from "@/content/profile";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:px-24">
      <Reveal className="mx-auto max-w-4xl">
        <h2 className="font-display text-5xl uppercase md:text-7xl">Let&apos;s Talk</h2>
        <p className="mt-6">
          <a
            href={`mailto:${profile.email}`}
            className="text-xl underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-fg"
          >
            {profile.email}
          </a>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {profile.linkedin && (
            <Button href={profile.linkedin} variant="outline" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </Button>
          )}
          {profile.github && (
            <Button href={profile.github} variant="outline" target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          )}
          <Button href={profile.resumeHref} variant="solid" download>
            Download Resume
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
