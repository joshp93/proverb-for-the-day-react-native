import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  logout as amplifyLogout,
  getAuthenticatedUser,
  getIdToken,
} from "../api/auth";

interface AuthUser {
  userId: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      console.log("[Auth] Checking for authenticated user...");
      const authenticatedUser = await getAuthenticatedUser();
      if (authenticatedUser) {
        console.log("[Auth] User is authenticated, fetching ID token...");
        const token = await getIdToken();
        if (token) {
          console.log("[Auth] User signed in successfully");
          setUser({ ...authenticatedUser, token });
        } else {
          console.log("[Auth] No ID token found, user is null");
          setUser(null);
        }
      } else {
        console.log("[Auth] No authenticated user found");
        setUser(null);
      }
    } catch (error: unknown) {
      console.error("[Auth] Error checking auth state", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    console.log("[Auth] Initializing auth state...");
    refreshUser().finally(() => {
      console.log("[Auth] Auth initialization complete");
      setLoading(false);
    });
  }, [refreshUser]);

  const signOut = useCallback(async () => {
    console.log("[Auth] Signing out user...");
    await amplifyLogout();
    console.log("[Auth] User signed out");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
