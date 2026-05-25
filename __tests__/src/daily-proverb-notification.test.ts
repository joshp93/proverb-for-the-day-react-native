import * as Notifications from "expo-notifications";
import { getProverbForTheDay } from "../../src/api/proverbs";
import { getChosenVersion } from "../../src/api/version-storage";
import {
  initializeNotifications,
  scheduleDailyProverbNotification,
} from "../../src/notifications/daily-proverb-notification";

jest.mock("expo-notifications", () => ({
  SchedulableTriggerInputTypes: {
    DATE: "date",
  },
  AndroidImportance: {
    HIGH: 4,
  },
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock("../../src/api/version-storage", () => ({
  getChosenVersion: jest.fn(),
}));

jest.mock("../../src/api/proverbs", () => ({
  getProverbForTheDay: jest.fn(),
}));

describe("initializeNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set notification handler with handleNotification callback", () => {
    initializeNotifications();

    const handlerArg = (Notifications.setNotificationHandler as jest.Mock).mock
      .calls[0][0];
    expect(handlerArg).toHaveProperty("handleNotification");
    expect(typeof handlerArg.handleNotification).toBe("function");
  });
});

describe("scheduleDailyProverbNotification", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should request notification permissions", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  it("should create the Android notification channel", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
      "daily-proverb",
      {
        name: "Daily Proverb",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#E6F4FE",
      },
    );
  });

  it("should fetch the proverb using the stored version", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("esv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    expect(getChosenVersion).toHaveBeenCalledTimes(1);
    expect(getProverbForTheDay).toHaveBeenCalledWith("esv");
  });

  it("should default to NIV when no version is stored", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce(null);
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    expect(getProverbForTheDay).toHaveBeenCalledWith("niv");
  });

  it("should cancel existing scheduled notifications before scheduling", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    expect(
      Notifications.cancelAllScheduledNotificationsAsync,
    ).toHaveBeenCalledTimes(1);
  });

  it("should schedule a notification for tomorrow at a random time", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      identifier: "daily-proverb-meditation",
      content: {
        title: "Daily Proverb Meditation",
        body: 'Tap to begin meditation on "Trust in the LORD"',
        data: { proverb: "Trust in the LORD", ref: "Proverbs 3:5" },
      },
      trigger: {
        type: "date",
        date: expect.any(Date),
      },
    });
  });

  it("should schedule for tomorrow (not today)", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    await scheduleDailyProverbNotification();

    const scheduledDate = (Notifications.scheduleNotificationAsync as jest.Mock)
      .mock.calls[0][0].trigger.date;
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(scheduledDate.getDate()).toBe(tomorrow.getDate());
    expect(scheduledDate.getMonth()).toBe(tomorrow.getMonth());
    expect(scheduledDate.getFullYear()).toBe(tomorrow.getFullYear());
  });

  it("should pick a random time within 9am-7pm", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    });
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (
      Notifications.scheduleNotificationAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);

    jest.spyOn(Math, "random").mockRestore();

    for (let i = 0; i < 20; i++) {
      jest.clearAllMocks();
      (
        Notifications.requestPermissionsAsync as jest.Mock
      ).mockResolvedValueOnce({});
      (
        Notifications.setNotificationChannelAsync as jest.Mock
      ).mockResolvedValueOnce(undefined);
      (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
      (getProverbForTheDay as jest.Mock).mockResolvedValueOnce({
        ref: "Proverbs 3:5",
        proverb: "Trust in the LORD",
      });
      (
        Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
      ).mockResolvedValueOnce(undefined);
      (
        Notifications.scheduleNotificationAsync as jest.Mock
      ).mockResolvedValueOnce(undefined);

      await scheduleDailyProverbNotification();

      const scheduledDate = (
        Notifications.scheduleNotificationAsync as jest.Mock
      ).mock.calls[0][0].trigger.date;
      const hour = scheduledDate.getHours();
      const minute = scheduledDate.getMinutes();

      expect(hour).toBeGreaterThanOrEqual(9);
      expect(hour).toBeLessThanOrEqual(19);
      if (hour === 19) {
        expect(minute).toBe(0);
      }
    }
  });

  it("should log an error if fetching the proverb fails", async () => {
    (getProverbForTheDay as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error("API error")),
    );
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({});
    (Notifications.setNotificationChannelAsync as jest.Mock).mockResolvedValue(
      undefined,
    );
    (getChosenVersion as jest.Mock).mockResolvedValue("niv");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await scheduleDailyProverbNotification();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to schedule daily proverb notification:",
      expect.any(Error),
    );
  });

  it("should log an error if accessing the result fails", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce(
      {},
    );
    (
      Notifications.setNotificationChannelAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    (getChosenVersion as jest.Mock).mockResolvedValueOnce("niv");
    (getProverbForTheDay as jest.Mock).mockResolvedValueOnce(undefined);
    (
      Notifications.cancelAllScheduledNotificationsAsync as jest.Mock
    ).mockResolvedValueOnce(undefined);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await scheduleDailyProverbNotification();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to schedule daily proverb notification:",
      expect.any(Error),
    );
  });
});
