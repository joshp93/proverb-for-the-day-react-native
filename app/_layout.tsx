import {
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { AuthProvider } from "../src/auth/auth-context";
import {
  defineBackgroundTask,
  scheduleBackgroundTask,
} from "../src/background/proverb-task";
import { HeaderMenu } from "../src/components/header-menu";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_400Regular_Italic,
  });

  useEffect(() => {
    defineBackgroundTask();
    scheduleBackgroundTask();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Stack
          screenOptions={{
            headerTitleStyle: styles.defaultText,
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "white",
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/app-logo.png")}
                  style={{ width: 40, height: 40, resizeMode: "contain" }}
                />
                <HeaderMenu />
              </View>
            ),
          }}
        />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  defaultText: {
    fontFamily: "Nunito_400Regular",
  },
  defaultContent: {
    fontFamily: "Nunito_400Regular",
  },
});
