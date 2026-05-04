import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { signIn } from "../src/api/auth";
import { useAuth } from "../src/auth/auth-context";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignIn() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState(params.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateField = (field: "email" | "password", value: string) => {
    if (!value) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${field === "email" ? "Email" : "Password"} is required`,
      }));
      return false;
    }
    if (field === "email" && !isValidEmail(value)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    return true;
  };

  const handleSignIn = async () => {
    setFormError("");

    const emailValid = validateField("email", email);
    const passwordValid = validateField("password", password);

    if (!emailValid || !passwordValid) {
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      await refreshUser();
      router.replace("/");
    } else {
      setFormError(result.message || "Sign in failed. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Sign In" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              fieldErrors.password ? styles.inputError : null,
            ]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => validateField("password", password)}
            secureTextEntry={!showPassword}
          />
          <Pressable
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showPasswordText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>
        {fieldErrors.password ? (
          <Text style={styles.fieldError}>{fieldErrors.password}</Text>
        ) : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Sign In"}
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
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 60,
  },
  showPasswordButton: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 15,
    justifyContent: "center",
  },
  showPasswordText: {
    color: "#007AFF",
    fontSize: 16,
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
