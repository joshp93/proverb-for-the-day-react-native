import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, View, StyleSheet } from "react-native";
import { ProverbCard } from "../src/components/proverb-card";
import { Text } from "../src/components/themed-text";
import { VersionDropdown } from "../src/components/version-dropdown";
import { useProverbForTheDay } from "../src/hooks/useProverbForTheDay";
import { updateProverbWidget } from "../src/widgets";

export default function Index() {
  const router = useRouter();

  const {
    proverb,
    loading,
    error,
    selectedVersion,
    availableVersions,
    changeVersion,
  } = useProverbForTheDay();

  useEffect(() => {
    if (proverb) {
      updateProverbWidget(proverb);
    }
  }, [proverb]);

  const title = proverb && !loading && !error ? proverb.ref : "Daily Proverb";

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontFamily: "Nunito_400Regular",
                }}
              >
                {title}
              </Text>
              {availableVersions &&
                availableVersions.length > 0 &&
                selectedVersion && (
                  <VersionDropdown
                    versions={availableVersions}
                    selectedVersion={selectedVersion}
                    onSelect={changeVersion}
                  />
                )}
            </View>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
        }}
        style={{
          flex: 1,
          backgroundColor: "#E6F4FE",
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
        {proverb && !loading && !error && <ProverbCard proverb={proverb} />}
      </ScrollView>
      <Pressable
        style={styles.meditationButton}
        onPress={() => router.push("/meditation")}
      >
        <Text style={styles.meditationButtonText}>Start Meditation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  meditationButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 36,
  },
  meditationButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_400Regular",
  },
});
