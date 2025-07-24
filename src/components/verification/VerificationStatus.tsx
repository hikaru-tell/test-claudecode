"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle, Shield, Camera } from "lucide-react";

export function VerificationStatus() {
  const status = useQuery(api.users.getVerificationStatus);

  if (!status) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusIcon = (verificationStatus: string) => {
    switch (verificationStatus) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (verificationStatus: string) => {
    switch (verificationStatus) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">承認済み</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">審査中</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">否認</Badge>;
      default:
        return <Badge variant="outline">未申請</Badge>;
    }
  };

  const getStatusMessage = (verificationStatus: string) => {
    switch (verificationStatus) {
      case "approved":
        return "確認が完了しました";
      case "pending":
        return "審査中です。しばらくお待ちください";
      case "rejected":
        return "審査で否認されました。再申請してください";
      default:
        return "確認書類をアップロードしてください";
    }
  };

  const getPermissionLevelInfo = (level: number) => {
    switch (level) {
      case 1:
        return { 
          label: "レベル1 - 基本アクセス", 
          description: "ログインのみ可能",
          color: "bg-gray-100 text-gray-800" 
        };
      case 2:
        return { 
          label: "レベル2 - 本人確認済み", 
          description: "基本機能が利用可能",
          color: "bg-blue-100 text-blue-800" 
        };
      case 3:
        return { 
          label: "レベル3 - 完全認証", 
          description: "マッチング機能が利用可能",
          color: "bg-green-100 text-green-800" 
        };
      case 4:
        return { 
          label: "レベル4 - プレミアム", 
          description: "すべての機能が利用可能",
          color: "bg-purple-100 text-purple-800" 
        };
      default:
        return { 
          label: "未認証", 
          description: "認証が必要です",
          color: "bg-gray-100 text-gray-800" 
        };
    }
  };

  const permissionInfo = getPermissionLevelInfo(status.permissionLevel);

  return (
    <div className="space-y-6">
      {/* 権限レベル表示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>アカウント権限レベル</span>
            <Badge className={permissionInfo.color}>
              {permissionInfo.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{permissionInfo.description}</p>
        </CardContent>
      </Card>

      {/* 本人確認ステータス */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span>本人確認</span>
            {getStatusIcon(status.identity)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getStatusBadge(status.identity)}
          <p className="text-sm text-gray-600">
            {getStatusMessage(status.identity)}
          </p>
          {status.identity === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                身分証明書が不鮮明または有効でない可能性があります。
                鮮明で有効な身分証明書を再度アップロードしてください。
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 筋肉確認ステータス（男性のみ） */}
      {status.gender === "male" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-orange-500" />
              <span>筋肉確認</span>
              {status.muscle && getStatusIcon(status.muscle)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {status.muscle ? (
              <>
                {getStatusBadge(status.muscle)}
                <p className="text-sm text-gray-600">
                  {getStatusMessage(status.muscle)}
                </p>
                {status.muscle === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-2">
                      筋肉の発達が十分確認できませんでした。
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• より鮮明な筋肉がわかる写真をアップロードしてください</li>
                      <li>• 上半身（胸筋、腹筋、肩等）がよく見える角度で撮影してください</li>
                      <li>• 適切なポーズで筋肉を強調した写真を使用してください</li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <Badge variant="outline">未申請</Badge>
                <p className="text-sm text-gray-600">
                  筋肉確認写真をアップロードしてください
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* 次のステップガイダンス */}
      {status.permissionLevel < 3 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">次のステップ</CardTitle>
          </CardHeader>
          <CardContent>
            {status.identity === "not_submitted" && (
              <p className="text-blue-700">
                1. 本人確認書類をアップロードしてください
              </p>
            )}
            {status.gender === "male" && status.identity === "approved" && (!status.muscle || status.muscle === "not_submitted") && (
              <p className="text-blue-700">
                2. 筋肉確認写真をアップロードしてください
              </p>
            )}
            {status.identity === "pending" || (status.muscle && status.muscle === "pending") && (
              <p className="text-blue-700">
                審査結果をお待ちください。通常1-3営業日で完了します。
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* 完了メッセージ */}
      {status.permissionLevel >= 3 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                認証完了！
              </h3>
              <p className="text-green-700">
                すべての認証が完了しました。マッチング機能をお楽しみください。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}