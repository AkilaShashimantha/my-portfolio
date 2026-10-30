import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id;
    if (!fileId) {
      return new NextResponse("File ID required", { status: 400 });
    }

    const mongo = await getMongoDb();
    if (!mongo) {
      return new NextResponse("Database unavailable", { status: 503 });
    }

    const col = mongo.collection("uploaded_files");
    const fileDoc = await col.findOne({
      $or: [{ id: fileId }, { name: fileId }],
    });

    if (!fileDoc || !fileDoc.data) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Convert BSON Binary / Buffer
    const buffer = Buffer.isBuffer(fileDoc.data)
      ? fileDoc.data
      : fileDoc.data.buffer
      ? Buffer.from(fileDoc.data.buffer)
      : Buffer.from(fileDoc.data);

    const mimeType = fileDoc.mimeType || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Error serving uploaded file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
