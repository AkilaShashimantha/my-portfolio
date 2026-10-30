import { dbGetCertificates } from "@/lib/db";
import { CertificatesManager } from "@/components/admin/CertificatesManager";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await dbGetCertificates();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          CREDENTIALS & ATTESTATIONS
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Certificates & Accreditations Manager
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Add and update industry certifications, verification hyperlinks, credential IDs, and badge preview imagery.
        </p>
      </div>

      <CertificatesManager initialCertificates={certificates ?? []} />
    </div>
  );
}
