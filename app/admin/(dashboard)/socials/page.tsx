import { dbGetSocialLinks } from "@/lib/db";
import { SocialsManager } from "@/components/admin/SocialsManager";

export const dynamic = "force-dynamic";

export default async function AdminSocialsPage() {
  const socials = await dbGetSocialLinks();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          CHANNELS & DIRECTORIES
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Social Links & External Directories Manager
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Manage social profiles, handles, icons, and visibility on the public portfolio hero and contact sections.
        </p>
      </div>

      <SocialsManager initialSocials={socials ?? []} />
    </div>
  );
}
