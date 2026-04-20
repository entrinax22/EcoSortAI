import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? "light";
  const c = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false, // Removing labels for a cleaner, modern look
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 32 : 24, // Adjust bottom margin based on platform
          left: 24,
          right: 24,
          backgroundColor: c.surface,
          borderRadius: 32,
          height: 72,
          borderTopWidth: 0,
          shadowColor: theme === "dark" ? "#000" : "#94A3B8",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: theme === "dark" ? 0.3 : 0.15,
          shadowRadius: 20,
          elevation: 15,
          paddingBottom: 0, // Reset default padding
          paddingTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(52, 211, 153, 0.18)"
                      : "rgba(16, 185, 129, 0.15)",
                },
              ]}
            >
              <IconSymbol
                size={26}
                name="house.fill"
                color={focused ? c.brand : c.mutedText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(52, 211, 153, 0.18)"
                      : "rgba(16, 185, 129, 0.15)",
                },
              ]}
            >
              <IconSymbol
                size={26}
                name="square.grid.2x2.fill"
                color={focused ? c.brand : c.mutedText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                styles.scanButtonContainer,
                {
                  backgroundColor: focused ? c.brand : c.accent,
                  shadowColor: focused ? c.brand : c.accent,
                  borderColor: c.surface,
                },
              ]}
            >
              <IconSymbol size={32} name="camera.fill" color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(52, 211, 153, 0.18)"
                      : "rgba(16, 185, 129, 0.15)",
                },
              ]}
            >
              <IconSymbol
                size={26}
                name="trophy.fill"
                color={focused ? c.brand : c.mutedText}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(52, 211, 153, 0.18)"
                      : "rgba(16, 185, 129, 0.15)",
                },
              ]}
            >
              <IconSymbol
                size={26}
                name="message.fill"
                color={focused ? c.brand : c.mutedText}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: 12, // Center vertically in the 72px high bar
  },
  scanButtonContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -20, // Make it float above the tab bar
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
  },
});
