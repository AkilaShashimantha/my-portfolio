import { dbGetPhotos } from "@/lib/db";
import { PhotosManager } from "@/components/admin/PhotosManager";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const photos = await dbGetPhotos();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          VISUAL LOG
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          My Photos & Visual Log Manager
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Curate personal photography plates, aspect ratios, location metadata, and story captions displayed on the public portfolio.
        </p>
      </div>

      <PhotosManager initialPhotos={photos ?? []} />
    </div>
  );
}
