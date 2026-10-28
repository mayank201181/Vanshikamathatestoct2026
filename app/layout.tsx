import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maths Test Prep · Year 8",
  description:
    "Year 8 maths class-test prep: Fractions, Percentages, Ratio, Expressions, Substitution and Sequences — revision guides, 4 multiple-choice and 4 written sets per topic with instant marking, flashcards, labs and a cram sheet.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Maths Prep" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)]">
        <ErrorBoundary>
          <ProgressProvider>
            <ErrorBoundary silent>
              <SiteHeader />
            </ErrorBoundary>
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:py-8">{children}</main>
            <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 print:hidden">
              Built for Vanshika&apos;s Year 8 maths class test · Your progress saves on this device as you go · You&apos;ve got this 💪
            </footer>
          </ProgressProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
