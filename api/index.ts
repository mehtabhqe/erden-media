import type { RequestHandler } from "express";

let app: RequestHandler | undefined;

export default async function handler(
  req: Parameters<RequestHandler>[0],
  res: Parameters<RequestHandler>[1],
) {
  try {
    if (!app) {
      const { createApp } = await import("../server/_core/app");
      app = createApp();
    }
    return app(req, res, error => {
      console.error("[Vercel API] Unhandled request error", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "API request failed" });
      }
    });
  } catch (error) {
    console.error("[Vercel API] Initialization failed", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "API initialization failed" });
    }
  }
}
