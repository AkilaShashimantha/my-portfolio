import { dbGetSiteProfile } from "@/lib/db";
import { ProfileEditor } from "@/components/admin/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await dbGetSiteProfile();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          PROFILE & ETHOS
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Bio & Portfolio Brief Manager
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Edits published here immediately update the homepage hero section, resume download, and availability pulse indicator.
        </p>
      </div>

      <ProfileEditor
        initialProfile={
          profile ?? {
            fullName: "Akila Shashimantha",
            headline: "Lead Full-Stack Engineer & Distributed Systems Architect",
            subheadline: "Architecting resilient digital platforms, high-throughput microservices, and editorial web experiences.",
            shortBio: "Colombo-based engineer balancing distributed systems reliability with architectural typographic craft.",
            extendedBio: "I design and build distributed microservices, document intelligence engines, and high-fidelity web applications.",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            resumeUrl: "/resume.pdf",
            location: "Colombo, Sri Lanka // GMT+05:30",
            availableForWork: true,
          }
        }
      />
    </div>
  );
}
