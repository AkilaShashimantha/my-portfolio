"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { dbGetPhotos, dbCreatePhoto, dbUpdatePhoto, dbDeletePhoto } from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const photoSchema = z.object({
  title: z.string().min(2, "Title is required"),
  caption: z.string().min(5, "Caption is required"),
  imageUrl: z.string().min(1, "Valid image URL or path is required"),
  location: z.string().min(2, "Location is required"),
  aspectRatio: z.enum(["PORTRAIT", "LANDSCAPE", "SQUARE"]).default("LANDSCAPE"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  takenAt: z.union([z.string(), z.date()]).optional(),
});

export async function getPhotos() {
  return await dbGetPhotos();
}

export async function createPhoto(data: z.infer<typeof photoSchema>) {
  await requireAdmin();
  const validated = photoSchema.parse(data);
  const result = await dbCreatePhoto(validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function updatePhoto(id: string, data: Partial<z.infer<typeof photoSchema>>) {
  await requireAdmin();
  const validated = photoSchema.partial().parse(data);
  const result = await dbUpdatePhoto(id, validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  await dbDeletePhoto(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}
