import type { Metadata } from "next";
import { Anton, Inter, Caveat } from "next/font/google";
import "./globals.css";

const display = Anton({ weight: "400", variable: "--font-display", subsets: ["latin"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const script = Caveat({ variable: "--font-script", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abdullah Shafique — AI Engineer & Software Developer",
  description:
    "Portfolio of Abdullah Shafique, an AI Engineer and Software Developer building intelligent systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-body">{children}</body>
    </html>
  );
}
