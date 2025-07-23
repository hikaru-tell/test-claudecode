"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAuth() {
  const user = useQuery(api.users.viewer);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading: user === undefined,
  };
}