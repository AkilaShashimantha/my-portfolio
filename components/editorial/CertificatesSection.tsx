"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Award, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl: string;
  order: number;
}

interface CertificatesSectionProps {
  certificates: CertificateItem[];
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  return (
    <section id="certificates" className="hairline-b bg-paper">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto p-8 sm:p-12 hairline-b">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
              <span className="text-terracotta font-semibold">04</span>
              <span>// CERTIFICATES & CREDENTIALS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight">
              Verified Technical Credentials
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider max-w-sm">
            INDUSTRY-CERTIFIED PROFICIENCIES IN CLOUD ARCHITECTURE & AGILE MASTERY
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-borderHairline">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-8 sm:p-10 flex flex-col justify-between bg-paper hover:bg-paper-card/40 transition-colors group"
          >
            <div>
              {/* Issuer Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 bg-paper-card hairline-all text-ink font-semibold flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-terracotta" />
                  <span>{cert.issuer}</span>
                </span>
                <span className="font-mono text-xs text-ink-muted">{cert.issueDate}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl text-ink font-normal mb-3 leading-snug group-hover:text-terracotta transition-colors">
                {cert.title}
              </h3>

              {/* Credential ID */}
              {cert.credentialId && (
                <div className="font-mono text-xs text-ink-muted mb-6">
                  <span className="text-ink-subtle">ID:</span> {cert.credentialId}
                </div>
              )}

              {/* Image Preview Thumbnail */}
              <div
                onClick={() => setActiveCert(cert)}
                className="relative w-full aspect-[4/3] bg-paper-card hairline-all overflow-hidden mb-6 cursor-pointer"
              >
                <Image
                  src={cert.imageUrl}
                  alt={cert.title}
                  fill
                  className="object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 bg-paper text-ink hairline-all flex items-center gap-1 shadow-editorial font-medium">
                    <Eye className="w-3 h-3" />
                    <span>PREVIEW CERTIFICATE</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 hairline-t flex items-center justify-between font-mono text-xs">
              <button
                onClick={() => setActiveCert(cert)}
                className="text-ink hover:text-terracotta transition-colors font-medium flex items-center gap-1"
              >
                <span>VIEW ATTESTATION</span>
              </button>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-terracotta hover:underline font-semibold"
                >
                  <span>VERIFY CREDENTIAL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Image Lightbox Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-paper max-w-3xl w-full hairline-all shadow-2xl relative"
            >
              <div className="p-6 hairline-b flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
                    {activeCert.issuer}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                    {activeCert.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="relative w-full aspect-[4/3] bg-paper-card hairline-all overflow-hidden mb-4">
                  <Image src={activeCert.imageUrl} alt={activeCert.title} fill className="object-contain" />
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-ink-muted pt-2">
                  <span>ISSUED: {activeCert.issueDate}</span>
                  {activeCert.credentialUrl && (
                    <a
                      href={activeCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-terracotta hover:underline font-semibold"
                    >
                      <span>EXTERNAL VERIFICATION PORTAL</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
