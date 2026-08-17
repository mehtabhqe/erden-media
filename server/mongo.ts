import { MongoClient, type Collection, type Document } from "mongodb";

let clientPromise: Promise<MongoClient> | null = null;

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  return uri;
}

async function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(getUri(), { serverSelectionTimeoutMS: 10_000 });
    clientPromise = client.connect();
  }
  return clientPromise;
}

function getDatabaseName() {
  return process.env.MONGODB_DB_NAME || "erden_media";
}

export type MongoPublicInquiry = {
  _id?: string;
  name: string;
  email: string;
  company?: string | null;
  service: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: number;
};

async function inquiries(): Promise<Collection<MongoPublicInquiry & Document>> {
  const client = await getClient();
  return client.db(getDatabaseName()).collection<MongoPublicInquiry & Document>("publicInquiries");
}

export async function pingMongo() {
  const client = await getClient();
  return client.db(getDatabaseName()).command({ ping: 1 });
}

export async function createMongoInquiry(input: Omit<MongoPublicInquiry, "createdAt" | "status">) {
  const collection = await inquiries();
  const record: MongoPublicInquiry = { ...input, status: "new", createdAt: Date.now() };
  const result = await collection.insertOne(record as MongoPublicInquiry & Document);
  return { id: result.insertedId.toString(), ...record };
}

export async function listMongoInquiries() {
  const collection = await inquiries();
  const rows = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return rows.map(({ _id, ...row }) => ({ id: _id?.toString(), ...row }));
}

export async function updateMongoInquiryStatus(id: string, status: MongoPublicInquiry["status"]) {
  const collection = await inquiries();
  const { ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) throw new Error("Invalid inquiry id");
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) } as any,
    { $set: { status } },
    { returnDocument: "after" },
  );
  if (!result) throw new Error("Inquiry not found");
  const { _id, ...row } = result;
  return { id: _id?.toString(), ...row };
}
