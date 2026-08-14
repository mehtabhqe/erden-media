import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createClient, listCampaigns, listClients, listContentItems, listInfluencers, listInvoices, listMediaContacts, listReports, listTasks, updateContentStatus, updateTaskStatus } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  agency: router({
    summary: publicProcedure.query(async () => {
      const [clientRows, campaignRows, contentRows, taskRows, invoiceRows] = await Promise.all([
        listClients(), listCampaigns(), listContentItems(), listTasks(), listInvoices(),
      ]);
      return {
        clients: clientRows.length,
        campaigns: campaignRows.filter((row) => row.status === "live").length,
        awaitingApproval: contentRows.filter((row) => row.status === "awaiting_approval").length,
        openTasks: taskRows.filter((row) => row.status !== "done").length,
        outstandingInvoices: invoiceRows.filter((row) => row.status === "open" || row.status === "overdue").length,
        revenue: invoiceRows.filter((row) => row.status === "paid").reduce((total, row) => total + row.amount, 0),
        isEmpty: clientRows.length === 0 && campaignRows.length === 0 && contentRows.length === 0 && taskRows.length === 0 && invoiceRows.length === 0,
      };
    }),
    clients: publicProcedure.query(() => listClients()),
    campaigns: publicProcedure.query(() => listCampaigns()),
    content: publicProcedure.query(() => listContentItems()),
    tasks: publicProcedure.query(() => listTasks()),
    media: publicProcedure.query(() => listMediaContacts()),
    influencers: publicProcedure.query(() => listInfluencers()),
    reports: publicProcedure.query(() => listReports()),
    invoices: publicProcedure.query(() => listInvoices()),
    createClient: protectedProcedure.input(z.object({
      name: z.string().min(2),
      category: z.string().min(2),
      leadInitials: z.string().min(1).max(8),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      notes: z.string().optional(),
    })).mutation(({ input }) => createClient({ ...input, health: 50, status: "on_track", createdAt: Date.now(), updatedAt: Date.now() })),
    approveContent: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => updateContentStatus(input.id, "approved")),
    completeTask: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => updateTaskStatus(input.id, "done")),
  }),
});

export type AppRouter = typeof appRouter;
