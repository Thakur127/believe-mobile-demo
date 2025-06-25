import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[chainId]" />
        <Stack.Screen name="search" />
        <Stack.Screen
          name="+not-found"
          options={{ headerShown: true, title: "Oops!" }}
        />
        <StatusBar style="auto" />
      </Stack>
    </ThemeProvider>
  );
}
