import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const ALLOWED_ADMIN_EMAIL = "akilashashimantha84@gmail.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const expectedEmail = ALLOWED_ADMIN_EMAIL.toLowerCase();

        if (email !== expectedEmail) {
          console.warn(`[Security Alert] Unauthorized login attempt with email: ${email}`);
          return null;
        }

        const envAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (envAdmin && envAdmin !== expectedEmail) {
          console.warn(`[Security Alert] ADMIN_EMAIL env mismatch: ${envAdmin}`);
          return null;
        }

        const validPassword = process.env.ADMIN_SECRET_PASSWORD;
        if (!validPassword || credentials.password !== validPassword) {
          console.warn("[Security Alert] Invalid admin credentials password attempt.");
          return null;
        }

        return {
          id: "admin-1",
          name: "Akila Shashimantha",
          email: ALLOWED_ADMIN_EMAIL,
          role: "ADMIN",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        return false;
      }
      const isAllowed = user.email.toLowerCase() === ALLOWED_ADMIN_EMAIL.toLowerCase();
      if (!isAllowed) {
        console.warn(`[Security Alert] Access denied for non-whitelisted email: ${user.email}`);
        return false;
      }
      return true;
    },
    async session({ session }) {
      if (session.user) {
        (session.user as any).role = "ADMIN";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = "ADMIN";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "e9a2b8e3489f7431289cf35028bf5867ec4310d7a6e11894b92c4b574fa03299",
});
