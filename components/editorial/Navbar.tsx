"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  availableForWork?: boolean;
}

export function Navbar({ availableForWork = true }: NavbarProps) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat("en-GB", options).format(now);
      setTimeString(`${formatted} COLOMBO (GMT+5:30)`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm hairline-b">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand Monogram */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-baseline gap-2 font-mono text-xs tracking-widest uppercase text-ink font-semibold"
          >
            <span className="w-2.5 h-2.5 bg-ink group-hover:bg-terracotta transition-colors inline-block" />
            <span>AKILA SHASHIMANTHA</span>
            <span className="text-ink-subtle hidden sm:inline">// SYSTEMS ARCHITECT</span>
          </Link>

          {/* Status Indicator */}
          {availableForWork && (
            <div className="hidden lg:flex items-center gap-2 pl-4 hairline-l py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta font-medium">
                AVAILABLE FOR PROJECTS
              </span>
            </div>
          )}
        </div>

        {/* Local Time and Nav Links */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 w-full md:w-auto justify-between md:justify-end">
          {timeString && (
            <div className="font-mono text-[11px] text-ink-muted tracking-wider hidden sm:block">
              {timeString}
            </div>
          )}

          <nav className="flex items-center gap-5 sm:gap-6 font-mono text-xs tracking-widest uppercase text-ink-muted">
            <a href="#projects" className="hover:text-terracotta transition-colors">
              Work
            </a>
            <a href="#experience" className="hover:text-terracotta transition-colors">
              Experience
            </a>
            <a href="#certificates" className="hover:text-terracotta transition-colors">
              Credentials
            </a>
            <a href="#gallery" className="hover:text-terracotta transition-colors">
              Gallery
            </a>
            <a href="#contact" className="hover:text-terracotta transition-colors">
              Contact
            </a>
            <Link
              href="/admin"
              className="p-1 text-ink-subtle hover:text-ink transition-colors ml-1"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
