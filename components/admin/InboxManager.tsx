"use client";

import { useState } from "react";
import { updateSubmissionStatus, deleteSubmission } from "@/app/actions/contact.actions";
import { Mail, Check, Archive, Trash2, Copy, CheckCheck, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubmissionItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string | Date;
}

interface InboxManagerProps {
  initialSubmissions: SubmissionItem[];
}

export function InboxManager({ initialSubmissions }: InboxManagerProps) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(initialSubmissions);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ" | "ARCHIVED">("ALL");
  const [activeMessage, setActiveMessage] = useState<SubmissionItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (filter === "ALL") return true;
    return s.status === filter;
  });

  const handleStatusChange = async (id: string, newStatus: "UNREAD" | "READ" | "ARCHIVED") => {
    try {
      await updateSubmissionStatus(id, newStatus);
      setSubmissions(
        submissions.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage({ ...activeMessage, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this inquiry?")) return;
    try {
      await deleteSubmission(id);
      setSubmissions(submissions.filter((s) => s.id !== id));
      if (activeMessage?.id === id) {
        setActiveMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Filters Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 hairline-b">
        <div className="flex items-center gap-2 font-mono text-xs">
          {(["ALL", "UNREAD", "READ", "ARCHIVED"] as const).map((tab) => {
            const count =
              tab === "ALL"
                ? submissions.length
                : submissions.filter((s) => s.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 uppercase tracking-wider transition-colors hairline-all ${
                  filter === tab
                    ? "bg-ink text-paper font-semibold"
                    : "bg-paper-card text-ink-muted hover:text-ink"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="font-mono text-xs text-ink-muted">
          TOTAL MESSAGES: <span className="text-ink font-semibold">{filtered.length}</span>
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-paper-card hairline-all font-mono text-xs text-ink-muted">
          NO INQUIRIES MATCHING THE SELECTED FILTER.
        </div>
      ) : (
        <div className="hairline-all bg-paper-card divide-y divide-borderHairline">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
                item.status === "UNREAD"
                  ? "bg-paper border-l-4 border-l-terracotta"
                  : "bg-paper-card hover:bg-paper/70"
              }`}
            >
              <div
                onClick={() => {
                  setActiveMessage(item);
                  if (item.status === "UNREAD") {
                    handleStatusChange(item.id, "READ");
                  }
                }}
                className="space-y-1.5 flex-1 cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-base text-ink">{item.name}</span>
                  <span className="font-mono text-xs text-ink-muted">
                    &lt;{item.email}&gt;
                  </span>
                  {item.status === "UNREAD" && (
                    <span className="px-2 py-0.5 bg-terracotta text-paper text-[10px] font-mono font-semibold uppercase tracking-wider">
                      NEW UNREAD
                    </span>
                  )}
                  {item.status === "ARCHIVED" && (
                    <span className="px-2 py-0.5 bg-paper hairline-all text-ink-subtle text-[10px] font-mono uppercase tracking-wider">
                      ARCHIVED
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-lg text-ink font-normal">{item.subject}</h4>

                <p className="text-xs text-ink-muted font-sans line-clamp-2 max-w-3xl">
                  {item.message}
                </p>

                <div className="font-mono text-[10px] text-ink-subtle flex items-center gap-1.5 pt-1">
                  <Clock className="w-3 h-3 text-terracotta" />
                  <span>
                    RECEIVED:{" "}
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                <button
                  onClick={() => handleCopyEmail(item.email, item.id)}
                  className="p-2 bg-paper text-ink hover:text-terracotta hairline-all transition-colors flex items-center gap-1"
                  title="Copy sender email"
                >
                  {copiedId === item.id ? (
                    <CheckCheck className="w-4 h-4 text-olive" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {item.status === "UNREAD" ? (
                  <button
                    onClick={() => handleStatusChange(item.id, "READ")}
                    className="p-2 bg-paper text-ink hover:text-olive hairline-all"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(item.id, "UNREAD")}
                    className="p-2 bg-paper text-ink hover:text-terracotta hairline-all"
                    title="Mark as Unread"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                )}

                {item.status !== "ARCHIVED" && (
                  <button
                    onClick={() => handleStatusChange(item.id, "ARCHIVED")}
                    className="p-2 bg-paper text-ink hover:text-ink-muted hairline-all"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-paper text-ink hover:text-terracotta hairline-all"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Viewer Lightbox with Framer Motion */}
      <AnimatePresence>
        {activeMessage && (
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
                    COMMUNICATION DOSSIER // {activeMessage.status}
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-normal mt-1">
                    {activeMessage.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-card hairline-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-paper-card hairline-all space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-subtle">SENDER:</span>
                    <span className="text-ink font-semibold">{activeMessage.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-subtle">EMAIL:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-mono">{activeMessage.email}</span>
                      <button
                        onClick={() => handleCopyEmail(activeMessage.email, "modal")}
                        className="text-terracotta hover:underline text-[11px]"
                      >
                        {copiedId === "modal" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-subtle">TIMESTAMP:</span>
                    <span className="text-ink-muted">
                      {new Date(activeMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-ink-subtle uppercase tracking-widest text-[10px] mb-2">
                    TRANSMITTED MESSAGE BODY
                  </div>
                  <div className="p-4 bg-paper hairline-all font-sans text-sm text-ink leading-relaxed whitespace-pre-line">
                    {activeMessage.message}
                  </div>
                </div>

                <div className="pt-4 hairline-t flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                      activeMessage.subject
                    )}`}
                    className="px-4 py-2 bg-ink text-paper hover:bg-terracotta font-mono text-xs uppercase tracking-wider font-semibold"
                  >
                    REPLY VIA EMAIL CLIENT ↗
                  </a>

                  <div className="flex items-center gap-2">
                    {activeMessage.status !== "ARCHIVED" && (
                      <button
                        onClick={() => handleStatusChange(activeMessage.id, "ARCHIVED")}
                        className="px-3 py-2 bg-paper-card hairline-all text-ink hover:text-ink-muted font-mono text-xs"
                      >
                        ARCHIVE
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(activeMessage.id)}
                      className="px-3 py-2 bg-paper-card hairline-all text-terracotta hover:bg-terracotta-subtle font-mono text-xs"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
