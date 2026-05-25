import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import NotificationsSettings from "../../app/notifications";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "../../src/notifications/notification-preferences";
import { scheduleDailyProverbNotification } from "../../src/notifications/daily-proverb-notification";

jest.mock("expo-router", () => ({
  useRouter: () => ({}),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("expo-notifications");

jest.mock(
  "../../src/notifications/notification-preferences",
);

jest.mock(
  "../../src/notifications/daily-proverb-notification",
);

const mockGetNotificationsEnabled = getNotificationsEnabled as jest.MockedFunction<
  typeof getNotificationsEnabled
>;
const mockSetNotificationsEnabled = setNotificationsEnabled as jest.MockedFunction<
  typeof setNotificationsEnabled
>;
const mockScheduleDailyProverbNotification = scheduleDailyProverbNotification as jest.MockedFunction<
  typeof scheduleDailyProverbNotification
>;

describe("NotificationsSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetNotificationsEnabled.mockResolvedValue(false);
    mockSetNotificationsEnabled.mockResolvedValue(undefined);
    mockScheduleDailyProverbNotification.mockResolvedValue(undefined);
  });

  it("should render toggle and label", async () => {
    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(
        getByText("Enable daily proverb meditation notifications"),
      ).toBeTruthy();
    });
  });

  it("should load and display saved preference as enabled", async () => {
    mockGetNotificationsEnabled.mockResolvedValueOnce(true);

    const { UNSAFE_getByType } = render(<NotificationsSettings />);

    await waitFor(() => {
      const switches = UNSAFE_getByType(require("react-native").Switch);
      expect(switches.props.value).toBe(true);
    });
  });

  it("should load and display saved preference as disabled", async () => {
    mockGetNotificationsEnabled.mockResolvedValueOnce(false);

    const { UNSAFE_getByType } = render(<NotificationsSettings />);

    await waitFor(() => {
      const switches = UNSAFE_getByType(require("react-native").Switch);
      expect(switches.props.value).toBe(false);
    });
  });

  it("should enable notifications when toggle is turned on", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "granted",
    });

    const { UNSAFE_getByType } = render(<NotificationsSettings />);

    await waitFor(() => {
      const switches = UNSAFE_getByType(require("react-native").Switch);
      fireEvent(switches, "valueChange", true);
    });

    await waitFor(() => {
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(mockScheduleDailyProverbNotification).toHaveBeenCalled();
      expect(mockSetNotificationsEnabled).toHaveBeenCalledWith(true);
    });
  });

  it("should disable notifications when toggle is turned off", async () => {
    mockGetNotificationsEnabled.mockResolvedValueOnce(true);
    (Notifications.cancelAllScheduledNotificationsAsync as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const { UNSAFE_getByType } = render(<NotificationsSettings />);

    await waitFor(() => {
      const switches = UNSAFE_getByType(require("react-native").Switch);
      fireEvent(switches, "valueChange", false);
    });

    await waitFor(() => {
      expect(
        Notifications.cancelAllScheduledNotificationsAsync,
      ).toHaveBeenCalled();
      expect(mockSetNotificationsEnabled).toHaveBeenCalledWith(false);
    });
  });

  it("should show permission denied message when permission is not granted", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: "denied",
    });

    const { UNSAFE_getByType } = render(<NotificationsSettings />);

    await waitFor(() => {
      const switches = UNSAFE_getByType(require("react-native").Switch);
      fireEvent(switches, "valueChange", true);
    });

    await waitFor(() => {
      expect(mockSetNotificationsEnabled).toHaveBeenCalledWith(false);
    });
  });

  it("should display descriptive text when enabled", async () => {
    mockGetNotificationsEnabled.mockResolvedValueOnce(true);

    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(
        getByText(/You will receive daily proverb meditation notifications/),
      ).toBeTruthy();
    });
  });

  it("should display descriptive text when disabled", async () => {
    const { getByText } = render(<NotificationsSettings />);

    await waitFor(() => {
      expect(
        getByText(/Daily proverb meditation notifications are disabled/),
      ).toBeTruthy();
    });
  });
});
