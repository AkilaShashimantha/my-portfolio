"use client";

import { useState } from "react";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
} from "@/app/actions/socials.actions";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Globe,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  handle: string;
  iconName: string;
  order: number;
  isVisible: boolean;
}

interface SocialsManagerProps {
  initialSocials: SocialLinkItem[];
}

export function SocialsManager({ initialSocials }: SocialsManagerProps) {
  const [socials, setSocials] = useState<SocialLinkItem[]>(initialSocials);
  const [editingLink, setEditingLink] = useState<Partial<SocialLinkItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingLink({
      platform: "GitHub",
      url: "https://github.com/",
      handle: "@handle",
      iconName: "Github",
      order: socials.length + 1,
      isVisible: true,
    });
  };

  const handleOpenEdit = (item: SocialLinkItem) => {
    setIsNew(false);
    setEditingLink({ ...item });
  };

  const handleClose = () => {
    setEditingLink(null);
    setIsNew(false);
  };

  const handleToggleVisibility = async (item: SocialLinkItem) => {
    try {
      const res = await updateSocialLink(item.id, { isVisible: !item.isVisible });
      if (res?.success && res.data) {
        setSocials(socials.map((s) => (s.id === item.id ? res.data : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this social directory connection?")) return;
    try {
      await deleteSocialLink(id);
      setSocials(socials.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socials.length) return;

    const newSocials = [...socials];
    const [moved] = newSocials.splice(index, 1);
    newSocials.splice(targetIndex, 0, moved);

    // Update order numbers sequentially
    const updatedWithOrder = newSocials.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setSocials(updatedWithOrder);

    try {
      await reorderSocialLinks(
        updatedWithOrder.map((s) => ({ id: s.id, order: s.order }))
      );
    } catch (err) {
      console.error("Failed to persist reordering:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    setSaving(true);

    try {
      const payload = {
        ...editingLink,
        order: editingLink.order ?? socials.length + 1,
      };

      if (isNew) {
        const res = await createSocialLink(payload as any);
        if (res.success && res.data) {
          setSocials([...socials, res.data].sort((a, b) => a.order - b.order));
          handleClose();
        }
      } else {
        const res = await updateSocialLink(editingLink.id!, payload);
        if (res.success && res.data) {
          setSocials(
            socials
              .map((s) => (s.id === editingLink.id ? res.data : s))
              .sort((a, b) => a.order - b.order)
          );
          handleClose();
        }
      }
    } catch (err: any) {
      alert(err?.message || "Failed to save link.");
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("git")) return <Github className="w-4 h-4" />;
    if (lower.includes("link")) return <Linkedin className="w-4 h-4" />;
    if (lower.includes("twit") || lower.includes("x")) return <Twitter className="w-4 h-4" />;
    if (lower.includes("mail")) return <Mail className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 hairline-b">
        <div className="font-mono text-xs text-ink-muted">
          DIRECTORIES & NETWORKS:{" "}
          <span className="text-ink font-semibold">{socials.length}</span>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD PLATFORM</span>
        </button>
      </div>

      <div className="hairline-all bg-paper-card divide-y divide-borderHairline">
        {socials.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper/70 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Order Indicator */}
              <div className="font-mono text-xs text-ink-subtle w-6 text-center">
                #{item.order}
              </div>

              <div className="p-2.5 bg-paper hairline-all text-ink">
                {getIcon(item.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">{item.platform}</span>
                  <span className="font-mono text-xs text-ink-muted">({item.handle})</span>
                  {!item.isVisible && (
                    <span className="px-2 py-0.5 bg-paper text-ink-subtle text-[10px] font-mono uppercase tracking-wider hairline-all">
                      HIDDEN
                    </span>
                  )}
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-ink-subtle hover:text-terracotta inline-flex items-center gap-1 mt-0.5"
                >
                  <span className="truncate max-w-sm">{item.url}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              {/* Reordering Up/Down controls */}
              <div className="flex items-center hairline-all bg-paper mr-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1.5 text-ink hover:text-terracotta disabled:opacity-30 disabled:hover:text-ink cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === socials.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 text-ink hover:text-terracotta disabled:opacity-30 disabled:hover:text-ink cursor-pointer hairline-l"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleToggleVisibility(item)}
                className={`p-2 hairline-all transition-colors cursor-pointer ${
                  item.isVisible
                    ? "bg-paper text-ink hover:text-terracotta"
                    : "bg-paper text-ink-subtle hover:text-ink"
                }`}
                title={item.isVisible ? "Hide from site" : "Show on site"}
              >
                {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 bg-paper text-ink hover:text-terracotta hairline-all cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-paper text-ink hover:text-terracotta hairline-all cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {editingLink && (
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
              className="bg-paper max-w-md w-full max-h-[90vh] overflow-y-auto hairline-all shadow-2xl relative p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 hairline-b">
                <div>
                  <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold">
                    {isNew ? "NEW PLATFORM" : "UPDATE PLATFORM"}
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-normal">
                    {isNew ? "Add Social Network" : `Editing: ${editingLink.platform}`}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    PLATFORM NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.platform || ""}
                    onChange={(e) =>
                      setEditingLink({ ...editingLink, platform: e.target.value })
                    }
                    placeholder="e.g. GitHub, LinkedIn, Behance"
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    FULL URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.url || ""}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-xs font-mono text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                    DISPLAY HANDLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.handle || ""}
                    onChange={(e) => setEditingLink({ ...editingLink, handle: e.target.value })}
                    placeholder="@akilashashimantha"
                    className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ICON IDENTIFIER
                    </label>
                    <select
                      value={editingLink.iconName || "Globe"}
                      onChange={(e) => setEditingLink({ ...editingLink, iconName: e.target.value })}
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink font-mono focus:border-terracotta focus:outline-none"
                    >
                      <option value="Github">GitHub</option>
                      <option value="Linkedin">LinkedIn</option>
                      <option value="Twitter">X / Twitter</option>
                      <option value="Mail">Email / Mail</option>
                      <option value="Globe">Generic Website / Globe</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
                      ORDER INDEX
                    </label>
                    <input
                      type="number"
                      value={editingLink.order ?? 0}
                      onChange={(e) =>
                        setEditingLink({ ...editingLink, order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-paper-card hairline-all px-3 py-2 text-sm text-ink font-mono focus:border-terracotta focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                    <input
                      type="checkbox"
                      checked={editingLink.isVisible ?? true}
                      onChange={(e) =>
                        setEditingLink({ ...editingLink, isVisible: e.target.checked })
                      }
                      className="w-4 h-4 text-terracotta border-borderHairline rounded-none"
                    />
                    <span>VISIBLE ON PORTFOLIO</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-3 py-2 font-mono text-xs text-ink-muted hover:text-ink cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "SAVING..." : "SAVE"}
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
