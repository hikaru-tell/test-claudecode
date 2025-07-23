import { z } from 'zod'

// プロフィール登録用のバリデーションスキーマ
export const profileRegistrationSchema = z.object({
  nickname: z
    .string()
    .min(2, 'ニックネームは2文字以上で入力してください')
    .max(20, 'ニックネームは20文字以内で入力してください')
    .refine((val) => val.length === 0 || /^[a-zA-Z0-9あ-んア-ヶ一-龠々ー\s]+$/.test(val), {
      message: '使用できない文字が含まれています'
    }),
  
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: '性別を選択してください' }
      }
      return { message: ctx.defaultError }
    }
  }),
  
  birthDate: z
    .string()
    .min(1, '生年月日は必須です')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18
    }, '18歳以上である必要があります'),
  
  age: z
    .number()
    .min(18, '18歳以上である必要があります')
    .max(120, '正しい年齢を入力してください'),
  
  location: z
    .string()
    .min(1, '居住地は必須です')
    .max(50, '居住地は50文字以内で入力してください'),
  
  bio: z
    .string()
    .min(10, '自己紹介は10文字以上で入力してください')
    .max(500, '自己紹介は500文字以内で入力してください'),
})

export type ProfileRegistrationData = z.infer<typeof profileRegistrationSchema>

// バリデーション関数
export function validateProfile(data: unknown): {
  success: boolean
  data?: ProfileRegistrationData
  errors: Record<string, string>
} {
  try {
    const validatedData = profileRegistrationSchema.parse(data)
    return {
      success: true,
      data: validatedData,
      errors: {},
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message
        }
      })
      return {
        success: false,
        errors,
      }
    }
    return {
      success: false,
      errors: { general: '予期しないエラーが発生しました' },
    }
  }
}

// プロフィール編集用のバリデーションスキーマ（すべてオプショナル）
export const profileUpdateSchema = profileRegistrationSchema.partial()

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// プロフィール更新用のバリデーション関数
export function validateProfileUpdate(data: unknown): {
  success: boolean
  data?: ProfileUpdateData
  errors: Record<string, string>
} {
  try {
    const validatedData = profileUpdateSchema.parse(data)
    return {
      success: true,
      data: validatedData,
      errors: {},
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message
        }
      })
      return {
        success: false,
        errors,
      }
    }
    return {
      success: false,
      errors: { general: '予期しないエラーが発生しました' },
    }
  }
}