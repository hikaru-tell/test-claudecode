import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VerificationUpload } from "../VerificationUpload";

// モック
jest.mock("convex/react", () => ({
  useMutation: () => jest.fn().mockResolvedValue("mock-upload-url"),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      profile: { gender: "male" },
      verificationStatus: {
        identity: "not_submitted",
        muscle: "not_submitted",
      },
    },
  }),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// File APIのモック
global.URL.createObjectURL = jest.fn(() => "mock-url");

describe("VerificationUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正しくレンダリングされる", () => {
    render(<VerificationUpload />);
    
    expect(screen.getByText("本人確認")).toBeInTheDocument();
    expect(screen.getByText("筋肉確認")).toBeInTheDocument();
    expect(screen.getByText("審査を申請")).toBeInTheDocument();
  });

  it("男性ユーザーに筋肉確認セクションが表示される", () => {
    render(<VerificationUpload />);
    
    expect(screen.getByText("筋肉確認")).toBeInTheDocument();
    expect(screen.getByText(/筋肉がわかる写真をアップロードしてください/)).toBeInTheDocument();
  });

  it("必須フィールドが空の場合にエラーが表示される", async () => {
    const user = userEvent.setup();
    render(<VerificationUpload />);
    
    const submitButton = screen.getByText("審査を申請");
    await user.click(submitButton);
    
    expect(screen.getByText("本人確認書類のアップロードが必要です")).toBeInTheDocument();
    expect(screen.getByText("筋肉確認写真のアップロードが必要です")).toBeInTheDocument();
  });

  it("ファイルサイズが大きすぎる場合にエラーが表示される", async () => {
    const user = userEvent.setup();
    render(<VerificationUpload />);
    
    // 大きなファイルを作成
    const largeFile = new File(["x".repeat(11 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // ファイル選択をシミュレート
    Object.defineProperty(fileInput, "files", {
      value: [largeFile],
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText(/ファイルサイズが大きすぎます/)).toBeInTheDocument();
    });
  });

  it("無効なファイル形式の場合にエラーが表示される", async () => {
    render(<VerificationUpload />);
    
    const invalidFile = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    Object.defineProperty(fileInput, "files", {
      value: [invalidFile],
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText(/対応していないファイル形式です/)).toBeInTheDocument();
    });
  });
});