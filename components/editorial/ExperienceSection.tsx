import { ArrowUpRight } from "lucide-react";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string | null;
  location: string;
  employmentType: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  order: number;
}

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="hairline-b bg-paper">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto p-8 sm:p-12 hairline-b">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
              <span className="text-terracotta font-semibold">03</span>
              <span>// WORK EXPERIENCE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight">
              Chronological Career Ledger
            </h2>
          </div>
          <p className="font-mono text-xs text-ink-muted uppercase tracking-wider max-w-sm">
            DOCUMENTING ENGINEERING LEADERSHIP & DISTRIBUTED SCALE
          </p>
        </div>
      </div>

      {/* Career Ledger Entries */}
      <div className="max-w-7xl mx-auto divide-y divide-borderHairline">
        {experiences.map((exp) => {
          const dateRange = exp.isCurrent
            ? `${exp.startDate} — PRESENT`
            : `${exp.startDate} — ${exp.endDate || "CONCLUDED"}`;

          return (
            <div
              key={exp.id}
              className="grid grid-cols-1 lg:grid-cols-12 p-8 sm:p-12 hover:bg-paper-card/30 transition-colors"
            >
              {/* Left Column: Timeline & Meta */}
              <div className="lg:col-span-4 mb-6 lg:mb-0 lg:pr-8">
                <div className="font-mono text-sm font-semibold text-ink tracking-wider mb-2">
                  {dateRange}
                </div>
                <div className="font-mono text-xs text-ink-muted uppercase tracking-wider space-y-1">
                  <div>{exp.location}</div>
                  <div className="inline-block px-2 py-0.5 bg-paper-card hairline-all text-[11px] text-ink font-medium mt-1">
                    {exp.employmentType}
                  </div>
                </div>
              </div>

              {/* Right Column: Role, Company & Achievements */}
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal mb-1">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        <span>{exp.company}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span>{exp.company}</span>
                    )}
                  </div>
                </div>

                <p className="text-ink-muted text-base leading-relaxed font-sans">
                  {exp.description}
                </p>

                {/* Key Bullet Highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                      KEY ARCHITECTURAL HIGHLIGHTS
                    </div>
                    <ul className="space-y-2 font-sans text-sm text-ink-muted">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-terracotta mt-1.5 text-xs font-mono">■</span>
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 bg-paper-card hairline-all text-ink font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
