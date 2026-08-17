import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not configured");

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
await client.connect();
try {
  const db = client.db(process.env.MONGODB_DB_NAME || "erden_media");
  const collection = db.collection("publicInquiries");
  const filter = {
    $or: [
      { email: { $in: ["api-test@example.com", "test123@gmail.com", "phonewebtest@gmail.com", "test23@gmail.com", "test@gmail.com"] } },
      { name: { $in: ["ERDEN API Test", "test4567", "test 899", "Test phone 1", "mehtab test 33"] } },
    ],
  };
  const matches = await collection.find(filter, { projection: { name: 1, email: 1, createdAt: 1 } }).toArray();
  const result = await collection.deleteMany(filter);
  console.log(JSON.stringify({ matched: matches.length, deleted: result.deletedCount, records: matches.map(({ name, email, createdAt }) => ({ name, email, createdAt })) }));
} finally {
  await client.close();
}
