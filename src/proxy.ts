import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

// With cacheComponents the page shell streams as 200 before notFound() can run for
// slugs outside generateStaticParams, so reject unknown slugs here for a real 404.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (projects.some((p) => p.slug === slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found-404", request.url), { status: 404 });
}

export const config = { matcher: "/projects/:slug" };
