import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

const nowMs = () => Date.now();

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  leadInitials: varchar("leadInitials", { length: 8 }).notNull(),
  status: mysqlEnum("status", ["on_track", "needs_review", "awaiting_assets"]).default("on_track").notNull(),
  health: int("health").default(50).notNull(),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 320 }),
  notes: text("notes"),
  createdAt: bigint("createdAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
  updatedAt: bigint("updatedAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
});

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["draft", "live", "complete"]).default("draft").notNull(),
  progress: int("progress").default(0).notNull(),
  startDate: bigint("startDate", { mode: "number" }),
  endDate: bigint("endDate", { mode: "number" }),
  createdAt: bigint("createdAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
});

export const contentItems = mysqlTable("contentItems", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId"),
  title: varchar("title", { length: 180 }).notNull(),
  channel: varchar("channel", { length: 60 }).notNull(),
  status: mysqlEnum("status", ["draft", "awaiting_approval", "approved", "published"]).default("draft").notNull(),
  dueDate: bigint("dueDate", { mode: "number" }),
  createdAt: bigint("createdAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
});

export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  title: varchar("title", { length: 180 }).notNull(),
  assignee: varchar("assignee", { length: 120 }),
  dueAt: bigint("dueAt", { mode: "number" }),
  status: mysqlEnum("status", ["todo", "in_progress", "done"]).default("todo").notNull(),
  createdAt: bigint("createdAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
});

export const mediaContacts = mysqlTable("mediaContacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  outlet: varchar("outlet", { length: 160 }).notNull(),
  beat: varchar("beat", { length: 100 }),
  status: mysqlEnum("status", ["not_contacted", "contacted", "responded", "covered"]).default("not_contacted").notNull(),
  lastContactedAt: bigint("lastContactedAt", { mode: "number" }),
});

export const influencers = mysqlTable("influencers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  handle: varchar("handle", { length: 120 }).notNull(),
  platform: varchar("platform", { length: 60 }).notNull(),
  audience: int("audience").default(0).notNull(),
  status: mysqlEnum("status", ["prospect", "contacted", "confirmed", "complete"]).default("prospect").notNull(),
});

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  period: varchar("period", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["draft", "ready", "sent"]).default("draft").notNull(),
  createdAt: bigint("createdAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
});

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  number: varchar("number", { length: 40 }).notNull().unique(),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 8 }).default("INR").notNull(),
  status: mysqlEnum("status", ["draft", "open", "paid", "overdue"]).default("open").notNull(),
  dueAt: bigint("dueAt", { mode: "number" }),
  createdAt: bigint("createdAt", { mode: "number" }).$defaultFn(nowMs).notNull(),
});

export type Client = typeof clients.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type ContentItem = typeof contentItems.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type MediaContact = typeof mediaContacts.$inferSelect;
export type Influencer = typeof influencers.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
