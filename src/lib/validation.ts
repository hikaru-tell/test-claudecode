// メールアドレスのバリデーション
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "メールアドレスを入力してください";
  }
  
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return "有効なメールアドレスを入力してください";
  }
  
  return null;
};

// パスワードのバリデーション
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "パスワードを入力してください";
  }
  
  if (password.length < 8) {
    return "パスワードは8文字以上で入力してください";
  }
  
  if (!/[A-Z]/.test(password)) {
    return "パスワードに大文字を含めてください";
  }
  
  if (!/[a-z]/.test(password)) {
    return "パスワードに小文字を含めてください";
  }
  
  if (!/[0-9]/.test(password)) {
    return "パスワードに数字を含めてください";
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "パスワードに特殊文字を含めてください";
  }
  
  return null;
};

// パスワード確認のバリデーション
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return "パスワード（確認）を入力してください";
  }
  
  if (password !== confirmPassword) {
    return "パスワードが一致しません";
  }
  
  return null;
};

// 総合的なフォームバリデーション
export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateRegistrationForm = (
  data: RegistrationFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  const confirmPasswordError = validatePasswordConfirmation(
    data.password,
    data.confirmPassword
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }
  
  return errors;
};

// ログインフォームのバリデーション
export interface LoginFormData {
  email: string;
  password: string;
}

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  if (!data.password) {
    errors.password = "パスワードを入力してください";
  }
  
  return errors;
};