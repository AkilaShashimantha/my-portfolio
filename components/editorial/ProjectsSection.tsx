"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Github, ExternalLink, X, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  techStack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  year: string;
  featured: boolean;
  order: number;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="hairline-b bg-paper">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto p-8 sm:p-12 hairline-b">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
              <span className="text-terracotta font-semibold">02</span>
              <span>// SELECTED PROJECTS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight">
              System Architectures & Production Engagements
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider max-w-sm">
            INDEX // {projects.length.toString().padStart(2, "0")} ARCHIVAL CASE STUDIES
          </p>
        </div>
      </div>

      {/* Projects Grid / Ledger */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {projects.map((project, index) => {
            const indexStr = (index + 1).toString().padStart(2, "0");
            const isEven = index % 2 === 0;

            return (
              <div
                key={project.id}
                className={`p-8 sm:p-12 flex flex-col justify-between group hairline-b ${
                  isEven ? "md:hairline-r" : ""
                } bg-paper hover:bg-paper-card/40 transition-colors duration-300`}
              >
                <div>
                  {/* Card Index & Year */}
                  <div className="flex items-center justify-between font-mono text-xs text-ink-muted mb-6 pb-3 hairline-b">
                    <div className="flex items-center gap-2">
                      <span className="text-terracotta font-semibold">{indexStr}</span>
                      <span>// {project.year}</span>
                    </div>
                    {project.featured && (
                      <span className="px-2 py-0.5 bg-terracotta-subtle text-terracotta border border-terracotta/20 text-[10px] uppercase tracking-widest font-semibold">
                        FEATURED ARCHITECTURE
                      </span>
                    )}
                  </div>

                  {/* Cover Image Frame */}
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="relative w-full aspect-[16/10] bg-paper-card hairline-all overflow-hidden mb-6 cursor-pointer"
                  >
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 bg-paper text-ink shadow-editorial font-medium">
                        VIEW DOSSIER ↗
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-serif text-2xl sm:text-3xl text-ink font-normal hover:text-terracotta transition-colors mb-3 cursor-pointer"
                  >
                    {project.title}
                  </h3>

                  <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-6 font-sans">
                    {project.summary}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 bg-paper-card hairline-all text-ink font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 hairline-t flex items-center justify-between font-mono text-xs">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1.5 text-ink hover:text-terracotta transition-colors font-medium"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>CASE STUDY</span>
                  </button>

                  <div className="flex items-center gap-4">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-ink-muted hover:text-ink transition-colors"
                        title="Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>SOURCE</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-terracotta hover:underline font-semibold"
                        title="Live System"
                      >
                        <span>LIVE DEMO</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-paper max-w-4xl w-full max-h-[90vh] overflow-y-auto hairline-all shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-paper hairline-b p-6 sm:p-8 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-1 flex items-center gap-2">
                    <span className="text-terracotta font-semibold">PROJECT DOSSIER</span>
                    <span>// {selectedProject.year}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Cover Image in Modal */}
                <div className="relative w-full aspect-[16/9] bg-paper-card hairline-all overflow-hidden">
                  <Image
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
                    SYSTEM OVERVIEW & ARCHITECTURAL SPECS
                  </h4>
                  <p className="text-ink leading-relaxed font-sans text-base sm:text-lg whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
                    TECHNOLOGIES & PROTOCOLS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs uppercase tracking-wider px-3 py-1 bg-paper-card hairline-all text-ink font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gallery if multiple images */}
                {selectedProject.galleryImages && selectedProject.galleryImages.length > 1 && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
                      ADDITIONAL ARCHITECTURAL PLATES
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedProject.galleryImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-[16/10] bg-paper-card hairline-all overflow-hidden">
                          <Image src={img} alt={`Plate ${idx + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                <div className="pt-6 hairline-t flex flex-wrap items-center gap-4">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
                    >
                      <span>VISIT PRODUCTION ENVIRONMENT</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {selectedProject.repoUrl && (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-paper-card hairline-all text-ink hover:text-terracotta transition-colors font-mono text-xs uppercase tracking-widest"
                    >
                      <Github className="w-4 h-4" />
                      <span>VIEW SOURCE REPOSITORY</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
