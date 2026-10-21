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
            <Link href="/" className="flex items-center gap-2.5">
              <GrapeLogo />
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold tracking-[0.3px] text-foreground">
                  Bizgrapes Designs
                </span>
                <span className="text-[10.5px] font-normal uppercase tracking-[0.63px] text-muted">
                  Made with Bizgrapes AI
                </span>
              </span>
            </Link>
            <form action="/" method="get" role="search" className="ml-auto mr-4 w-full max-w-[220px] sm:max-w-xs">
              <input
                type="search"
                name="q"
                maxLength={80}
                placeholder="Search designs or creators"
                aria-label="Search designs or creators"
                className="w-full rounded-full border border-border bg-surface px-4 py-1.5 text-sm outline-none placeholder:text-muted focus:border-violet-600"
              />
            </form>
            <a
              href="https://bizgrapes.com"
              className="hidden lg:inline text-sm font-medium text-muted hover:text-violet-600 transition-colors"
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
