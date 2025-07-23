import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          アカウントにログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          マッチョマッチングへおかえりなさい
        </p>
      </div>
      <div className="mt-8">
        <SignInForm />
      </div>
    </>
  );
}