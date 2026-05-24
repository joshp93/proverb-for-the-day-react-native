import AsyncStorage from "@react-native-async-storage/async-storage";

const CHOSEN_VERSION_KEY = "chosenVersion";

export const getChosenVersion = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(CHOSEN_VERSION_KEY);
  } catch (error) {
    console.error("Error reading chosenVersion:", error);
    return null;
  }
};

export const saveChosenVersion = async (version: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(CHOSEN_VERSION_KEY, version);
  } catch (error) {
    console.error("Error saving chosenVersion:", error);
  }
};

export const removeChosenVersion = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CHOSEN_VERSION_KEY);
  } catch (error) {
    console.error("Error removing chosenVersion:", error);
  }
};
