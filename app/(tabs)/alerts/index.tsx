import React, { useState } from "react";
import ViewMap from "@/components/ViewMap";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../styles/alertStyles";
import alertsData from "./alertsData.json";

interface AdminAlert {
  id: string;
  title: string;
  description: string;
  category: "emergency" | "announcement" | "facility" | "weather";
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // For area-based alerts
  verifiedBy: string;
  expiresAt?: string;
}

export default function AlertsScreen() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const isDark = useColorScheme() === "dark";

  const [adminAlerts] = useState<AdminAlert[]>(() => {
    // Optional validation logic
    return alertsData.adminAlerts as AdminAlert[];
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency":
        return "#FF4444";
      case "announcement":
        return "#FF9500";
      case "facility":
        return "#007AFF";
      case "weather":
        return "#FFD700";
      default:
        return "#34C759";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency":
        return "warning";
      case "announcement":
        return "megaphone";
      case "facility":
        return "construct";
      case "weather":
        return "rainy";
      default:
        return "information-circle";
    }
  };

  const getSeverityText = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const handleAlertSelect = (alertId: string) => {
    setSelectedAlert(alertId === selectedAlert ? null : alertId);
    const alert = adminAlerts.find((a) => a.id === alertId);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text
            style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}
          >
            Official Alerts
          </Text>
        </View>
        <Text
          style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}
        >
          Critical safety information from campus authorities
        </Text>
      </View>

      {/* Location Display */}
      <View style={styles.mapContainer}>
        <ViewMap mapHeight={200} />

        {/* Map Legend */}
        <View
          style={[
            styles.mapLegend,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
        >
          <Text
            style={[
              styles.legendTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            Alert Categories
          </Text>
          <View style={styles.legendItems}>
            {[
              { category: "emergency", label: "Emergency" },
              { category: "announcement", label: "Announcement" },
              { category: "facility", label: "Facility" },
              { category: "weather", label: "Weather" },
            ].map((item) => (
              <View key={item.category} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getCategoryColor(item.category) },
                  ]}
                />
                <Text
                  style={[
                    styles.legendText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Alerts List */}
      <ScrollView
        style={styles.alertsList}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.listTitle, { color: isDark ? "#ffffff" : "#000000" }]}
        >
          Active Alerts ({adminAlerts.length})
        </Text>

        {adminAlerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={[
              styles.alertCard,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              selectedAlert === alert.id && styles.selectedAlertCard,
            ]}
            onPress={() => handleAlertSelect(alert.id)}
          >
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleRow}>
                <Ionicons
                  name={getCategoryIcon(alert.category) as any}
                  size={24}
                  color={getCategoryColor(alert.category)}
                />
                <Text
                  style={[
                    styles.alertTitle,
                    {
                      color:
                        selectedAlert === alert.id
                          ? "#000" // Always black when selected
                          : isDark
                          ? "#fff"
                          : "#000",
                    },
                  ]}
                >
                  {alert.title}
                </Text>
              </View>
              <View
                style={[
                  styles.severityBadge,
                  { backgroundColor: getCategoryColor(alert.category) },
                ]}
              >
                <Text style={styles.severityText}>
                  {getSeverityText(alert.severity)}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.alertDescription,
                { color: isDark ? "#999999" : "#666666" },
              ]}
            >
              {alert.description}
            </Text>

            <View style={styles.alertDetails}>
              <View style={styles.detailRow}>
                <Ionicons
                  name="time"
                  size={16}
                  color={isDark ? "#999999" : "#666666"}
                />
                <Text
                  style={[
                    styles.detailText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {alert.timestamp}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="location"
                  size={16}
                  color={isDark ? "#999999" : "#666666"}
                />
                <Text
                  style={[
                    styles.detailText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {alert.location}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={isDark ? "#999999" : "#666666"}
                />
                <Text
                  style={[
                    styles.detailText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  Verified by {alert.verifiedBy}
                </Text>
              </View>

              {alert.expiresAt && (
                <View style={styles.detailRow}>
                  <Ionicons
                    name="timer"
                    size={16}
                    color={isDark ? "#999999" : "#666666"}
                  />
                  <Text
                    style={[
                      styles.detailText,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    Expires: {alert.expiresAt}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.alertActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: getCategoryColor(alert.category) },
                ]}
                onPress={() => handleAlertSelect(alert.id)}
              >
                <Ionicons name="map" size={16} color="white" />
                <Text style={styles.actionButtonText}>View on Map</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#34C759" }]}
                onPress={() => console.log("Get directions to", alert.location)}
              >
                <Ionicons name="navigate" size={16} color="white" />
                <Text style={styles.actionButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Info Section */}
        <View
          style={[
            styles.infoSection,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
        >
          <Text
            style={[
              styles.infoTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            About Official Alerts
          </Text>
          <Text
            style={[styles.infoText, { color: isDark ? "#999999" : "#666666" }]}
          >
            These alerts are verified by campus authorities and contain critical
            safety information. Community reports can escalate to official
            alerts if they receive sufficient community support and are verified
            by administrators.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
