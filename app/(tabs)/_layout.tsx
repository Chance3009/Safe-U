import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF0000' }}>
      {/* Changed from "index/index" to "index" to match actual file structure */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'SOS',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="warning" color={color} />,
        }}
      />
      <Tabs.Screen
        name="safety/safety"
        options={{
          title: 'Safety',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="shield-checkmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="report/report"
        options={{
          title: 'Report',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="document-text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community/community"
        options={{
          title: 'Community',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts/alerts"
        options={{
          title: 'Alerts',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="notifications" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
