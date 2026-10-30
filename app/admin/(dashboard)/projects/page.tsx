import { dbGetProjects } from "@/lib/db";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await dbGetProjects();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="pb-6 hairline-b">
        <div className="font-mono text-xs text-terracotta uppercase tracking-widest font-semibold mb-1">
          PORTFOLIO SHOWCASE
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
          Projects & System Architectures Manager
        </h1>
        <p className="font-mono text-xs text-ink-muted mt-2">
          Manage production case studies, live demos, repositories, tech stacks, and featured highlight badges.
        </p>
      </div>

      <ProjectsManager initialProjects={projects ?? []} />
    </div>
  );
}
