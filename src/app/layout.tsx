import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "e-Daan — The smarter way forward",
  description: "e-Daan: navigation, charging, and safety for LEV commuters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex justify-center bg-zinc-100">
        <div className="w-full max-w-md bg-[var(--background)] min-h-screen relative shadow-2xl overflow-x-hidden pb-24">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
