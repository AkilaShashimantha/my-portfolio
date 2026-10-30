"use server";

import { requireAdmin } from "@/lib/auth-guard";
import {
  dbGetProjects,
  dbCreateProject,
  dbUpdateProject,
  dbDeleteProject,
  dbToggleProjectFeatured,
} from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  summary: z.string().min(10, "Summary is required"),
  description: z.string().min(20, "Description is required"),
  coverImage: z.string().url("Valid cover image URL is required"),
  galleryImages: z.array(z.string()).default([]),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  liveUrl: z.string().nullable().optional(),
  repoUrl: z.string().nullable().optional(),
  year: z.string().min(4, "Year is required"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export async function getProjects() {
  return await dbGetProjects();
}

export async function createProject(data: z.infer<typeof projectSchema>) {
  await requireAdmin();
  const validated = projectSchema.parse(data);
  const result = await dbCreateProject(validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function updateProject(id: string, data: Partial<z.infer<typeof projectSchema>>) {
  await requireAdmin();
  const validated = projectSchema.partial().parse(data);
  const result = await dbUpdateProject(id, validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await dbDeleteProject(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}

export async function toggleProjectFeatured(id: string) {
  await requireAdmin();
  const result = await dbToggleProjectFeatured(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}
