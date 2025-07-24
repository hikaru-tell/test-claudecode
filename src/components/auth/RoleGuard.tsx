"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: "user" | "admin";
  requiredVerificationLevel?: number; // 1-4の権限レベル
  fallback?: ReactNode;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requiredVerificationLevel,
  fallback 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600">ログインが必要です</p>
      </div>
    );
  }

  // 役割チェック
  if (user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-red-600">このページにアクセスする権限がありません</p>
      </div>
    );
  }

  // 権限レベルチェック（指定された場合）
  if (requiredVerificationLevel) {
    const userLevel = getUserPermissionLevel(user);
    
    if (userLevel < requiredVerificationLevel) {
      return fallback || (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="text-center">
            <p className="text-orange-600 mb-2">
              権限レベル {requiredVerificationLevel} が必要です（現在: レベル {userLevel}）
            </p>
            <p className="text-sm text-gray-600">
              {getVerificationMessage(userLevel, requiredVerificationLevel)}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

// ユーザーの権限レベルを計算（1-4）
function getUserPermissionLevel(user: any): number {
  if (!user) return 0;

  // レベル1: ログインのみ
  let level = 1;

  // レベル2: 本人確認完了
  if (user.verificationStatus?.identity === "approved") {
    level = 2;
  }

  // レベル3: 本人確認 + 筋肉確認（男性のみ）
  if (level >= 2) {
    // 女性の場合は筋肉確認不要でレベル3
    if (user.profile?.gender === "female" || user.profile?.gender === "other") {
      level = 3;
    }
    // 男性の場合は筋肉確認も必要
    else if (user.profile?.gender === "male" && user.verificationStatus?.muscle === "approved") {
      level = 3;
    }
  }

  // レベル4: レベル3 + プレミアム会員
  if (level >= 3 && user.subscription?.level === "premium") {
    level = 4;
  }

  return level;
}

// 権限レベル不足時のメッセージ
function getVerificationMessage(currentLevel: number, requiredLevel: number): string {
  if (currentLevel < 2 && requiredLevel >= 2) {
    return "本人確認が必要です。プロフィール設定から身分証明書をアップロードしてください。";
  }
  
  if (currentLevel < 3 && requiredLevel >= 3) {
    return "本人確認と筋肉確認（男性のみ）が必要です。審査完了までお待ちください。";
  }
  
  if (currentLevel < 4 && requiredLevel >= 4) {
    return "プレミアム会員への登録が必要です。";
  }
  
  return "必要な権限レベルを満たしていません。";
}