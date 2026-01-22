import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    broadcasts: defineTable({
        type: v.string(), // 'trivia', 'digest', 'market-pulse', 'code-sutra', 'genai-frontiers', 'actuarial-simplified'
        title: v.string(),
        slug: v.string(),
        data: v.any(), // The JSON object containing the specific fields for each type
        publishedAt: v.number(), // Timestamp
    })
        .index("by_type", ["type"])
        .index("by_slug", ["slug"])
        .index("by_publishedAt", ["publishedAt"]),
});
