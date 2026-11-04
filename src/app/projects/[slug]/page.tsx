import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { ProjectVideo } from "@/components/media/ProjectVideo";
import { TechChip } from "@/components/ui/TechChip";
import { Button } from "@/components/ui/Button";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Abdullah Shafique`, description: project.pitch };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <Link href="/" className="text-sm text-muted underline underline-offset-4">
        ← Back home
      </Link>
      <h1 className="mt-6 font-display text-6xl uppercase md:text-8xl">{project.title}</h1>
      <p className="mt-2 text-muted">
        {project.subtitle}
        {project.origin === "orzeh" && " · Orzeh Technologies work"}
      </p>
      <div className="mt-8">
        <ProjectVideo src={project.video} poster={project.poster} accent={project.accent} title={project.title} />
      </div>
      <p className="mt-8 text-xl">{project.pitch}</p>
      {project.slug === "chartli" && (
        <div className="mt-12 space-y-12">
          <section aria-labelledby="chartli-overview">
            <h2 id="chartli-overview" className="font-display text-3xl uppercase md:text-4xl">Overview</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Chartli is a clinical documentation platform for doctors and patients. It connects patient records and visit history with a guided encounter workflow, then helps clinicians turn typed notes, dictation, or recorded conversations into structured documentation.
            </p>
          </section>

          <section aria-labelledby="chartli-challenge">
            <h2 id="chartli-challenge" className="font-display text-3xl uppercase md:text-4xl">The product challenge</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Clinical information spans patient context, encounter details, and the final note. Chartli brings those pieces together so clinicians can review relevant context, capture a visit in the way that suits the encounter, and produce a consistent SOAP record. Patients also need a clear account of the visit without being presented with the clinician&apos;s full clinical note.
            </p>
          </section>

          <section aria-labelledby="chartli-solution">
            <h2 id="chartli-solution" className="font-display text-3xl uppercase md:text-4xl">The solution</h2>
            <p className="mt-3 leading-relaxed text-muted">
              A responsive, role-based platform combines a PIN-protected doctor workspace with a patient portal. The doctor experience moves from a searchable patient directory and longitudinal profile into a guided new-visit workflow. Once the visit is documented, Chartli produces a structured Subjective, Objective, Assessment, and Plan note and a separate plain-language summary that can be shared with the patient.
            </p>
          </section>

          <section aria-labelledby="chartli-workflow">
            <h2 id="chartli-workflow" className="font-display text-3xl uppercase md:text-4xl">Encounter workflow</h2>
            <ol className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["01", "Find the patient", "Search the patient directory and review demographics, chronic conditions, allergy alerts, and prior visits."],
                ["02", "Capture the visit", "Start a new encounter, record the chief complaint and vitals, and choose typed notes, solo dictation, or conversation recording."],
                ["03", "Structure the documentation", "Use AI-assisted documentation to turn the encounter input into a SOAP note, with draft and finalized visit states visible in the workspace."],
                ["04", "Share a patient summary", "Provide a plain-language visit summary through the patient portal, separately from the clinician's full SOAP documentation."],
              ].map(([number, title, description]) => (
                <li key={number} className="rounded-2xl border border-fg/10 bg-glass p-5">
                  <p className="text-sm text-muted">{number}</p>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="chartli-capabilities">
            <h2 id="chartli-capabilities" className="font-display text-3xl uppercase md:text-4xl">Product capabilities</h2>
            <ul className="mt-4 grid gap-3 text-muted md:grid-cols-2">
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Patient context:</strong> searchable records, demographics, identifiers, blood groups, chronic conditions, allergy alerts, and visit timelines.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Clinic operations:</strong> daily patient and visit views, documentation methods, and draft or finalized note status.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Multimodal capture:</strong> typed input, solo dictation, and doctor-patient conversation recording.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Two audiences:</strong> clinical SOAP documentation for clinicians and a plain-language summary for patients.</li>
            </ul>
          </section>

          <section aria-labelledby="chartli-implementation">
            <h2 id="chartli-implementation" className="font-display text-3xl uppercase md:text-4xl">Implementation</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The application pairs a React interface with a FastAPI backend and SQLAlchemy data layer, with SQLite and PostgreSQL support. Groq-hosted Llama 3.3 70B supports language generation, while Whisper Large v3 Turbo handles transcription. Backend tests reach 89% coverage.
            </p>
            <p className="mt-4 text-sm text-muted">People and medical records shown in the product images are fictional demo data.</p>
          </section>
        </div>
      )}
      {project.slug === "resolva" && (
        <div className="mt-12 space-y-12">
          <section aria-labelledby="resolva-overview">
            <h2 id="resolva-overview" className="font-display text-3xl uppercase md:text-4xl">Overview</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Resolva is a knowledge-grounded customer support platform. It answers questions using a company&apos;s own documents, shows a confidence score with every response, and gives support staff a workflow for conversations that need human attention. My role covered full-stack AI development.
            </p>
          </section>

          <section aria-labelledby="resolva-challenge">
            <h2 id="resolva-challenge" className="font-display text-3xl uppercase md:text-4xl">The problem</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Support teams repeatedly spend time on common questions, while unusual requests can be missed or receive an unreliable answer from a basic chatbot. The product goal was to handle routine questions from trusted company material and make uncertainty visible, so a person can take over when needed.
            </p>
          </section>

          <section aria-labelledby="resolva-approach">
            <h2 id="resolva-approach" className="font-display text-3xl uppercase md:text-4xl">The approach</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Resolva lets companies upload PDF and text documents into separate knowledge bases. The retrieval-based support agent uses that material to answer customer questions and displays a confidence score alongside each response. When it is unsure, it avoids guessing and creates an escalated support ticket for a human agent.
            </p>
          </section>

          <section aria-labelledby="resolva-workflow">
            <h2 id="resolva-workflow" className="font-display text-3xl uppercase md:text-4xl">Support workflow</h2>
            <ol className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["01", "Add company knowledge", "Upload PDF or text documents and keep each company's source material in its own knowledge base."],
                ["02", "Answer from the sources", "A customer asks a question; Resolva retrieves relevant knowledge and returns an answer with a confidence score."],
                ["03", "Escalate uncertainty", "If confidence is low, Resolva creates a ticket and passes the conversation to a human support agent."],
                ["04", "Resolve and review", "Staff review escalated conversations, filter tickets by company or status, mark issues resolved, and track support activity in analytics."],
              ].map(([number, title, description]) => (
                <li key={number} className="rounded-2xl border border-fg/10 bg-glass p-5">
                  <p className="text-sm text-muted">{number}</p>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="resolva-capabilities">
            <h2 id="resolva-capabilities" className="font-display text-3xl uppercase md:text-4xl">Key capabilities</h2>
            <ul className="mt-4 grid gap-3 text-muted md:grid-cols-2">
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Knowledge-grounded chat:</strong> customer responses based on company documents, with a confidence score shown for every answer.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Human escalation:</strong> uncertain conversations become support tickets instead of guessed answers.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Multi-company knowledge:</strong> PDF and text ingestion with separate knowledge bases for different companies.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Operations dashboard:</strong> questions, automated resolutions, escalations, average confidence, and ticket status at a glance.</li>
            </ul>
          </section>

          <section aria-labelledby="resolva-implementation">
            <h2 id="resolva-implementation" className="font-display text-3xl uppercase md:text-4xl">Implementation</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Resolva combines a React frontend with a Python and FastAPI backend. LangGraph coordinates the AI workflow; Groq provides the language model, and ChromaDB with Sentence Transformers supports knowledge retrieval. SQLAlchemy and SQLite provide the data layer.
            </p>
          </section>

          <section aria-labelledby="resolva-outcome">
            <h2 id="resolva-outcome" className="font-display text-3xl uppercase md:text-4xl">Intended impact</h2>
            <p className="mt-3 leading-relaxed text-muted">
              By automating answers to common questions and surfacing uncertain cases for staff, Resolva is designed to reduce repetitive support work and help teams focus on issues that need human attention. The dashboard and ticket states make that handoff visible to the support team.
            </p>
          </section>
        </div>
      )}
      {project.slug === "asta" && (
        <div className="mt-12 space-y-12">
          <section aria-labelledby="asta-overview">
            <h2 id="asta-overview" className="font-display text-3xl uppercase md:text-4xl">Overview</h2>
            <p className="mt-3 leading-relaxed text-muted">
              ASTA is a luxury auction marketplace built around live bidding. Buyers can discover items, follow an auction as it runs, and place bids, while sellers and administrators get dedicated tools to manage the marketplace. My role covered full-stack web development and UI design.
            </p>
          </section>

          <section aria-labelledby="asta-challenge">
            <h2 id="asta-challenge" className="font-display text-3xl uppercase md:text-4xl">The challenge</h2>
            <p className="mt-3 leading-relaxed text-muted">
              An online auction needs to make changing prices and closing times clear to every bidder, while supporting the seller and administrator work behind each listing. ASTA brings live auction activity, item discovery, account access, listing management, and payment flows into one consistent experience.
            </p>
          </section>

          <section aria-labelledby="asta-solution">
            <h2 id="asta-solution" className="font-display text-3xl uppercase md:text-4xl">The solution</h2>
            <p className="mt-3 leading-relaxed text-muted">
              I designed and built a responsive MERN auction platform with Socket.IO real-time events. The experience spans a browsable catalogue, live bid rooms, seller and administrator dashboards, authentication, image uploads, and checkout-oriented payment flows. A burgundy, brass, ivory, and charcoal visual system gives the product a cohesive luxury auction identity.
            </p>
          </section>

          <section aria-labelledby="asta-journey">
            <h2 id="asta-journey" className="font-display text-3xl uppercase md:text-4xl">Auction journey</h2>
            <ol className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["01", "Discover an auction", "Browse the searchable catalogue, refine listings with filters, and compare current prices and closing times."],
                ["02", "Follow the live lot", "Open an auction room to see the item, countdown, viewer activity, current bid, and recent offers."],
                ["03", "Place a bid", "Submit a bid in the live room and follow auction updates delivered through Socket.IO."],
                ["04", "Complete the flow", "Use the payment flow and confirmation screen, then return to the auction listings."],
              ].map(([number, title, description]) => (
                <li key={number} className="rounded-2xl border border-fg/10 bg-glass p-5">
                  <p className="text-sm text-muted">{number}</p>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="asta-operations">
            <h2 id="asta-operations" className="font-display text-3xl uppercase md:text-4xl">Marketplace operations</h2>
            <ul className="mt-4 grid gap-3 text-muted md:grid-cols-2">
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Seller tools:</strong> create, edit, and manage listings, including item images, prices, and auction closing times.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Administrator tools:</strong> manage users and auctions, assign roles, and review flagged or suspicious bidding activity.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Bidder access:</strong> browse auctions and participate with secure account access, including Google sign-in.</li>
              <li className="rounded-xl border border-fg/10 p-4"><strong className="text-fg">Payments:</strong> card and regional payment workflows, with a clear payment confirmation experience.</li>
            </ul>
          </section>

          <section aria-labelledby="asta-implementation">
            <h2 id="asta-implementation" className="font-display text-3xl uppercase md:text-4xl">Implementation</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The frontend uses React, React Router, Tailwind CSS, Axios, and Socket.IO Client. The backend uses Node.js, Express, MongoDB, Mongoose, and Socket.IO. Authentication uses JWT and Google OAuth; the documented payment integrations include Stripe and PayFast-oriented flows. The platform also includes role authorization, file uploads, email notifications, auction filtering, and pagination.
            </p>
          </section>

          <section aria-labelledby="asta-outcome">
            <h2 id="asta-outcome" className="font-display text-3xl uppercase md:text-4xl">Outcome</h2>
            <p className="mt-3 leading-relaxed text-muted">
              ASTA brings live auction participation and the operational tools around it into a single responsive product, with a distinctive visual identity carried across bidder, seller, and administrator experiences.
            </p>
          </section>
        </div>
      )}
      {project.slug === "getaura" && (
        <div className="mt-12 space-y-12">
          <section aria-labelledby="getaura-overview">
            <h2 id="getaura-overview" className="font-display text-3xl uppercase md:text-4xl">Overview</h2>
            <p className="mt-3 leading-relaxed text-muted">
              GETAURA is an ecommerce platform for ergonomic gaming and workstation essentials. It pairs a responsive product storefront with customer accounts, shopping and checkout, and administration tools. I built the full-stack experience and developed the store as its author and maintainer.
            </p>
          </section>

          <section aria-labelledby="getaura-challenge">
            <h2 id="getaura-challenge" className="font-display text-3xl uppercase md:text-4xl">The challenge</h2>
            <p className="mt-3 leading-relaxed text-muted">
              A specialist workspace store needs to make it easy to explore products and complete a purchase, while giving customers a useful account experience and administrators practical ways to maintain the catalogue and orders. GETAURA brings those needs into one coherent shopping journey.
            </p>
          </section>

          <section aria-labelledby="getaura-solution">
            <h2 id="getaura-solution" className="font-display text-3xl uppercase md:text-4xl">The solution</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The storefront supports gaming and workstation catalogues with search, pagination, ratings, and customer reviews. Customers can register, manage profiles, keep a shopping bag, check out, and revisit order history. Administrators can manage products, users, orders, inventory, and product images.
            </p>
          </section>

          <section aria-labelledby="getaura-journey">
            <h2 id="getaura-journey" className="font-display text-3xl uppercase md:text-4xl">Shopping journey</h2>
            <ol className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["01", "Explore the catalogue", "Browse gaming and workstation essentials, search products, and move through paginated listings."],
                ["02", "Compare products", "Use product ratings and customer reviews as part of product discovery."],
                ["03", "Build a shopping bag", "Collect chosen items before moving through the multi-step checkout."],
                ["04", "Manage the purchase", "Use customer accounts and order history, with PayPal and card-payment options in the checkout experience."],
              ].map(([number, title, description]) => (
                <li key={number} className="rounded-2xl border border-fg/10 bg-glass p-5">
                  <p className="text-sm text-muted">{number}</p>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="getaura-operations">
            <h2 id="getaura-operations" className="font-display text-3xl uppercase md:text-4xl">Store operations</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The administration experience supports product, user, and order management, along with product image uploads and inventory controls. Together these tools cover the operational side of keeping the storefront current.
            </p>
          </section>

          <section aria-labelledby="getaura-design">
            <h2 id="getaura-design" className="font-display text-3xl uppercase md:text-4xl">Brand and visual direction</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The portfolio thumbnail presents GETAURA through a composed workstation scene: ergonomic seating, a height-adjustable desk, monitor, and warm task lighting. Deep forest green and brass accents, balanced by ivory surroundings and natural wood, establish a premium, calm setting for the brand promise: “Better setups, built around you.”
            </p>
          </section>

          <section aria-labelledby="getaura-implementation">
            <h2 id="getaura-implementation" className="font-display text-3xl uppercase md:text-4xl">Implementation</h2>
            <p className="mt-3 leading-relaxed text-muted">
              GETAURA uses React, React Bootstrap, and Redux Toolkit on the frontend, with a Node.js and Express backend. MongoDB and Mongoose persist application data, and JSON Web Tokens support authentication. The platform also includes PayPal and card-payment integration.
            </p>
          </section>

          <section aria-labelledby="getaura-outcome">
            <h2 id="getaura-outcome" className="font-display text-3xl uppercase md:text-4xl">Outcome</h2>
            <p className="mt-3 leading-relaxed text-muted">
              GETAURA brings product discovery, purchase, customer accounts, and store administration into one responsive ecommerce experience, backed by a consistent visual identity for ergonomic gaming and workspace products.
            </p>
          </section>
        </div>
      )}
      <ul className="mt-6 list-disc space-y-2 pl-5 text-muted">
        {project.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <TechChip key={s}>{s}</TechChip>
        ))}
      </div>
      {(project.links.github || project.links.live) && (
        <div className="mt-8 flex gap-3">
          {project.links.github && (
            <Button href={project.links.github} variant="outline" target="_blank" rel="noopener noreferrer">
              GitHub
            </Button>
          )}
          {project.links.live && (
            <Button href={project.links.live} variant="outline" target="_blank" rel="noopener noreferrer">
              Live
            </Button>
          )}
        </div>
      )}
      <nav className="mt-16 border-t border-fg/10 pt-8">
        <Link href={`/projects/${next.slug}`} className="text-xl underline underline-offset-4">
          Next project: {next.title} →
        </Link>
      </nav>
    </main>
  );
}
