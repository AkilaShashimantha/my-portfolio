"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact.actions";
import {
  ArrowUpRight,
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Twitter,
  Globe,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  handle: string;
  iconName: string;
  isVisible: boolean;
}

interface ContactSectionProps {
  socialLinks: SocialLinkItem[];
  email?: string;
  location?: string;
}

export function ContactSection({
  socialLinks,
  email = "akilashashimantha84@gmail.com",
  location = "Colombo, Sri Lanka // UTC+05:30",
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const visibleSocials = socialLinks.filter((s) => s.isVisible);

  const getSocialIcon = (iconName: string) => {
    const lower = iconName.toLowerCase();
    if (lower.includes("git")) return <Github className="w-4 h-4" />;
    if (lower.includes("link")) return <Linkedin className="w-4 h-4" />;
    if (lower.includes("twit") || lower.includes("x")) return <Twitter className="w-4 h-4" />;
    if (lower.includes("mail")) return <Mail className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setStatus("success");
        const msg = res.message || "Message delivered successfully.";
        setStatusMessage(msg);
        showToast("success", msg);
        setFormData({ name: "", email: "", subject: "", message: "", website: "" });
      } else {
        setStatus("error");
        const msg = "Failed to submit inquiry. Please try again.";
        setStatusMessage(msg);
        showToast("error", msg);
      }
    } catch (err: any) {
      setStatus("error");
      const msg = err?.message || "An unexpected error occurred. Please try again.";
      setStatusMessage(msg);
      showToast("error", msg);
    }
  };

  return (
    <section id="contact" className="hairline-b bg-paper relative">
      {/* Toast Feedback Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-50 p-4 max-w-md shadow-2xl hairline-all flex items-start gap-3 bg-paper ${
              toast.type === "success" ? "border-olive text-ink" : "border-terracotta text-ink"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-olive shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-mono text-xs">
              <div className="font-semibold uppercase tracking-wider text-[11px] mb-0.5 text-terracotta">
                {toast.type === "success" ? "DISPATCH ATTESTED" : "TRANSMISSION ERROR"}
              </div>
              <div className="text-ink leading-relaxed font-sans">{toast.message}</div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 text-ink-subtle hover:text-ink"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto p-8 sm:p-12 hairline-b">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
              <span className="text-terracotta font-semibold">06</span>
              <span>// INITIATE CONTACT</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight">
              Initiate Dialogue & Project Inquiries
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider max-w-sm">
            DIRECT CHANNEL FOR ARCHITECTURAL CONSULTATIONS & TECHNICAL ADVISORY
          </p>
        </div>
      </div>

      {/* Split Editorial Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Direct Coordinates & Social Directory */}
        <div className="lg:col-span-5 p-8 sm:p-12 hairline-r bg-paper flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-ink font-normal mb-3">
                Direct Coordinates
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed font-sans">
                Open to advisory engagements, technical leadership, and engineering architectural reviews.
              </p>
            </div>

            {/* Coordinates List */}
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-paper-card hairline-all space-y-2">
                <div className="text-ink-subtle uppercase tracking-widest text-[10px]">
                  DIRECT ELECTRONIC MAIL
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-ink hover:text-terracotta font-semibold text-sm flex items-center justify-between group"
                >
                  <span>{email}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <div className="p-4 bg-paper-card hairline-all space-y-1">
                <div className="text-ink-subtle uppercase tracking-widest text-[10px]">
                  PRIMARY TIMEZONE & LOCATION
                </div>
                <div className="text-ink font-medium text-xs flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>{location}</span>
                </div>
              </div>

              <div className="p-4 bg-paper-card hairline-all space-y-1">
                <div className="text-ink-subtle uppercase tracking-widest text-[10px]">
                  RESPONSE EXPECTATION
                </div>
                <div className="text-ink-muted text-xs flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-olive" />
                  <span>Inquiries reviewed within 24 business hours</span>
                </div>
              </div>
            </div>

            {/* Social Directory */}
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
                SOCIAL MEDIA DIRECTORY
              </div>
              <div className="divide-y divide-borderHairline hairline-t hairline-b">
                {visibleSocials.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between py-3 text-ink hover:text-terracotta transition-colors group font-mono text-xs"
                  >
                    <span className="flex items-center gap-2.5">
                      {getSocialIcon(link.iconName)}
                      <span className="font-semibold">{link.platform}</span>
                    </span>
                    <span className="text-ink-muted group-hover:text-terracotta flex items-center gap-1">
                      <span>{link.handle}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Underline-Styled Minimal Contact Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 bg-paper">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot field (hidden from view) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Leave this field blank</label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Status Alert */}
            {status === "success" && (
              <div className="p-4 bg-olive-subtle border border-olive/30 flex items-start gap-3 text-olive font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 bg-terracotta-subtle border border-terracotta/30 flex items-start gap-3 text-terracotta font-mono text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block font-mono text-xs uppercase tracking-widest text-ink-muted"
                >
                  YOUR FULL NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Jonathan Mercer"
                  className="w-full bg-transparent border-0 border-b border-borderHairline py-2.5 text-ink font-sans placeholder:text-ink-subtle focus:border-terracotta focus:ring-0 focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block font-mono text-xs uppercase tracking-widest text-ink-muted"
                >
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="j.mercer@enterprise.io"
                  className="w-full bg-transparent border-0 border-b border-borderHairline py-2.5 text-ink font-sans placeholder:text-ink-subtle focus:border-terracotta focus:ring-0 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block font-mono text-xs uppercase tracking-widest text-ink-muted"
              >
                PROJECT SUBJECT / INQUIRY NATURE *
              </label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Architectural Advisory or Technical Proposal"
                className="w-full bg-transparent border-0 border-b border-borderHairline py-2.5 text-ink font-sans placeholder:text-ink-subtle focus:border-terracotta focus:ring-0 focus:outline-none transition-colors"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block font-mono text-xs uppercase tracking-widest text-ink-muted"
              >
                DETAILED INQUIRY / SCOPE SPECIFICATIONS *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your architectural scope, timeline expectations, or inquiry context..."
                className="w-full bg-transparent border-0 border-b border-borderHairline py-2.5 text-ink font-sans placeholder:text-ink-subtle focus:border-terracotta focus:ring-0 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-between">
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold disabled:opacity-50 shadow-editorial group cursor-pointer"
              >
                {status === "loading" ? (
                  <span>TRANSMITTING INQUIRY...</span>
                ) : (
                  <>
                    <span>DISPATCH MESSAGE</span>
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>

              <span className="font-mono text-[11px] text-ink-subtle">
                ENCRYPTED & SPAM-PROTECTED
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
