import type { IncomingMessage, ServerResponse } from "node:http";
import { MongoClient } from "mongodb";
import { SignJWT, jwtVerify } from "jose";
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

type SessionUser = {
  id: number;
  openId: string;
  name: string;
  email: string | null;
  role: "admin" | "user";
};

const COOKIE_NAME = "app_session_id";
const OAUTH_STATE_COOKIE = "__Host-oauth_state";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
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

function parseCookies(header: string | undefined) {
  return new Map(
    (header ?? "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join("="))])
  );
}

function decodeOAuthState(state: string) {
  try {
    const decoded = Buffer.from(state, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as { redirectUri?: string; nonce?: string };
    return parsed && typeof parsed.redirectUri === "string" ? parsed : { redirectUri: decoded };
  } catch {
    return { redirectUri: "" };
  }
}

function env(name: string) {
  return process.env[name] ?? "";
}

function sessionSecret() {
  const secret = env("JWT_SECRET");
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

async function createSession(user: { openId: string; name: string }) {
  return new SignJWT({ openId: user.openId, appId: env("VITE_APP_ID"), name: user.name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(`${ONE_YEAR_SECONDS}s`)
    .sign(sessionSecret());
}

async function readSession(req: Request): Promise<SessionUser | null> {
  const token = parseCookies(req.headers.cookie).get(COOKIE_NAME);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), { algorithms: ["HS256"] });
    const openId = typeof payload.openId === "string" ? payload.openId : "";
    const name = typeof payload.name === "string" ? payload.name : "";
    if (!openId || !name) return null;
    return {
      id: 1,
      openId,
      name,
      email: null,
      role: openId === env("OWNER_OPEN_ID") ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

async function handleOAuthCallback(req: Request, res: Response, url: URL) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    json(res, 400, { error: "code and state are required" });
    return;
  }

  const stateData = decodeOAuthState(state);
  const cookies = parseCookies(req.headers.cookie);
  if (stateData.nonce && cookies.get(OAUTH_STATE_COOKIE) !== stateData.nonce) {
    json(res, 403, { error: "invalid oauth state" });
    return;
  }

  const oauthServerUrl = env("OAUTH_SERVER_URL").replace(/\/+$/, "");
  const appId = env("VITE_APP_ID");
  if (!oauthServerUrl || !appId) throw new Error("OAuth server configuration is incomplete");

  const exchange = await fetch(`${oauthServerUrl}/webdev.v1.WebDevAuthPublicService/ExchangeToken`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ clientId: appId, grantType: "authorization_code", code, redirectUri: stateData.redirectUri }),
  });
  if (!exchange.ok) throw new Error(`OAuth token exchange failed (${exchange.status})`);
  const token = (await exchange.json()) as { accessToken?: string };
  if (!token.accessToken) throw new Error("OAuth access token missing");

  const profileResponse = await fetch(`${oauthServerUrl}/webdev.v1.WebDevAuthPublicService/GetUserInfo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ accessToken: token.accessToken }),
  });
  if (!profileResponse.ok) throw new Error(`OAuth user lookup failed (${profileResponse.status})`);
  const profile = (await profileResponse.json()) as { openId?: string; name?: string; email?: string };
  if (!profile.openId) throw new Error("OAuth user identity missing");

  const session = await createSession({ openId: profile.openId, name: profile.name || "AgencyOS user" });
  res.setHeader("set-cookie", [
    `${COOKIE_NAME}=${encodeURIComponent(session)}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
    `${OAUTH_STATE_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=None`,
  ]);
  res.statusCode = 302;
  res.setHeader("location", stateData.redirectUri ? new URL(stateData.redirectUri).origin + "/desk" : "/desk");
  res.end();
}

async function getMongoClient() {
  const uri = env("MONGODB_URI");
  if (!uri) throw new Error("MONGODB_URI is not configured");
  mongoClientPromise ??= new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect();
  return mongoClientPromise;
}

async function createInquiry(input: InquiryInput) {
  const client = await getMongoClient();
  const database = env("MONGODB_DB_NAME") || "erden_media";
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
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/api/oauth/callback") {
    try {
      await handleOAuthCallback(req, res, url);
    } catch (error) {
      console.error("[Vercel OAuth] Callback failed", error);
      json(res, 500, { error: "OAuth callback failed", detail: error instanceof Error ? error.message : "unknown error" });
    }
    return;
  }

  const { name } = getProcedure(req);
  try {
    const body = await readBody(req);
    const input = getInput(body, url);

    if (name === "system.health") {
      trpcSuccess(res, { ok: true });
      return;
    }

    if (name === "auth.me") {
      trpcSuccess(res, await readSession(req));
      return;
    }

    if (name === "auth.logout") {
      res.setHeader("set-cookie", `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
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
