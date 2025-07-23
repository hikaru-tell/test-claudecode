import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 現在のユーザー情報を取得（viewer）
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // デバッグ用: 認証情報の構造を確認
    console.log("Identity object:", JSON.stringify(identity, null, 2));

    // Convex Authの認証情報を基に、カスタムプロフィール情報を取得
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return {
      _id: identity.subject,
      email: identity.email || identity.emailVerified || null,
      name: identity.name,
      profile: profile,
      // 追加情報（プロフィールがある場合）
      status: profile?.status || "active",
      role: profile?.role || "user",
      verificationStatus: profile?.verificationStatus || {
        identity: "not_submitted",
        muscle: "not_submitted",
      },
      subscription: profile?.subscription || {
        level: "free",
      },
    };
  },
});

// サインアップ時の初期プロフィール作成
export const createInitialProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    // 既にプロフィールが存在するかチェック
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (existingProfile) {
      return existingProfile._id;
    }

    // 初期プロフィール作成
    const now = Date.now();
    const profileId = await ctx.db.insert("profiles", {
      userId: identity.subject,
      status: "active",
      role: "user",
      verificationStatus: {
        identity: "not_submitted",
        muscle: "not_submitted", // 初期設定では性別不明なのでとりあえず設定
      },
      subscription: {
        level: "free",
      },
      dailyLikes: {
        count: 0,
        resetAt: now + 24 * 60 * 60 * 1000,
      },
      createdAt: now,
      lastActive: now,
    });

    return profileId;
  },
});

// プロフィール作成または更新
export const createOrUpdateProfile = mutation({
  args: {
    nickname: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    birthDate: v.optional(v.string()),
    age: v.optional(v.number()),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    const now = Date.now();

    if (existingProfile) {
      // プロフィール更新
      await ctx.db.patch(existingProfile._id, {
        ...args,
        lastActive: now,
      });
      return existingProfile._id;
    } else {
      // プロフィール新規作成
      const profileId = await ctx.db.insert("profiles", {
        userId: identity.subject,
        ...args,
        status: "active",
        role: "user",
        verificationStatus: {
          identity: "not_submitted",
          muscle: args.gender === "male" ? "not_submitted" : undefined,
        },
        subscription: {
          level: "free",
        },
        dailyLikes: {
          count: 0,
          resetAt: now + 24 * 60 * 60 * 1000,
        },
        createdAt: now,
        lastActive: now,
      });

      return profileId;
    }
  },
});