'use client'

import { ProfileRegistrationForm } from '@/components/profile/ProfileRegistrationForm'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ProfileRegistrationPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              プロフィール登録
            </h1>
            <p className="text-gray-600">
              アカウント作成が完了しました！プロフィールを設定してマッチングを始めましょう。
            </p>
          </div>
          
          <ProfileRegistrationForm />
        </div>
      </div>
    </AuthGuard>
  )
}