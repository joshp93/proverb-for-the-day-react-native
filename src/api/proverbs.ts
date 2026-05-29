import { ProverbSchema } from "../models/proverb";
import { LEMUEL_API_BASE_URL } from "./constants";

/**
 * Fetches today's proverb for the given Bible version.
 * @param version Optional Bible version string (defaults to "kjv").
 * @returns A parsed Proverb object.
 * @throws On network failure or invalid response data.
 */
export const getProverbForTheDay = (version?: string) =>
  fetch(`${LEMUEL_API_BASE_URL}/${version || "kjv"}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => ProverbSchema.parse(data))
    .catch((error) => {
      console.error("Error fetching proverb:", error);
      throw error;
    });
