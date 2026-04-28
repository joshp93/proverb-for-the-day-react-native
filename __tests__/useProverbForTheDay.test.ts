import { renderHook, waitFor } from "@testing-library/react-native";
import { useProverbForTheDay } from "../app/_hooks/useProverbForTheDay";

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("useProverbForTheDay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start with loading state", () => {
    mockFetch.mockImplementation(
      () => new Promise(() => {}) as Promise<Response>,
    );

    const { result } = renderHook(() => useProverbForTheDay());

    expect(result.current.loading).toBe(true);
    expect(result.current.proverb).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should set proverb on successful fetch", async () => {
    const mockProverb = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD with all your heart",
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProverb),
    } as Response);

    const { result } = renderHook(() => useProverbForTheDay());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.proverb).toEqual(mockProverb);
    expect(result.current.error).toBeNull();
  });

  it("should set error on failed fetch", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useProverbForTheDay());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.proverb).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it("should not refetch on re-render", async () => {
    const mockProverb = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProverb),
    } as Response);

    const { result, rerender } = renderHook(() => useProverbForTheDay());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    rerender(() => {});

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
