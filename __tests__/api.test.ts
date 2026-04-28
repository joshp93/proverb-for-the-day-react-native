import { getProverbForTheDay } from "../app/_api/proverbs";

global.fetch = jest.fn();

describe("getProverbForTheDay", () => {
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and parse a valid proverb response", async () => {
    const mockProverb = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD with all your heart",
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProverb),
    } as Response);

    const result = await getProverbForTheDay();

    expect(result).toEqual(mockProverb);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should throw an error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(getProverbForTheDay()).rejects.toThrow("Network error");
  });

  it("should throw an error on invalid response data", async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ invalid: "data" }),
    } as Response);

    await expect(getProverbForTheDay()).rejects.toThrow();
  });

  it("should use the correct API endpoint", async () => {
    const mockProverb = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD",
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockProverb),
    } as Response);

    await getProverbForTheDay();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          "8ndcvtnwf1.execute-api.eu-west-2.amazonaws.com",
        ),
      }),
    );
  });
});
