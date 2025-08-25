import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  health_checks: defineTable({
    status: v.string(), // "good" | "bad"
    timestamp: v.number(), // Date.now()
    responseTime: v.optional(v.number()), // ms latency
    message: v.optional(v.string()), // error info if any
  }),
});
