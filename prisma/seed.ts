import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initialSiteProfile = {
  fullName: "Akila Shashimantha",
  headline: "Lead Full-Stack Engineer & Distributed Systems Architect",
  subheadline: "Architecting resilient digital platforms, high-throughput microservices, and editorial web experiences.",
  shortBio: "Colombo-based engineer balancing distributed systems reliability with architectural typographic craft.",
  extendedBio: "I design and build distributed microservices, document intelligence engines, and high-fidelity web applications. At Onsys, I guide system architecture across enterprise banking integrations, real-time biometric identity gateways, and automated document analysis pipelines. My technical ethos combines strict algorithmic rigor, type-safe software design, and warm, tactile editorial aesthetics.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  resumeUrl: "/resume.pdf",
  location: "Colombo, Sri Lanka // GMT+05:30",
  availableForWork: true,
};

export const initialSocialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/akilashashimantha",
    handle: "@akilashashimantha",
    iconName: "Github",
    order: 1,
    isVisible: true,
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/akilashashimantha",
    handle: "in/akilashashimantha",
    iconName: "Linkedin",
    order: 2,
    isVisible: true,
  },
  {
    platform: "X / Twitter",
    url: "https://x.com/akilashashimantha",
    handle: "@akilashashi",
    iconName: "Twitter",
    order: 3,
    isVisible: true,
  },
  {
    platform: "Email",
    url: "mailto:akilashashimantha84@gmail.com",
    handle: "akilashashimantha84@gmail.com",
    iconName: "Mail",
    order: 4,
    isVisible: true,
  },
];

export const initialProjects = [
  {
    title: "CRIB Document Intelligence Platform",
    slug: "crib-document-intelligence",
    summary: "Distributed microservices engine for high-volume banking document verification and optical feature analysis.",
    description: "Architected an enterprise-grade document extraction pipeline capable of processing complex financial records, KYC validation, and biometric liveness checks in real-time. Built with Node.js microservices, Docker containerization, Redis pub/sub queues, and Azure Cognitive Services, delivering sub-second parsing with 99.8% verification accuracy.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    ],
    techStack: ["Next.js 14", "TypeScript", "Node.js", "Docker", "Redis", "Azure Vision", "PostgreSQL"],
    liveUrl: "https://crib.example.com",
    repoUrl: "https://github.com/akilashashimantha/crib-doc-intel",
    year: "2024",
    featured: true,
    order: 1,
  },
  {
    title: "Dialog Telecom Biometric Liveness System",
    slug: "dialog-biometric-liveness",
    summary: "Real-time anti-spoofing facial recognition and identity verification gateway for telecom onboarding.",
    description: "Designed and integrated low-latency client-side frame processing with server-side 3D face mesh validation. Reduced fraud attempts by 99.4% across 2M+ active subscriber activations while ensuring WCAG AA accessibility compliance.",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    ],
    techStack: ["React", "TypeScript", "WebRTC", "TensorFlow.js", "FastAPI", "Docker"],
    liveUrl: "https://liveness.dialog.example.com",
    repoUrl: "https://github.com/akilashashimantha/dialog-liveness",
    year: "2023",
    featured: true,
    order: 2,
  },
  {
    title: "IOM Automated Visa Logistics Portal",
    slug: "iom-visa-logistics",
    summary: "Secure immigration data management platform handling multi-jurisdiction applicant tracking.",
    description: "Architected end-to-end encrypted biometric case handling for international migration workflows, featuring automated PDF dossier generation, granular role-based access control, and tamper-evident audit trails.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    ],
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS", "Go", "Kubernetes"],
    liveUrl: "https://iom-portal.example.com",
    repoUrl: "https://github.com/akilashashimantha/iom-visa-logistics",
    year: "2023",
    featured: false,
    order: 3,
  },
  {
    title: "Kinesis Real-Time Financial Ledger",
    slug: "kinesis-financial-ledger",
    summary: "Event-sourced ledger accounting engine processing thousands of concurrent transactions with ACID guarantees.",
    description: "Built using CQRS patterns, Kafka streaming, and distributed locks. Features a Swiss-style minimal dashboard with live transaction graphing and instant reconciliation reporting.",
    coverImage: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
    ],
    techStack: ["TypeScript", "Node.js", "Apache Kafka", "PostgreSQL", "Next.js", "Tailwind CSS"],
    liveUrl: "https://kinesis-ledger.example.com",
    repoUrl: "https://github.com/akilashashimantha/kinesis-ledger",
    year: "2022",
    featured: true,
    order: 4,
  },
];

export const initialExperiences = [
  {
    role: "Lead Full-Stack Engineer",
    company: "Onsys Company",
    companyUrl: "https://onsys.example.com",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    startDate: "2022",
    endDate: null,
    isCurrent: true,
    description: "Directing engineering strategy, architectural standards, and full-stack product development for enterprise fintech clients.",
    highlights: [
      "Spearheaded architectural evolution of CRIB Document Intelligence platform handling 500,000+ verification queries per month.",
      "Engineered microservices backend utilizing Node.js, Redis queues, and Docker containerization with 99.95% uptime.",
      "Established modern Next.js + TypeScript UI component system ensuring accessible and performant client interfaces.",
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "Docker", "Redis", "PostgreSQL", "Azure"],
    order: 1,
  },
  {
    role: "Senior Full-Stack Developer",
    company: "TechForge Solutions",
    companyUrl: "https://techforge.example.com",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    startDate: "2020",
    endDate: "2022",
    isCurrent: false,
    description: "Built high-frequency merchant payment processing gateways and administrative analytics dashboards.",
    highlights: [
      "Reduced core transaction query latencies by 45% through composite database indexing and in-memory Redis caching.",
      "Implemented comprehensive CI/CD pipelines and unit testing suites cutting regression release cycles by 60%.",
    ],
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "AWS", "Jest"],
    order: 2,
  },
  {
    role: "Software Engineer",
    company: "Horizon Digital Labs",
    companyUrl: "https://horizon.example.com",
    location: "Colombo, Sri Lanka",
    employmentType: "Full-time",
    startDate: "2018",
    endDate: "2020",
    isCurrent: false,
    description: "Developed responsive cross-platform web and mobile applications for international logistics and education partners.",
    highlights: [
      "Built native-feeling cross-platform mobile experiences utilizing Flutter and React Native.",
      "Collaborated with product designers to implement Swiss design typography standards and tokenized design systems.",
    ],
    technologies: ["JavaScript", "React", "Flutter", "Python", "REST APIs", "Tailwind CSS"],
    order: 3,
  },
];

export const initialCertificates = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issueDate: "Nov 2023",
    expiryDate: "Nov 2026",
    credentialId: "AWS-SAA-8392102",
    credentialUrl: "https://aws.amazon.com/verification",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    order: 1,
  },
  {
    title: "Professional Scrum Master I (PSM I)",
    issuer: "Scrum.org",
    issueDate: "Jun 2023",
    expiryDate: null,
    credentialId: "PSM-928104",
    credentialUrl: "https://www.scrum.org/certificates",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    order: 2,
  },
  {
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    issueDate: "Mar 2022",
    expiryDate: null,
    credentialId: "DLAI-449102",
    credentialUrl: "https://coursera.org/verify/specialization",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    order: 3,
  },
];

export const initialPhotos = [
  {
    title: "Brutalist Geometry & Coastal Monoliths",
    caption: "Studies in concrete texture, marine humidity, and architectural verticality in the harbor district.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    location: "Colombo Harbor // Sri Lanka",
    takenAt: new Date("2024-03-12T09:30:00.000Z"),
    aspectRatio: "PORTRAIT",
    featured: true,
    order: 1,
  },
  {
    title: "High-Altitude Central Highlands",
    caption: "Morning mist clearing over terraced estates. Quiet stillness and rhythmic geometry away from terminal monitors.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    location: "Nuwara Eliya // Sri Lanka",
    takenAt: new Date("2024-01-20T06:15:00.000Z"),
    aspectRatio: "LANDSCAPE",
    featured: true,
    order: 2,
  },
  {
    title: "Archival Printing & Movable Type Studio",
    caption: "Movable lead letterpress blocks and heavy cotton rag paper. Tactile inspirations for modern digital interfaces.",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80",
    location: "Old Dutch Fort // Galle",
    takenAt: new Date("2023-11-04T14:45:00.000Z"),
    aspectRatio: "SQUARE",
    featured: true,
    order: 3,
  },
  {
    title: "Southern Ocean Tides & Sandstone Headland",
    caption: "Indian Ocean swells carving into ancient sandstone at twilight.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    location: "Mirissa Headland // Sri Lanka",
    takenAt: new Date("2023-08-18T18:20:00.000Z"),
    aspectRatio: "PORTRAIT",
    featured: false,
    order: 4,
  },
];

export const initialContactSubmissions = [
  {
    name: "Elena Rostova",
    email: "elena.rostova@archstudio.design",
    subject: "Architectural Design System Consultation",
    message: "Hello Akila, we reviewed your work on the CRIB Document Intelligence platform and were impressed by your clean typography and systems thinking. We would love to discuss a potential advisory role on our upcoming platform redesign.",
    status: "UNREAD",
  },
  {
    name: "Marcus Vance",
    email: "marcus@vancecloud.io",
    subject: "Distributed Microservices Architecture Keynote",
    message: "Hi Akila, are you available for a remote panel speaking engagement next month regarding low-latency document processing pipelines?",
    status: "READ",
  },
];

async function main() {
  console.log("🌱 Seeding database with initial editorial portfolio data...");

  // 1. Site Profile
  await prisma.siteProfile.deleteMany();
  await prisma.siteProfile.create({
    data: initialSiteProfile,
  });
  console.log("✓ SiteProfile seeded");

  // 2. Social Links
  await prisma.socialLink.deleteMany();
  for (const link of initialSocialLinks) {
    await prisma.socialLink.create({ data: link });
  }
  console.log("✓ SocialLinks seeded");

  // 3. Projects
  await prisma.project.deleteMany();
  for (const project of initialProjects) {
    await prisma.project.create({ data: project });
  }
  console.log("✓ Projects seeded");

  // 4. Experiences
  await prisma.workExperience.deleteMany();
  for (const exp of initialExperiences) {
    await prisma.workExperience.create({ data: exp });
  }
  console.log("✓ WorkExperience seeded");

  // 5. Certificates
  await prisma.certificate.deleteMany();
  for (const cert of initialCertificates) {
    await prisma.certificate.create({ data: cert });
  }
  console.log("✓ Certificates seeded");

  // 6. Photos
  await prisma.photo.deleteMany();
  for (const photo of initialPhotos) {
    await prisma.photo.create({ data: photo });
  }
  console.log("✓ Photos seeded");

  // 7. Contact Submissions
  await prisma.contactSubmission.deleteMany();
  for (const sub of initialContactSubmissions) {
    await prisma.contactSubmission.create({ data: sub });
  }
  console.log("✓ ContactSubmissions seeded");

  console.log("🎉 Seeding complete!");
}

if (process.argv[1] && (process.argv[1].endsWith("seed.ts") || process.argv[1].endsWith("seed.js") || process.argv[1].includes("seed"))) {
  main()
    .catch((e) => {
      console.warn("Notice: PostgreSQL database connection unavailable for prisma db seed. Local store initialized instead.", e.message);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
