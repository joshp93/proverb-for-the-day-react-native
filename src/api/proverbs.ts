import { ProverbSchema } from "../models/proverb";

export const getProverbForTheDay = (version?: string) =>
  fetch(
    new Request(
      `https://vua1tbtwtd.execute-api.eu-west-2.amazonaws.com/prod/${version || "kjv"}`,
      {
        method: "GET",
      },
    ),
  )
    .then((res) => res.json())
    .then((data) => ProverbSchema.parse(data))
    .catch((error) => {
      console.error("Error fetching proverb:", error);
      throw error;
    });
