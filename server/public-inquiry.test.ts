import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { createPublicInquiry, listPublicInquiries, updatePublicInquiryStatus } = vi.hoisted(() => ({
  createPublicInquiry: vi.fn(async (input: Record<string, unknown>) => ({ id: 42, ...input })),
  listPublicInquiries: vi.fn(async () => [{ id: 42, name: "Mira Sol", email: "mira@example.com", company: "Mira Studio", service: "Personal branding", message: "I need a sharper public presence.", source: "contact", status: "new", createdAt: Date.now() }]),
  updatePublicInquiryStatus: vi.fn(async (id: string | number, status: string) => ({ id, name: "Mira Sol", email: "mira@example.com", company: "Mira Studio", service: "Personal branding", message: "I need a sharper public presence.", source: "contact", status, createdAt: Date.now() })),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, createPublicInquiry, listPublicInquiries, updatePublicInquiryStatus };
});

import { appRouter } from "./routers";

describe("public inquiry workflow", () => {
  it("persists a valid public inquiry and exposes it to the authenticated inbox", async () => {
    const anonymous = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } satisfies TrpcContext;
    const created = await appRouter.createCaller(anonymous).agency.createInquiry({
      name: "Mira Sol",
      email: "mira@example.com",
      company: "Mira Studio",
      service: "Personal branding",
      message: "I need a sharper public presence.",
      source: "contact",
    });

    expect(created).toMatchObject({ id: 42, name: "Mira Sol", service: "Personal branding", status: "new" });
    expect(createPublicInquiry).toHaveBeenCalledOnce();

    const now = new Date();
    const authenticated = {
      user: { id: 1, openId: "inbox-test", name: "Inbox User", email: "inbox@example.com", loginMethod: "test", role: "admin", createdAt: now, updatedAt: now, lastSignedIn: now },
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } satisfies TrpcContext;
    const inbox = await appRouter.createCaller(authenticated).agency.inquiries();

    expect(inbox[0]).toMatchObject({ id: 42, email: "mira@example.com", status: "new" });
    expect(listPublicInquiries).toHaveBeenCalledOnce();

    const updated = await appRouter.createCaller(authenticated).agency.updateInquiryStatus({ id: 42, status: "contacted" });
    expect(updated).toMatchObject({ id: 42, status: "contacted" });
    expect(updatePublicInquiryStatus).toHaveBeenCalledWith(42, "contacted");
  });
});
