import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../auth/auth-context";

export function HeaderMenu() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignIn = () => {
    setVisible(false);
    router.push("/email-entry");
  };

  const handleSignOut = () => {
    setVisible(false);
    signOut();
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.burger}>
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {user ? (
              <>
                <Text style={styles.userEmail}>{user.email}</Text>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSignOut}
                >
                  <Text style={styles.menuText}>Sign Out</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.menuItem} onPress={handleSignIn}>
                <Text style={styles.menuText}>Sign In</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  burger: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  burgerLine: {
    width: 20,
    height: 2,
    backgroundColor: "white",
    marginVertical: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
