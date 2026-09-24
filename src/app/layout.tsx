import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GrapeLogo } from "@/components/GrapeLogo";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Designs Gallery — Bizgrapes AI",
  description:
    "Real designs made with Bizgrapes AI, published by the people who made them.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <GrapeLogo />
              <span className="font-display text-lg font-semibold tracking-tight">
                Bizgrapes Designs
              </span>
            </Link>
            <a
              href="https://bizgrapes.com"
              className="text-sm font-medium text-muted hover:text-violet-600 transition-colors"
            >
              Made with Bizgrapes AI →
            </a>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 text-sm text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} Bizgrapes AI</span>
            <a
              href="https://bizgrapes.com"
              className="hover:text-violet-600 transition-colors"
            >
              bizgrapes.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
