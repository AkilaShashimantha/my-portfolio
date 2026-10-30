import { dbGetExperiences } from "@/lib/db";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await dbGetExperiences();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          CAREER LEDGER
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Work Experience & Positions Manager
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Manage chronological career history, company associations, role details, and dynamic achievement highlights.
        </p>
      </div>

      <ExperienceManager initialExperiences={experiences ?? []} />
    </div>
  );
}
