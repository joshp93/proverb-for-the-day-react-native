import { Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "./components/themed-text";
import { useProverbForTheDay } from "./hooks/useProverbForTheDay";

export default function Index() {
  const { proverb, loading, error } = useProverbForTheDay();

  return (
    <>
      <Stack.Screen
        options={{
          title:
            proverb && !loading && !error ? proverb.ref : "Proverb of the Day",
        }}
      />
      <View
        style={{
          flex: 1,
          padding: 16,
          overflowY: "auto",
        }}
      >
        {loading && (
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Loading proverb...
          </Text>
        )}
        {error && <Text>{error}</Text>}
        {proverb && !loading && !error && (
          <View>
            <Text
              style={{
                fontSize: 40,
                fontStyle: "italic",
              }}
            >
              {proverb.proverb}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
