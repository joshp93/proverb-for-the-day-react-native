export const getAvailableVersions = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      new Request(
        "https://vua1tbtwtd.execute-api.eu-west-2.amazonaws.com/prod/available-versions",
        { method: "GET" },
      ),
    );
    const data = (await response.json()) as string[];
    return data;
  } catch (error: any) {
    console.error("Error fetching available versions:", error);
    return [];
  }
};
