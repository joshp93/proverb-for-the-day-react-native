import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ConfirmSignUp from "../../app/confirm-sign-up";
import { verifyAccount } from "../../src/api/auth";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("../../src/api/auth", () => ({
  verifyAccount: jest.fn(),
}));

const mockVerifyAccount = verifyAccount as jest.MockedFunction<
  typeof verifyAccount
>;

describe("ConfirmSignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render email and code inputs", () => {
    const { getByPlaceholderText } = render(<ConfirmSignUp />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Verification Code")).toBeTruthy();
  });

  it("should show validation error for empty email", async () => {
    const { getByPlaceholderText, getByText } = render(<ConfirmSignUp />);
    const emailInput = getByPlaceholderText("Email");

    fireEvent(emailInput, "blur");

    await waitFor(() => {
      expect(getByText("Email is required")).toBeTruthy();
    });
  });

  it("should show validation error for empty code", async () => {
    const { getByPlaceholderText, getByText } = render(<ConfirmSignUp />);
    const codeInput = getByPlaceholderText("Verification Code");

    fireEvent(codeInput, "blur");

    await waitFor(() => {
      expect(getByText("Verification code is required")).toBeTruthy();
    });
  });

  it("should show validation error for invalid code length", async () => {
    const { getByPlaceholderText, getByText } = render(<ConfirmSignUp />);
    const codeInput = getByPlaceholderText("Verification Code");

    fireEvent.changeText(codeInput, "123");
    fireEvent(codeInput, "blur");

    await waitFor(() => {
      expect(getByText("Please enter the 6-digit code")).toBeTruthy();
    });
  });

  it("should verify account successfully", async () => {
    mockVerifyAccount.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByText } = render(<ConfirmSignUp />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Verification Code"), "123456");

    fireEvent.press(getByText("Verify"));

    await waitFor(() => {
      expect(mockVerifyAccount).toHaveBeenCalledWith(
        "test@example.com",
        "123456",
      );
    });

    await waitFor(() => {
      expect(getByText("Your email has been verified. You can now sign in.")).toBeTruthy();
    });
  });

  it("should navigate to sign in on success", async () => {
    mockVerifyAccount.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getByText } = render(<ConfirmSignUp />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Verification Code"), "123456");

    fireEvent.press(getByText("Verify"));

    await waitFor(() => {
      expect(getByText("Your email has been verified. You can now sign in.")).toBeTruthy();
    });
  });

  it("should show error message on verification failure", async () => {
    mockVerifyAccount.mockResolvedValueOnce({
      success: false,
      message: "Invalid verification code",
    });

    const { getByPlaceholderText, getByText } = render(<ConfirmSignUp />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Verification Code"), "000000");

    fireEvent.press(getByText("Verify"));

    await waitFor(() => {
      expect(getByText("Invalid verification code")).toBeTruthy();
    });
  });
});