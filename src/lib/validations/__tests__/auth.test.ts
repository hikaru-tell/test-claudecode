import { signUpSchema, signInSchema } from "../auth";

describe("Auth Validation Schemas", () => {
  describe("signUpSchema", () => {
    it("有効な入力を受け入れる", () => {
      const validInput = {
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };
      
      const result = signUpSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("無効なメールアドレスを拒否する", () => {
      const invalidEmail = {
        email: "invalid-email",
        password: "Password123",
        confirmPassword: "Password123",
      };
      
      const result = signUpSchema.safeParse(invalidEmail);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("有効なメールアドレスを入力してください");
      }
    });

    it("空のメールアドレスを拒否する", () => {
      const emptyEmail = {
        email: "",
        password: "Password123",
        confirmPassword: "Password123",
      };
      
      const result = signUpSchema.safeParse(emptyEmail);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("メールアドレスを入力してください");
      }
    });

    it("短いパスワードを拒否する", () => {
      const shortPassword = {
        email: "test@example.com",
        password: "Pass1",
        confirmPassword: "Pass1",
      };
      
      const result = signUpSchema.safeParse(shortPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードは8文字以上で入力してください");
      }
    });

    it("大文字を含まないパスワードを拒否する", () => {
      const noUppercase = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      
      const result = signUpSchema.safeParse(noUppercase);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードは大文字、小文字、数字を含む必要があります");
      }
    });

    it("小文字を含まないパスワードを拒否する", () => {
      const noLowercase = {
        email: "test@example.com",
        password: "PASSWORD123",
        confirmPassword: "PASSWORD123",
      };
      
      const result = signUpSchema.safeParse(noLowercase);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードは大文字、小文字、数字を含む必要があります");
      }
    });

    it("数字を含まないパスワードを拒否する", () => {
      const noNumber = {
        email: "test@example.com",
        password: "PasswordABC",
        confirmPassword: "PasswordABC",
      };
      
      const result = signUpSchema.safeParse(noNumber);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードは大文字、小文字、数字を含む必要があります");
      }
    });

    it("一致しないパスワードを拒否する", () => {
      const mismatchedPasswords = {
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password456",
      };
      
      const result = signUpSchema.safeParse(mismatchedPasswords);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードが一致しません");
      }
    });

    it("空のパスワード確認を拒否する", () => {
      const emptyConfirm = {
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "",
      };
      
      const result = signUpSchema.safeParse(emptyConfirm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === "パスワードを再入力してください")).toBe(true);
      }
    });
  });

  describe("signInSchema", () => {
    it("有効な入力を受け入れる", () => {
      const validInput = {
        email: "test@example.com",
        password: "password",
      };
      
      const result = signInSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("無効なメールアドレスを拒否する", () => {
      const invalidEmail = {
        email: "invalid-email",
        password: "password",
      };
      
      const result = signInSchema.safeParse(invalidEmail);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("有効なメールアドレスを入力してください");
      }
    });

    it("空のメールアドレスを拒否する", () => {
      const emptyEmail = {
        email: "",
        password: "password",
      };
      
      const result = signInSchema.safeParse(emptyEmail);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("メールアドレスを入力してください");
      }
    });

    it("空のパスワードを拒否する", () => {
      const emptyPassword = {
        email: "test@example.com",
        password: "",
      };
      
      const result = signInSchema.safeParse(emptyPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("パスワードを入力してください");
      }
    });
  });
});