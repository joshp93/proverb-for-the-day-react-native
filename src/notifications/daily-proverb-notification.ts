import * as Notifications from "expo-notifications";
import { getProverbForTheDay } from "../api/proverbs";
import { getChosenVersion } from "../api/version-storage";

const NOTIFICATION_ID = "daily-proverb-meditation";

const WINDOW_START_HOUR = 9;
const WINDOW_END_HOUR = 19;

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

const createAndroidChannel = async () => {
  await Notifications.setNotificationChannelAsync("daily-proverb", {
    name: "Daily Proverb",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#E6F4FE",
  });
};

const getRandomTimeInWindow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfDay = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
  );

  const windowStartMinutes = WINDOW_START_HOUR * 60;
  const windowEndMinutes = WINDOW_END_HOUR * 60;
  const randomMinutes =
    windowStartMinutes +
    Math.floor(Math.random() * (windowEndMinutes - windowStartMinutes));

  const randomDate = new Date(startOfDay.getTime() + randomMinutes * 60 * 1000);
  console.debug("Scheduled notification for:", randomDate);
  return randomDate;
};

export const scheduleDailyProverbNotification = async () => {
  try {
    console.debug("Scheduling daily proverb notification...");
    await Notifications.requestPermissionsAsync();

    await createAndroidChannel();
    const storedVersion = await getChosenVersion();
    const version = storedVersion || "niv";
    const proverb = await getProverbForTheDay(version);

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "Daily Proverb Meditation",
        body: `Tap to begin meditation on "${proverb.proverb}"`,
        data: { proverb: proverb.proverb, ref: proverb.ref },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: getRandomTimeInWindow(),
      },
    });
  } catch (error) {
    console.error("Failed to schedule daily proverb notification:", error);
  }
};
