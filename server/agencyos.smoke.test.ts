import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("AgencyOS foundation", () => {
  it("blocks internal reads for anonymous callers", async () => {
    const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } satisfies TrpcContext;
    await expect(appRouter.createCaller(ctx).agency.clients()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("allows internal reads for authenticated callers", async () => {
    const now = new Date();
    const ctx = {
      user: { id: 1, openId: "authenticated-test", name: "Test User", email: "test@example.com", loginMethod: "test", role: "admin", createdAt: now, updatedAt: now, lastSignedIn: now },
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } satisfies TrpcContext;
    await expect(appRouter.createCaller(ctx).agency.clients()).resolves.toBeInstanceOf(Array);
  }, 15000);

  it("exposes the authenticated user contract", async () => {
    const ctx = {
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } satisfies TrpcContext;

    const result = await appRouter.createCaller(ctx).auth.me();
    expect(result).toBeNull();
  });
});
