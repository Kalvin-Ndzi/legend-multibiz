/**
 * ROOT LAYOUT — Legend Multibiz
 * Wraps every page. Sets up fonts, the phone-width app shell, and the
 * persistent BottomNav.
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Legend Multibiz | Premium Cosmetics in Bamenda",
  description:
    "Shop 100% authentic skincare, makeup & body care. Fast delivery in Bamenda, Cameroon.",
  openGraph: {
    title: "Legend Multibiz Cosmetics",
    description: "Original products delivered to your door in Bamenda.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#d1d1d6] overflow-x-hidden">
        <div className="max-w-[448px] mx-auto bg-[#fafafa] min-h-dvh relative shadow-2xl overflow-x-hidden">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
