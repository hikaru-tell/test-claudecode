import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUpload } from "../ImageUpload";

// File APIのモック
global.URL.createObjectURL = jest.fn(() => "mock-url");

describe("ImageUpload", () => {
  const mockOnImageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正しくレンダリングされる", () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
      />
    );
    
    expect(screen.getByText("テスト画像")).toBeInTheDocument();
    expect(screen.getByText("画像をアップロード")).toBeInTheDocument();
  });

  it("必須マーカーが表示される", () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
        isRequired
      />
    );
    
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("説明文が表示される", () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
        description="テスト用の説明文"
      />
    );
    
    expect(screen.getByText("テスト用の説明文")).toBeInTheDocument();
  });

  it("エラーメッセージが表示される", () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
        error="エラーが発生しました"
      />
    );
    
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
  });

  it("プレビュー画像が表示される", () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
        preview="test-image-url"
      />
    );
    
    expect(screen.getByAltText("アップロード画像プレビュー")).toBeInTheDocument();
    expect(screen.getByText("画像が選択されました")).toBeInTheDocument();
  });

  it("有効なファイルが選択された場合にコールバックが呼ばれる", async () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
      />
    );
    
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    
    fireEvent.change(fileInput);
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(file);
  });

  it("ファイルサイズが大きすぎる場合にエラーが表示される", async () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
        maxSize={1}
      />
    );
    
    const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, "files", {
      value: [largeFile],
    });
    
    fireEvent.change(fileInput);
    
    expect(screen.getByText(/ファイルサイズが大きすぎます/)).toBeInTheDocument();
    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  it("無効なファイル形式の場合にエラーが表示される", async () => {
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
      />
    );
    
    const invalidFile = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, "files", {
      value: [invalidFile],
    });
    
    fireEvent.change(fileInput);
    
    expect(screen.getByText(/対応していないファイル形式です/)).toBeInTheDocument();
    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  it("削除ボタンでファイルが削除される", async () => {
    const user = userEvent.setup();
    render(
      <ImageUpload
        onImageSelect={mockOnImageSelect}
        label="テスト画像"
        preview="test-image-url"
      />
    );
    
    const removeButton = screen.getByRole("button");
    await user.click(removeButton);
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(null);
  });
});