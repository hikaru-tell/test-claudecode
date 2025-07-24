"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Check, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  label: string;
  description?: string;
  preview?: string | null;
  error?: string;
  isRequired?: boolean;
}

export function ImageUpload({
  onImageSelect,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  label,
  description,
  preview,
  error,
  isRequired = false
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // ファイルタイプチェック
    if (!acceptedTypes.includes(file.type)) {
      return `対応していないファイル形式です。${acceptedTypes.map(type => type.split('/')[1]).join(', ')} のみ対応しています。`;
    }

    // ファイルサイズチェック
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `ファイルサイズが大きすぎます。${maxSize}MB以下にしてください。`;
    }

    // 基本的な画像ファイル検証
    if (!file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return "有効な画像ファイルを選択してください。";
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    
    const validation = validateFile(file);
    if (validation) {
      setUploadError(validation);
      return;
    }

    onImageSelect(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    setUploadError(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentError = uploadError || error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      <Card className={`p-6 border-2 border-dashed transition-colors ${
        isDragOver 
          ? "border-blue-500 bg-blue-50" 
          : currentError
            ? "border-red-300 bg-red-50"
            : preview
              ? "border-green-300 bg-green-50"
              : "border-gray-300"
      }`}>
        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="アップロード画像プレビュー"
                className="max-w-full max-h-64 mx-auto rounded-lg object-contain"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white shadow-md"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm">画像が選択されました</span>
            </div>
          </div>
        ) : (
          <div
            className="text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className={`h-12 w-12 mx-auto mb-4 ${
              isDragOver ? "text-blue-500" : "text-gray-400"
            }`} />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragOver ? "ここにドロップ" : "画像をアップロード"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ドラッグ&ドロップまたはクリックして選択
            </p>
            <p className="text-xs text-gray-400">
              {acceptedTypes.map(type => type.split('/')[1]).join(', ')} • 最大{maxSize}MB
            </p>
          </div>
        )}
      </Card>

      {currentError && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{currentError}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}