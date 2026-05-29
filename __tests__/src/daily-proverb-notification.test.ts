import * as Notifications from "expo-notifications";
import {
  getNotificationMode,
  getNotificationsEnabled,
  getRandomWindowEnd,
  getRandomWindowEndMinute,
  getRandomWindowStart,
  getRandomWindowStartMinute,
  getScheduledTimeHour,
  getScheduledTimeMinute,
} from "../../src/notifications/notification-preferences";
import {
  cleanupNotifications,
  getRandomTimeInWindow,
  initializeNotifications,
  resolveScheduleDate,
  scheduleProverbNotification,
  sendProverbNotification,
} from "../../src/notifications/daily-proverb-notification";
import type { Proverb } from "../../src/models/proverb";

jest.mock("expo-notifications", () => ({
  SchedulableTriggerInputTypes: {
    DATE: "date",
    TIME_INTERVAL: "timeInterval",
  },
  AndroidImportance: {
    HIGH: "high",
  },
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationCategoryAsync: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  dismissNotificationAsync: jest.fn(),
}));

jest.mock("../../src/notifications/notification-preferences");

const mockGetNotificationsEnabled =
  getNotificationsEnabled as jest.MockedFunction<
    typeof getNotificationsEnabled
  >;
const mockGetNotificationMode = getNotificationMode as jest.MockedFunction<
  typeof getNotificationMode
>;
const mockGetRandomWindowStart =
  getRandomWindowStart as jest.MockedFunction<
    typeof getRandomWindowStart
  >;
const mockGetRandomWindowEnd = getRandomWindowEnd as jest.MockedFunction<
  typeof getRandomWindowEnd
>;
const mockGetRandomWindowStartMinute =
  getRandomWindowStartMinute as jest.MockedFunction<
    typeof getRandomWindowStartMinute
  >;
const mockGetRandomWindowEndMinute =
  getRandomWindowEndMinute as jest.MockedFunction<
    typeof getRandomWindowEndMinute
  >;
const mockGetScheduledTimeHour =
  getScheduledTimeHour as jest.MockedFunction<
    typeof getScheduledTimeHour
  >;
const mockGetScheduledTimeMinute =
  getScheduledTimeMinute as jest.MockedFunction<
    typeof getScheduledTimeMinute
  >;

const mockProverb: Proverb = {
  ref: "Proverbs 3:5",
  proverb: "Trust in the LORD",
};

  describe("Notification Functions", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockGetRandomWindowStartMinute.mockResolvedValue(0);
      mockGetRandomWindowEndMinute.mockResolvedValue(0);
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });
    });

    afterEach(() => {
      cleanupNotifications();
    });

  describe("initializeNotifications", () => {
    it("should set notification handler", () => {
      initializeNotifications();
      expect(Notifications.setNotificationHandler).toHaveBeenCalled();
    });

    it("should create snooze category", () => {
      initializeNotifications();
      expect(
        Notifications.setNotificationCategoryAsync,
      ).toHaveBeenCalledWith("proverb-meditation", [
        expect.objectContaining({
          identifier: "snooze",
          buttonTitle: "Snooze 10 min",
        }),
      ]);
    });

    it("should set up snooze response listener", () => {
      initializeNotifications();
      expect(
        Notifications.addNotificationResponseReceivedListener,
      ).toHaveBeenCalled();
    });

    it("should not set up duplicate listener", () => {
      const mockAdd = Notifications
        .addNotificationResponseReceivedListener as jest.Mock;
      initializeNotifications();
      initializeNotifications();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe("cleanupNotifications", () => {
    it("should remove the snooze listener", () => {
      const mockRemove = jest.fn();
      (
        Notifications
          .addNotificationResponseReceivedListener as jest.Mock
      ).mockReturnValueOnce({ remove: mockRemove });

      initializeNotifications();
      cleanupNotifications();

      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe("sendProverbNotification", () => {
    it("should send a notification immediately (null trigger)", async () => {
      await sendProverbNotification(mockProverb);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: null,
        }),
      );
    });
  });

  describe("getRandomTimeInWindow", () => {
    it("returns a time within the given window", () => {
      const baseDate = new Date("2026-05-29T00:00:00");
      jest.spyOn(Math, "random").mockReturnValue(0.5);
      const result = getRandomTimeInWindow(baseDate, 9, 0, 19, 0);
      const minutes =
        (result.getHours() - baseDate.getHours()) * 60 + result.getMinutes();
      expect(minutes).toBeGreaterThanOrEqual(9 * 60);
      expect(minutes).toBeLessThan(19 * 60);
      jest.restoreAllMocks();
    });

    it("respects Math.random for min and max", () => {
      const baseDate = new Date("2026-05-29T00:00:00");

      jest.spyOn(Math, "random").mockReturnValue(0);
      const minResult = getRandomTimeInWindow(baseDate, 9, 0, 19, 0);
      expect(minResult.getHours()).toBe(9);
      expect(minResult.getMinutes()).toBe(0);

      jest.spyOn(Math, "random").mockReturnValue(0.9999);
      const maxResult = getRandomTimeInWindow(baseDate, 9, 0, 19, 0);
      expect(maxResult.getHours()).toBeLessThan(19);

      jest.restoreAllMocks();
    });
  });

  describe("resolveScheduleDate", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("returns today when the time has not passed yet", () => {
      jest.setSystemTime(new Date("2026-05-29T10:00:00"));
      const result = resolveScheduleDate(14, 30);
      expect(result.getDate()).toBe(29);
      expect(result.getMonth()).toBe(4);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it("returns tomorrow when the time has already passed", () => {
      jest.setSystemTime(new Date("2026-05-29T15:00:00"));
      const result = resolveScheduleDate(14, 30);
      expect(result.getDate()).toBe(30);
      expect(result.getMonth()).toBe(4);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it("returns tomorrow when the time is exactly now", () => {
      jest.setSystemTime(new Date("2026-05-29T14:30:00"));
      const result = resolveScheduleDate(14, 30);
      expect(result.getDate()).toBe(30);
    });

    it("handles month boundary (May 31 to June 1)", () => {
      jest.setSystemTime(new Date("2026-05-31T23:00:00"));
      const result = resolveScheduleDate(9, 0);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(5);
      expect(result.getFullYear()).toBe(2026);
    });

    it("handles year boundary (Dec 31 to Jan 1)", () => {
      jest.setSystemTime(new Date("2026-12-31T23:00:00"));
      const result = resolveScheduleDate(9, 0);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2027);
    });
  });

  describe("scheduleProverbNotification", () => {
    beforeEach(() => {
      mockGetNotificationsEnabled.mockResolvedValue(true);
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-29T10:00:00"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("does nothing when notifications are disabled", async () => {
      mockGetNotificationsEnabled.mockResolvedValue(false);
      await scheduleProverbNotification(mockProverb);
      expect(
        Notifications.scheduleNotificationAsync,
      ).not.toHaveBeenCalled();
    });

    it("schedules with a random time in the configured window", async () => {
      jest.spyOn(Math, "random").mockReturnValue(0.5);
      mockGetNotificationMode.mockResolvedValue("random");
      mockGetRandomWindowStart.mockResolvedValue(12);
      mockGetRandomWindowEnd.mockResolvedValue(14);

      await scheduleProverbNotification(mockProverb);

      const call = (
        Notifications.scheduleNotificationAsync as jest.Mock
      ).mock.calls[0][0];
      const scheduledDate: Date = call.trigger.date;
      expect(scheduledDate.getFullYear()).toBe(2026);
      expect(scheduledDate.getMonth()).toBe(4);
      expect(scheduledDate.getDate()).toBe(29);
      expect(scheduledDate.getHours()).toBeGreaterThanOrEqual(12);
      expect(scheduledDate.getHours()).toBeLessThan(14);
      jest.restoreAllMocks();
    });

    it("schedules at the exact configured time in scheduled mode", async () => {
      mockGetNotificationMode.mockResolvedValue("scheduled");
      mockGetScheduledTimeHour.mockResolvedValue(14);
      mockGetScheduledTimeMinute.mockResolvedValue(30);

      await scheduleProverbNotification(mockProverb);

      const call = (
        Notifications.scheduleNotificationAsync as jest.Mock
      ).mock.calls[0][0];
      const scheduledDate: Date = call.trigger.date;
      expect(scheduledDate.getHours()).toBe(14);
      expect(scheduledDate.getMinutes()).toBe(30);
      expect(scheduledDate.getDate()).toBe(29);
    });

    it("schedules for tomorrow when the scheduled time has passed today", async () => {
      mockGetNotificationMode.mockResolvedValue("scheduled");
      mockGetScheduledTimeHour.mockResolvedValue(9);
      mockGetScheduledTimeMinute.mockResolvedValue(0);

      await scheduleProverbNotification(mockProverb);

      const call = (
        Notifications.scheduleNotificationAsync as jest.Mock
      ).mock.calls[0][0];
      const scheduledDate: Date = call.trigger.date;
      expect(scheduledDate.getDate()).toBe(30);
    });
  });
});
