"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Camera, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface VerificationUploadProps {
  onVerificationSubmit?: () => void;
}

export function VerificationUpload({ onVerificationSubmit }: VerificationUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveUploadedFile = useMutation(api.files.saveUploadedFile);
  
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [muscleFile, setMuscleFile] = useState<File | null>(null);
  const [identityPreview, setIdentityPreview] = useState<string | null>(null);
  const [musclePreview, setMusclePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{
    identity?: string;
    muscle?: string;
  }>({});

  const isMale = user?.profile?.gender === "male";
  const isIdentityApproved = user?.verificationStatus?.identity === "approved";
  const isMuscleApproved = user?.verificationStatus?.muscle === "approved";

  const handleImageSelect = (type: "identity" | "muscle") => (file: File | null) => {
    if (type === "identity") {
      setIdentityFile(file);
      setIdentityPreview(file ? URL.createObjectURL(file) : null);
      if (errors.identity) {
        setErrors(prev => ({ ...prev, identity: undefined }));
      }
    } else {
      setMuscleFile(file);
      setMusclePreview(file ? URL.createObjectURL(file) : null);
      if (errors.muscle) {
        setErrors(prev => ({ ...prev, muscle: undefined }));
      }
    }
  };

  const uploadFile = async (file: File, type: "identity" | "muscle") => {
    try {
      // アップロードURL取得
      const uploadUrl = await generateUploadUrl();
      
      // ファイルアップロード
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("ファイルアップロードに失敗しました");
      }

      const { storageId } = await result.json();
      
      // ファイル情報保存
      await saveUploadedFile({
        storageId,
        filename: file.name,
        type,
        metadata: {
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
        },
      });

      return storageId;
    } catch (error) {
      console.error(`${type} upload error:`, error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    
    // バリデーション
    const newErrors: { identity?: string; muscle?: string } = {};
    
    if (!identityFile && !isIdentityApproved) {
      newErrors.identity = "本人確認書類のアップロードが必要です";
    }
    
    if (isMale && !muscleFile && !isMuscleApproved) {
      newErrors.muscle = "筋肉確認写真のアップロードが必要です";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises: Promise<any>[] = [];
      
      // 本人確認書類のアップロード
      if (identityFile && !isIdentityApproved) {
        uploadPromises.push(uploadFile(identityFile, "identity"));
      }
      
      // 筋肉確認写真のアップロード（男性のみ）
      if (isMale && muscleFile && !isMuscleApproved) {
        uploadPromises.push(uploadFile(muscleFile, "muscle"));
      }

      await Promise.all(uploadPromises);

      toast({
        title: "アップロード完了",
        description: "審査用ファイルのアップロードが完了しました。審査結果をお待ちください。",
      });

      onVerificationSubmit?.();

    } catch (error) {
      console.error("Verification upload error:", error);
      toast({
        title: "エラー",
        description: "アップロードに失敗しました。再度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 本人確認セクション */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <CardTitle>本人確認</CardTitle>
            {isIdentityApproved && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <CardDescription>
            身分証明書（運転免許証、マイナンバーカード、パスポート等）をアップロードしてください
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isIdentityApproved ? (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <span>本人確認が完了しています</span>
            </div>
          ) : (
            <ImageUpload
              onImageSelect={handleImageSelect("identity")}
              label="身分証明書"
              description="顔写真付きの公的身分証明書をアップロードしてください"
              preview={identityPreview}
              error={errors.identity}
              isRequired
              maxSize={10}
            />
          )}
        </CardContent>
      </Card>

      {/* 筋肉確認セクション（男性のみ） */}
      {isMale && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-orange-500" />
              <CardTitle>筋肉確認</CardTitle>
              {isMuscleApproved && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <CardDescription>
              筋肉がわかる写真をアップロードしてください（上半身推奨）
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMuscleApproved ? (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span>筋肉確認が完了しています</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 mb-1">筋肉確認について</p>
                      <ul className="text-orange-700 space-y-1">
                        <li>• 筋肉の発達が確認できる写真をご提出ください</li>
                        <li>• 上半身（胸筋、腹筋、肩等）がわかる角度での撮影を推奨</li>
                        <li>• 管理者による主観的な審査となります</li>
                        <li>• 不適切な写真や関係のない画像は審査対象外です</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <ImageUpload
                  onImageSelect={handleImageSelect("muscle")}
                  label="筋肉確認写真"
                  description="筋肉の発達が確認できる写真をアップロードしてください"
                  preview={musclePreview}
                  error={errors.muscle}
                  isRequired
                  maxSize={10}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 送信ボタン */}
      {(!isIdentityApproved || (isMale && !isMuscleApproved)) && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isUploading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isUploading ? "アップロード中..." : "審査を申請"}
          </Button>
        </div>
      )}

      {/* 完了メッセージ */}
      {isIdentityApproved && (!isMale || isMuscleApproved) && (
        <div className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            すべての確認が完了しています
          </h3>
          <p className="text-gray-600">
            マッチング機能をご利用いただけます
          </p>
        </div>
      )}
    </div>
  );
}