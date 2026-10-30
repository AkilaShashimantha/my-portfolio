import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akila Shashimantha — Systems Architect & Full-Stack Engineer",
  description:
    "Personal portfolio & architectural CV of Akila Shashimantha. Lead engineer building high-throughput microservices, document intelligence engines, and precision web experiences.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} scroll-smooth`}>
      <body className="min-h-screen bg-paper text-ink font-sans selection:bg-terracotta selection:text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
