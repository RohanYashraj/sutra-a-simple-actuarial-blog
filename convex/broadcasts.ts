import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveBroadcast = mutation({
    args: {
        type: v.string(),
        title: v.string(),
        slug: v.string(),
        data: v.any(),
    },
    handler: async (ctx, args) => {
        const publishedAt = Date.now();
        const id = await ctx.db.insert("broadcasts", {
            type: args.type,
            title: args.title,
            slug: args.slug,
            data: args.data,
            publishedAt,
        });
        return id;
    },
});

export const getBroadcastsByType = query({
    args: { type: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("broadcasts")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .order("desc")
            .collect();
    },
});

export const getBroadcastBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("broadcasts")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

export const getAllBroadcasts = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("broadcasts")
            .order("desc")
            .collect();
    },
});
