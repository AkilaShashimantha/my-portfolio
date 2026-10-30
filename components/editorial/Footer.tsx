import Link from "next/link";
import { ArrowUp, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-paper hairline-t">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs text-ink-muted">
        <div>
          <div className="font-semibold text-ink tracking-wider mb-1">
            AKILA SHASHIMANTHA // SYSTEMS ARCHITECT & LEAD ENGINEER
          </div>
          <div className="text-[11px] text-ink-subtle">
            ENGINEERED UNDER WARM SWISS EDITORIAL ARCHITECTURE. COLOMBO, SRI LANKA.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a
            href="#"
            className="flex items-center gap-1.5 text-ink hover:text-terracotta transition-colors font-medium"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-ink hover:text-terracotta transition-colors font-medium hairline-l pl-6"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>ADMINISTRATIVE PORTAL</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
