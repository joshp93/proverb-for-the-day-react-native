import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Proverb } from "../models/proverb";

const NOTIFICATION_ID = "daily-proverb-meditation";
const WINDOW_START_HOUR = 9;
const WINDOW_END_HOUR = 19;

// Helper to generate notification content
const _createNotificationContent = (proverb: Proverb) => ({
  title: "Daily Proverb Meditation",
  body: `Tap to begin meditation on "${proverb.ref}"`,
  data: { proverb: proverb.proverb, ref: proverb.ref },
});

// Helper to create the Android channel (safe to call multiple times)
const _createAndroidChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-proverb", {
      name: "Daily Proverb",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E6F4FE",
    });
  }
};

// Generic internal scheduler
const _scheduleNotification = async (
  proverb: Proverb,
  trigger: Notifications.NotificationTriggerInput,
) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permissions not granted.");
    return;
  }

  await _createAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: _createNotificationContent(proverb),
    trigger,
  });
};

const getRandomTimeInWindow = (date: Date): Date => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const windowStartMinutes = WINDOW_START_HOUR * 60;
  const windowEndMinutes = WINDOW_END_HOUR * 60;
  const randomMinutes =
    windowStartMinutes +
    Math.floor(Math.random() * (windowEndMinutes - windowStartMinutes));
  const randomDate = new Date(startOfDay.getTime() + randomMinutes * 60000);
  console.debug("Scheduled notification for:", randomDate.toISOString());
  return randomDate;
};

// --- Public API ---

export const initializeNotifications = () => {
  console.debug("Initializing notifications...");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

export const sendProverbNotification = async (proverb: Proverb) => {
  try {
    await _scheduleNotification(proverb, null); // null trigger sends immediately
  } catch (error) {
    console.error("Failed to send daily proverb notification:", error);
  }
};

export const scheduleProverbNotification = async (proverb: Proverb) => {
  try {
    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: getRandomTimeInWindow(new Date()),
    };
    await _scheduleNotification(proverb, trigger);
  } catch (error) {
    console.error("Failed to schedule daily proverb notification:", error);
  }
};

export const scheduleNextDayProverbNotification = async (proverb: Proverb) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: getRandomTimeInWindow(tomorrow),
    };
    await _scheduleNotification(proverb, trigger);
  } catch (error) {
    console.error("Failed to schedule next day proverb notification:", error);
  }
};
