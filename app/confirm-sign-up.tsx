import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { verifyAccount } from "../src/api/auth";

export default function ConfirmSignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    code?: string;
  }>({});

  useEffect(() => {
    if (params.email) {
      setEmail(params.email);
    }
  }, [params.email]);

  const validateField = (field: "email" | "code", value: string) => {
    if (!value) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: `${field === "email" ? "Email" : "Verification code"} is required`,
      }));
      return false;
    }
    if (field === "code" && value.length !== 6) {
      setFieldErrors((prev) => ({
        ...prev,
        code: "Please enter the 6-digit code",
      }));
      return false;
    }
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    return true;
  };

  const handleConfirm = async () => {
    setFormError("");
    setSuccessMessage("");

    const emailValid = validateField("email", email);
    const codeValid = validateField("code", code);

    if (!emailValid || !codeValid) {
      return;
    }

    setLoading(true);
    const result = await verifyAccount(email, code);
    setLoading(false);

    if (result.success) {
      setSuccessMessage("Your email has been verified. You can now sign in.");
      setTimeout(
        () => router.push({ pathname: "/sign-in", params: { email } }),
        2000,
      );
    } else {
      setFormError(result.message || "Verification failed. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Confirm Sign Up" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Sign Up</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </Text>

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
          style={[styles.input, fieldErrors.code ? styles.inputError : null]}
          placeholder="Verification Code"
          value={code}
          onChangeText={setCode}
          onBlur={() => validateField("code", code)}
          keyboardType="number-pad"
          maxLength={6}
        />
        {fieldErrors.code ? (
          <Text style={styles.fieldError}>{fieldErrors.code}</Text>
        ) : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
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
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
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
    textAlign: "center",
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
});
