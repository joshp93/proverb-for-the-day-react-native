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
    const user = await getCurrentUser();
    return user.username === email;
  } catch {
    return false;
  }
}

export async function createAccount(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function verifyAccount(
  email: string,
  code: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    await signIn({
      username: email,
      password,
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function logout(): Promise<void> {
  await signOut();
}

export async function getAuthenticatedUser(): Promise<AppAuthUser | null> {
  try {
    const user = await getCurrentUser();
    return {
      userId: user.userId,
      username: user.username,
      email: user.username,
    };
  } catch {
    return null;
  }
}

export async function getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}
