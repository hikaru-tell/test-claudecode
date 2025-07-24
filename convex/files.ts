import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ファイルアップロード用のURL生成
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// アップロード完了後のファイル情報保存
export const saveUploadedFile = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    type: v.union(v.literal("identity"), v.literal("muscle"), v.literal("profile")),
    metadata: v.optional(v.object({
      originalName: v.string(),
      size: v.number(),
      mimeType: v.string(),
    })),
  },
  handler: async (ctx, { storageId, filename, type, metadata }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    // ユーザーのプロフィール取得
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      throw new Error("プロフィールが見つかりません");
    }

    // ファイル情報をプロフィールに追加または更新
    let updatedPhotos = profile.photos || [];
    
    if (type === "profile") {
      // プロフィール写真の場合
      const url = await ctx.storage.getUrl(storageId);
      if (!url) {
        throw new Error("ファイルURLの取得に失敗しました");
      }

      updatedPhotos.push({
        storageId: storageId,
        url: url,
        isPrimary: updatedPhotos.length === 0, // 最初の写真をプライマリに設定
      });

      await ctx.db.patch(profile._id, {
        photos: updatedPhotos,
      });
    } else {
      // 本人確認・筋肉確認の場合は一時的に保存
      // 実際のアプリではより安全な方法で管理する
      const url = await ctx.storage.getUrl(storageId);
      if (!url) {
        throw new Error("ファイルURLの取得に失敗しました");
      }

      // 審査用ファイルとして保存（プロフィールには直接保存せず）
      // TODO: 専用テーブルでの管理推奨
    }

    return { success: true, storageId, url: await ctx.storage.getUrl(storageId) };
  },
});

// ファイル削除
export const deleteFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    // ユーザーのプロフィール取得
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) {
      throw new Error("プロフィールが見つかりません");
    }

    // プロフィール写真から削除
    const updatedPhotos = (profile.photos || []).filter(
      photo => photo.storageId !== storageId
    );

    await ctx.db.patch(profile._id, {
      photos: updatedPhotos,
    });

    // ストレージからファイル削除
    await ctx.storage.delete(storageId);

    return { success: true };
  },
});

// ファイルURL取得
export const getFileUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});