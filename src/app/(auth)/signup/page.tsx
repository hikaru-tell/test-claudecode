import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          マッチョマッチングへようこそ
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          新規アカウントを作成
        </p>
      </div>
      <div className="mt-8">
        <SignUpForm />
      </div>
    </>
  );
}