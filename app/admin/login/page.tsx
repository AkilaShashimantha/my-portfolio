"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("akilashashimantha84@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Authentication failed. Invalid password or email is not authorized.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md bg-paper-card hairline-all shadow-editorial p-8 sm:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex p-3 bg-paper hairline-all rounded-none text-ink mx-auto mb-2">
          <Lock className="w-5 h-5 text-terracotta" />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          RESTRICTED ACCESS PORTAL
        </div>
        <h1 className="font-serif text-3xl text-ink font-normal">
          Editorial CMS Console
        </h1>
        <p className="font-mono text-xs text-ink-subtle">
          AUTHORIZED PERSONNEL EXCLUSIVELY
        </p>
      </div>

      {/* Strict Whitelist Notice */}
      <div className="p-3 bg-paper hairline-all text-ink-muted font-mono text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 text-terracotta font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>SECURITY WHITELIST ENFORCEMENT</span>
        </div>
        <div className="text-ink-subtle">
          Access strictly restricted to:{" "}
          <span className="text-ink font-medium">akilashashimantha84@gmail.com</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-terracotta-subtle border border-terracotta/30 text-terracotta font-mono text-xs">
          {error}
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
            ADMIN EMAIL
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink font-mono focus:border-terracotta focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-xs uppercase tracking-wider text-ink-muted">
            PASSWORD
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-paper hairline-all px-3.5 py-2.5 text-sm text-ink font-mono focus:border-terracotta focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-ink text-paper hover:bg-terracotta transition-colors font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>AUTHENTICATING...</span>
          ) : (
            <>
              <span>ENTER CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Google OAuth Option */}
      <div className="space-y-4 pt-4 hairline-t">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 bg-paper hairline-all hover:bg-paper-card text-ink transition-colors font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>SIGN IN WITH GOOGLE</span>
        </button>

        <div className="text-center">
          <Link
            href="/"
            className="font-mono text-xs text-ink-muted hover:text-ink transition-colors"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center p-6 selection:bg-terracotta selection:text-paper">
      <Suspense fallback={<div className="font-mono text-xs text-ink-muted">LOADING CONSOLE...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
