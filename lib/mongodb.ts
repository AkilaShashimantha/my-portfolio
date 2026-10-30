import { MongoClient, Db, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "portfolio";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoDb(): Promise<Db | null> {
  const connectionUri = process.env.MONGODB_URI || uri;
  if (!connectionUri) {
    return null;
  }

  try {
    if (!clientPromise) {
      if (process.env.NODE_ENV === "development") {
        if (!global._mongoClientPromise) {
          client = new MongoClient(connectionUri, {
            serverSelectionTimeoutMS: 4000,
            connectTimeoutMS: 4000,
          });
          global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
      } else {
        client = new MongoClient(connectionUri, {
          serverSelectionTimeoutMS: 4000,
          connectTimeoutMS: 4000,
        });
        clientPromise = client.connect();
      }
    }

    const connectedClient = await clientPromise;
    return connectedClient.db(process.env.MONGODB_DB || dbName);
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to local resilient store:", err);
    clientPromise = null;
    return null;
  }
}

export function toMongoId(id: string): ObjectId | string {
  try {
    if (typeof id === "string" && id.length === 24 && ObjectId.isValid(id)) {
      return new ObjectId(id);
    }
  } catch {
    // not a valid ObjectId
  }
  return id;
}

export function formatMongoDoc<T extends Record<string, any>>(doc: T): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: doc.id || (_id ? _id.toString() : ""),
  } as T;
}
