import { dbGetContactSubmissions } from "@/lib/db";
import { InboxManager } from "@/components/admin/InboxManager";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const submissions = await dbGetContactSubmissions();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          COMMUNICATIONS & INQUIRIES
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Contact Form Inquiries Inbox
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Review incoming client inquiries, project scopes, filter by message status, or dispatch direct email replies.
        </p>
      </div>

      <InboxManager initialSubmissions={submissions ?? []} />
    </div>
  );
}
