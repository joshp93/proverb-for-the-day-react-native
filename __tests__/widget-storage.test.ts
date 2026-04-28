import AsyncStorage from "@react-native-async-storage/async-storage";
import { Proverb } from "../app/_models/proverb";
import {
  clearWidgetStorage,
  getProverbFromWidget,
  getWidgetLastUpdate,
  isProverbStale,
  saveProverbForWidget,
} from "../app/_services/widget-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const mockProverb: Proverb = {
  proverb: "A wise man knows himself to be a fool",
  ref: "Proverbs 12:15",
};

describe("Widget Storage Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("saveProverbForWidget", () => {
    it("should save proverb and timestamp to storage", async () => {
      const mockSetItem = jest.fn().mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock) = mockSetItem;

      await saveProverbForWidget(mockProverb);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "widget_proverb_current",
        JSON.stringify(mockProverb)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "widget_last_update",
        expect.any(String)
      );
    });

    it("should throw error if save fails", async () => {
      const mockSetItem = jest.fn().mockRejectedValue(new Error("Storage failed"));
      (AsyncStorage.setItem as jest.Mock) = mockSetItem;

      await expect(saveProverbForWidget(mockProverb)).rejects.toThrow(
        "Storage failed"
      );
    });
  });

  describe("getProverbFromWidget", () => {
    it("should retrieve proverb from storage", async () => {
      const mockGetItem = jest
        .fn()
        .mockResolvedValue(JSON.stringify(mockProverb));
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await getProverbFromWidget();

      expect(result).toEqual(mockProverb);
    });

    it("should return null if no proverb is stored", async () => {
      const mockGetItem = jest.fn().mockResolvedValue(null);
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await getProverbFromWidget();

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      const mockGetItem = jest.fn().mockRejectedValue(new Error("Read failed"));
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await getProverbFromWidget();

      expect(result).toBeNull();
    });
  });

  describe("getWidgetLastUpdate", () => {
    it("should retrieve last update timestamp", async () => {
      const now = new Date().toISOString();
      const mockGetItem = jest.fn().mockResolvedValue(now);
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await getWidgetLastUpdate();

      expect(result).toEqual(new Date(now));
    });

    it("should return null if no timestamp exists", async () => {
      const mockGetItem = jest.fn().mockResolvedValue(null);
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await getWidgetLastUpdate();

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      const mockGetItem = jest.fn().mockRejectedValue(new Error("Read failed"));
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await getWidgetLastUpdate();

      expect(result).toBeNull();
    });
  });

  describe("isProverbStale", () => {
    it("should return true if proverb is older than 24 hours", async () => {
      const pastDate = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      const mockGetItem = jest.fn().mockResolvedValue(pastDate);
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await isProverbStale();

      expect(result).toBe(true);
    });

    it("should return false if proverb is less than 24 hours old", async () => {
      const recentDate = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
      const mockGetItem = jest.fn().mockResolvedValue(recentDate);
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await isProverbStale();

      expect(result).toBe(false);
    });

    it("should return true if no timestamp exists", async () => {
      const mockGetItem = jest.fn().mockResolvedValue(null);
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await isProverbStale();

      expect(result).toBe(true);
    });

    it("should return true on error", async () => {
      const mockGetItem = jest.fn().mockRejectedValue(new Error("Read failed"));
      (AsyncStorage.getItem as jest.Mock) = mockGetItem;

      const result = await isProverbStale();

      expect(result).toBe(true);
    });
  });

  describe("clearWidgetStorage", () => {
    it("should remove both proverb and timestamp", async () => {
      const mockRemoveItem = jest.fn().mockResolvedValue(null);
      (AsyncStorage.removeItem as jest.Mock) = mockRemoveItem;

      await clearWidgetStorage();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("widget_proverb_current");
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("widget_last_update");
    });

    it("should throw error if removal fails", async () => {
      const mockRemoveItem = jest
        .fn()
        .mockRejectedValue(new Error("Storage failed"));
      (AsyncStorage.removeItem as jest.Mock) = mockRemoveItem;

      await expect(clearWidgetStorage()).rejects.toThrow("Storage failed");
    });
  });
});