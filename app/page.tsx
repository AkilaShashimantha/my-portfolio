import {
  dbGetSiteProfile,
  dbGetSocialLinks,
  dbGetProjects,
  dbGetExperiences,
  dbGetCertificates,
  dbGetPhotos,
} from "@/lib/db";
import { Navbar } from "@/components/editorial/Navbar";
import { HeroSection } from "@/components/editorial/HeroSection";
import { ProjectsSection } from "@/components/editorial/ProjectsSection";
import { ExperienceSection } from "@/components/editorial/ExperienceSection";
import { CertificatesSection } from "@/components/editorial/CertificatesSection";
import { PhotosSection } from "@/components/editorial/PhotosSection";
import { ContactSection } from "@/components/editorial/ContactSection";
import { Footer } from "@/components/editorial/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, socialLinks, projects, experiences, certificates, photos] =
    await Promise.all([
      dbGetSiteProfile(),
      dbGetSocialLinks(),
      dbGetProjects(),
      dbGetExperiences(),
      dbGetCertificates(),
      dbGetPhotos(),
    ]);

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between selection:bg-terracotta selection:text-paper">
      <JsonLd profile={profile} socialLinks={socialLinks} />

      <Navbar availableForWork={profile?.availableForWork ?? true} />

      <main className="flex-1">
        <HeroSection
          profile={
            profile ?? {
              fullName: "Akila Shashimantha",
              headline: "Lead Full-Stack Engineer & Distributed Systems Architect",
              subheadline: "Architecting resilient digital platforms and editorial web experiences.",
              shortBio: "Colombo-based engineer balancing distributed systems reliability with architectural typographic craft.",
              extendedBio: "I design and build distributed microservices, document intelligence engines, and high-fidelity web applications.",
              avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
              resumeUrl: "/resume.pdf",
              location: "Colombo, Sri Lanka // GMT+05:30",
              availableForWork: true,
            }
          }
          socialLinks={socialLinks ?? []}
        />

        <ProjectsSection projects={projects ?? []} />

        <ExperienceSection experiences={experiences ?? []} />

        <CertificatesSection certificates={certificates ?? []} />

        <PhotosSection photos={photos ?? []} />

        <ContactSection
          socialLinks={socialLinks ?? []}
          email="akilashashimantha84@gmail.com"
          location={profile?.location ?? "Colombo, Sri Lanka // UTC+05:30"}
        />
      </main>

      <Footer />
    </div>
  );
}
