import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { scheduleDailyProverbNotification } from "../src/notifications/daily-proverb-notification";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "../src/notifications/notification-preferences";

export default function NotificationsSettings() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    const isEnabled = await getNotificationsEnabled();
    setEnabled(isEnabled);
    setLoading(false);
  };

  const handleToggle = async (value: boolean) => {
    setEnabled(value);
    await setNotificationsEnabled(value);

    if (value) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          setEnabled(false);
          await setNotificationsEnabled(false);
          return;
        }
        await scheduleDailyProverbNotification();
      } catch (error) {
        console.error("Failed to request notification permissions:", error);
        setEnabled(false);
        await setNotificationsEnabled(false);
      }
    } else {
      try {
        console.debug("Cancelling all scheduled notifications...");
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (error) {
        console.error("Failed to cancel notifications:", error);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Notifications" }} />
      <ScrollView style={styles.container}>
        <View style={styles.settingItem}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              Enable daily proverb meditation notifications
            </Text>
          </View>
          {!loading && (
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: "#d3d3d3", true: "#007AFF" }}
              thumbColor={enabled ? "#007AFF" : "#f4f3f4"}
            />
          )}
        </View>
        <Text style={styles.description}>
          Receive a daily reminder notification to meditate on today&apos;s
          proverb.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F4FE",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
