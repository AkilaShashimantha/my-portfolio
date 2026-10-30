import { revalidatePath } from "next/cache";

export function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch (err) {
    // Gracefully ignore in non-request or testing contexts
  }
}
