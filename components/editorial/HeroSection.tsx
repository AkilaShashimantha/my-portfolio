"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, FileText, Github, Linkedin, Twitter, Mail, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  profile: {
    fullName: string;
    headline: string;
    subheadline: string;
    shortBio: string;
    extendedBio: string;
    avatarUrl: string;
    resumeUrl: string;
    location: string;
    availableForWork: boolean;
  };
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    handle: string;
    iconName: string;
    isVisible: boolean;
  }>;
}

export function HeroSection({ profile, socialLinks }: HeroSectionProps) {
  const visibleSocials = socialLinks.filter((s) => s.isVisible);

  const getSocialIcon = (iconName: string) => {
    const lower = iconName.toLowerCase();
    if (lower.includes("git")) return <Github className="w-4 h-4" />;
    if (lower.includes("link")) return <Linkedin className="w-4 h-4" />;
    if (lower.includes("twit") || lower.includes("x")) return <Twitter className="w-4 h-4" />;
    if (lower.includes("mail")) return <Mail className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <section className="hairline-b bg-paper">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Index & Meta Information */}
        <div className="lg:col-span-4 p-8 sm:p-10 hairline-r flex flex-col justify-between bg-paper">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-6 flex items-center gap-2">
              <span className="text-terracotta font-semibold">01</span>
              <span>// BRIEF INTRODUCTION</span>
            </div>

            {/* Framed Portrait Photo with Framer Motion Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-8 group"
            >
              <div className="relative w-full aspect-[4/5] bg-paper-card hairline-all overflow-hidden shadow-editorial">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  fill
                  className="object-cover grayscale contrast-[1.05] group-hover:scale-102 transition-transform duration-700"
                  priority
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-ink-muted uppercase tracking-wider">
                <span>PORTRAIT // ARCHIVE REF. 24</span>
                <span>{profile.location.split("//")[0]}</span>
              </div>
            </motion.div>

            {/* Location & Status Ledger */}
            <div className="space-y-3 font-mono text-xs py-4 hairline-t hairline-b text-ink-muted">
              <div className="flex justify-between">
                <span className="uppercase tracking-wider">PRIMARY LOCATION:</span>
                <span className="text-ink font-medium">{profile.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-wider">SPECIALIZATION:</span>
                <span className="text-ink font-medium">DISTRIBUTED SYSTEMS</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-wider">STATUS:</span>
                <span className={profile.availableForWork ? "text-terracotta font-semibold" : "text-ink-muted"}>
                  {profile.availableForWork ? "AVAILABLE FOR PROJECTS" : "CURRENTLY ENGAGED"}
                </span>
              </div>
            </div>
          </div>

          {/* Social Contacts Strip */}
          <div className="pt-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle mb-3">
              PRIMARY DIRECTORIES
            </div>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {visibleSocials.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between py-1.5 text-ink hover:text-terracotta transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    {getSocialIcon(link.iconName)}
                    <span>{link.platform}</span>
                  </span>
                  <span className="text-ink-subtle group-hover:text-terracotta flex items-center gap-1">
                    <span>{link.handle}</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Typographic Headline & Biography */}
        <div className="lg:col-span-8 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-paper">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Header Badge */}
            <div className="inline-block mb-8 font-mono text-xs uppercase tracking-widest px-3 py-1 bg-paper-card hairline-all text-ink font-medium">
              EDITORIAL DOSSIER // VOL. 2026
            </div>

            {/* Display Headline in Serif */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-ink mb-8">
              {profile.headline}
            </h1>

            {/* Subheadline & Short Bio */}
            <p className="text-lg sm:text-xl text-ink font-normal leading-relaxed mb-6 font-sans">
              {profile.subheadline}
            </p>

            <div className="w-16 h-[2px] bg-terracotta mb-8" />

            {/* Extended Bio */}
            <div className="prose prose-lg text-ink-muted leading-relaxed font-sans max-w-3xl space-y-4 text-base sm:text-lg">
              <p>{profile.extendedBio}</p>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <div className="pt-12 mt-12 hairline-t flex flex-wrap items-center gap-4 sm:gap-6">
            <motion.a
              href={profile.resumeUrl}
              download
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold group shadow-editorial"
            >
              <FileText className="w-4 h-4 text-paper" />
              <span>DOWNLOAD RESUME / CV</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-paper-card hairline-all text-ink hover:text-terracotta hover:border-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-medium"
            >
              <span>INITIATE INQUIRY</span>
              <ArrowDownRight className="w-4 h-4" />
            </motion.a>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-4 py-3.5 text-ink-muted hover:text-ink transition-colors font-mono text-xs uppercase tracking-widest"
            >
              <span>EXPLORE WORKS</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
