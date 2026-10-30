"use client";

import { useState } from "react";
import Image from "next/image";
import { createPhoto, updatePhoto, deletePhoto } from "@/app/actions/photos.actions";
import { MediaUploader } from "./MediaUploader";
import { Plus, Edit2, Trash2, X, Camera, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  location: string;
  takenAt: string | Date;
  aspectRatio: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
  featured: boolean;
  order: number;
}

interface PhotosManagerProps {
  initialPhotos: PhotoItem[];
}

export function PhotosManager({ initialPhotos }: PhotosManagerProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingPhoto({
      title: "",
      caption: "",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      location: "Colombo // Sri Lanka",
      takenAt: new Date().toISOString().split("T")[0],
      aspectRatio: "LANDSCAPE",
      featured: false,
      order: photos.length + 1,
    });
  };

  const handleOpenEdit = (photo: PhotoItem) => {
    setIsNew(false);
    const dateStr = photo.takenAt
      ? typeof photo.takenAt === "string"
        ? photo.takenAt.split("T")[0]
        : new Date(photo.takenAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setEditingPhoto({
      ...photo,
      takenAt: dateStr,
    });
  };

  const handleClose = () => {
    setEditingPhoto(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photograph from the gallery?")) return;
    try {
      await deletePhoto(id);
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSaving(true);

    try {
      if (isNew) {
        const res = await createPhoto(editingPhoto as any);
        if (res.success && res.data) {
          setPhotos([...photos, res.data]);
          handleClose();
        }
      } else {
        const res = await updatePhoto(editingPhoto.id!, editingPhoto);
        if (res.success && res.data) {
          setPhotos(photos.map((p) => (p.id === editingPhoto.id ? res.data : p)));
          handleClose();
        }
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save photo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 hairline-b">
        <div className="font-mono text-xs text-ink-muted">
          TOTAL GALLERY PHOTOS: <span className="text-ink font-semibold">{photos.length}</span>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>UPLOAD NEW PHOTOGRAPH</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="p-4 bg-paper-card hairline-all flex flex-col justify-between hover:shadow-card transition-all group"
          >
            <div>
              <div className="relative w-full aspect-[4/3] bg-paper hairline-all overflow-hidden mb-3">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider mb-1">
                <span className="text-terracotta font-semibold">{photo.aspectRatio}</span>
                <span className="text-ink-subtle">ORDER #{photo.order}</span>
              </div>

              <h3 className="font-serif text-lg text-ink font-normal mb-1 line-clamp-1">
                {photo.title}
              </h3>

              <p className="text-xs text-ink-muted font-sans line-clamp-2 mb-2">
                {photo.caption}
              </p>

              <div className="space-y-1 font-mono text-[10px] text-ink-subtle">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-terracotta" />
                  <span className="truncate">{photo.location}</span>
                </div>
                {photo.takenAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-olive" />
                    <span>
                      {new Date(photo.takenAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 mt-3 hairline-t flex items-center justify-end gap-2 font-mono text-xs">
              <button
                onClick={() => handleOpenEdit(photo)}
                className="p-1.5 bg-paper text-ink hover:text-terracotta hairline-all"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(photo.id)}
                className="p-1.5 bg-paper text-ink hover:text-terracotta hairline-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer / Modal with Framer Motion */}
      <AnimatePresence>
        {editingPhoto && (
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
                    {isNew ? "NEW PHOTO" : "UPDATE PHOTO"}
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-normal">
                    {isNew ? "Add Gallery Photograph" : `Editing: ${editingPhoto.title}`}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    PHOTOGRAPH TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPhoto.title || ""}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPhoto.location || ""}
                      onChange={(e) =>
                        setEditingPhoto({ ...editingPhoto, location: e.target.value })
                      }
                      placeholder="Colombo Harbor // Sri Lanka"
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ASPECT RATIO *
                    </label>
                    <select
                      value={editingPhoto.aspectRatio || "LANDSCAPE"}
                      onChange={(e) =>
                        setEditingPhoto({
                          ...editingPhoto,
                          aspectRatio: e.target.value as "PORTRAIT" | "LANDSCAPE" | "SQUARE",
                        })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink font-mono focus:border-terracotta focus:outline-none"
                    >
                      <option value="PORTRAIT">PORTRAIT (3:4)</option>
                      <option value="LANDSCAPE">LANDSCAPE (16:10)</option>
                      <option value="SQUARE">SQUARE (1:1)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      DATE TAKEN (ARCHIVAL TIMESTAMP)
                    </label>
                    <input
                      type="date"
                      value={
                        editingPhoto.takenAt
                          ? typeof editingPhoto.takenAt === "string"
                            ? editingPhoto.takenAt.split("T")[0]
                            : new Date(editingPhoto.takenAt).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditingPhoto({ ...editingPhoto, takenAt: e.target.value })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink font-mono focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ORDER INDEX
                    </label>
                    <input
                      type="number"
                      value={editingPhoto.order ?? 0}
                      onChange={(e) =>
                        setEditingPhoto({
                          ...editingPhoto,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    STORY / CAPTION *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editingPhoto.caption || ""}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, caption: e.target.value })
                    }
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <MediaUploader
                  label="PHOTOGRAPH IMAGE URL OR UPLOAD *"
                  value={editingPhoto.imageUrl || ""}
                  onChange={(url) => setEditingPhoto({ ...editingPhoto, imageUrl: url })}
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
                    {saving ? "SAVING..." : "SAVE PHOTOGRAPH"}
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
