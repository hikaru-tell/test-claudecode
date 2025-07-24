"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Shield, 
  Camera, 
  Settings, 
  LogOut, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Heart,
  MessageCircle,
  Search
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">ユーザー情報を読み込んでいます...</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">承認済み</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">審査中</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">否認</Badge>;
      default:
        return <Badge variant="outline">未申請</Badge>;
    }
  };

  const hasProfile = user.profile?.nickname;
  const isIdentityVerified = user.verificationStatus?.identity === "approved";
  const isMuscleVerified = user.profile?.gender !== "male" || user.verificationStatus?.muscle === "approved";
  const canUseMatching = isIdentityVerified && isMuscleVerified;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">マッチョマッチング</h1>
              <p className="text-gray-600">
                ようこそ、{user.profile?.nickname || user.email}さん
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* プロフィール状況 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>プロフィール</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasProfile ? (
                <div className="space-y-2">
                  <p className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    設定済み
                  </p>
                  <p className="text-sm text-gray-600">
                    ニックネーム: {user.profile.nickname}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => router.push("/profile-registration")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    編集
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-orange-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    未設定
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => router.push("/profile-registration")}
                  >
                    プロフィール作成
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 本人確認状況 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>本人確認</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {getStatusIcon(user.verificationStatus?.identity || "not_submitted")}
                  {getStatusBadge(user.verificationStatus?.identity || "not_submitted")}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/verification")}
                >
                  確認・申請
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 筋肉確認状況（男性のみ） */}
          {user.profile?.gender === "male" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>筋肉確認</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {getStatusIcon(user.verificationStatus?.muscle || "not_submitted")}
                    {getStatusBadge(user.verificationStatus?.muscle || "not_submitted")}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push("/verification")}
                  >
                    確認・申請
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* マッチング機能 */}
          <Card className={canUseMatching ? "" : "opacity-60"}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>マッチング</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canUseMatching ? (
                <div className="space-y-2">
                  <p className="text-green-600 text-sm">利用可能</p>
                  <Button className="w-full" disabled>
                    スワイプ開始
                    <span className="text-xs ml-2">(開発中)</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-orange-600 text-sm">認証完了が必要</p>
                  <Button variant="outline" className="w-full" disabled>
                    利用不可
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* メッセージ機能 */}
          <Card className={canUseMatching ? "" : "opacity-60"}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>メッセージ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">マッチした相手とのチャット</p>
                <Button variant="outline" className="w-full" disabled>
                  メッセージ一覧
                  <span className="text-xs ml-2">(開発中)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 検索機能 */}
          <Card className={canUseMatching ? "" : "opacity-60"}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>検索</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">条件を指定してユーザー検索</p>
                <Button variant="outline" className="w-full" disabled>
                  検索画面
                  <span className="text-xs ml-2">(開発中)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 開発状況のお知らせ */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">開発状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-700 text-sm space-y-2">
              <p><strong>✅ 実装完了:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ユーザー登録・ログイン機能</li>
                <li>プロフィール登録システム</li>
                <li>本人確認・筋肉確認システム</li>
                <li>権限レベル管理</li>
              </ul>
              
              <p className="pt-2"><strong>🔄 開発中:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>スワイプ式マッチング機能</li>
                <li>リアルタイムメッセージング</li>
                <li>検索・フィルター機能</li>
                <li>管理者審査画面</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}