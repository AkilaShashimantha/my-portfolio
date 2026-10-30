"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createProject,
  updateProject,
  deleteProject,
  toggleProjectFeatured,
} from "@/app/actions/projects.actions";
import { MediaUploader } from "./MediaUploader";
import { Plus, Edit2, Trash2, Star, X, ExternalLink, Github, Image as ImageIcon } from "lucide-react";
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

interface ProjectsManagerProps {
  initialProjects: ProjectItem[];
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingProject({
      title: "",
      slug: "",
      summary: "",
      description: "",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [],
      techStack: ["Next.js", "TypeScript", "PostgreSQL"],
      liveUrl: "",
      repoUrl: "",
      year: new Date().getFullYear().toString(),
      featured: false,
      order: projects.length + 1,
    });
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setIsNew(false);
    setEditingProject({
      ...project,
      galleryImages: project.galleryImages || [project.coverImage],
    });
  };

  const handleClose = () => {
    setEditingProject(null);
    setIsNew(false);
    setNewGalleryUrl("");
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await toggleProjectFeatured(id);
      if (res?.success) {
        setProjects(
          projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you certain you wish to delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);

    try {
      const payload = {
        ...editingProject,
        galleryImages:
          editingProject.galleryImages && editingProject.galleryImages.length > 0
            ? editingProject.galleryImages
            : [editingProject.coverImage || ""],
      };

      if (isNew) {
        const res = await createProject(payload as any);
        if (res.success && res.data) {
          setProjects([...projects, res.data]);
          handleClose();
        }
      } else {
        const res = await updateProject(editingProject.id!, payload);
        if (res.success && res.data) {
          setProjects(projects.map((p) => (p.id === editingProject.id ? res.data : p)));
          handleClose();
        }
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const addTech = () => {
    if (!techInput.trim() || !editingProject) return;
    const current = editingProject.techStack || [];
    if (!current.includes(techInput.trim())) {
      setEditingProject({ ...editingProject, techStack: [...current, techInput.trim()] });
    }
    setTechInput("");
  };

  const removeTech = (item: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      techStack: (editingProject.techStack || []).filter((t) => t !== item),
    });
  };

  const addGalleryImage = (url: string) => {
    if (!url.trim() || !editingProject) return;
    const current = editingProject.galleryImages || [];
    if (!current.includes(url.trim())) {
      setEditingProject({ ...editingProject, galleryImages: [...current, url.trim()] });
    }
    setNewGalleryUrl("");
  };

  const removeGalleryImage = (idx: number) => {
    if (!editingProject) return;
    const current = (editingProject.galleryImages || []).filter((_, i) => i !== idx);
    setEditingProject({ ...editingProject, galleryImages: current });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between pb-4 hairline-b">
        <div className="font-mono text-xs text-ink-muted">
          TOTAL REGISTERED PROJECTS:{" "}
          <span className="text-ink font-semibold">{projects.length}</span>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW PROJECT CASE STUDY</span>
        </button>
      </div>

      {/* Projects Table / List */}
      <div className="hairline-all bg-paper-card divide-y divide-borderHairline">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-paper/70 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-16 bg-paper hairline-all shrink-0 overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover grayscale"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-terracotta font-semibold">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-xl text-ink font-normal">{project.title}</h3>
                  <span className="font-mono text-xs text-ink-muted">({project.year})</span>
                  {project.featured && (
                    <span className="px-2 py-0.5 bg-terracotta text-paper text-[10px] font-mono font-semibold uppercase tracking-wider">
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted font-sans line-clamp-1 max-w-2xl">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] px-2 py-0.5 bg-paper hairline-all text-ink-muted"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.galleryImages && project.galleryImages.length > 1 && (
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-paper-card hairline-all text-terracotta">
                      +{project.galleryImages.length - 1} PLATES
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
              <button
                onClick={() => handleToggleFeatured(project.id)}
                className={`p-2 hairline-all transition-colors cursor-pointer ${
                  project.featured
                    ? "bg-terracotta text-paper"
                    : "bg-paper text-ink-muted hover:text-ink"
                }`}
                title="Toggle Featured"
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenEdit(project)}
                className="p-2 bg-paper text-ink hover:text-terracotta hairline-all transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 bg-paper text-ink hover:text-terracotta hairline-all transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer / Modal with Framer Motion */}
      <AnimatePresence>
        {editingProject && (
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
              className="bg-paper max-w-3xl w-full max-h-[90vh] overflow-y-auto hairline-all shadow-2xl relative p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 hairline-b">
                <div>
                  <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold">
                    {isNew ? "CREATE DOSSIER" : "UPDATE DOSSIER"}
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-normal">
                    {isNew ? "Register New Case Study" : `Editing: ${editingProject.title}`}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          title: e.target.value,
                          slug:
                            editingProject.slug ||
                            e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      UNIQUE SLUG *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      YEAR *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.year || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, year: e.target.value })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ORDER INDEX
                    </label>
                    <input
                      type="number"
                      value={editingProject.order ?? 0}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    SUMMARY (CARD OVERVIEW) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={editingProject.summary || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, summary: e.target.value })
                    }
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    FULL ARCHITECTURAL SPECIFICATION & DESCRIPTION *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={editingProject.description || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                {/* Cover Image */}
                <MediaUploader
                  label="COVER IMAGE URL / UPLOAD *"
                  value={editingProject.coverImage || ""}
                  onChange={(url) => setEditingProject({ ...editingProject, coverImage: url })}
                />

                {/* Additional Gallery Images */}
                <div className="space-y-3 pt-2 hairline-t">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ADDITIONAL GALLERY PLATES ({editingProject.galleryImages?.length || 0})
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Paste additional image URL (e.g. https://...)"
                      className="flex-1 bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => addGalleryImage(newGalleryUrl)}
                      className="px-4 py-2 bg-paper-card hairline-all text-ink hover:text-terracotta font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      ADD PLATE
                    </button>
                  </div>
                  {editingProject.galleryImages && editingProject.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {editingProject.galleryImages.map((img, i) => (
                        <div key={i} className="relative aspect-[16/10] bg-paper-card hairline-all group overflow-hidden">
                          <Image src={img} alt={`Plate ${i + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute top-1 right-1 p-1 bg-paper/90 text-terracotta hairline-all opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove plate"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tech Stack Tags Editor */}
                <div className="space-y-2 pt-2 hairline-t">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    TECH STACK TAGS *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTech();
                        }
                      }}
                      placeholder="Type technology (e.g. Next.js) and press Add"
                      className="flex-1 bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-4 py-2 bg-paper-card hairline-all text-ink hover:text-terracotta font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      ADD
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(editingProject.techStack || []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 bg-paper-card hairline-all text-ink"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => removeTech(t)}
                          className="text-ink-subtle hover:text-terracotta cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      LIVE PRODUCTION URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.liveUrl || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, liveUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      REPOSITORY URL
                    </label>
                    <input
                      type="text"
                      value={editingProject.repoUrl || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, repoUrl: e.target.value })
                      }
                      placeholder="https://github.com/..."
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                    <input
                      type="checkbox"
                      checked={editingProject.featured || false}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-terracotta border-borderHairline rounded-none"
                    />
                    <span>FEATURE ON EDITORIAL PORTFOLIO</span>
                  </label>

                  <div className="flex items-center gap-3">
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
                      {saving ? "SAVING..." : "SAVE PROJECT"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
