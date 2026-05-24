import { Stack } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ProverbCard } from "../src/components/proverb-card";
import { Text } from "../src/components/themed-text";
import { VersionDropdown } from "../src/components/version-dropdown";
import { useProverbForTheDay } from "../src/hooks/useProverbForTheDay";
import { updateProverbWidget } from "../src/widgets";

export default function Index() {
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
    <>
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
    </>
  );
}
