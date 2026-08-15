import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";

const { createMongoInquiry } = vi.hoisted(() => ({
  createMongoInquiry: vi.fn(async (input: Record<string, unknown>) => ({ id: "test-inquiry", ...input, status: "new", createdAt: Date.now() })),
}));

vi.mock("./mongo", () => ({
  createMongoInquiry,
  listMongoInquiries: vi.fn(async () => []),
}));

import { createApp } from "./_core/app";

const servers: ReturnType<ReturnType<typeof createApp>["listen"]>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      server =>
        new Promise<void>((resolve, reject) => {
          server.close(error => (error ? reject(error) : resolve()));
        }),
    ),
  );
  createMongoInquiry.mockClear();
});

async function startApp() {
  const server = createApp().listen(0);
  servers.push(server);
  await new Promise<void>(resolve => server.once("listening", () => resolve()));
  return server.address() as AddressInfo;
}

describe("Vercel API app", () => {
  it("serves the public health procedure as JSON", async () => {
    const { port } = await startApp();
    const response = await fetch(
      `http://127.0.0.1:${port}/api/trpc/system.health?input=${encodeURIComponent(JSON.stringify({ json: { timestamp: Date.now() } }))}`,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ result: { data: { json: { ok: true } } } });
  });

  it("returns JSON from the public inquiry mutation", async () => {
    const { port } = await startApp();
    const response = await fetch("http://127.0.0.1:" + port + "/api/trpc/agency.createInquiry?batch=1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        0: {
          json: {
            name: "Test Contact",
            email: "test@example.com",
            company: "Test Company",
            service: "Public relations",
            message: "This is a valid inquiry message for the API regression test.",
            source: "test",
          },
        },
      }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject([{ result: { data: { json: { id: "test-inquiry" } } } }]);
    expect(createMongoInquiry).toHaveBeenCalledOnce();
  });
});
