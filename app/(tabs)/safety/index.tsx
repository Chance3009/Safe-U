import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import styles from "../../../components/styles/safetyStyles";

export default function SafetyScreen() {
  // Safety Home Screen
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [safetyCheckInEnabled, setSafetyCheckInEnabled] = useState(false);
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
      ]}
    >
      <View style={[
        styles.header,
        { paddingBottom: 0 } // Reduce padding to remove the gap
      ]}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              // Navigate back - you might need to use navigation
              // If using Expo Router, you could use router.back()
            }}
          />
          <Text
            style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}
          >
            Safety & Navigation
          </Text>
        </View>
        <Text
          style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}
        >
          Stay safe with friends and smart routing
        </Text>
      </View>

      {/* Safety Cards - start right after header with no gap */}
      <View style={[styles.cardsContainer, { marginTop: 8 }]}>
        {/* FriendWalk Card */}
        <TouchableOpacity
          style={[
            styles.safetyCard,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
          onPress={() => router.push("/safety/friendWalk")}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={32} color="#007AFF" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              FriendWalk
            </Text>
          </View>
          <Text
            style={[
              styles.cardDescription,
              { color: isDark ? "#999999" : "#666666" },
            ]}
          >
            Set destination, share route, timed check-ins
          </Text>
          <View style={styles.cardAction}>
            <Text style={styles.cardActionText}>Start Walk</Text>
            <Ionicons name="arrow-forward" size={20} color="#007AFF" />
          </View>
        </TouchableOpacity>

        {/* Safe-Haven Card */}
        <TouchableOpacity
          style={[
            styles.safetyCard,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={32} color="#34C759" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Safe-Haven
            </Text>
          </View>
          <Text
            style={[
              styles.cardDescription,
              { color: isDark ? "#999999" : "#666666" },
            ]}
          >
            Find nearby safe locations and guard posts
          </Text>
          <View style={styles.cardAction}>
            <Text style={styles.cardActionText}>Find Safe Spots</Text>
            <Ionicons name="arrow-forward" size={20} color="#34C759" />
          </View>
        </TouchableOpacity>

        {/* Bus Card (Optional P1) */}
        <TouchableOpacity
          style={[
            styles.safetyCard,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="bus" size={32} color="#FF9500" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Campus Bus
            </Text>
          </View>
          <Text
            style={[
              styles.cardDescription,
              { color: isDark ? "#999999" : "#666666" },
            ]}
          >
            Track university transport and schedules
          </Text>
          <View style={styles.cardAction}>
            <Text style={styles.cardActionText}>Track Bus</Text>
            <Ionicons name="arrow-forward" size={20} color="#FF9500" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Safety Check-in Section */}
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "#1c1e1f" : "#ffffff" },
        ]}
      >
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <View style={styles.settingText}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Safety Check-ins
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: isDark ? "#999999" : "#666666" },
                ]}
              >
                Periodic safety confirmations
              </Text>
            </View>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              value={safetyCheckInEnabled}
              onValueChange={setSafetyCheckInEnabled}
              trackColor={{ false: "#767577", true: "#34C759" }}
              thumbColor={safetyCheckInEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
  
}

