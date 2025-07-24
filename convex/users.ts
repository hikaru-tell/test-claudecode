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


    // Convex Authの認証情報を基に、カスタムプロフィール情報を取得
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    // Convex Authのユーザー情報を取得（メールアドレス含む）
    const authUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), identity.subject))
      .first();

    return {
      _id: identity.subject,
      email: authUser?.email || null,
      name: authUser?.name || null,
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

// 審査申請の提出
export const submitVerification = mutation({
  args: {
    type: v.union(v.literal("identity"), v.literal("muscle")),
    fileStorageId: v.id("_storage"),
  },
  handler: async (ctx, { type, fileStorageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      throw new Error("プロフィールが見つかりません");
    }

    // 現在のステータスを取得
    const currentStatus = profile.verificationStatus;
    
    // 審査状態を"pending"に更新
    const newStatus = { ...currentStatus, [type]: "pending" };

    await ctx.db.patch(profile._id, {
      verificationStatus: newStatus,
    });

    return { success: true, status: newStatus };
  },
});

// ユーザーの審査状態確認
export const getVerificationStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      return null;
    }

    return {
      identity: profile.verificationStatus.identity,
      muscle: profile.verificationStatus.muscle,
      gender: profile.gender,
      permissionLevel: calculatePermissionLevel(profile),
    };
  },
});

// 権限レベル計算関数
function calculatePermissionLevel(profile: any): number {
  let level = 1; // ログインのみ

  // レベル2: 本人確認完了
  if (profile.verificationStatus.identity === "approved") {
    level = 2;
  }

  // レベル3: 本人確認 + 筋肉確認（男性のみ）
  if (level >= 2) {
    if (profile.gender === "female" || profile.gender === "other") {
      // 女性・その他は筋肉確認不要
      level = 3;
    } else if (profile.gender === "male" && profile.verificationStatus.muscle === "approved") {
      // 男性は筋肉確認も必要
      level = 3;
    }
  }

  // レベル4: レベル3 + プレミアム会員
  if (level >= 3 && profile.subscription?.level === "premium") {
    level = 4;
  }

  return level;
}

// 管理者機能：審査状態の更新
export const updateVerificationStatus = mutation({
  args: {
    profileId: v.id("profiles"),
    type: v.union(v.literal("identity"), v.literal("muscle")),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("not_submitted")
    ),
  },
  handler: async (ctx, { profileId, type, status }) => {
    // 1. 管理者権限チェック
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証されていません");
    }
    
    const adminProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("管理者権限がありません");
    }

    // 2. 審査対象プロフィール取得
    const targetProfile = await ctx.db.get(profileId);
    if (!targetProfile) {
      throw new Error("対象のプロフィールが見つかりません");
    }

    // 3. 審査状態更新
    const currentStatus = targetProfile.verificationStatus;
    const newStatus = { ...currentStatus, [type]: status };

    await ctx.db.patch(profileId, {
      verificationStatus: newStatus,
    });

    // 4. 監査ログ用データ（将来実装）
    // TODO: 管理者アクションログの記録
    // TODO: ユーザー通知システム（メール/プッシュ通知）
    
    return { success: true, updatedStatus: newStatus };
  },
});

// 管理者機能：審査待ちユーザー一覧取得
export const getPendingVerifications = query({
  args: {},
  handler: async (ctx) => {
    // 管理者権限チェック
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const adminProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("管理者権限がありません");
    }

    // 審査待ちユーザーを取得
    const profiles = await ctx.db.query("profiles").collect();
    
    return profiles.filter(profile => 
      profile.verificationStatus.identity === "pending" ||
      (profile.verificationStatus.muscle && profile.verificationStatus.muscle === "pending")
    );
  },
});

// 管理者機能：ユーザー権限レベル更新
export const updateUserRole = mutation({
  args: {
    profileId: v.id("profiles"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, { profileId, role }) => {
    // 管理者権限チェック
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証されていません");
    }
    
    const adminProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!adminProfile || adminProfile.role !== "admin") {
      throw new Error("管理者権限がありません");
    }

    // 対象プロフィール取得・更新
    const targetProfile = await ctx.db.get(profileId);
    if (!targetProfile) {
      throw new Error("対象のプロフィールが見つかりません");
    }

    await ctx.db.patch(profileId, { role });
    
    return { success: true, updatedRole: role };
  },
});