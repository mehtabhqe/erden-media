import { describe, expect, it } from "vitest";
import { MongoClient } from "mongodb";

describe("MongoDB Atlas connection", () => {
  it("can ping the configured database when a URI is supplied", async () => {
    const uri = process.env.MONGODB_URI;
    expect(uri, "MONGODB_URI must be configured for this test").toBeTruthy();

    const client = new MongoClient(uri!);
    try {
      await client.db().command({ ping: 1 });
      expect(true).toBe(true);
    } finally {
      await client.close();
    }
  }, 15000);
});
