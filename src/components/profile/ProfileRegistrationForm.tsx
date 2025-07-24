'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleSelect } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { validateProfile } from '@/lib/validations/profile'

interface ProfileRegistrationFormProps {
  onStageChange?: (stage: number) => void
  totalStages?: number
}

interface ProfileFormData {
  nickname: string
  gender: 'male' | 'female' | 'other' | ''
  birthDate: string
  age: number | undefined
  location: string
  bio: string
}

export function ProfileRegistrationForm({ 
  onStageChange,
  totalStages = 3 
}: ProfileRegistrationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const createOrUpdateProfile = useMutation(api.users.createOrUpdateProfile)
  
  const [currentStage, setCurrentStage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: '',
    gender: '',
    birthDate: '',
    age: undefined,
    location: '',
    bio: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const validateCurrentStage = (): boolean => {
    const stageErrors: Record<string, string> = {}

    if (currentStage === 1) {
      if (!formData.nickname.trim()) {
        stageErrors.nickname = 'ニックネームは必須です'
      } else if (formData.nickname.length < 2) {
        stageErrors.nickname = 'ニックネームは2文字以上で入力してください'
      }

      if (!formData.gender) {
        stageErrors.gender = '性別の選択が必要です'
      }
    }

    if (currentStage === 2) {
      if (!formData.birthDate) {
        stageErrors.birthDate = '生年月日は必須です'
      } else {
        const age = calculateAge(formData.birthDate)
        if (age < 18) {
          stageErrors.birthDate = '18歳以上である必要があります'
        }
      }

      if (!formData.location.trim()) {
        stageErrors.location = '居住地は必須です'
      }
    }

    if (currentStage === 3) {
      if (!formData.bio.trim()) {
        stageErrors.bio = '自己紹介は必須です'
      } else if (formData.bio.length < 10) {
        stageErrors.bio = '自己紹介は10文字以上で入力してください'
      }
    }

    setErrors(stageErrors)
    return Object.keys(stageErrors).length === 0
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // 生年月日が変更された場合、年齢を自動計算
      if (field === 'birthDate' && typeof value === 'string' && value) {
        updated.age = calculateAge(value)
      }
      
      return updated
    })
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNext = () => {
    if (validateCurrentStage()) {
      if (currentStage < totalStages) {
        setCurrentStage(prev => prev + 1)
        onStageChange?.(currentStage + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1)
      onStageChange?.(currentStage - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStage()) return

    // 全体バリデーション
    const validationResult = validateProfile({
      nickname: formData.nickname,
      gender: formData.gender as 'male' | 'female' | 'other',
      birthDate: formData.birthDate,
      age: formData.age!,
      location: formData.location,
      bio: formData.bio
    })

    if (!validationResult.success) {
      setErrors(validationResult.errors)
      toast({
        title: 'エラー',
        description: '入力内容に問題があります。修正してください。',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      // 入力データのサニタイゼーション
      const sanitizedData = {
        nickname: formData.nickname.trim(),
        gender: formData.gender as 'male' | 'female' | 'other',
        birthDate: formData.birthDate,
        age: formData.age!,
        location: formData.location.trim(),
        bio: formData.bio.trim()
      }

      await createOrUpdateProfile(sanitizedData)

      toast({
        title: 'プロフィール登録完了',
        description: 'プロフィールの登録が完了しました。本人確認のために身分証明書の提出をお願いします。'
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Profile registration error:', error)
      
      // エラーの詳細に応じたメッセージ
      let errorMessage = 'プロフィールの登録に失敗しました。再度お試しください。'
      
      if (error instanceof Error) {
        if (error.message.includes('認証')) {
          errorMessage = '認証エラーが発生しました。再度ログインしてください。'
        } else if (error.message.includes('バリデーション')) {
          errorMessage = '入力内容に問題があります。各項目を確認してください。'
        }
      }

      toast({
        title: 'エラー',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStage1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nickname">ニックネーム *</Label>
        <Input
          id="nickname"
          type="text"
          placeholder="表示される名前を入力"
          value={formData.nickname}
          onChange={(e) => handleInputChange('nickname', e.target.value)}
          className={errors.nickname ? 'border-red-500' : ''}
        />
        {errors.nickname && (
          <p className="text-sm text-red-500">{errors.nickname}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">性別 *</Label>
        <SimpleSelect 
          id="gender"
          value={formData.gender} 
          onValueChange={(value) => handleInputChange('gender', value)}
          className={errors.gender ? 'border-red-500' : ''}
        >
          <option value="">性別を選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </SimpleSelect>
        {errors.gender && (
          <p className="text-sm text-red-500">{errors.gender}</p>
        )}
      </div>
    </div>
  )

  const renderStage2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birthDate">生年月日 *</Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          className={errors.birthDate ? 'border-red-500' : ''}
        />
        {formData.age && (
          <p className="text-sm text-gray-600">年齢: {formData.age}歳</p>
        )}
        {errors.birthDate && (
          <p className="text-sm text-red-500">{errors.birthDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">居住地 *</Label>
        <Input
          id="location"
          type="text"
          placeholder="例: 東京都渋谷区"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location}</p>
        )}
      </div>
    </div>
  )

  const renderStage3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bio">自己紹介 *</Label>
        <Textarea
          id="bio"
          placeholder="あなたについて教えてください..."
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className={errors.bio ? 'border-red-500' : ''}
          rows={5}
        />
        <p className="text-sm text-gray-600">
          {formData.bio.length}/500文字
        </p>
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio}</p>
        )}
      </div>
    </div>
  )

  const getStageTitle = () => {
    switch (currentStage) {
      case 1:
        return '基本情報'
      case 2:
        return '詳細情報'
      case 3:
        return '自己紹介'
      default:
        return 'プロフィール登録'
    }
  }

  const getStageDescription = () => {
    switch (currentStage) {
      case 1:
        return 'ニックネームと性別を入力してください'
      case 2:
        return '生年月日と居住地を入力してください'
      case 3:
        return '自己紹介を入力してください'
      default:
        return ''
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">
            ステップ {currentStage} / {totalStages}
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: totalStages }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= currentStage ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <CardTitle>{getStageTitle()}</CardTitle>
        <CardDescription>{getStageDescription()}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {currentStage === 1 && renderStage1()}
        {currentStage === 2 && renderStage2()}
        {currentStage === 3 && renderStage3()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStage === 1}
        >
          戻る
        </Button>
        
        {currentStage < totalStages ? (
          <Button type="button" onClick={handleNext}>
            次へ
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '登録中...' : '登録完了'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}