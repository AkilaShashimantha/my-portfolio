import { requireAdmin, ALLOWED_ADMIN_EMAIL } from "@/lib/auth-guard";
import { dbGetContactSubmissions } from "@/lib/db";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  Award,
  Camera,
  Share2,
  Inbox,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const submissions = await dbGetContactSubmissions();
  const unreadCount = submissions.filter((s) => s.status === "UNREAD").length;

  const navLinks = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Bio & Profile", href: "/admin/profile", icon: User },
    { label: "Projects", href: "/admin/projects", icon: Layers },
    { label: "Work Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "My Photos", href: "/admin/photos", icon: Camera },
    { label: "Social Links", href: "/admin/socials", icon: Share2 },
    { label: "Contact Inbox", href: "/admin/inbox", icon: Inbox, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row text-ink selection:bg-terracotta selection:text-paper">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-paper-card hairline-r flex flex-col justify-between shrink-0">
        <div>
          {/* Brand & Monogram Header */}
          <div className="p-6 hairline-b">
            <Link href="/admin" className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-ink">
              <span className="w-2.5 h-2.5 bg-terracotta inline-block" />
              <span>AKILA STUDIO // CMS</span>
            </Link>
            <div className="font-mono text-[10px] text-ink-subtle uppercase tracking-wider mt-1">
              EDITORIAL CMS CONSOLE
            </div>
          </div>

          {/* Admin Identity Badge */}
          <div className="px-6 py-4 hairline-b bg-paper/60 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-olive font-semibold text-[11px] mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUTHENTICATED ADMIN</span>
            </div>
            <div className="text-ink truncate font-medium text-[11px]" title={ALLOWED_ADMIN_EMAIL}>
              {ALLOWED_ADMIN_EMAIL}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 font-mono text-xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2 text-ink hover:text-terracotta hover:bg-paper/80 transition-colors group"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-ink-muted group-hover:text-terracotta transition-colors" />
                    <span className="tracking-wider uppercase">{link.label}</span>
                  </span>
                  {link.badge && link.badge > 0 ? (
                    <span className="px-1.5 py-0.2 bg-terracotta text-paper text-[10px] font-semibold">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 hairline-t space-y-2 font-mono text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-ink-muted hover:text-ink hover:bg-paper/80 transition-colors"
          >
            <span>VIEW LIVE SITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hairline-b bg-paper px-8 py-4 flex items-center justify-between">
          <div className="font-mono text-xs text-ink-muted uppercase tracking-widest">
            MANAGEMENT WORKSPACE // 2026
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-ink-muted">
            <span className="hidden sm:inline">SINGLE-ADMIN ARCHITECTURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-olive inline-block" />
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
