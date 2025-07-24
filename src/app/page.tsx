"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          💪 マッチョマッチング
        </h1>
        <p className="mt-2 text-center text-lg text-gray-600">
          筋トレ愛好者のための
          <br />
          マッチングプラットフォーム
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Link
              href="/signup"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              新規登録
            </Link>
            
            <Link
              href="/signin"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログイン
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">特徴</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>男性は審査制（筋肉確認必須）</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>Tinder風スワイプ機能</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>リアルタイムメッセージング</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>トレーニング情報の共有</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}