import type { RequestHandler } from "express";
import { createApp } from "../server/_core/app";

let app: RequestHandler | undefined;

export default function handler(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
  try {
    app ??= createApp();
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
