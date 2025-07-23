import React from "react";
import { render, screen } from "@testing-library/react";
import { SignUpForm } from "../SignUpForm";

// モック
jest.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({
    signIn: jest.fn(),
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正しくレンダリングされる", () => {
    render(<SignUpForm />);
    
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード（確認）")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新規登録" })).toBeInTheDocument();
  });

  it("プレースホルダーが正しく表示される", () => {
    render(<SignUpForm />);
    
    expect(screen.getByPlaceholderText("example@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("8文字以上、大文字・小文字・数字を含む")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワードを再入力")).toBeInTheDocument();
  });

  it("ログインページへのリンクが表示される", () => {
    render(<SignUpForm />);
    
    const loginLink = screen.getByText("ログイン");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/signin");
  });

  it("フォームに必要な要素が存在する", () => {
    render(<SignUpForm />);
    
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("")).toHaveLength(3); // 3つの空のinput要素が存在
  });

  it("パスワード入力フィールドが適切なtype属性を持つ", () => {
    render(<SignUpForm />);
    
    const passwordInput = screen.getByLabelText("パスワード");
    const confirmPasswordInput = screen.getByLabelText("パスワード（確認）");
    
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });
});