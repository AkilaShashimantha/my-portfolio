"use server";

import { requireAdmin } from "@/lib/auth-guard";
import {
  dbGetCertificates,
  dbCreateCertificate,
  dbUpdateCertificate,
  dbDeleteCertificate,
} from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const certificateSchema = z.object({
  title: z.string().min(2, "Title is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issueDate: z.string().min(2, "Issue date is required"),
  expiryDate: z.string().nullable().optional(),
  credentialId: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional(),
  imageUrl: z.string().url("Valid credential image URL is required"),
  order: z.number().int().default(0),
});

export async function getCertificates() {
  return await dbGetCertificates();
}

export async function createCertificate(data: z.infer<typeof certificateSchema>) {
  await requireAdmin();
  const validated = certificateSchema.parse(data);
  const result = await dbCreateCertificate(validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function updateCertificate(id: string, data: Partial<z.infer<typeof certificateSchema>>) {
  await requireAdmin();
  const validated = certificateSchema.partial().parse(data);
  const result = await dbUpdateCertificate(id, validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function deleteCertificate(id: string) {
  await requireAdmin();
  await dbDeleteCertificate(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}
