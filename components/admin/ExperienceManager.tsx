"use client";

import { useState } from "react";
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/app/actions/experience.actions";
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string | null;
  location: string;
  employmentType: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  order: number;
}

interface ExperienceManagerProps {
  initialExperiences: ExperienceItem[];
}

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingExp({
      role: "",
      company: "",
      companyUrl: "",
      location: "Colombo, Sri Lanka",
      employmentType: "Full-time",
      startDate: "2024",
      endDate: null,
      isCurrent: true,
      description: "",
      highlights: [""],
      technologies: [],
      order: experiences.length + 1,
    });
  };

  const handleOpenEdit = (exp: ExperienceItem) => {
    setIsNew(false);
    setEditingExp({
      ...exp,
      highlights: exp.highlights && exp.highlights.length > 0 ? exp.highlights : [""],
      technologies: exp.technologies || [],
    });
  };

  const handleClose = () => {
    setEditingExp(null);
    setIsNew(false);
    setTechInput("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this experience record?")) return;
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);

    try {
      const cleanData = {
        ...editingExp,
        highlights: (editingExp.highlights || []).filter((h) => h.trim().length > 0),
        technologies: editingExp.technologies || [],
        endDate: editingExp.isCurrent ? null : editingExp.endDate || null,
        order: editingExp.order ?? 0,
      };

      if (isNew) {
        const res = await createExperience(cleanData as any);
        if (res.success && res.data) {
          setExperiences([...experiences, res.data]);
          handleClose();
        }
      } else {
        const res = await updateExperience(editingExp.id!, cleanData);
        if (res.success && res.data) {
          setExperiences(experiences.map((e) => (e.id === editingExp.id ? res.data : e)));
          handleClose();
        }
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save experience record.");
    } finally {
      setSaving(false);
    }
  };

  const updateHighlight = (index: number, val: string) => {
    if (!editingExp) return;
    const current = [...(editingExp.highlights || [])];
    current[index] = val;
    setEditingExp({ ...editingExp, highlights: current });
  };

  const addHighlight = () => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      highlights: [...(editingExp.highlights || []), ""],
    });
  };

  const removeHighlight = (index: number) => {
    if (!editingExp) return;
    const current = (editingExp.highlights || []).filter((_, i) => i !== index);
    setEditingExp({ ...editingExp, highlights: current });
  };

  const addTech = () => {
    if (!techInput.trim() || !editingExp) return;
    const current = editingExp.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingExp({ ...editingExp, technologies: [...current, techInput.trim()] });
    }
    setTechInput("");
  };

  const removeTech = (item: string) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      technologies: (editingExp.technologies || []).filter((t) => t !== item),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 hairline-b">
        <div className="font-mono text-xs text-ink-muted">
          REGISTERED POSITIONS:{" "}
          <span className="text-ink font-semibold">{experiences.length}</span>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CAREER POSITION</span>
        </button>
      </div>

      <div className="hairline-all bg-paper-card divide-y divide-borderHairline">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-paper/70 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl text-ink font-normal">{exp.role}</h3>
                <span className="font-mono text-xs text-terracotta font-semibold">
                  @{exp.company}
                </span>
                <span className="font-mono text-xs text-ink-muted">
                  ({exp.startDate} — {exp.isCurrent ? "PRESENT" : exp.endDate})
                </span>
                <span className="font-mono text-[10px] text-ink-subtle">
                  ORDER #{exp.order}
                </span>
              </div>
              <p className="text-xs text-ink-muted font-sans line-clamp-2 max-w-2xl">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-ink-subtle">
                <span>{exp.highlights?.length || 0} BULLETS • {exp.location}</span>
                {exp.technologies && exp.technologies.length > 0 && (
                  <span> • [{exp.technologies.join(", ")}]</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 bg-paper text-ink hover:text-terracotta hairline-all transition-colors cursor-pointer"
                title="Edit Experience"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 bg-paper text-ink hover:text-terracotta hairline-all transition-colors cursor-pointer"
                title="Delete Experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {editingExp && (
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
                    {isNew ? "NEW POSITION" : "UPDATE POSITION"}
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-normal">
                    {isNew ? "Record Career Engagement" : `Editing: ${editingExp.role}`}
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
                      ROLE TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingExp.role || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      COMPANY NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingExp.company || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingExp.location || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      COMPANY WEBSITE
                    </label>
                    <input
                      type="text"
                      value={editingExp.companyUrl || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, companyUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      START DATE / YEAR *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingExp.startDate || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      END DATE
                    </label>
                    <input
                      type="text"
                      disabled={editingExp.isCurrent}
                      value={editingExp.endDate || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                      placeholder={editingExp.isCurrent ? "PRESENT" : "2024"}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ORDER INDEX
                    </label>
                    <input
                      type="number"
                      value={editingExp.order ?? 0}
                      onChange={(e) => setEditingExp({ ...editingExp, order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                      <input
                        type="checkbox"
                        checked={editingExp.isCurrent || false}
                        onChange={(e) =>
                          setEditingExp({ ...editingExp, isCurrent: e.target.checked })
                        }
                        className="w-4 h-4 text-terracotta border-borderHairline rounded-none"
                      />
                      <span>PRESENT</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    POSITION SUMMARY / ROLE DESCRIPTION *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={editingExp.description || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                {/* Dynamic Highlights Bullets Array */}
                <div className="space-y-3 pt-2 hairline-t">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ARCHITECTURAL BULLET HIGHLIGHTS
                    </label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="font-mono text-xs text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>ADD BULLET</span>
                    </button>
                  </div>

                  {(editingExp.highlights || []).map((highlight, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="font-mono text-xs text-terracotta">■</span>
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(idx, e.target.value)}
                        placeholder="e.g., Architected distributed microservice handling 500k queries..."
                        className="flex-1 bg-paper-card hairline-all px-3 py-1.5 text-xs text-ink focus:border-terracotta focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="p-1 text-ink-subtle hover:text-terracotta cursor-pointer"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Technologies Tags Editor */}
                <div className="space-y-2 pt-2 hairline-t">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    TECHNOLOGIES USED
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
                      placeholder="e.g. Next.js, Docker, Redis..."
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
                    {(editingExp.technologies || []).map((t) => (
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
                    {saving ? "SAVING..." : "SAVE POSITION"}
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
