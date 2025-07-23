import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Auth の内部テーブル
  ...authTables,
  // プロフィールテーブル（Convex Authのユーザーと紐づけ）
  profiles: defineTable({
    userId: v.string(), // Convex AuthのuserIdはstringType
    // 基本情報
    nickname: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    birthDate: v.optional(v.string()), // YYYY-MM-DD
    age: v.optional(v.number()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
    // ユーザーステータス情報
    status: v.union(v.literal("active"), v.literal("suspended"), v.literal("banned")),
    role: v.union(v.literal("user"), v.literal("admin")),
    verificationStatus: v.object({
      identity: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
        v.literal("not_submitted")
      ),
      muscle: v.optional(
        v.union(
          v.literal("pending"),
          v.literal("approved"),
          v.literal("rejected"),
          v.literal("not_submitted")
        )
      ),
    }),
    subscription: v.object({
      level: v.union(v.literal("free"), v.literal("premium")),
      expiresAt: v.optional(v.number()),
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
    }),
    dailyLikes: v.object({
      count: v.number(),
      resetAt: v.number(),
    }),
    createdAt: v.number(),
    lastActive: v.number(),
    // 写真（オプション）
    photos: v.optional(v.array(
      v.object({
        storageId: v.string(),
        url: v.string(),
        isPrimary: v.boolean(),
      })
    )),
  })
    .index("by_userId", ["userId"])
    .index("by_gender", ["gender"])
    .index("by_status", ["status"]),
});