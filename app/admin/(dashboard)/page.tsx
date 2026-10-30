import {
  dbGetProjects,
  dbGetPhotos,
  dbGetCertificates,
  dbGetExperiences,
  dbGetContactSubmissions,
  dbGetSiteProfile,
} from "@/lib/db";
import Link from "next/link";
import {
  Layers,
  Camera,
  Award,
  Briefcase,
  Inbox,
  ArrowUpRight,
  Clock,
  User,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [projects, photos, certificates, experiences, submissions, profile] =
    await Promise.all([
      dbGetProjects(),
      dbGetPhotos(),
      dbGetCertificates(),
      dbGetExperiences(),
      dbGetContactSubmissions(),
      dbGetSiteProfile(),
    ]);

  const unreadCount = submissions.filter((s) => s.status === "UNREAD").length;
  const recentSubmissions = submissions.slice(0, 5);

  const stats = [
    { label: "Active Projects", value: projects.length, href: "/admin/projects", icon: Layers },
    { label: "Visual Log / Photos", value: photos.length, href: "/admin/photos", icon: Camera },
    { label: "Credentials", value: certificates.length, href: "/admin/certificates", icon: Award },
    { label: "Career Positions", value: experiences.length, href: "/admin/experience", icon: Briefcase },
    {
      label: "Unread Inquiries",
      value: unreadCount,
      href: "/admin/inbox",
      icon: Inbox,
      highlight: unreadCount > 0,
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
            EXECUTIVE DASHBOARD
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
            Studio Portfolio Overview
          </h1>
        </div>
        <div className="font-mono text-xs text-ink-muted">
          LOGGED IN AS:{" "}
          <span className="text-ink font-medium">akilashashimantha84@gmail.com</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`p-6 bg-paper-card hairline-all flex flex-col justify-between hover:border-terracotta transition-colors group ${
                stat.highlight ? "border-terracotta bg-terracotta-subtle/30" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon
                  className={`w-4 h-4 ${
                    stat.highlight ? "text-terracotta" : "text-ink-muted group-hover:text-terracotta"
                  }`}
                />
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-terracotta transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div>
                <div className="font-serif text-4xl text-ink font-normal mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {stat.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bio / Profile Quick Snapshot */}
      <div className="p-6 sm:p-8 bg-paper-card hairline-all space-y-4">
        <div className="flex items-center justify-between pb-3 hairline-b">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink font-semibold">
            <User className="w-4 h-4 text-terracotta" />
            <span>SITE PROFILE STATUS</span>
          </div>
          <Link
            href="/admin/profile"
            className="font-mono text-xs text-terracotta hover:underline font-semibold flex items-center gap-1"
          >
            <span>EDIT BIO & PROFILE</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div>
            <div className="text-ink-subtle uppercase text-[10px]">NAME & HEADLINE</div>
            <div className="font-serif text-xl text-ink font-normal mt-1">
              {profile?.fullName || "Akila Shashimantha"}
            </div>
            <div className="text-ink-muted font-sans text-xs mt-1">
              {profile?.headline}
            </div>
          </div>
          <div>
            <div className="text-ink-subtle uppercase text-[10px]">CURRENT AVAILABILITY</div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  profile?.availableForWork ? "bg-terracotta" : "bg-ink-subtle"
                }`}
              />
              <span className="font-semibold text-ink">
                {profile?.availableForWork
                  ? "AVAILABLE FOR ENGAGEMENTS"
                  : "CURRENTLY COMMITTED"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-ink-subtle uppercase text-[10px]">LOCATION</div>
            <div className="text-ink font-medium mt-1">{profile?.location}</div>
          </div>
        </div>
      </div>

      {/* Recent Contact Form Inbox */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 hairline-b">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink font-semibold">
            <Inbox className="w-4 h-4 text-terracotta" />
            <span>RECENT CONTACT INQUIRIES ({submissions.length} TOTAL)</span>
          </div>
          <Link
            href="/admin/inbox"
            className="font-mono text-xs text-terracotta hover:underline font-semibold flex items-center gap-1"
          >
            <span>VIEW ALL IN INBOX</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="p-8 text-center bg-paper-card hairline-all font-mono text-xs text-ink-muted">
            NO INQUIRIES SUBMITTED YET.
          </div>
        ) : (
          <div className="divide-y divide-borderHairline hairline-all bg-paper">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper-card/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-ink">{sub.name}</span>
                    <span className="font-mono text-xs text-ink-muted">
                      &lt;{sub.email}&gt;
                    </span>
                    {sub.status === "UNREAD" ? (
                      <span className="px-2 py-0.5 bg-terracotta text-paper text-[10px] font-mono font-semibold uppercase tracking-wider">
                        NEW
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-paper-card hairline-all text-ink-muted text-[10px] font-mono uppercase tracking-wider">
                        {sub.status}
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-base text-ink">{sub.subject}</div>
                  <p className="text-xs text-ink-muted font-sans line-clamp-1">
                    {sub.message}
                  </p>
                </div>

                <div className="font-mono text-xs text-ink-subtle shrink-0">
                  {new Date(sub.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
