import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import NotificationsSettings from "../../app/notifications";
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
  scheduleProverbNotification,
  sendProverbNotification,
} from "../../src/notifications/daily-proverb-notification";
import { getProverbForTheDay } from "../../src/api/proverbs";
import { getChosenVersion } from "../../src/api/version-storage";

jest.mock("expo-router", () => ({
  useRouter: () => ({}),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("expo-notifications");

jest.mock("../../src/notifications/notification-preferences");
jest.mock("../../src/notifications/daily-proverb-notification");
jest.mock("../../src/api/proverbs");
jest.mock("../../src/api/version-storage");
jest.mock("@react-native-community/datetimepicker", () => "DateTimePicker");

jest.mock("../../src/utils/battery-optimization", () => ({
  openBatteryOptimizationSettings: jest.fn(),
  getBatteryOptimizationWarningText: jest.fn(
    () => "To ensure timely notifications...",
  ),
}));

const mockGetNotificationsEnabled =
  getNotificationsEnabled as jest.MockedFunction<
    typeof getNotificationsEnabled
  >;
const mockGetNotificationMode =
  getNotificationMode as jest.MockedFunction<
    typeof getNotificationMode
  >;
const mockGetRandomWindowStart =
  getRandomWindowStart as jest.MockedFunction<
    typeof getRandomWindowStart
  >;
const mockGetRandomWindowEnd =
  getRandomWindowEnd as jest.MockedFunction<
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
const mockScheduleProverbNotification =
  scheduleProverbNotification as jest.MockedFunction<
    typeof scheduleProverbNotification
  >;
const mockSendProverbNotification =
  sendProverbNotification as jest.MockedFunction<
    typeof sendProverbNotification
  >;
const mockGetProverbForTheDay =
  getProverbForTheDay as jest.MockedFunction<
    typeof getProverbForTheDay
  >;
const mockGetChosenVersion = getChosenVersion as jest.MockedFunction<
  typeof getChosenVersion
>;

describe("NotificationsSettings", () => {
  const mockProverb = {
    ref: "Proverbs 3:5",
    proverb: "Trust in the LORD",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetNotificationsEnabled.mockResolvedValue(false);
    mockGetNotificationMode.mockResolvedValue("random");
    mockGetRandomWindowStart.mockResolvedValue(9);
    mockGetRandomWindowStartMinute.mockResolvedValue(0);
    mockGetRandomWindowEnd.mockResolvedValue(19);
    mockGetRandomWindowEndMinute.mockResolvedValue(0);
    mockGetScheduledTimeHour.mockResolvedValue(8);
    mockGetScheduledTimeMinute.mockResolvedValue(0);
    mockScheduleProverbNotification.mockResolvedValue(undefined);
    mockSendProverbNotification.mockResolvedValue(undefined);
    mockGetProverbForTheDay.mockResolvedValue(mockProverb);
    mockGetChosenVersion.mockResolvedValue("niv");
  });

  it("schedules a notification when toggled on", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "granted",
    });

    const { UNSAFE_getByType } = render(<NotificationsSettings />);

    let switches: any;
    await waitFor(() => {
      switches = UNSAFE_getByType(require("react-native").Switch);
    });

    fireEvent(switches, "valueChange", true);

    await waitFor(() => {
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(mockScheduleProverbNotification).toHaveBeenCalledWith(
        mockProverb,
      );
    });
  });

  it("shows expandable sections when enabled", async () => {
    mockGetNotificationsEnabled.mockResolvedValue(true);

    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(getByText("Send at a random time")).toBeTruthy();
      expect(getByText("Send at a specific time")).toBeTruthy();
    });
  });

  it("does not show expandable sections when disabled", async () => {
    const { queryByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(queryByText("Send at a random time")).toBeNull();
      expect(queryByText("Send at a specific time")).toBeNull();
    });
  });

  it("shows random time picker buttons when random mode is selected", async () => {
    mockGetNotificationsEnabled.mockResolvedValue(true);
    mockGetNotificationMode.mockResolvedValue("random");

    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(getByText("09:00")).toBeTruthy();
      expect(getByText("19:00")).toBeTruthy();
    });
  });

  it("shows scheduled time picker buttons when scheduled mode is selected", async () => {
    mockGetNotificationsEnabled.mockResolvedValue(true);
    mockGetNotificationMode.mockResolvedValue("scheduled");
    mockGetScheduledTimeHour.mockResolvedValue(14);
    mockGetScheduledTimeMinute.mockResolvedValue(30);

    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(getByText("14:30")).toBeTruthy();
    });
  });

  it("shows 24-hour format note when enabled", async () => {
    mockGetNotificationsEnabled.mockResolvedValue(true);

    const { getAllByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      const notes = getAllByText("Times are in 24-hour format");
      expect(notes.length).toBe(2);
    });
  });

  it("sends an example notification when button pressed", async () => {
    mockGetNotificationsEnabled.mockResolvedValue(true);
    const { getByText } = render(<NotificationsSettings />);

    const sendButton = await waitFor(() => getByText("Send example notification"));
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockSendProverbNotification).toHaveBeenCalled();
    });
  });

  it("shows battery optimization info when enabled", async () => {
    mockGetNotificationsEnabled.mockResolvedValue(true);

    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(getByText("To ensure timely notifications...")).toBeTruthy();
    });
  });
});
