import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateRegistrationForm,
  validateLoginForm,
} from "../validation";

describe("validateEmail", () => {
  it("空のメールアドレスはエラーを返す", () => {
    expect(validateEmail("")).toBe("メールアドレスを入力してください");
  });

  it("無効なメールアドレス形式はエラーを返す", () => {
    expect(validateEmail("invalid")).toBe("有効なメールアドレスを入力してください");
    expect(validateEmail("test@")).toBe("有効なメールアドレスを入力してください");
    expect(validateEmail("@example.com")).toBe("有効なメールアドレスを入力してください");
    expect(validateEmail("test@example")).toBe("有効なメールアドレスを入力してください");
  });

  it("有効なメールアドレスはnullを返す", () => {
    expect(validateEmail("test@example.com")).toBeNull();
    expect(validateEmail("user.name@example.co.jp")).toBeNull();
    expect(validateEmail("user+tag@example.com")).toBeNull();
  });
});

describe("validatePassword", () => {
  it("空のパスワードはエラーを返す", () => {
    expect(validatePassword("")).toBe("パスワードを入力してください");
  });

  it("8文字未満のパスワードはエラーを返す", () => {
    expect(validatePassword("Pass1!")).toBe("パスワードは8文字以上で入力してください");
  });

  it("大文字を含まないパスワードはエラーを返す", () => {
    expect(validatePassword("password1!")).toBe("パスワードに大文字を含めてください");
  });

  it("小文字を含まないパスワードはエラーを返す", () => {
    expect(validatePassword("PASSWORD1!")).toBe("パスワードに小文字を含めてください");
  });

  it("数字を含まないパスワードはエラーを返す", () => {
    expect(validatePassword("Password!")).toBe("パスワードに数字を含めてください");
  });

  it("特殊文字を含まないパスワードはエラーを返す", () => {
    expect(validatePassword("Password1")).toBe("パスワードに特殊文字を含めてください");
  });

  it("有効なパスワードはnullを返す", () => {
    expect(validatePassword("Password1!")).toBeNull();
    expect(validatePassword("Complex@Pass123")).toBeNull();
    expect(validatePassword("MyStr0ng#Pass")).toBeNull();
  });
});

describe("validatePasswordConfirmation", () => {
  it("空の確認パスワードはエラーを返す", () => {
    expect(validatePasswordConfirmation("password", "")).toBe(
      "パスワード（確認）を入力してください"
    );
  });

  it("一致しないパスワードはエラーを返す", () => {
    expect(validatePasswordConfirmation("password1", "password2")).toBe(
      "パスワードが一致しません"
    );
  });

  it("一致するパスワードはnullを返す", () => {
    expect(validatePasswordConfirmation("password", "password")).toBeNull();
  });
});

describe("validateRegistrationForm", () => {
  it("全てのフィールドが空の場合は複数のエラーを返す", () => {
    const errors = validateRegistrationForm({
      email: "",
      password: "",
      confirmPassword: "",
    });

    expect(errors.email).toBe("メールアドレスを入力してください");
    expect(errors.password).toBe("パスワードを入力してください");
    expect(errors.confirmPassword).toBe("パスワード（確認）を入力してください");
  });

  it("無効なデータの場合は適切なエラーを返す", () => {
    const errors = validateRegistrationForm({
      email: "invalid-email",
      password: "weak",
      confirmPassword: "different",
    });

    expect(errors.email).toBe("有効なメールアドレスを入力してください");
    expect(errors.password).toBe("パスワードは8文字以上で入力してください");
    expect(errors.confirmPassword).toBe("パスワードが一致しません");
  });

  it("有効なデータの場合は空のオブジェクトを返す", () => {
    const errors = validateRegistrationForm({
      email: "test@example.com",
      password: "Password1!",
      confirmPassword: "Password1!",
    });

    expect(errors).toEqual({});
  });
});

describe("validateLoginForm", () => {
  it("全てのフィールドが空の場合はエラーを返す", () => {
    const errors = validateLoginForm({
      email: "",
      password: "",
    });

    expect(errors.email).toBe("メールアドレスを入力してください");
    expect(errors.password).toBe("パスワードを入力してください");
  });

  it("無効なメールアドレスの場合はエラーを返す", () => {
    const errors = validateLoginForm({
      email: "invalid-email",
      password: "password",
    });

    expect(errors.email).toBe("有効なメールアドレスを入力してください");
    expect(errors.password).toBeUndefined();
  });

  it("有効なデータの場合は空のオブジェクトを返す", () => {
    const errors = validateLoginForm({
      email: "test@example.com",
      password: "anypassword",
    });

    expect(errors).toEqual({});
  });
});