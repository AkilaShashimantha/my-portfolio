import type { Metadata, Viewport } from "next";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://my-portfolio-amber-nine-87.vercel.app";

export const viewport: Viewport = {
  themeColor: "#161615",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akila Shashimantha — Systems Architect & Lead Full-Stack Engineer",
    template: "%s | Akila Shashimantha",
  },
  description:
    "Official portfolio & architectural CV of Akila Shashimantha, Lead Full-Stack Engineer and Distributed Systems Architect based in Colombo, Sri Lanka. Specializing in high-throughput microservices, Next.js, Spring Boot, React Native, and resilient cloud architectures.",
  keywords: [
    "Akila Shashimantha",
    "Akila Shashimantha Portfolio",
    "Akila Shashimantha Software Engineer",
    "Akila Shashimantha Systems Architect",
    "Akila Shashimantha Onsys",
    "Akila Shashimantha Colombo",
    "Akila Shashimantha Sri Lanka",
    "Akila Shashimantha Developer",
    "Akila Shashimantha Full Stack",
    "Akila Shashimantha GitHub",
    "Akila Shashimantha LinkedIn",
    "Lead Full-Stack Engineer",
    "Distributed Systems Architect",
    "Software Engineer Colombo",
    "Next.js Architect",
    "Spring Boot Microservices",
  ],
  authors: [{ name: "Akila Shashimantha", url: siteUrl }],
  creator: "Akila Shashimantha",
  publisher: "Akila Shashimantha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Akila",
    lastName: "Shashimantha",
    username: "akilashashimantha",
    gender: "male",
    locale: "en_US",
    url: siteUrl,
    title: "Akila Shashimantha — Systems Architect & Lead Full-Stack Engineer",
    description:
      "Official portfolio & architectural CV of Akila Shashimantha. Lead engineer building high-throughput microservices, distributed systems, and precision web experiences.",
    siteName: "Akila Shashimantha Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akila Shashimantha — Systems Architect & Lead Full-Stack Engineer",
    description:
      "Official portfolio & architectural CV of Akila Shashimantha, Lead Full-Stack Engineer and Distributed Systems Architect based in Colombo, Sri Lanka.",
    creator: "@akilashashimantha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "googlefcd7ce448e83e559",
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
