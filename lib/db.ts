import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { getMongoDb, formatMongoDoc, toMongoId } from "@/lib/mongodb";
import {
  initialSiteProfile,
  initialSocialLinks,
  initialProjects,
  initialExperiences,
  initialCertificates,
  initialPhotos,
  initialContactSubmissions,
} from "@/prisma/seed";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

interface LocalStore {
  siteProfile: any;
  socialLinks: any[];
  projects: any[];
  experiences: any[];
  certificates: any[];
  photos: any[];
  contactSubmissions: any[];
}

let dbConnected: boolean | null = null;
let lastDbProbe = 0;
const PROBE_INTERVAL_MS = 25000;

/**
 * Rapid probe to check if PostgreSQL via Prisma is live.
 * Prevents multiple sequential seconds-long connection timeouts when the DB is down.
 */
async function isDbConnected(): Promise<boolean> {
  // In Vercel or cloud environments without a real external Postgres DB, skip probe
  if (
    process.env.VERCEL ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("localhost")
  ) {
    return false;
  }

  const now = Date.now();
  if (dbConnected !== null && now - lastDbProbe < PROBE_INTERVAL_MS) {
    return dbConnected;
  }
  lastDbProbe = now;
  try {
    const probePromise = prisma.$queryRawUnsafe("SELECT 1;");
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database probe timeout")), 800)
    );
    await Promise.race([probePromise, timeoutPromise]);
    dbConnected = true;
    return true;
  } catch {
    dbConnected = false;
    return false;
  }
}

function ensureLocalStore(): LocalStore {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {
        // Read-only filesystem in serverless environments (e.g. Vercel)
      }
    }

    if (!fs.existsSync(DATA_FILE)) {
      const defaultData: LocalStore = {
        siteProfile: { id: "profile-1", ...initialSiteProfile, updatedAt: new Date().toISOString() },
        socialLinks: initialSocialLinks.map((s, idx) => ({ id: `social-${idx + 1}`, ...s })),
        projects: initialProjects.map((p, idx) => ({ id: `project-${idx + 1}`, createdAt: new Date().toISOString(), ...p })),
        experiences: initialExperiences.map((e, idx) => ({ id: `exp-${idx + 1}`, ...e })),
        certificates: initialCertificates.map((c, idx) => ({ id: `cert-${idx + 1}`, ...c })),
        photos: initialPhotos.map((ph, idx) => ({
          id: `photo-${idx + 1}`,
          createdAt: new Date().toISOString(),
          ...ph,
          takenAt: (ph as any).takenAt
            ? new Date((ph as any).takenAt).toISOString()
            : new Date().toISOString(),
        })),
        contactSubmissions: initialContactSubmissions.map((cs, idx) => ({ id: `sub-${idx + 1}`, createdAt: new Date().toISOString(), ...cs })),
      };
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf8");
      } catch {
        // Read-only filesystem in serverless
      }
      return defaultData;
    }

    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed.photos) {
      let modified = false;
      parsed.photos = parsed.photos.map((p: any) => {
        if (!p.takenAt) {
          modified = true;
          return { ...p, takenAt: p.createdAt || new Date().toISOString() };
        }
        return p;
      });
      if (modified) writeLocalStore(parsed);
    }
    return parsed;
  } catch {
    return {
      siteProfile: { id: "profile-1", ...initialSiteProfile, updatedAt: new Date().toISOString() },
      socialLinks: initialSocialLinks.map((s, idx) => ({ id: `social-${idx + 1}`, ...s })),
      projects: initialProjects.map((p, idx) => ({ id: `project-${idx + 1}`, createdAt: new Date().toISOString(), ...p })),
      experiences: initialExperiences.map((e, idx) => ({ id: `exp-${idx + 1}`, ...e })),
      certificates: initialCertificates.map((c, idx) => ({ id: `cert-${idx + 1}`, ...c })),
      photos: initialPhotos.map((ph, idx) => ({
        id: `photo-${idx + 1}`,
        createdAt: new Date().toISOString(),
        ...ph,
        takenAt: (ph as any).takenAt
          ? new Date((ph as any).takenAt).toISOString()
          : new Date().toISOString(),
      })),
      contactSubmissions: initialContactSubmissions.map((cs, idx) => ({ id: `sub-${idx + 1}`, createdAt: new Date().toISOString(), ...cs })),
    };
  }
}

function writeLocalStore(data: LocalStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }
}

// --------------------------------------------------------------------------------
// 1. Site Profile
// --------------------------------------------------------------------------------
export async function dbGetSiteProfile() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const doc = await mongo.collection("site_profile").findOne({});
      if (doc) return formatMongoDoc(doc);
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetSiteProfile:", err);
  }

  if (await isDbConnected()) {
    try {
      const profile = await prisma.siteProfile.findFirst();
      if (profile) return profile;
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.siteProfile;
}

export async function dbUpdateSiteProfile(data: any) {
  const store = ensureLocalStore();
  store.siteProfile = { ...store.siteProfile, ...data, updatedAt: new Date().toISOString() };

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const col = mongo.collection("site_profile");
      const existing = await col.findOne({});
      const { id: _ignoreId, _id: _ignoreMongoId, ...updateFields } = data;
      if (existing) {
        await col.updateOne(
          { _id: existing._id },
          { $set: { ...updateFields, updatedAt: new Date().toISOString() } }
        );
      } else {
        await col.insertOne({ ...store.siteProfile });
      }
      const updated = await col.findOne({});
      return formatMongoDoc(updated || store.siteProfile);
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdateSiteProfile:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      const existing = await prisma.siteProfile.findFirst();
      if (existing) {
        return await prisma.siteProfile.update({
          where: { id: existing.id },
          data,
        });
      } else {
        return await prisma.siteProfile.create({ data });
      }
    } catch {
      dbConnected = false;
    }
  }
  return store.siteProfile;
}

// --------------------------------------------------------------------------------
// 2. Social Links
// --------------------------------------------------------------------------------
export async function dbGetSocialLinks() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const docs = await mongo.collection("social_links").find({}).sort({ order: 1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map(formatMongoDoc);
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetSocialLinks:", err);
  }

  if (await isDbConnected()) {
    try {
      return await prisma.socialLink.findMany({
        orderBy: { order: "asc" },
      });
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.socialLinks.sort((a, b) => a.order - b.order);
}

export async function dbCreateSocialLink(data: any) {
  const store = ensureLocalStore();
  const newLink = { id: `social-${Date.now()}`, ...data };
  store.socialLinks.push(newLink);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("social_links").insertOne({ ...newLink });
      return newLink;
    }
  } catch (err) {
    console.warn("MongoDB error in dbCreateSocialLink:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.socialLink.create({ data });
    } catch {
      dbConnected = false;
    }
  }
  return newLink;
}

export async function dbUpdateSocialLink(id: string, data: any) {
  const store = ensureLocalStore();
  const index = store.socialLinks.findIndex((l) => l.id === id);
  if (index !== -1) {
    store.socialLinks[index] = { ...store.socialLinks[index], ...data };
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const { id: _ignoreId, _id: _ignoreMongoId, ...updateFields } = data;
      await mongo.collection("social_links").updateOne(
        { $or: [{ id }, { _id: toMongoId(id) }] },
        { $set: updateFields }
      );
      return index !== -1 ? store.socialLinks[index] : null;
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdateSocialLink:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.socialLink.update({
        where: { id },
        data,
      });
    } catch {
      dbConnected = false;
    }
  }
  return index !== -1 ? store.socialLinks[index] : null;
}

export async function dbDeleteSocialLink(id: string) {
  const store = ensureLocalStore();
  store.socialLinks = store.socialLinks.filter((l) => l.id !== id);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("social_links").deleteOne({
        $or: [{ id }, { _id: toMongoId(id) }],
      });
      return { id };
    }
  } catch (err) {
    console.warn("MongoDB error in dbDeleteSocialLink:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await prisma.socialLink.delete({ where: { id } });
    } catch {
      dbConnected = false;
    }
  }
  return { id };
}

export async function dbReorderSocialLinks(items: { id: string; order: number }[]) {
  const store = ensureLocalStore();
  for (const item of items) {
    const link = store.socialLinks.find((l) => l.id === item.id);
    if (link) {
      link.order = item.order;
    }
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const col = mongo.collection("social_links");
      for (const item of items) {
        await col.updateOne(
          { $or: [{ id: item.id }, { _id: toMongoId(item.id) }] },
          { $set: { order: item.order } }
        );
      }
      return true;
    }
  } catch (err) {
    console.warn("MongoDB error in dbReorderSocialLinks:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await Promise.all(
        items.map((item) =>
          prisma.socialLink.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );
    } catch {
      dbConnected = false;
    }
  }
  return true;
}

// --------------------------------------------------------------------------------
// 3. Projects
// --------------------------------------------------------------------------------
export async function dbGetProjects() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const docs = await mongo.collection("projects").find({}).sort({ order: 1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map(formatMongoDoc);
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetProjects:", err);
  }

  if (await isDbConnected()) {
    try {
      return await prisma.project.findMany({
        orderBy: { order: "asc" },
      });
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.projects.sort((a, b) => a.order - b.order);
}

export async function dbCreateProject(data: any) {
  const store = ensureLocalStore();
  const newProj = {
    id: `project-${Date.now()}`,
    createdAt: new Date().toISOString(),
    galleryImages: data.galleryImages || [data.coverImage],
    ...data,
  };
  store.projects.push(newProj);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("projects").insertOne({ ...newProj });
      return newProj;
    }
  } catch (err) {
    console.warn("MongoDB error in dbCreateProject:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.project.create({ data });
    } catch {
      dbConnected = false;
    }
  }
  return newProj;
}

export async function dbUpdateProject(id: string, data: any) {
  const store = ensureLocalStore();
  const index = store.projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    store.projects[index] = { ...store.projects[index], ...data };
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const { id: _ignoreId, _id: _ignoreMongoId, ...updateFields } = data;
      await mongo.collection("projects").updateOne(
        { $or: [{ id }, { _id: toMongoId(id) }] },
        { $set: updateFields }
      );
      return index !== -1 ? store.projects[index] : null;
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdateProject:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.project.update({
        where: { id },
        data,
      });
    } catch {
      dbConnected = false;
    }
  }
  return index !== -1 ? store.projects[index] : null;
}

export async function dbDeleteProject(id: string) {
  const store = ensureLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("projects").deleteOne({
        $or: [{ id }, { _id: toMongoId(id) }],
      });
      return { id };
    }
  } catch (err) {
    console.warn("MongoDB error in dbDeleteProject:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await prisma.project.delete({ where: { id } });
    } catch {
      dbConnected = false;
    }
  }
  return { id };
}

export async function dbToggleProjectFeatured(id: string) {
  const store = ensureLocalStore();
  const proj = store.projects.find((p) => p.id === id);
  if (proj) {
    proj.featured = !proj.featured;
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const col = mongo.collection("projects");
      const existing = await col.findOne({ $or: [{ id }, { _id: toMongoId(id) }] });
      if (existing) {
        const newFeatured = !existing.featured;
        await col.updateOne(
          { _id: existing._id },
          { $set: { featured: newFeatured } }
        );
        return formatMongoDoc({ ...existing, featured: newFeatured });
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbToggleProjectFeatured:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      const existing = await prisma.project.findUnique({ where: { id } });
      if (existing) {
        return await prisma.project.update({
          where: { id },
          data: { featured: !existing.featured },
        });
      }
    } catch {
      dbConnected = false;
    }
  }
  return proj || null;
}

// --------------------------------------------------------------------------------
// 4. Work Experience
// --------------------------------------------------------------------------------
export async function dbGetExperiences() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const docs = await mongo.collection("work_experiences").find({}).sort({ order: 1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map(formatMongoDoc);
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetExperiences:", err);
  }

  if (await isDbConnected()) {
    try {
      return await prisma.workExperience.findMany({
        orderBy: { order: "asc" },
      });
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.experiences.sort((a, b) => a.order - b.order);
}

export async function dbCreateExperience(data: any) {
  const store = ensureLocalStore();
  const newExp = {
    id: `exp-${Date.now()}`,
    highlights: data.highlights || [],
    technologies: data.technologies || [],
    ...data,
  };
  store.experiences.push(newExp);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("work_experiences").insertOne({ ...newExp });
      return newExp;
    }
  } catch (err) {
    console.warn("MongoDB error in dbCreateExperience:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.workExperience.create({ data });
    } catch {
      dbConnected = false;
    }
  }
  return newExp;
}

export async function dbUpdateExperience(id: string, data: any) {
  const store = ensureLocalStore();
  const index = store.experiences.findIndex((e) => e.id === id);
  if (index !== -1) {
    store.experiences[index] = { ...store.experiences[index], ...data };
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const { id: _ignoreId, _id: _ignoreMongoId, ...updateFields } = data;
      await mongo.collection("work_experiences").updateOne(
        { $or: [{ id }, { _id: toMongoId(id) }] },
        { $set: updateFields }
      );
      return index !== -1 ? store.experiences[index] : null;
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdateExperience:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.workExperience.update({
        where: { id },
        data,
      });
    } catch {
      dbConnected = false;
    }
  }
  return index !== -1 ? store.experiences[index] : null;
}

export async function dbDeleteExperience(id: string) {
  const store = ensureLocalStore();
  store.experiences = store.experiences.filter((e) => e.id !== id);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("work_experiences").deleteOne({
        $or: [{ id }, { _id: toMongoId(id) }],
      });
      return { id };
    }
  } catch (err) {
    console.warn("MongoDB error in dbDeleteExperience:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await prisma.workExperience.delete({ where: { id } });
    } catch {
      dbConnected = false;
    }
  }
  return { id };
}

// --------------------------------------------------------------------------------
// 5. Certificates
// --------------------------------------------------------------------------------
export async function dbGetCertificates() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const docs = await mongo.collection("certificates").find({}).sort({ order: 1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map(formatMongoDoc);
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetCertificates:", err);
  }

  if (await isDbConnected()) {
    try {
      return await prisma.certificate.findMany({
        orderBy: { order: "asc" },
      });
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.certificates.sort((a, b) => a.order - b.order);
}

export async function dbCreateCertificate(data: any) {
  const store = ensureLocalStore();
  const newCert = { id: `cert-${Date.now()}`, ...data };
  store.certificates.push(newCert);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("certificates").insertOne({ ...newCert });
      return newCert;
    }
  } catch (err) {
    console.warn("MongoDB error in dbCreateCertificate:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.certificate.create({ data });
    } catch {
      dbConnected = false;
    }
  }
  return newCert;
}

export async function dbUpdateCertificate(id: string, data: any) {
  const store = ensureLocalStore();
  const index = store.certificates.findIndex((c) => c.id === id);
  if (index !== -1) {
    store.certificates[index] = { ...store.certificates[index], ...data };
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const { id: _ignoreId, _id: _ignoreMongoId, ...updateFields } = data;
      await mongo.collection("certificates").updateOne(
        { $or: [{ id }, { _id: toMongoId(id) }] },
        { $set: updateFields }
      );
      return index !== -1 ? store.certificates[index] : null;
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdateCertificate:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.certificate.update({
        where: { id },
        data,
      });
    } catch {
      dbConnected = false;
    }
  }
  return index !== -1 ? store.certificates[index] : null;
}

export async function dbDeleteCertificate(id: string) {
  const store = ensureLocalStore();
  store.certificates = store.certificates.filter((c) => c.id !== id);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("certificates").deleteOne({
        $or: [{ id }, { _id: toMongoId(id) }],
      });
      return { id };
    }
  } catch (err) {
    console.warn("MongoDB error in dbDeleteCertificate:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await prisma.certificate.delete({ where: { id } });
    } catch {
      dbConnected = false;
    }
  }
  return { id };
}

// --------------------------------------------------------------------------------
// 6. Photos (Primary MongoDB Collection)
// --------------------------------------------------------------------------------
export async function dbGetPhotos() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const docs = await mongo.collection("photos").find({}).sort({ order: 1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map(formatMongoDoc);
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetPhotos:", err);
  }

  if (await isDbConnected()) {
    try {
      return await prisma.photo.findMany({
        orderBy: { order: "asc" },
      });
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.photos.sort((a, b) => a.order - b.order);
}

export async function dbCreatePhoto(data: any) {
  const takenAtStr = data.takenAt
    ? typeof data.takenAt === "string"
      ? data.takenAt
      : new Date(data.takenAt).toISOString()
    : new Date().toISOString();

  const store = ensureLocalStore();
  const newPhoto = {
    id: `photo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
    takenAt: takenAtStr,
  };
  store.photos.push(newPhoto);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("photos").insertOne({ ...newPhoto });
      return newPhoto;
    }
  } catch (err) {
    console.warn("MongoDB error in dbCreatePhoto:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.photo.create({
        data: {
          ...data,
          takenAt: new Date(takenAtStr),
        },
      });
    } catch {
      dbConnected = false;
    }
  }
  return newPhoto;
}

export async function dbUpdatePhoto(id: string, data: any) {
  const store = ensureLocalStore();
  const index = store.photos.findIndex((p) => p.id === id);
  if (index !== -1) {
    const updatedTakenAt = data.takenAt
      ? typeof data.takenAt === "string"
        ? data.takenAt
        : new Date(data.takenAt).toISOString()
      : store.photos[index].takenAt;

    store.photos[index] = {
      ...store.photos[index],
      ...data,
      takenAt: updatedTakenAt,
    };
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const { id: _ignoreId, _id: _ignoreMongoId, ...updateFields } = data;
      await mongo.collection("photos").updateOne(
        { $or: [{ id }, { _id: toMongoId(id) }] },
        { $set: updateFields }
      );
      return index !== -1 ? store.photos[index] : null;
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdatePhoto:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      const prismaData = { ...data };
      if (data.takenAt) {
        prismaData.takenAt = new Date(data.takenAt);
      }
      return await prisma.photo.update({
        where: { id },
        data: prismaData,
      });
    } catch {
      dbConnected = false;
    }
  }
  return index !== -1 ? store.photos[index] : null;
}

export async function dbDeletePhoto(id: string) {
  const store = ensureLocalStore();
  store.photos = store.photos.filter((p) => p.id !== id);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("photos").deleteOne({
        $or: [{ id }, { _id: toMongoId(id) }],
      });
      return { id };
    }
  } catch (err) {
    console.warn("MongoDB error in dbDeletePhoto:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await prisma.photo.delete({ where: { id } });
    } catch {
      dbConnected = false;
    }
  }
  return { id };
}

// --------------------------------------------------------------------------------
// 7. Contact Submissions
// --------------------------------------------------------------------------------
export async function dbGetContactSubmissions() {
  try {
    const mongo = await getMongoDb();
    if (mongo) {
      const docs = await mongo.collection("contact_submissions").find({}).sort({ createdAt: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map(formatMongoDoc);
      }
    }
  } catch (err) {
    console.warn("MongoDB error in dbGetContactSubmissions:", err);
  }

  if (await isDbConnected()) {
    try {
      return await prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      dbConnected = false;
    }
  }
  const store = ensureLocalStore();
  return store.contactSubmissions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function dbCreateContactSubmission(data: any) {
  const store = ensureLocalStore();
  const newSub = {
    id: `sub-${Date.now()}`,
    status: "UNREAD",
    createdAt: new Date().toISOString(),
    ...data,
  };
  store.contactSubmissions.unshift(newSub);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("contact_submissions").insertOne({ ...newSub });
      return newSub;
    }
  } catch (err) {
    console.warn("MongoDB error in dbCreateContactSubmission:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.contactSubmission.create({ data });
    } catch {
      dbConnected = false;
    }
  }
  return newSub;
}

export async function dbUpdateSubmissionStatus(id: string, status: string) {
  const store = ensureLocalStore();
  const sub = store.contactSubmissions.find((s) => s.id === id);
  if (sub) {
    sub.status = status;
  }

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("contact_submissions").updateOne(
        { $or: [{ id }, { _id: toMongoId(id) }] },
        { $set: { status } }
      );
      return sub || null;
    }
  } catch (err) {
    console.warn("MongoDB error in dbUpdateSubmissionStatus:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      return await prisma.contactSubmission.update({
        where: { id },
        data: { status },
      });
    } catch {
      dbConnected = false;
    }
  }
  return sub || null;
}

export async function dbDeleteSubmission(id: string) {
  const store = ensureLocalStore();
  store.contactSubmissions = store.contactSubmissions.filter((s) => s.id !== id);

  try {
    const mongo = await getMongoDb();
    if (mongo) {
      await mongo.collection("contact_submissions").deleteOne({
        $or: [{ id }, { _id: toMongoId(id) }],
      });
      return { id };
    }
  } catch (err) {
    console.warn("MongoDB error in dbDeleteSubmission:", err);
  }

  writeLocalStore(store);

  if (await isDbConnected()) {
    try {
      await prisma.contactSubmission.delete({ where: { id } });
    } catch {
      dbConnected = false;
    }
  }
  return { id };
}
