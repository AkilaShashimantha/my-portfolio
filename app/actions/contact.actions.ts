"use server";

import { requireAdmin } from "@/lib/auth-guard";
import {
  dbGetContactSubmissions,
  dbCreateContactSubmission,
  dbUpdateSubmissionStatus,
  dbDeleteSubmission,
} from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(), // Honeypot field
});

export async function submitContactForm(data: z.infer<typeof contactFormSchema>) {
  // Honeypot spam protection: if website is filled out, reject silently or return success to fool bots
  if (data.website && data.website.trim().length > 0) {
    console.warn("[Spam Protection] Honeypot field was filled, ignoring submission.");
    return { success: true, message: "Thank you for reaching out." };
  }

  const validated = contactFormSchema.parse(data);
  const result = await dbCreateContactSubmission({
    name: validated.name,
    email: validated.email,
    subject: validated.subject,
    message: validated.message,
  });

  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return {
    success: true,
    message: "Your message has been received. Akila will get back to you shortly.",
    data: result,
  };
}

export async function getContactSubmissions() {
  await requireAdmin();
  return await dbGetContactSubmissions();
}

export async function updateSubmissionStatus(id: string, status: "UNREAD" | "READ" | "ARCHIVED") {
  await requireAdmin();
  const result = await dbUpdateSubmissionStatus(id, status);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function deleteSubmission(id: string) {
  await requireAdmin();
  await dbDeleteSubmission(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}
