import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <h1 className="font-display text-6xl uppercase">Not found</h1>
      <p className="mt-4 text-muted">That page does not exist.</p>
      <Link href="/" className="mt-6 underline underline-offset-4">
        Back home
      </Link>
    </main>
  );
}
