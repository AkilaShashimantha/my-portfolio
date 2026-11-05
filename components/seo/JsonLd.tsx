interface JsonLdProps {
  profile?: {
    fullName: string;
    headline: string;
    subheadline: string;
    shortBio: string;
    extendedBio: string;
    avatarUrl: string;
    resumeUrl: string;
    location: string;
    availableForWork: boolean;
  } | null;
  socialLinks?: Array<{
    id: string;
    platform: string;
    url: string;
    handle: string;
    iconName: string;
    isVisible: boolean;
  }>;
}

export function JsonLd({ profile, socialLinks }: JsonLdProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://my-portfolio-amber-nine-87.vercel.app";

  const sameAsUrls = [
    "https://github.com/AkilaShashimantha",
    ...(socialLinks?.filter((s) => s.isVisible && s.url).map((s) => s.url) || []),
  ];
  const uniqueSameAs = Array.from(new Set(sameAsUrls));

  const avatarUrl = profile?.avatarUrl
    ? profile.avatarUrl.startsWith("http")
      ? profile.avatarUrl
      : `${siteUrl}${profile.avatarUrl}`
    : `${siteUrl}/opengraph-image`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Akila Shashimantha — Systems Architect & Lead Full-Stack Engineer",
        description:
          profile?.shortBio ||
          "Personal portfolio & architectural CV of Akila Shashimantha, Lead Full-Stack Engineer and Distributed Systems Architect.",
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: "Akila Shashimantha — Portfolio & Engineering Dossier",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#person`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile?.fullName || "Akila Shashimantha",
        givenName: "Akila",
        familyName: "Shashimantha",
        alternateName: ["Akila Shashimantha", "akilashashimantha", "Akila S."],
        jobTitle:
          profile?.headline || "Lead Full-Stack Engineer & Distributed Systems Architect",
        description:
          profile?.extendedBio ||
          profile?.shortBio ||
          "Lead Full-Stack Engineer & Distributed Systems Architect based in Colombo, Sri Lanka.",
        url: siteUrl,
        image: avatarUrl,
        email: "mailto:akilashashimantha84@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Colombo",
          addressCountry: "LK",
        },
        worksFor: {
          "@type": "Organization",
          name: "Onsys",
        },
        sameAs: uniqueSameAs,
        knowsAbout: [
          "Distributed Systems Architecture",
          "Full-Stack Development",
          "Next.js",
          "React",
          "TypeScript",
          "Java Spring Boot 3",
          "Microservices Architecture",
          "Mobile Application Development (React Native / Android)",
          "PostgreSQL",
          "MongoDB Atlas",
          "Docker & Containerization",
          "Kubernetes",
          "REST & WebSocket APIs",
          "High-Throughput Financial Systems",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
