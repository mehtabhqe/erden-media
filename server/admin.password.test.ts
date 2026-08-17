import { describe, expect, it } from "vitest";
import { verifyAdminCredentials } from "./adminAuth";

describe("private desk password credentials", () => {
  it("accepts the configured admin credentials", () => {
    expect(verifyAdminCredentials(process.env.AGENCYOS_ADMIN_USERNAME ?? "", process.env.AGENCYOS_ADMIN_PASSWORD ?? "")).toBe(true);
  });

  it("rejects an incorrect password", () => {
    expect(verifyAdminCredentials(process.env.AGENCYOS_ADMIN_USERNAME ?? "", "incorrect-password")).toBe(false);
  });
});
