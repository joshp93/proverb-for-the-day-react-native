import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { createAccount } from "../src/api/auth";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getPasswordError = (password: string): string | null => {
  if (password.length === 0) return null;
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[0-9]/.test(password)) return "Password must contain at least 1 number";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least 1 uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least 1 lowercase letter";
  return null;
};

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateField = (
    field: "email" | "password" | "confirmPassword",
    value: string,
    allValues?: { password: string; confirmPassword: string },
  ) => {
    let error: string | undefined;

    if (!value) {
      error = `${field === "confirmPassword" ? "Confirm password" : field === "email" ? "Email" : "Password"} is required`;
    } else if (field === "email" && !isValidEmail(value)) {
      error = "Please enter a valid email address";
    } else if (field === "password") {
      error = getPasswordError(value) || undefined;
    } else if (
      field === "confirmPassword" &&
      allValues &&
      value !== allValues.password
    ) {
      error = "Passwords do not match";
    }

    setFieldErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleSignUp = async () => {
    setFormError("");
    setSuccessMessage("");

    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);
    const confirmValid = validateField("confirmPassword", confirmPassword, {
      password,
      confirmPassword,
    });

    if (!emailValid || !passwordValid || !confirmValid) {
      return;
    }

    setLoading(true);
    const result = await createAccount(email, password);
    setLoading(false);

    if (result.success) {
      setSuccessMessage("Check your email for a verification code");
      router.push({
        pathname: "/confirm-sign-up",
        params: { email },
      });
    } else {
      setFormError(result.message || "Sign up failed. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign Up" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
        {successMessage ? (
          <Text style={styles.success}>{successMessage}</Text>
        ) : null}

        <TextInput
          style={[styles.input, fieldErrors.email ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => validateField("email", email)}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        {fieldErrors.email ? (
          <Text style={styles.fieldError}>{fieldErrors.email}</Text>
        ) : null}

        <TextInput
          style={[
            styles.input,
            fieldErrors.password ? styles.inputError : null,
          ]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => validateField("password", password)}
          secureTextEntry
        />
        {fieldErrors.password ? (
          <Text style={styles.fieldError}>{fieldErrors.password}</Text>
        ) : null}

        <TextInput
          style={[
            styles.input,
            fieldErrors.confirmPassword ? styles.inputError : null,
          ]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onBlur={() =>
            validateField("confirmPassword", confirmPassword, {
              password,
              confirmPassword,
            })
          }
          secureTextEntry
        />
        {fieldErrors.confirmPassword ? (
          <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>
        ) : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  formError: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  success: {
    color: "#28a745",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  fieldError: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  links: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#007AFF",
    fontSize: 16,
  },
});
