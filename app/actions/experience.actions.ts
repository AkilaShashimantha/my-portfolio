"use server";

import { requireAdmin } from "@/lib/auth-guard";
import {
  dbGetExperiences,
  dbCreateExperience,
  dbUpdateExperience,
  dbDeleteExperience,
} from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const experienceSchema = z.object({
  role: z.string().min(2, "Role title is required"),
  company: z.string().min(2, "Company name is required"),
  companyUrl: z.string().nullable().optional(),
  location: z.string().min(2, "Location is required"),
  employmentType: z.string().default("Full-time"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(10, "Description is required"),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export async function getExperiences() {
  return await dbGetExperiences();
}

export async function createExperience(data: z.infer<typeof experienceSchema>) {
  await requireAdmin();
  const validated = experienceSchema.parse(data);
  const result = await dbCreateExperience(validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function updateExperience(id: string, data: Partial<z.infer<typeof experienceSchema>>) {
  await requireAdmin();
  const validated = experienceSchema.partial().parse(data);
  const result = await dbUpdateExperience(id, validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await dbDeleteExperience(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}
