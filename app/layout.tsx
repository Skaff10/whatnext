import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "What Next? — Retro Media & Game Tracker",
  description:
    "A 90s video rental store & arcade tracker for movies, series and games. What should you watch or play next?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-vt323 bg-[#14101F] text-[#F4E9D0] selection:bg-[#FF3D81] selection:text-[#14101F]">
        {/* CRT Scanline & Vignette Effect Overlays */}
        <div className="crt-scanlines pointer-events-none fixed inset-0 z-50 overflow-hidden" />
        <div className="crt-vignette pointer-events-none fixed inset-0 z-40 overflow-hidden" />
        
        {/* Main Content Shell */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
