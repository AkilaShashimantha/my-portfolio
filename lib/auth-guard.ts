import { auth } from "@/auth";

export const ALLOWED_ADMIN_EMAIL = "akilashashimantha84@gmail.com";

export async function getAdminSession() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return null;
    }
    if (session.user.email.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  let session = null;
  try {
    session = await auth();
  } catch {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }

  if (!session?.user?.email) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }
  if (session.user.email.toLowerCase() !== ALLOWED_ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Unauthorized: Access denied. Only akilashashimantha84@gmail.com is authorized.");
  }
  return session.user;
}
