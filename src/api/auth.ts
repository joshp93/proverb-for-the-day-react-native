import {
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "@aws-amplify/auth";

export interface AppAuthUser {
  userId: string;
  username: string;
  email: string;
}

export async function checkUserExists(email: string): Promise<boolean> {
  try {
    console.log("[Auth API] Checking if user exists...");
    const user = await getCurrentUser();
    const exists = user.username === email;
    console.log("[Auth API] User exists: ", exists);
    return exists;
  } catch (error: unknown) {
    console.error("[Auth API] Error checking user existence", error);
    return false;
  }
}

export async function createAccount(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("[Auth API] Creating new account...");
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    console.log("[Auth API] Account created successfully");
    return { success: true };
  } catch (error: unknown) {
    console.error("[Auth API] Account creation failed", error);
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function verifyAccount(
  email: string,
  code: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("[Auth API] Verifying account...");
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    console.log("[Auth API] Account verified successfully");
    return { success: true };
  } catch (error: unknown) {
    console.error("[Auth API] Account verification failed", error);
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("[Auth API] Attempting login...");
    await signIn({
      username: email,
      password,
    });
    console.log("[Auth API] Login successful");
    return { success: true };
  } catch (error: unknown) {
    console.error("[Auth API] Login failed", error);
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function logout(): Promise<void> {
  console.log("[Auth API] Logging out...");
  await signOut();
  console.log("[Auth API] Logged out");
}

export async function getAuthenticatedUser(): Promise<AppAuthUser | null> {
  try {
    console.log("[Auth API] Getting authenticated user...");
    const user = await getCurrentUser();
    console.log("[Auth API] User found");
    return {
      userId: user.userId,
      username: user.username,
      email: user.username,
    };
  } catch (error: unknown) {
    console.error("[Auth API] Error getting authenticated user", error);
    return null;
  }
}

export async function getIdToken(): Promise<string | null> {
  try {
    console.log("[Auth API] Getting ID token...");
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString() ?? null;
    console.log("[Auth API] ID token retrieved:", token ? "yes" : "no");
    return token;
  } catch (error: unknown) {
    console.error("[Auth API] Error getting ID token", error);
    return null;
  }
}
