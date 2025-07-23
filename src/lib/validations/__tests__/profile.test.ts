import { validateProfile, validateProfileUpdate } from '../profile'

describe('Profile Validation', () => {
  describe('validateProfile', () => {
    const validProfileData = {
      nickname: 'テストユーザー',
      gender: 'male' as const,
      birthDate: '1990-01-01',
      age: 34,
      location: '東京都',
      bio: 'これは有効な自己紹介文です。十分な長さがあります。'
    }

    it('有効なプロフィールデータでバリデーションが成功する', () => {
      const result = validateProfile(validProfileData)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(validProfileData)
      expect(result.errors).toEqual({})
    })

    describe('nickname validation', () => {
      it('空のニックネームでエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          nickname: ''
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.nickname).toBe('ニックネームは2文字以上で入力してください')
      })

      it('短すぎるニックネームでエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          nickname: 'A'
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.nickname).toBe('ニックネームは2文字以上で入力してください')
      })

      it('長すぎるニックネームでエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          nickname: 'A'.repeat(21)
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.nickname).toBe('ニックネームは20文字以内で入力してください')
      })

      it('無効な文字が含まれるとエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          nickname: 'test@user'
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.nickname).toBe('使用できない文字が含まれています')
      })

      it('有効な文字（日本語、英数字、スペース）は許可される', () => {
        const validNicknames = [
          'テストユーザー',
          'Test User',
          'テスト123',
          'ユーザー ABC'
        ]

        validNicknames.forEach(nickname => {
          const result = validateProfile({
            ...validProfileData,
            nickname
          })
          expect(result.success).toBe(true)
        })
      })
    })

    describe('gender validation', () => {
      it('有効な性別が許可される', () => {
        const validGenders = ['male', 'female', 'other'] as const

        validGenders.forEach(gender => {
          const result = validateProfile({
            ...validProfileData,
            gender
          })
          expect(result.success).toBe(true)
        })
      })

      it('無効な性別でエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          gender: 'invalid' as any
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.gender).toContain('expected one of')
      })
    })

    describe('birthDate validation', () => {
      it('18歳未満でエラーが返される', () => {
        const today = new Date()
        const seventeenYearsAgo = new Date()
        seventeenYearsAgo.setFullYear(today.getFullYear() - 17)
        
        const result = validateProfile({
          ...validProfileData,
          birthDate: seventeenYearsAgo.toISOString().split('T')[0],
          age: 17
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.birthDate).toBe('18歳以上である必要があります')
      })

      it('18歳以上で成功する', () => {
        const today = new Date()
        const eighteenYearsAgo = new Date()
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18)
        
        const result = validateProfile({
          ...validProfileData,
          birthDate: eighteenYearsAgo.toISOString().split('T')[0],
          age: 18
        })
        
        expect(result.success).toBe(true)
      })
    })

    describe('age validation', () => {
      it('18歳未満でエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          age: 17
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.age).toBe('18歳以上である必要があります')
      })

      it('120歳を超えるとエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          age: 121
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.age).toBe('正しい年齢を入力してください')
      })
    })

    describe('location validation', () => {
      it('空の居住地でエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          location: ''
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.location).toBe('居住地は必須です')
      })

      it('長すぎる居住地でエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          location: 'A'.repeat(51)
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.location).toBe('居住地は50文字以内で入力してください')
      })
    })

    describe('bio validation', () => {
      it('短すぎる自己紹介でエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          bio: '短い'
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.bio).toBe('自己紹介は10文字以上で入力してください')
      })

      it('長すぎる自己紹介でエラーが返される', () => {
        const result = validateProfile({
          ...validProfileData,
          bio: 'A'.repeat(501)
        })
        
        expect(result.success).toBe(false)
        expect(result.errors.bio).toBe('自己紹介は500文字以内で入力してください')
      })
    })

    it('複数のフィールドでエラーがある場合、すべてのエラーが返される', () => {
      const result = validateProfile({
        nickname: 'A', // 短すぎる
        gender: 'invalid' as any, // 無効
        birthDate: '2020-01-01', // 18歳未満
        age: 3, // 18歳未満
        location: '', // 空
        bio: '短い' // 短すぎる
      })
      
      expect(result.success).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(1)
    })
  })

  describe('validateProfileUpdate', () => {
    it('部分的なデータでバリデーションが成功する', () => {
      const result = validateProfileUpdate({
        nickname: 'テストユーザー更新'
      })
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        nickname: 'テストユーザー更新'
      })
    })

    it('空のオブジェクトでも成功する', () => {
      const result = validateProfileUpdate({})
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({})
    })

    it('無効なデータでエラーが返される', () => {
      const result = validateProfileUpdate({
        nickname: 'A' // 短すぎる
      })
      
      expect(result.success).toBe(false)
      expect(result.errors.nickname).toBe('ニックネームは2文字以上で入力してください')
    })
  })
})