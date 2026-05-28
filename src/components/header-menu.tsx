import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Animated,
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
  const [slideAnimation] = useState(new Animated.Value(300));
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignIn = () => {
    closeMenu();
    router.push("/email-entry");
  };

  const handleNotifications = () => {
    closeMenu();
    router.push("/notifications");
  };

  const handleSignOut = () => {
    closeMenu();
    signOut();
  };

  const openMenu = () => {
    setVisible(true);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnimation, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <>
      <Pressable onPress={openMenu} style={styles.burger}>
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
        <View style={styles.burgerLine} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <Animated.View
            style={[
              styles.drawerMenu,
              { transform: [{ translateX: slideAnimation }] },
            ]}
          >
            <View style={styles.menuContent}>
              {user && (
                <Text style={styles.userEmail}>{user.email}</Text>
              )}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleNotifications}
              >
                <Text style={styles.menuText}>Notifications</Text>
              </TouchableOpacity>
              {user ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSignOut}
                >
                  <Text style={styles.menuText}>Sign Out</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSignIn}
                >
                  <Text style={styles.menuText}>Sign In</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
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
    height: "100%",
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
  },
  drawerMenu: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
