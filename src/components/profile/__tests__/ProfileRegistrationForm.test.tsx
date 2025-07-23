import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileRegistrationForm } from '../ProfileRegistrationForm'
import { validateProfile } from '@/lib/validations/profile'

// モックの設定
jest.mock('convex/react', () => ({
  useMutation: jest.fn(() => jest.fn()),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}))

// バリデーション関数のモック
jest.mock('@/lib/validations/profile', () => ({
  validateProfile: jest.fn(),
}))

const mockValidateProfile = validateProfile as jest.MockedFunction<typeof validateProfile>

describe('ProfileRegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Stage 1 - 基本情報', () => {
    it('初期状態でステージ1が表示される', () => {
      render(<ProfileRegistrationForm />)
      
      expect(screen.getByText('基本情報')).toBeInTheDocument()
      expect(screen.getByText('ニックネームと性別を入力してください')).toBeInTheDocument()
      expect(screen.getByLabelText('ニックネーム *')).toBeInTheDocument()
      expect(screen.getByLabelText('性別 *')).toBeInTheDocument()
    })

    it('必須フィールドが空の場合にエラーメッセージが表示される', async () => {
      const user = userEvent.setup()
      render(<ProfileRegistrationForm />)
      
      const nextButton = screen.getByText('次へ')
      await user.click(nextButton)
      
      expect(screen.getByText('ニックネームは必須です')).toBeInTheDocument()
      expect(screen.getByText('性別を選択してください')).toBeInTheDocument()
    })

    it('有効な入力で次のステージに進む', async () => {
      const user = userEvent.setup()
      render(<ProfileRegistrationForm />)
      
      const nicknameInput = screen.getByLabelText('ニックネーム *')
      const genderSelect = screen.getByLabelText('性別 *')
      const nextButton = screen.getByText('次へ')
      
      await user.type(nicknameInput, 'テストユーザー')
      await user.selectOptions(genderSelect, 'male')
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText('詳細情報')).toBeInTheDocument()
      })
    })

    it('短すぎるニックネームでエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<ProfileRegistrationForm />)
      
      const nicknameInput = screen.getByLabelText('ニックネーム *')
      const nextButton = screen.getByText('次へ')
      
      await user.type(nicknameInput, 'A')
      await user.click(nextButton)
      
      expect(screen.getByText('ニックネームは2文字以上で入力してください')).toBeInTheDocument()
    })
  })

  describe('Stage 2 - 詳細情報', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<ProfileRegistrationForm />)
      
      // ステージ1をクリア
      const nicknameInput = screen.getByLabelText('ニックネーム *')
      const genderSelect = screen.getByLabelText('性別 *')
      const nextButton = screen.getByText('次へ')
      
      await user.type(nicknameInput, 'テストユーザー')
      await user.selectOptions(genderSelect, 'male')
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText('詳細情報')).toBeInTheDocument()
      })
    })

    it('ステージ2の要素が表示される', () => {
      expect(screen.getByLabelText('生年月日 *')).toBeInTheDocument()
      expect(screen.getByLabelText('居住地 *')).toBeInTheDocument()
      expect(screen.getByText('戻る')).toBeInTheDocument()
    })

    it('生年月日入力時に年齢が自動計算される', async () => {
      const user = userEvent.setup()
      const birthDateInput = screen.getByLabelText('生年月日 *')
      
      // 30歳になる生年月日を入力
      const thirtyYearsAgo = new Date()
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30)
      const dateString = thirtyYearsAgo.toISOString().split('T')[0]
      
      await user.type(birthDateInput, dateString)
      
      await waitFor(() => {
        expect(screen.getByText(/年齢: \d+歳/)).toBeInTheDocument()
      })
    })

    it('戻るボタンでステージ1に戻る', async () => {
      const user = userEvent.setup()
      const backButton = screen.getByText('戻る')
      
      await user.click(backButton)
      
      await waitFor(() => {
        expect(screen.getByText('基本情報')).toBeInTheDocument()
      })
    })
  })

  describe('Stage 3 - 自己紹介', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<ProfileRegistrationForm />)
      
      // ステージ1と2をクリア
      const nicknameInput = screen.getByLabelText('ニックネーム *')
      const genderSelect = screen.getByLabelText('性別 *')
      let nextButton = screen.getByText('次へ')
      
      await user.type(nicknameInput, 'テストユーザー')
      await user.selectOptions(genderSelect, 'male')
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText('詳細情報')).toBeInTheDocument()
      })
      
      const birthDateInput = screen.getByLabelText('生年月日 *')
      const locationInput = screen.getByLabelText('居住地 *')
      nextButton = screen.getByText('次へ')
      
      const thirtyYearsAgo = new Date()
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30)
      const dateString = thirtyYearsAgo.toISOString().split('T')[0]
      
      await user.type(birthDateInput, dateString)
      await user.type(locationInput, '東京都')
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText('自己紹介')).toBeInTheDocument()
      })
    })

    it('ステージ3の要素が表示される', () => {
      expect(screen.getByLabelText('自己紹介 *')).toBeInTheDocument()
      expect(screen.getByText('登録完了')).toBeInTheDocument()
    })

    it('文字数カウンターが表示される', async () => {
      const user = userEvent.setup()
      const bioTextarea = screen.getByLabelText('自己紹介 *')
      
      await user.type(bioTextarea, 'テスト自己紹介')
      
      expect(screen.getByText(/\d+\/500文字/)).toBeInTheDocument()
    })

    it('短い自己紹介でエラーが表示される', async () => {
      const user = userEvent.setup()
      const bioTextarea = screen.getByLabelText('自己紹介 *')
      const submitButton = screen.getByText('登録完了')
      
      await user.type(bioTextarea, '短い')
      await user.click(submitButton)
      
      expect(screen.getByText('自己紹介は10文字以上で入力してください')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('すべてのデータが有効な場合にフォームが送信される', async () => {
      const user = userEvent.setup()
      const mockMutation = jest.fn()
      const mockRouter = { push: jest.fn() }
      const mockToast = jest.fn()

      // モックの設定
      require('convex/react').useMutation.mockReturnValue(mockMutation)
      require('next/navigation').useRouter.mockReturnValue(mockRouter)
      require('@/hooks/use-toast').useToast.mockReturnValue({ toast: mockToast })
      mockValidateProfile.mockReturnValue({
        success: true,
        data: {
          nickname: 'テストユーザー',
          gender: 'male' as const,
          birthDate: '1990-01-01',
          age: 34,
          location: '東京都',
          bio: 'これは有効な自己紹介文です。'
        },
        errors: {}
      })

      render(<ProfileRegistrationForm />)
      
      // 全ステージを完了
      const nicknameInput = screen.getByLabelText('ニックネーム *')
      const genderSelect = screen.getByLabelText('性別 *')
      
      await user.type(nicknameInput, 'テストユーザー')
      await user.selectOptions(genderSelect, 'male')
      await user.click(screen.getByText('次へ'))
      
      await waitFor(() => {
        expect(screen.getByText('詳細情報')).toBeInTheDocument()
      })
      
      const birthDateInput = screen.getByLabelText('生年月日 *')
      const locationInput = screen.getByLabelText('居住地 *')
      
      await user.type(birthDateInput, '1990-01-01')
      await user.type(locationInput, '東京都')
      await user.click(screen.getByText('次へ'))
      
      await waitFor(() => {
        expect(screen.getByText('自己紹介')).toBeInTheDocument()
      })
      
      const bioTextarea = screen.getByLabelText('自己紹介 *')
      await user.type(bioTextarea, 'これは有効な自己紹介文です。')
      
      await user.click(screen.getByText('登録完了'))
      
      await waitFor(() => {
        expect(mockMutation).toHaveBeenCalledWith({
          nickname: 'テストユーザー',
          gender: 'male',
          birthDate: '1990-01-01',
          age: 34,
          location: '東京都',
          bio: 'これは有効な自己紹介文です。'
        })
      })
    })
  })

  describe('Progress Indicator', () => {
    it('進捗インジケーターが正しく表示される', () => {
      render(<ProfileRegistrationForm />)
      
      expect(screen.getByText('ステップ 1 / 3')).toBeInTheDocument()
      
      // 進捗ドットの確認
      const dots = screen.container.querySelectorAll('.w-2.h-2.rounded-full')
      expect(dots).toHaveLength(3)
      expect(dots[0]).toHaveClass('bg-blue-500') // アクティブ
      expect(dots[1]).toHaveClass('bg-gray-300') // 非アクティブ
      expect(dots[2]).toHaveClass('bg-gray-300') // 非アクティブ
    })
  })
})