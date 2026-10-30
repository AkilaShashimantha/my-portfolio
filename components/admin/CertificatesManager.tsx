"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/app/actions/certificates.actions";
import { MediaUploader } from "./MediaUploader";
import { Plus, Edit2, Trash2, X, ExternalLink } from "lucide-react";
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

interface CertificatesManagerProps {
  initialCertificates: CertificateItem[];
}

export function CertificatesManager({ initialCertificates }: CertificatesManagerProps) {
  const [certificates, setCertificates] = useState<CertificateItem[]>(initialCertificates);
  const [editingCert, setEditingCert] = useState<Partial<CertificateItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingCert({
      title: "",
      issuer: "",
      issueDate: "2024",
      expiryDate: null,
      credentialId: "",
      credentialUrl: "",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      order: certificates.length + 1,
    });
  };

  const handleOpenEdit = (cert: CertificateItem) => {
    setIsNew(false);
    setEditingCert({ ...cert });
  };

  const handleClose = () => {
    setEditingCert(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate credential?")) return;
    try {
      await deleteCertificate(id);
      setCertificates(certificates.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setSaving(true);

    try {
      const payload = {
        ...editingCert,
        order: editingCert.order ?? 0,
        expiryDate: editingCert.expiryDate || null,
        credentialId: editingCert.credentialId || null,
        credentialUrl: editingCert.credentialUrl || null,
      };

      if (isNew) {
        const res = await createCertificate(payload as any);
        if (res.success && res.data) {
          setCertificates([...certificates, res.data]);
          handleClose();
        }
      } else {
        const res = await updateCertificate(editingCert.id!, payload);
        if (res.success && res.data) {
          setCertificates(certificates.map((c) => (c.id === editingCert.id ? res.data : c)));
          handleClose();
        }
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save certificate.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 hairline-b">
        <div className="font-mono text-xs text-ink-muted">
          TOTAL VERIFIED CREDENTIALS:{" "}
          <span className="text-ink font-semibold">{certificates.length}</span>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CREDENTIAL</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-6 bg-paper-card hairline-all flex flex-col justify-between hover:shadow-card transition-all"
          >
            <div>
              <div className="relative w-full aspect-[4/3] bg-paper hairline-all overflow-hidden mb-4">
                <Image
                  src={cert.imageUrl}
                  alt={cert.title}
                  fill
                  className="object-cover grayscale"
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider mb-1">
                <span className="text-terracotta font-semibold">{cert.issuer}</span>
                <span className="text-ink-subtle">ORDER #{cert.order}</span>
              </div>

              <h3 className="font-serif text-xl text-ink font-normal mb-2 leading-snug">
                {cert.title}
              </h3>

              <div className="font-mono text-xs text-ink-muted space-y-0.5">
                <div>ISSUED: {cert.issueDate}</div>
                {cert.expiryDate && <div>EXPIRES: {cert.expiryDate}</div>}
                {cert.credentialId && <div>ID: {cert.credentialId}</div>}
              </div>
            </div>

            <div className="pt-4 mt-4 hairline-t flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="p-1.5 bg-paper text-ink hover:text-terracotta hairline-all cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-1.5 bg-paper text-ink hover:text-terracotta hairline-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>VERIFY</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {editingCert && (
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
              className="bg-paper max-w-2xl w-full max-h-[90vh] overflow-y-auto hairline-all shadow-2xl relative p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 hairline-b">
                <div>
                  <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold">
                    {isNew ? "NEW CREDENTIAL" : "UPDATE CREDENTIAL"}
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-normal">
                    {isNew ? "Register Technical Certification" : `Editing: ${editingCert.title}`}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    CERTIFICATE / CREDENTIAL TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.title || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ISSUING ORGANIZATION / BODY *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCert.issuer || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ISSUE DATE *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCert.issueDate || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                      placeholder="e.g. Nov 2023"
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      EXPIRY DATE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={editingCert.expiryDate || ""}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, expiryDate: e.target.value })
                      }
                      placeholder="e.g. Nov 2026 or Lifetime"
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      CREDENTIAL ID / CODE
                    </label>
                    <input
                      type="text"
                      value={editingCert.credentialId || ""}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, credentialId: e.target.value })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ORDER INDEX
                    </label>
                    <input
                      type="number"
                      value={editingCert.order ?? 0}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    VERIFICATION LINK
                  </label>
                  <input
                    type="text"
                    value={editingCert.credentialUrl || ""}
                    onChange={(e) =>
                      setEditingCert({ ...editingCert, credentialUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <MediaUploader
                  label="CERTIFICATE IMAGE / BADGE URL OR UPLOAD *"
                  value={editingCert.imageUrl || ""}
                  onChange={(url) => setEditingCert({ ...editingCert, imageUrl: url })}
                />

                <div className="pt-2 flex items-center justify-end gap-3 hairline-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 font-mono text-xs text-ink-muted hover:text-ink cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "SAVING..." : "SAVE CREDENTIAL"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
