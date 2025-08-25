import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const writeResult = mutation({
  args: {
    status: v.string(),
    timestamp: v.number(),
    message: v.optional(v.string()),
  },
  handler: async ({ db }, args) => {
    await db.insert("health_checks", args);
  },
});

export const recent = query(async ({ db }) => {
  return await db.query("health_checks").order("desc").take(100); // latest 100 checks
});

export const uptimeStats = query(
  async ({ db }, { since }: { since: number }) => {
    const checks = await db
      .query("health_checks")
      .order("desc")
      .filter((q) => q.gte(q.field("timestamp"), since))
      .collect();

    if (checks.length === 0) return { uptime: 100, total: 0, good: 0, bad: 0 };

    const good = checks.filter((c) => c.status === "good").length;
    const bad = checks.length - good;

    const uptime = (good / checks.length) * 100;

    return {
      uptime: Number(uptime.toFixed(2)),
      total: checks.length,
      good,
      bad,
    };
  }
);
