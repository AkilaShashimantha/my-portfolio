"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, Check, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaUploader({ value, onChange, label = "IMAGE URL OR UPLOAD" }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
        {label}
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /uploads/..."
            className="w-full bg-paper hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
          />
        </div>

        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-paper-card hairline-all text-ink hover:text-terracotta transition-colors font-mono text-xs uppercase tracking-wider font-medium">
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? "UPLOADING..." : "UPLOAD"}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="text-[11px] font-mono text-terracotta">
          {error}
        </div>
      )}

      {value && (
        <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-ink-muted">
          <Check className="w-3.5 h-3.5 text-olive shrink-0" />
          <span className="truncate max-w-md">{value}</span>
        </div>
      )}
    </div>
  );
}
