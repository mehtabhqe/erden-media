import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, calendarEvents, campaigns, clients, contentItems, files, influencers, invoices, mediaContacts, messages, publicInquiries, reports, tasks, users, workspaceSettings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}


export async function listClients() {
  const db = await getDb();
  return db ? db.select().from(clients).orderBy(desc(clients.updatedAt)) : [];
}

export async function createClient(input: typeof clients.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(clients).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function createCampaign(input: typeof campaigns.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(campaigns).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function createMediaContact(input: typeof mediaContacts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(mediaContacts).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function createInfluencer(input: typeof influencers.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(influencers).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function createReport(input: typeof reports.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(reports).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function createInvoice(input: typeof invoices.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(invoices).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function createCalendarEvent(input: typeof calendarEvents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(calendarEvents).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function listCampaigns() {
  const db = await getDb();
  return db ? db.select().from(campaigns).orderBy(desc(campaigns.createdAt)) : [];
}

export async function listContentItems() {
  const db = await getDb();
  return db ? db.select().from(contentItems).orderBy(desc(contentItems.createdAt)) : [];
}

export async function updateContentStatus(id: number, status: typeof contentItems.$inferInsert.status) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(contentItems).set({ status }).where(eq(contentItems.id, id));
  return { id, status };
}

export async function listTasks() {
  const db = await getDb();
  return db ? db.select().from(tasks).orderBy(desc(tasks.createdAt)) : [];
}

export async function updateTaskStatus(id: number, status: typeof tasks.$inferInsert.status) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(tasks).set({ status }).where(eq(tasks.id, id));
  return { id, status };
}

export async function listMediaContacts() {
  const db = await getDb();
  return db ? db.select().from(mediaContacts).orderBy(desc(mediaContacts.id)) : [];
}

export async function listInfluencers() {
  const db = await getDb();
  return db ? db.select().from(influencers).orderBy(desc(influencers.id)) : [];
}

export async function listReports() {
  const db = await getDb();
  return db ? db.select().from(reports).orderBy(desc(reports.createdAt)) : [];
}

export async function listInvoices() {
  const db = await getDb();
  return db ? db.select().from(invoices).orderBy(desc(invoices.createdAt)) : [];
}

export async function listCalendarEvents() {
  const db = await getDb();
  return db ? db.select().from(calendarEvents).orderBy(desc(calendarEvents.startsAt)) : [];
}

export async function listFiles() {
  const db = await getDb();
  return db ? db.select().from(files).orderBy(desc(files.createdAt)) : [];
}

export async function listMessages() {
  const db = await getDb();
  return db ? db.select().from(messages).orderBy(desc(messages.createdAt)) : [];
}

export async function getWorkspaceSettings() {
  const db = await getDb();
  return db ? db.select().from(workspaceSettings).limit(1) : [];
}

export async function createPublicInquiry(input: typeof publicInquiries.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(publicInquiries).values(input);
  return { id: Number(result[0].insertId), ...input };
}

export async function listPublicInquiries() {
  const db = await getDb();
  return db ? db.select().from(publicInquiries).orderBy(desc(publicInquiries.createdAt)) : [];
}

