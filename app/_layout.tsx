import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../src/theme/ThemeContext";
import { IdeasProvider } from "../src/context/IdeasContext";
import { ToastProvider } from "../src/components/Toast";

function InnerLayout() {
  const { mode, colors } = useTheme();
  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <IdeasProvider>
            <InnerLayout />
          </IdeasProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
