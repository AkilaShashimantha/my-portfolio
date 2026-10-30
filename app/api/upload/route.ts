import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-guard";
import { getMongoDb } from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize extension and filename
    const ext = path.extname(file.name) || ".png";
    const cleanExt = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".pdf"].includes(
      ext.toLowerCase()
    )
      ? ext.toLowerCase()
      : ".png";

    const uniqueId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const uniqueName = `${uniqueId}${cleanExt}`;
    const mimeType = file.type || "image/jpeg";

    // 1. Primary: Save to MongoDB Atlas collection for cloud durability
    try {
      const mongo = await getMongoDb();
      if (mongo) {
        await mongo.collection("uploaded_files").insertOne({
          id: uniqueName,
          name: uniqueName,
          originalName: file.name,
          mimeType,
          data: buffer,
          size: buffer.length,
          createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
          success: true,
          url: `/api/files/${uniqueName}`,
          name: file.name,
        });
      }
    } catch (mongoErr) {
      console.warn("MongoDB file store warning:", mongoErr);
    }

    // 2. Fallback: Local filesystem (for offline development environments)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, uniqueName);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueName}`,
        name: file.name,
      });
    } catch {
      // 3. Fallback for serverless if MongoDB was unavailable: Base64 Data URL
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        name: file.name,
      });
    }
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: "File upload failed", details: err?.message },
      { status: 500 }
    );
  }
}
