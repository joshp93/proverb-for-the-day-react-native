import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { checkUser } from "../src/api/auth";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function EmailEntry() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | undefined>();

  const validateField = (value: string) => {
    if (!value) {
      setFieldError("Email is required");
      return false;
    }
    if (!isValidEmail(value)) {
      setFieldError("Please enter a valid email address");
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleContinue = async () => {
    if (!validateField(email)) {
      return;
    }

    setLoading(true);
    const exists = await checkUser(email);
    setLoading(false);

    if (exists) {
      router.push({ pathname: "/sign-in", params: { email } });
    } else {
      router.push({ pathname: "/sign-up", params: { email } });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Enter your email to continue</Text>

      {fieldError ? <Text style={styles.fieldError}>{fieldError}</Text> : null}

      <TextInput
        style={[styles.input, fieldError ? styles.inputError : null]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={() => validateField(email)}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <Button
        title={loading ? "" : "Continue"}
        onPress={handleContinue}
        disabled={loading}
      />
      {loading && <ActivityIndicator style={styles.loader} />}
    </View>
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
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  loader: {
    marginTop: 10,
  },
});
