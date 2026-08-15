import type { IncomingMessage, ServerResponse } from "node:http";
import { MongoClient } from "mongodb";
import { z } from "zod";

type Request = IncomingMessage & { body?: unknown };
type Response = ServerResponse;

type InquiryInput = {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
  source?: string;
};

let mongoClientPromise: Promise<MongoClient> | undefined;

function json(res: Response, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function trpcSuccess(res: Response, data: unknown) {
  json(res, 200, [{ result: { data: { json: data } } }]);
}

function trpcError(res: Response, statusCode: number, message: string, code = "INTERNAL_SERVER_ERROR") {
  json(res, statusCode, [{ error: { json: { message, code, data: { code, httpStatus: statusCode } } } }]);
}

async function readBody(req: Request): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
}

function getProcedure(req: Request) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const match = url.pathname.match(/\/api\/trpc\/([^/]+)/);
  return { name: match?.[1] ?? "", url };
}

function getInput(body: Record<string, unknown>, url: URL) {
  const batch = body["0"];
  if (batch && typeof batch === "object" && "json" in batch) return (batch as { json?: unknown }).json;
  const input = url.searchParams.get("input");
  if (!input) return undefined;
  const parsed = JSON.parse(input) as { json?: unknown };
  return parsed.json;
}

async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  mongoClientPromise ??= new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect();
  return mongoClientPromise;
}

async function createInquiry(input: InquiryInput) {
  const client = await getMongoClient();
  const database = process.env.MONGODB_DB_NAME || "erden_media";
  const record = { ...input, company: input.company ?? null, source: input.source ?? "contact", status: "new", createdAt: Date.now() };
  const result = await client.db(database).collection("publicInquiries").insertOne(record);
  return { id: result.insertedId.toString(), ...record };
}

const inquirySchema = z.object({
  name: z.string().min(2).max(160),
  email: z.string().email(),
  company: z.string().max(160).optional(),
  service: z.string().min(2).max(120),
  message: z.string().min(10).max(5000),
  source: z.string().max(60).optional().default("contact"),
});

export default async function handler(req: Request, res: Response) {
  const { name, url } = getProcedure(req);
  try {
    const body = await readBody(req);
    const input = getInput(body, url);

    if (name === "system.health") {
      trpcSuccess(res, { ok: true });
      return;
    }

    if (name === "auth.me") {
      trpcSuccess(res, null);
      return;
    }

    if (name === "auth.logout") {
      trpcSuccess(res, { success: true });
      return;
    }

    if (name === "agency.createInquiry") {
      const parsed = inquirySchema.safeParse(input);
      if (!parsed.success) {
        trpcError(res, 400, parsed.error.message, "BAD_REQUEST");
        return;
      }
      const record = await createInquiry(parsed.data);
      trpcSuccess(res, record);
      return;
    }

    trpcError(res, 404, "Procedure not found", "NOT_FOUND");
  } catch (error) {
    console.error("[Vercel API] Request failed", error);
    trpcError(res, 500, "API request failed");
  }
}
