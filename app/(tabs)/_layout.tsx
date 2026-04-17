import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false, // Removing labels for a cleaner, modern look
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === 'ios' ? 32 : 24, // Adjust bottom margin based on platform
          left: 24,
          right: 24,
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF", // Deep slate for dark, crisp white for light
          borderRadius: 32,
          height: 72,
          borderTopWidth: 0,
          shadowColor: isDark ? "#000" : "#94A3B8",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: isDark ? 0.3 : 0.15,
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
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <IconSymbol 
                size={26} 
                name="house.fill" 
                color={focused ? "#10B981" : "#94A3B8"} 
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
            <View style={[
              styles.iconContainer, 
              styles.scanButtonContainer,
              focused && styles.activeScanContainer
            ]}>
              <IconSymbol 
                size={32} 
                name="camera.fill" 
                color={focused ? "#FFFFFF" : "#FFFFFF"} 
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
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <IconSymbol 
                size={26} 
                name="square.grid.2x2.fill" // Changing to a more appropriate category icon 
                color={focused ? "#10B981" : "#94A3B8"} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: "Impact",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <IconSymbol 
                size={26} 
                name="leaf.fill" 
                color={focused ? "#10B981" : "#94A3B8"} 
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
  activeIconContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.15)", // Very light emerald background
  },
  scanButtonContainer: {
    backgroundColor: "#3B82F6", // Vibrant Blue for the primary action
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -20, // Make it float above the tab bar
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  activeScanContainer: {
    backgroundColor: "#10B981", // Change to Emerald when active
    shadowColor: "#10B981",
  },
});
