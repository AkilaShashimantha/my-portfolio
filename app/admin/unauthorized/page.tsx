"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ShieldX, LogOut, ArrowLeft } from "lucide-react";

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center p-6 selection:bg-terracotta selection:text-paper">
      <div className="w-full max-w-md bg-paper-card hairline-all shadow-editorial p-8 sm:p-10 space-y-6 text-center">
        <div className="inline-flex p-3 bg-terracotta-subtle hairline-all text-terracotta mx-auto">
          <ShieldX className="w-6 h-6 text-terracotta" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-widest text-terracotta font-semibold">
            ACCESS DENIED // 403 FORBIDDEN
          </div>
          <h1 className="font-serif text-3xl text-ink font-normal">
            Unauthorized Account
          </h1>
          <p className="text-sm text-ink-muted font-sans leading-relaxed">
            This administrative console is restricted exclusively to{" "}
            <span className="font-mono text-ink font-semibold">
              akilashashimantha84@gmail.com
            </span>
            . The current session does not match the authorized administrator whitelist.
          </p>
        </div>

        <div className="pt-4 hairline-t space-y-3">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full py-2.5 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT CURRENT SESSION</span>
          </button>

          <Link
            href="/"
            className="block py-2 text-ink-muted hover:text-ink font-mono text-xs uppercase tracking-wider"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
