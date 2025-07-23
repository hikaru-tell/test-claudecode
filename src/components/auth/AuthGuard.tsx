"use client";

import { useConvexAuth } from "@convex-dev/auth/react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {fallback || (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-600">ログインが必要です</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}