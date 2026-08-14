import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createCalendarEvent, createCampaign, createClient, createInfluencer, createInvoice, createMediaContact, createPublicInquiry, createReport, getWorkspaceSettings, listCalendarEvents, listCampaigns, listClients, listContentItems, listFiles, listInfluencers, listInvoices, listMediaContacts, listMessages, listPublicInquiries, listReports, listTasks, updateContentStatus, updateTaskStatus } from "./db";

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
    summary: protectedProcedure.query(async () => {
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
    clients: protectedProcedure.query(() => listClients()),
    campaigns: protectedProcedure.query(() => listCampaigns()),
    content: protectedProcedure.query(() => listContentItems()),
    tasks: protectedProcedure.query(() => listTasks()),
    media: protectedProcedure.query(() => listMediaContacts()),
    influencers: protectedProcedure.query(() => listInfluencers()),
    reports: protectedProcedure.query(() => listReports()),
    invoices: protectedProcedure.query(() => listInvoices()),
    calendar: protectedProcedure.query(() => listCalendarEvents()),
    files: protectedProcedure.query(() => listFiles()),
    messages: protectedProcedure.query(() => listMessages()),
    settings: protectedProcedure.query(() => getWorkspaceSettings()),
    inquiries: protectedProcedure.query(() => listPublicInquiries()),
    createClient: protectedProcedure.input(z.object({
      name: z.string().min(2),
      category: z.string().min(2),
      leadInitials: z.string().min(1).max(8),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      notes: z.string().optional(),
    })).mutation(({ input }) => createClient({ ...input, health: 50, status: "on_track", createdAt: Date.now(), updatedAt: Date.now() })),
    createCampaign: protectedProcedure.input(z.object({ clientId: z.number().int().positive(), name: z.string().min(2), type: z.string().min(2) })).mutation(({ input }) => createCampaign({ ...input, status: "draft", progress: 0, createdAt: Date.now() })),
    createMediaContact: protectedProcedure.input(z.object({ name: z.string().min(2), outlet: z.string().min(2), beat: z.string().optional() })).mutation(({ input }) => createMediaContact({ ...input, status: "not_contacted" })),
    createInfluencer: protectedProcedure.input(z.object({ name: z.string().min(2), handle: z.string().min(2), platform: z.string().min(2), audience: z.number().int().nonnegative() })).mutation(({ input }) => createInfluencer({ ...input, status: "prospect" })),
    createReport: protectedProcedure.input(z.object({ clientId: z.number().int().positive(), title: z.string().min(2), period: z.string().min(2) })).mutation(({ input }) => createReport({ ...input, status: "draft", createdAt: Date.now() })),
    createInvoice: protectedProcedure.input(z.object({ clientId: z.number().int().positive(), number: z.string().min(2), amount: z.number().int().positive() })).mutation(({ input }) => createInvoice({ ...input, currency: "INR", status: "open", createdAt: Date.now() })),
    createCalendarEvent: protectedProcedure.input(z.object({ title: z.string().min(2), eventType: z.string().min(2), startsAt: z.number().int().positive() })).mutation(({ input }) => createCalendarEvent({ ...input, status: "planned" })),
    createInquiry: publicProcedure.input(z.object({ name: z.string().min(2).max(160), email: z.string().email(), company: z.string().max(160).optional(), service: z.string().min(2).max(120), message: z.string().min(10).max(5000), source: z.string().max(60).default("contact") })).mutation(({ input }) => createPublicInquiry({ ...input, createdAt: Date.now(), status: "new" })),
    approveContent: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => updateContentStatus(input.id, "approved")),
    completeTask: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => updateTaskStatus(input.id, "done")),
  }),
});

export type AppRouter = typeof appRouter;
