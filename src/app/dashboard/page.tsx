"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  // デバッグ情報
  console.log("Dashboard - isAuthenticated:", isAuthenticated);
  console.log("Dashboard - user:", user);
  console.log("Dashboard - isLoading:", isLoading);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Redirecting to signin - not authenticated");
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // ユーザー情報が取得できない場合の簡易表示
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                ダッシュボード
              </h1>
              <p>ユーザー情報を読み込んでいます...</p>
              <div className="mt-6">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ダッシュボード
            </h1>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">メールアドレス</p>
                <p className="text-lg font-medium">{user.email || "取得中..."}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">ユーザーID</p>
                <p className="text-lg font-medium">{user._id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">アカウントステータス</p>
                <p className="text-lg font-medium">{user.status || "未設定"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">会員レベル</p>
                <p className="text-lg font-medium">{user.subscription?.level || "未設定"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">本人確認</p>
                <p className="text-lg font-medium">{user.verificationStatus?.identity || "未設定"}</p>
              </div>
              
              {user.verificationStatus?.muscle && (
                <div>
                  <p className="text-sm text-gray-500">筋肉確認</p>
                  <p className="text-lg font-medium">{user.verificationStatus.muscle}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}