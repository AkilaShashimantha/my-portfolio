"use client";

import { useState } from "react";
import { updateSiteProfile } from "@/app/actions/profile.actions";
import { MediaUploader } from "./MediaUploader";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileEditorProps {
  initialProfile: {
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
}

export function ProfileEditor({ initialProfile }: ProfileEditorProps) {
  const [formData, setFormData] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await updateSiteProfile(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Site profile updated and changes published to homepage." });
      } else {
        setMessage({ type: "error", text: "Failed to update profile." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-paper-card hairline-all p-8 sm:p-10">
      {message && (
        <div
          className={`p-4 font-mono text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-olive-subtle border border-olive/30 text-olive"
              : "bg-terracotta-subtle border border-terracotta/30 text-terracotta"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
            FULL NAME *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
            LOCATION & TIMEZONE *
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
          EXECUTIVE HEADLINE *
        </label>
        <input
          type="text"
          required
          value={formData.headline}
          onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
          className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
          SUBHEADLINE *
        </label>
        <input
          type="text"
          required
          value={formData.subheadline}
          onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
          className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
          SHORT BIO (SUMMARY) *
        </label>
        <textarea
          required
          rows={3}
          value={formData.shortBio}
          onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
          className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
          EXTENDED BIOGRAPHY & ARCHITECTURAL MANIFESTO *
        </label>
        <textarea
          required
          rows={6}
          value={formData.extendedBio}
          onChange={(e) => setFormData({ ...formData, extendedBio: e.target.value })}
          className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink focus:border-terracotta focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 hairline-t">
        <MediaUploader
          label="PORTRAIT AVATAR URL / UPLOAD"
          value={formData.avatarUrl}
          onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
        />

        <div className="space-y-1.5">
          <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
            DOWNLOADABLE RESUME / CV URL *
          </label>
          <input
            type="text"
            required
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            className="w-full bg-paper hairline-all px-3.5 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4 hairline-t flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.availableForWork}
            onChange={(e) => setFormData({ ...formData, availableForWork: e.target.checked })}
            className="w-4 h-4 text-terracotta border-borderHairline rounded-none focus:ring-0"
          />
          <span className="font-mono text-xs uppercase tracking-wider text-ink font-medium">
            AVAILABLE FOR COMMISSIONS & ADVISORY (ACTIVE PULSE DOT)
          </span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "SAVING..." : "SAVE & PUBLISH"}</span>
        </button>
      </div>
    </form>
  );
}
