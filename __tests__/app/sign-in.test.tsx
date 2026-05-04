import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SignIn from "../../app/sign-in";
import { signIn as apiSignIn } from "../../src/api/auth";

const mockRefreshUser = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("../../src/auth/auth-context", () => ({
  useAuth: () => ({
    refreshUser: mockRefreshUser,
  }),
}));

jest.mock("../../src/api/auth", () => ({
  signIn: jest.fn(),
}));

const mockSignIn = apiSignIn as jest.MockedFunction<typeof apiSignIn>;

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render email and password inputs", () => {
    const { getByPlaceholderText } = render(<SignIn />);
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  it("should show validation errors for empty fields", async () => {
    const { getAllByText } = render(<SignIn />);

    const signInButtons = getAllByText("Sign In");
    fireEvent.press(signInButtons[1]);

    await waitFor(() => {
      expect(getAllByText("Email is required").length).toBeGreaterThan(0);
    });
  });

  it("should show validation error for invalid email", async () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    const emailInput = getByPlaceholderText("Email");

    fireEvent(emailInput, "focus");
    fireEvent(emailInput, "changeText", "not-an-email");
    fireEvent(emailInput, "blur");

    await waitFor(() => {
      expect(getByText("Please enter a valid email address")).toBeTruthy();
    });
  });

  it("should sign in successfully", async () => {
    mockSignIn.mockResolvedValueOnce({ success: true });

    const { getByPlaceholderText, getAllByText } = render(<SignIn />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    const signInButtons = getAllByText("Sign In");
    fireEvent.press(signInButtons[1]);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });

    expect(mockRefreshUser).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("should show error message on sign in failure", async () => {
    mockSignIn.mockResolvedValueOnce({
      success: false,
      message: "Incorrect password",
    });

    const { getByPlaceholderText, getAllByText, getByText } = render(
      <SignIn />,
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpassword");

    const signInButtons = getAllByText("Sign In");
    fireEvent.press(signInButtons[1]);

    await waitFor(() => {
      expect(getByText("Incorrect password")).toBeTruthy();
    });
  });

  it("should toggle password visibility", () => {
    const { getByText } = render(<SignIn />);

    expect(getByText("Show")).toBeTruthy();

    fireEvent.press(getByText("Show"));

    expect(getByText("Hide")).toBeTruthy();
  });
});
