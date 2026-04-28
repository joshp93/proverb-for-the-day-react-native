import AsyncStorage from '@react-native-async-storage/async-storage';
import { Proverb } from '../_models/proverb';

const WIDGET_PROVERB_KEY = 'widget_proverb_current';
const WIDGET_LAST_UPDATE_KEY = 'widget_last_update';

/**
 * Stores the current proverb in async storage for the widget to access
 */
export const saveProverbForWidget = async (proverb: Proverb): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(WIDGET_PROVERB_KEY, JSON.stringify(proverb)),
      AsyncStorage.setItem(WIDGET_LAST_UPDATE_KEY, new Date().toISOString()),
    ]);
  } catch (error) {
    console.error('Error saving proverb to widget storage:', error);
    throw error;
  }
};

/**
 * Retrieves the stored proverb from widget storage
 */
export const getProverbFromWidget = async (): Promise<Proverb | null> => {
  try {
    const stored = await AsyncStorage.getItem(WIDGET_PROVERB_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving proverb from widget storage:', error);
    return null;
  }
};

/**
 * Gets the timestamp of the last widget update
 */
export const getWidgetLastUpdate = async (): Promise<Date | null> => {
  try {
    const timestamp = await AsyncStorage.getItem(WIDGET_LAST_UPDATE_KEY);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('Error retrieving widget last update:', error);
    return null;
  }
};

/**
 * Checks if the widget proverb is stale (older than 24 hours)
 */
export const isProverbStale = async (): Promise<boolean> => {
  try {
    const lastUpdate = await getWidgetLastUpdate();
    if (!lastUpdate) return true;

    const now = new Date();
    const hoursElapsed = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    return hoursElapsed >= 24;
  } catch (error) {
    console.error('Error checking if proverb is stale:', error);
    return true;
  }
};

/**
 * Clears widget storage
 */
export const clearWidgetStorage = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(WIDGET_PROVERB_KEY),
      AsyncStorage.removeItem(WIDGET_LAST_UPDATE_KEY),
    ]);
  } catch (error) {
    console.error('Error clearing widget storage:', error);
    throw error;
  }
};
