import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/sections/nav";
import { Footer } from "@/components/sections/footer";
import { Cursor } from "@/components/motion/cursor";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const label = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "RADD — Richard Davies",
    template: "%s — RADD",
  },
  description:
    "Portfolio of graphic design and photography work by Richard Davies (RADD).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${label.variable} bg-canvas text-ink font-body antialiased`}
      >
        <GrainOverlay />
        <Cursor />
        <ScrollProgress />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
