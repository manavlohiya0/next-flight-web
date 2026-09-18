import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextFlight — The Next.js 15.5 SaaS Starter for AI Builders",
  description:
    "An editorial, production-ready Next.js 15.5 boilerplate designed for solo founders building with AI. Pre-configured multi-tenancy, WebAuthn passkeys, Lemon Squeezy billing, AGENTS.md, and automated GitHub collaborator delivery.",
  keywords: [
    "nextflight boilerplate",
    "ai saas starter",
    "saas boilerplate",
    "nextjs boilerplate",
    "cursor rules",
    "agents.md",
    "starter kit",
    "lemon squeezy nextjs",
    "passkeys",
  ],
  openGraph: {
    title: "NextFlight — The Next.js 15.5 SaaS Starter for AI Builders",
    description:
      "Ship your next SaaS without the plumbing. Production Next.js 15.5, PostgreSQL, multi-tenancy, and automated GitHub repository delivery.",
    type: "website",
    url: "https://nextflight.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextFlight — The Next.js 15.5 SaaS Starter for AI Builders",
    description:
      "Full-stack Next.js 15.5 boilerplate built specifically for Antigravity, Cursor, and Claude Code. Pay once, own forever.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
