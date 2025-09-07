import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useDarkMode from "../useDarkMode";
import { useColorScheme } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const isDark = useColorScheme() === "dark";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF0000",
        tabBarStyle: { backgroundColor: isDark ? "#000000" : "#ffffff" },
      }}
    >
      {/* Changed from "index/index" to "index" to match actual file structure */}
      <Tabs.Screen
        name="index"
        options={{
          title: "SOS",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="warning" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          title: "Safety",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="shield-checkmark" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          title: "Community",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts/index"
        options={{
          title: "Alerts",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="notifications" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
