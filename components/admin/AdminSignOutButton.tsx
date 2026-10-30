"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full flex items-center justify-between px-3 py-2 text-terracotta hover:bg-terracotta-subtle transition-colors text-left"
    >
      <span className="uppercase tracking-wider">SIGN OUT</span>
      <LogOut className="w-3.5 h-3.5" />
    </button>
  );
}
