"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { VerificationStatus } from "@/components/verification/VerificationStatus";
import { VerificationUpload } from "@/components/verification/VerificationUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload } from "lucide-react";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("status");

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              本人確認・筋肉確認
            </h1>
            <p className="text-gray-600">
              マッチング機能を利用するために必要な認証手続きです
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="status" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>認証状況確認</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>書類アップロード</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>認証状況</CardTitle>
                  <CardDescription>
                    現在の認証レベルと各種確認の進捗状況をご確認ください
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VerificationStatus />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>書類アップロード</CardTitle>
                  <CardDescription>
                    本人確認書類と筋肉確認写真をアップロードしてください
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VerificationUpload 
                    onVerificationSubmit={() => {
                      // アップロード完了後は状況確認タブに切り替え
                      setActiveTab("status");
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 注意事項 */}
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">重要な注意事項</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-orange-700 space-y-2">
                <p><strong>本人確認について：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>顔写真付きの公的身分証明書をご用意ください</li>
                  <li>文字が鮮明に読める写真をアップロードしてください</li>
                  <li>偽造・加工された書類は厳格に対処いたします</li>
                </ul>
                
                <p className="pt-2"><strong>筋肉確認について（男性のみ）：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>筋肉の発達が確認できる写真をご提出ください</li>
                  <li>管理者による主観的な審査となります</li>
                  <li>不適切な写真や関係のない画像は審査対象外です</li>
                  <li>審査基準に関するお問い合わせにはお答えできません</li>
                </ul>

                <p className="pt-2"><strong>プライバシーについて：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>アップロードされた画像は審査のみに使用されます</li>
                  <li>審査完了後、身分証明書画像は安全に削除されます</li>
                  <li>個人情報は厳重に管理・保護されます</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}