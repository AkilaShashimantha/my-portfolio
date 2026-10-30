import assert from "node:assert";
import { ALLOWED_ADMIN_EMAIL } from "../auth";
import { requireAdmin } from "../lib/auth-guard";
import {
  dbGetSiteProfile,
  dbUpdateSiteProfile,
  dbGetSocialLinks,
  dbCreateSocialLink,
  dbUpdateSocialLink,
  dbReorderSocialLinks,
  dbDeleteSocialLink,
  dbGetProjects,
  dbCreateProject,
  dbUpdateProject,
  dbToggleProjectFeatured,
  dbDeleteProject,
  dbGetExperiences,
  dbCreateExperience,
  dbUpdateExperience,
  dbDeleteExperience,
  dbGetCertificates,
  dbCreateCertificate,
  dbUpdateCertificate,
  dbDeleteCertificate,
  dbGetPhotos,
  dbCreatePhoto,
  dbUpdatePhoto,
  dbDeletePhoto,
  dbGetContactSubmissions,
  dbCreateContactSubmission,
  dbUpdateSubmissionStatus,
  dbDeleteSubmission,
} from "../lib/db";
import { submitContactForm } from "../app/actions/contact.actions";

async function runTests() {
  console.log("==========================================");
  console.log("RUNNING PORTFOLIO & CMS VERIFICATION SUITE");
  console.log("==========================================");

  // 1. Verify Whitelist Constant & Auth Guard
  console.log("Test 1: Verify Whitelisted Admin Email & Auth Guard");
  assert.strictEqual(
    ALLOWED_ADMIN_EMAIL.toLowerCase(),
    "akilashashimantha84@gmail.com",
    "Admin email must strictly match akilashashimantha84@gmail.com"
  );
  console.log("✓ Allowed admin email strictly verified as akilashashimantha84@gmail.com");

  await assert.rejects(
    async () => {
      await requireAdmin();
    },
    (err: any) => {
      assert(err instanceof Error);
      assert(
        err.message.startsWith("Unauthorized:") || err.message.startsWith("Forbidden:"),
        `Error message must start with Unauthorized or Forbidden: got "${err.message}"`
      );
      return true;
    },
    "requireAdmin must throw Unauthorized when session is unauthenticated"
  );
  console.log("✓ requireAdmin successfully rejects unauthenticated calls");

  // 2. Verify Database Initial Store / Site Profile Read & Mutation
  console.log("\nTest 2: Verify Site Profile Database Query & Mutation");
  const profile = await dbGetSiteProfile();
  assert(profile, "SiteProfile record must exist");
  assert.strictEqual(profile.fullName, "Akila Shashimantha", "Full name must be Akila Shashimantha");
  assert(profile.availableForWork !== undefined, "availableForWork must be defined");

  const originalHeadline = profile.headline;
  await dbUpdateSiteProfile({ headline: "Updated Architectural Headline" });
  const updatedProfile = await dbGetSiteProfile();
  assert.strictEqual(updatedProfile.headline, "Updated Architectural Headline");
  // Restore original
  await dbUpdateSiteProfile({ headline: originalHeadline });
  console.log("✓ SiteProfile read & update verified successfully");

  // 3. Verify Social Links Query, Reordering & CRUD
  console.log("\nTest 3: Verify Social Links Database Query, CRUD & Reordering");
  const socials = await dbGetSocialLinks();
  assert(Array.isArray(socials), "Social links must be an array");
  assert(socials.length >= 4, "Must have at least 4 seeded social links");

  // Create new social link
  const newSocial = await dbCreateSocialLink({
    platform: "Bluesky",
    url: "https://bsky.app/profile/akila.design",
    handle: "@akila.design",
    iconName: "Globe",
    order: 99,
    isVisible: true,
  });
  assert(newSocial.id, "New social link must have an id");

  // Reorder test
  const reorderPayload = [
    { id: newSocial.id, order: 0 },
    { id: socials[0].id, order: 1 },
  ];
  await dbReorderSocialLinks(reorderPayload);
  const reordered = await dbGetSocialLinks();
  const foundNew = reordered.find((s) => s.id === newSocial.id);
  assert(foundNew && foundNew.order === 0, "Social link order must be updated to 0");

  // Delete created social link
  await dbDeleteSocialLink(newSocial.id);
  const afterDelete = await dbGetSocialLinks();
  assert(!afterDelete.some((s) => s.id === newSocial.id), "Deleted social link must not be present");
  console.log("✓ Social links CRUD and reordering verified successfully");

  // 4. Verify Projects Query & CRUD with Gallery Images
  console.log("\nTest 4: Verify Projects Database Query & Full CRUD");
  const projects = await dbGetProjects();
  assert(Array.isArray(projects), "Projects must be an array");
  assert(projects.length >= 4, "Must have at least 4 seeded projects");

  const newProj = await dbCreateProject({
    title: "Test Architecture Case Study",
    slug: "test-architecture-case-study",
    summary: "A test project exploring distributed editorial systems.",
    description: "Detailed case study description of architectural design patterns.",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    ],
    techStack: ["Next.js", "TypeScript", "Prisma"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/repo",
    year: "2026",
    featured: false,
    order: 50,
  });
  assert(newProj.id, "Project must have an id");
  assert.strictEqual(newProj.galleryImages.length, 2, "galleryImages must preserve all plates");

  // Toggle featured
  await dbToggleProjectFeatured(newProj.id);
  const projsAfterToggle = await dbGetProjects();
  const toggledProj = projsAfterToggle.find((p) => p.id === newProj.id);
  assert(toggledProj && toggledProj.featured === true, "Featured toggle must invert state");

  // Update project
  await dbUpdateProject(newProj.id, { title: "Updated Project Title" });
  const projsAfterUpdate = await dbGetProjects();
  const updatedProj = projsAfterUpdate.find((p) => p.id === newProj.id);
  assert.strictEqual(updatedProj?.title, "Updated Project Title");

  // Delete project
  await dbDeleteProject(newProj.id);
  const projsAfterDelete = await dbGetProjects();
  assert(!projsAfterDelete.some((p) => p.id === newProj.id), "Deleted project must not be present");
  console.log("✓ Projects full CRUD with galleryImages and featured toggle verified");

  // 5. Verify Experience Query & CRUD with Technologies
  console.log("\nTest 5: Verify Work Experience Database Query & Full CRUD");
  const experiences = await dbGetExperiences();
  assert(Array.isArray(experiences), "Experiences must be an array");
  assert(experiences.length >= 3, "Must have at least 3 career entries");

  const newExp = await dbCreateExperience({
    company: "Test Architectural Labs",
    role: "Staff Infrastructure Architect",
    location: "Zurich, CH",
    period: "2026 — Present",
    description: "Designing high-scale architectural design systems.",
    highlights: ["Built micro-frontends", "Optimized editorial cache"],
    technologies: ["Next.js", "GraphQL", "Tailwind CSS"],
    isCurrent: false,
    order: 10,
  });
  assert(newExp.id, "Experience must have an id");
  assert.strictEqual(newExp.technologies.length, 3, "Technologies must be preserved");

  await dbUpdateExperience(newExp.id, { role: "Principal Architect" });
  const expsAfterUpdate = await dbGetExperiences();
  const updatedExp = expsAfterUpdate.find((e) => e.id === newExp.id);
  assert.strictEqual(updatedExp?.role, "Principal Architect");

  await dbDeleteExperience(newExp.id);
  const expsAfterDelete = await dbGetExperiences();
  assert(!expsAfterDelete.some((e) => e.id === newExp.id), "Deleted experience must not exist");
  console.log("✓ Work experience full CRUD with technologies verified");

  // 6. Verify Certificates Query & CRUD with Expiry Date
  console.log("\nTest 6: Verify Certificates Database Query & Full CRUD");
  const certificates = await dbGetCertificates();
  assert(Array.isArray(certificates), "Certificates must be an array");
  assert(certificates.length >= 3, "Must have at least 3 credentials");

  const newCert = await dbCreateCertificate({
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issueDate: "Jan 2026",
    expiryDate: "Jan 2029",
    credentialId: "AWS-ARCH-9988",
    credentialUrl: "https://aws.amazon.com/verification",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    order: 10,
  });
  assert(newCert.id, "Certificate must have an id");
  assert.strictEqual(newCert.expiryDate, "Jan 2029", "expiryDate must be preserved");

  await dbUpdateCertificate(newCert.id, { title: "AWS Solutions Architect Professional" });
  const certsAfterUpdate = await dbGetCertificates();
  const updatedCert = certsAfterUpdate.find((c) => c.id === newCert.id);
  assert.strictEqual(updatedCert?.title, "AWS Solutions Architect Professional");

  await dbDeleteCertificate(newCert.id);
  const certsAfterDelete = await dbGetCertificates();
  assert(!certsAfterDelete.some((c) => c.id === newCert.id), "Deleted certificate must not exist");
  console.log("✓ Certificates full CRUD with expiryDate verified");

  // 7. Verify Photos Gallery Query & CRUD with TakenAt
  console.log("\nTest 7: Verify Photos Gallery Database Query & Full CRUD with Date");
  const photos = await dbGetPhotos();
  assert(Array.isArray(photos), "Photos must be an array");
  assert(photos.length >= 4, "Must have at least 4 photo plates");

  const sampleDate = "2025-11-15T10:00:00.000Z";
  const newPhoto = await dbCreatePhoto({
    title: "Brutalist Concrete Pavilion",
    caption: "Sharp geometric silhouettes against morning mist.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    location: "Basel, Switzerland",
    takenAt: sampleDate,
    aspectRatio: "PORTRAIT",
    featured: true,
    order: 20,
  });
  assert(newPhoto.id, "Photo must have an id");
  assert.strictEqual(newPhoto.takenAt, sampleDate, "Photo takenAt must match input timestamp");

  await dbUpdatePhoto(newPhoto.id, { location: "Zurich, Switzerland" });
  const photosAfterUpdate = await dbGetPhotos();
  const updatedPhoto = photosAfterUpdate.find((p) => p.id === newPhoto.id);
  assert.strictEqual(updatedPhoto?.location, "Zurich, Switzerland");
  assert.strictEqual(updatedPhoto?.takenAt, sampleDate, "Photo takenAt must be preserved on update");

  await dbDeletePhoto(newPhoto.id);
  const photosAfterDelete = await dbGetPhotos();
  assert(!photosAfterDelete.some((p) => p.id === newPhoto.id), "Deleted photo must not exist");
  console.log("✓ Photos full CRUD with takenAt ISO timestamp verified");

  // 8. Verify Contact Submissions, Honeypot Guard & Status Management
  console.log("\nTest 8: Verify Public Contact Submission, Honeypot Guard & CMS Inbox");
  // 8a. Legitimate submission
  const legitResult = await submitContactForm({
    name: "Architectural Reviewer",
    email: "reviewer@studio-arch.com",
    subject: "Distributed Systems Advisory Request",
    message: "We would like to discuss engineering architecture advisory for our platform.",
  });
  assert.strictEqual(legitResult.success, true, "Legitimate submission must succeed");

  // 8b. Bot submission with honeypot field filled
  const spamResult = await submitContactForm({
    name: "Spam Bot",
    email: "spammer@botnet.ru",
    subject: "Cheap SEO Services",
    message: "Buy cheap backlinks now!",
    website: "http://spam-link.com",
  });
  assert.strictEqual(spamResult.success, true, "Honeypot should return success to fool bot");

  const inbox = await dbGetContactSubmissions();
  const botSubmission = inbox.find((s) => s.name === "Spam Bot");
  assert.strictEqual(botSubmission, undefined, "Spam bot submission with honeypot must NOT be stored in database");

  const reviewerSub = inbox.find((s) => s.email === "reviewer@studio-arch.com");
  assert(reviewerSub, "Legitimate submission must be stored in database");

  // 8c. Status transitions (UNREAD -> READ -> ARCHIVED) and Deletion
  await dbUpdateSubmissionStatus(reviewerSub.id, "READ");
  const readInbox = await dbGetContactSubmissions();
  const readSub = readInbox.find((s) => s.id === reviewerSub.id);
  assert.strictEqual(readSub?.status, "READ");

  await dbUpdateSubmissionStatus(reviewerSub.id, "ARCHIVED");
  const archInbox = await dbGetContactSubmissions();
  const archSub = archInbox.find((s) => s.id === reviewerSub.id);
  assert.strictEqual(archSub?.status, "ARCHIVED");

  await dbDeleteSubmission(reviewerSub.id);
  const finalInbox = await dbGetContactSubmissions();
  assert(!finalInbox.some((s) => s.id === reviewerSub.id), "Deleted submission must not exist");
  console.log("✓ Contact submission, honeypot protection & status transitions verified");

  console.log("\n=======================================================");
  console.log("ALL 8 VERIFICATION TEST SUITES (CRUD + SECURITY) PASSED");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
