import React from "react";
import { render, screen } from "@testing-library/react";
import { SignInForm } from "../SignInForm";

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

describe("SignInForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正しくレンダリングされる", () => {
    render(<SignInForm />);
    
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  it("プレースホルダーが正しく表示される", () => {
    render(<SignInForm />);
    
    expect(screen.getByPlaceholderText("example@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("パスワード")).toBeInTheDocument();
  });

  it("新規登録ページへのリンクが表示される", () => {
    render(<SignInForm />);
    
    const signUpLink = screen.getByText("新規登録");
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest("a")).toHaveAttribute("href", "/signup");
  });

  it("フォームに必要な要素が存在する", () => {
    render(<SignInForm />);
    
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("")).toHaveLength(2); // 2つの空のinput要素が存在
  });
});