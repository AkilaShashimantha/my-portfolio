"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { dbGetSiteProfile, dbUpdateSiteProfile } from "@/lib/db";
import { safeRevalidatePath } from "@/lib/revalidate";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  headline: z.string().min(3, "Headline is required"),
  subheadline: z.string().min(3, "Subheadline is required"),
  shortBio: z.string().min(10, "Short bio is required"),
  extendedBio: z.string().min(20, "Extended bio is required"),
  avatarUrl: z.string().min(1, "Valid avatar URL or path is required"),
  resumeUrl: z.string().min(1, "Resume URL is required"),
  location: z.string().min(2, "Location is required"),
  availableForWork: z.boolean(),
});

export async function getSiteProfile() {
  return await dbGetSiteProfile();
}

export async function updateSiteProfile(data: z.infer<typeof profileSchema>) {
  await requireAdmin();
  const validated = profileSchema.parse(data);
  const result = await dbUpdateSiteProfile(validated);
  safeRevalidatePath("/");
  safeRevalidatePath("/admin");
  return { success: true, data: result };
}
