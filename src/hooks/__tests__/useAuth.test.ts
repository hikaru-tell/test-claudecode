import { renderHook } from "@testing-library/react";
import { useAuth } from "../useAuth";

// モック
jest.mock("convex/react", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../../convex/_generated/api", () => ({
  api: {
    users: {
      viewer: "mockViewerQuery",
    },
  },
}));

describe("useAuth", () => {
  const mockUseQuery = require("convex/react").useQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーがログインしている場合の状態を返す", () => {
    const mockUser = {
      _id: "user1",
      email: "test@example.com",
      status: "active",
    };
    
    mockUseQuery.mockReturnValue(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("ユーザーがログインしていない場合の状態を返す", () => {
    mockUseQuery.mockReturnValue(null);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("ロード中の状態を返す", () => {
    mockUseQuery.mockReturnValue(undefined);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBe(undefined);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });
});