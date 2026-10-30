import { MongoClient } from "mongodb";
import {
  initialSiteProfile,
  initialSocialLinks,
  initialProjects,
  initialExperiences,
  initialCertificates,
  initialPhotos,
  initialContactSubmissions,
} from "./seed";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://<db_username>:<db_password>@cluster0.6z6ykwr.mongodb.net/portfolio?retryWrites=true&w=majority";
const dbName = process.env.MONGODB_DB || "portfolio";

async function main() {
  console.log(`Connecting to MongoDB Atlas: ${dbName}...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✓ Connected to MongoDB Atlas cluster0.6z6ykwr.mongodb.net");
    const db = client.db(dbName);

    // 1. Photos Collection (User's primary request)
    const photosCol = db.collection("photos");
    const existingPhotosCount = await photosCol.countDocuments();
    console.log(`Existing photos in Atlas: ${existingPhotosCount}`);

    if (existingPhotosCount === 0) {
      const photosToInsert = initialPhotos.map((ph, idx) => ({
        id: `photo-${idx + 1}`,
        title: ph.title,
        caption: ph.caption,
        imageUrl: ph.imageUrl,
        location: ph.location,
        takenAt: ph.takenAt instanceof Date ? ph.takenAt.toISOString() : ph.takenAt,
        aspectRatio: ph.aspectRatio,
        featured: ph.featured,
        order: ph.order,
        createdAt: new Date().toISOString(),
      }));
      const res = await photosCol.insertMany(photosToInsert);
      console.log(`✓ Seeded ${res.insertedCount} photos into MongoDB Atlas 'photos' collection!`);
    } else {
      console.log(`Photos collection already has ${existingPhotosCount} documents.`);
    }

    // 2. Site Profile Collection
    const profileCol = db.collection("site_profile");
    if ((await profileCol.countDocuments()) === 0) {
      await profileCol.insertOne({
        id: "profile-1",
        ...initialSiteProfile,
        updatedAt: new Date().toISOString(),
      });
      console.log("✓ Seeded site profile into 'site_profile' collection!");
    }

    // 3. Social Links Collection
    const socialsCol = db.collection("social_links");
    if ((await socialsCol.countDocuments()) === 0) {
      await socialsCol.insertMany(
        initialSocialLinks.map((s, idx) => ({ id: `social-${idx + 1}`, ...s }))
      );
      console.log("✓ Seeded social links into 'social_links' collection!");
    }

    // 4. Projects Collection
    const projectsCol = db.collection("projects");
    if ((await projectsCol.countDocuments()) === 0) {
      await projectsCol.insertMany(
        initialProjects.map((p, idx) => ({
          id: `project-${idx + 1}`,
          createdAt: new Date().toISOString(),
          ...p,
        }))
      );
      console.log("✓ Seeded projects into 'projects' collection!");
    }

    // 5. Work Experience Collection
    const expCol = db.collection("work_experiences");
    if ((await expCol.countDocuments()) === 0) {
      await expCol.insertMany(
        initialExperiences.map((e, idx) => ({ id: `exp-${idx + 1}`, ...e }))
      );
      console.log("✓ Seeded work experience into 'work_experiences' collection!");
    }

    // 6. Certificates Collection
    const certCol = db.collection("certificates");
    if ((await certCol.countDocuments()) === 0) {
      await certCol.insertMany(
        initialCertificates.map((c, idx) => ({ id: `cert-${idx + 1}`, ...c }))
      );
      console.log("✓ Seeded certificates into 'certificates' collection!");
    }

    // 7. Contact Submissions Collection
    const contactCol = db.collection("contact_submissions");
    if ((await contactCol.countDocuments()) === 0) {
      await contactCol.insertMany(
        initialContactSubmissions.map((cs, idx) => ({
          id: `sub-${idx + 1}`,
          createdAt: new Date().toISOString(),
          ...cs,
        }))
      );
      console.log("✓ Seeded contact submissions into 'contact_submissions' collection!");
    }

    console.log("\n=======================================================");
    console.log("ALL 7 COLLECTIONS IN MONGODB ATLAS 'portfolio' READY!");
    console.log("=======================================================");
  } catch (err) {
    console.error("MongoDB Atlas seed error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
