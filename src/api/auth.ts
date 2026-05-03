const BASE_URL =
  "https://8ndcvtnwf1.execute-api.eu-west-2.amazonaws.com/prod/auth";

export interface SignUpResponse {
  success: boolean;
  message?: string;
}

export interface SignInResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export async function signUp(
  email: string,
  password: string,
): Promise<SignUpResponse> {
  const response = await fetch(`${BASE_URL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 200) {
    return { success: true };
  }

  return {
    success: false,
    message: "Please try again",
  };
}

export async function confirmSignUp(
  email: string,
  code: string,
): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${BASE_URL}/confirm-sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (response.status === 200) {
    return { success: true };
  }

  return {
    success: false,
    message: "Invalid code. Please try again.",
  };
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResponse> {
  const response = await fetch(`${BASE_URL}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 200) {
    const data = await response.json();
    return {
      success: true,
      token: data.token || data.jwt || data.accessToken,
    };
  }

  return {
    success: false,
    message: "Invalid email or password",
  };
}

export async function checkUser(email: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/check-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (response.status === 200) {
    const data = await response.json();
    return data.exists === true;
  }

  return false;
}
