"use server";

import { requireAdmin } from "@/lib/auth-guard";
import {
  dbGetSocialLinks,
  dbCreateSocialLink,
  dbUpdateSocialLink,
  dbDeleteSocialLink,
  dbReorderSocialLinks,
} from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const socialLinkSchema = z.object({
  platform: z.string().min(2, "Platform name is required"),
  url: z.string().min(1, "URL is required"),
  handle: z.string().min(1, "Handle is required"),
  iconName: z.string().min(1, "Icon name is required"),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function getSocialLinks() {
  return await dbGetSocialLinks();
}

export async function createSocialLink(data: z.infer<typeof socialLinkSchema>) {
  await requireAdmin();
  const validated = socialLinkSchema.parse(data);
  const result = await dbCreateSocialLink(validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function updateSocialLink(id: string, data: Partial<z.infer<typeof socialLinkSchema>>) {
  await requireAdmin();
  const validated = socialLinkSchema.partial().parse(data);
  const result = await dbUpdateSocialLink(id, validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await dbDeleteSocialLink(id);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}

export async function reorderSocialLinks(items: { id: string; order: number }[]) {
  await requireAdmin();
  await dbReorderSocialLinks(items);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true };
}
