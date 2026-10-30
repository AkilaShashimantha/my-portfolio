"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, MapPin, Calendar, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  location: string;
  takenAt: string | Date;
  aspectRatio: string;
  featured: boolean;
  order: number;
}

interface PhotosSectionProps {
  photos: PhotoItem[];
}

export function PhotosSection({ photos }: PhotosSectionProps) {
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const getAspectClass = (ratio: string) => {
    switch (ratio.toUpperCase()) {
      case "PORTRAIT":
        return "aspect-[3/4]";
      case "SQUARE":
        return "aspect-square";
      case "LANDSCAPE":
      default:
        return "aspect-[16/10]";
    }
  };

  return (
    <section id="gallery" className="hairline-b bg-paper">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto p-8 sm:p-12 hairline-b">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
              <span className="text-terracotta font-semibold">05</span>
              <span>// PHOTOGRAPHY & VISUAL LOG</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight">
              Visual Log & Spatial Observations
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider max-w-sm">
            DOCUMENTING FORM, ARCHITECTURAL CONCRETE, AND COASTAL LIGHT
          </p>
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      <div className="max-w-7xl mx-auto p-8 sm:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer flex flex-col justify-between bg-paper-card hairline-all p-4 hover:shadow-card transition-all duration-300"
            >
              <div>
                <div
                  className={`relative w-full ${getAspectClass(
                    photo.aspectRatio
                  )} bg-paper hairline-all overflow-hidden mb-4`}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                  />
                  <div className="absolute top-2 right-2 p-1.5 bg-paper/80 backdrop-blur-sm hairline-all opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5 text-ink" />
                  </div>
                </div>

                <h3 className="font-serif text-lg text-ink font-normal group-hover:text-terracotta transition-colors mb-1.5 line-clamp-1">
                  {photo.title}
                </h3>

                <p className="text-xs text-ink-muted font-sans line-clamp-2 leading-relaxed mb-3">
                  {photo.caption}
                </p>
              </div>

              <div className="pt-2 hairline-t flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-wider">
                <span className="flex items-center gap-1 truncate max-w-[140px]">
                  <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                  <span className="truncate">{photo.location.split("//")[0]}</span>
                </span>
                <span>{photo.aspectRatio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal with Date Display & Framer Motion */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-ink/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-paper max-w-4xl w-full max-h-[95vh] overflow-y-auto hairline-all shadow-2xl relative"
            >
              <div className="p-6 hairline-b flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-terracotta font-semibold mb-1">
                    VISUAL ARCHIVE PLATE // {activePhoto.aspectRatio}
                  </div>
                  <h3 className="font-serif text-2xl text-ink font-normal">
                    {activePhoto.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Image Frame */}
                <div className="relative w-full aspect-[16/10] bg-paper-card hairline-all overflow-hidden">
                  <Image
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Story / Caption */}
                <div className="space-y-4">
                  <p className="font-sans text-base sm:text-lg text-ink leading-relaxed">
                    {activePhoto.caption}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 hairline-t font-mono text-xs text-ink-muted">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-terracotta" />
                      <span className="uppercase">{activePhoto.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-terracotta" />
                      <span>
                        DATE:{" "}
                        {activePhoto.takenAt
                          ? new Date(activePhoto.takenAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "ARCHIVAL"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-ink-subtle" />
                      <span>ASPECT: {activePhoto.aspectRatio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
