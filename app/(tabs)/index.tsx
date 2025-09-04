import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  useColorScheme,
  Animated,
  Linking,
  Share, //added import
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from '../styles/sosPageStyles';
import indexData from './indexData.json';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  status: "delivered" | "watching" | "on-way" | "none";
  eta?: string;
}

interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export default function SOSScreen() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyStartTime, setEmergencyStartTime] = useState<Date | null>(
    null
  );
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "status" | "people" | "actions"
  >("status");
  const [audioRecording, setAudioRecording] = useState(false);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 37.78825,
    longitude: -122.4324,
    timestamp: new Date(),
  });
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);

  const isDark = useColorScheme() === "dark";
  const countdownAnimation = useRef(new Animated.Value(1)).current;

  const emergencyContacts: EmergencyContact[] =
    indexData.emergencyContacts as EmergencyContact[];

  const handleEmergencySOS = () => {
    setCountdownActive(true);
    setCountdownValue(3);

    // Start countdown animation
    Animated.timing(countdownAnimation, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const countdownInterval = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdownActive(false);
          activateEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const activateEmergency = () => {
    setIsEmergencyActive(true);
    setEmergencyStartTime(new Date());
    setLocationHistory([userLocation]);

    // Start location tracking simulation
    const locationInterval = setInterval(() => {
      if (isEmergencyActive) {
        const newLocation = {
          ...userLocation,
          timestamp: new Date(),
        };
        setLocationHistory((prev) => [...prev, newLocation]);
      } else {
        clearInterval(locationInterval);
      }
    }, 5000);

    Alert.alert(
      "Emergency SOS Activated",
      "Your emergency contacts have been notified and your location is being shared.",
      [{ text: "OK" }]
    );
  };

  const handleEndEmergency = () => {
    setShowPasswordModal(true);
  };

  const confirmEndEmergency = () => {
    if (password === "1234") {
      // Simple password for demo
      setIsEmergencyActive(false);
      setEmergencyStartTime(null);
      setLocationHistory([]);
      setPassword("");
      setShowPasswordModal(false);
      setAudioRecording(false);

      Alert.alert(
        "SOS Ended",
        "Emergency session has been terminated. Your contacts have been notified that you are safe.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Incorrect Password",
        "Please enter the correct password to end SOS."
      );
      setPassword("");
    }
  };

  const getEmergencyDuration = () => {
    if (!emergencyStartTime) return "00:00";
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - emergencyStartTime.getTime()) / 1000
    );
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "#34C759";
      case "watching":
        return "#FF9500";
      case "on-way":
        return "#007AFF";
      default:
        return "#8E8E93";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "watching":
        return "Watching";
      case "on-way":
        return "On my way";
      default:
        return "Pending";
    }
  };

  const handleShareLocation = async () => {
    try {
      const shareUrl = `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`;
      const message = `🚨 EMERGENCY ALERT 🚨\n\nI need help! My current location is:\n${shareUrl}\n\nThis is an automated message from SafeU app.`;
      
      const result = await Share.share({
        message: message,
        url: shareUrl, // On iOS, this will be handled separately
        title: 'Emergency Location Share',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via activity type (iOS)
          console.log('Shared via', result.activityType);
        } else {
          // Shared (Android)
          console.log('Location shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share location');
      console.error('Share error:', error);
    }
  };

  if (countdownActive) {
    return (
      <View style={[styles.container, { backgroundColor: "#FF0000" }]}>
        <View style={styles.countdownContainer}>
          <Animated.View
            style={[
              styles.countdownRing,
              { transform: [{ scale: countdownAnimation }] },
            ]}
          >
            <Text style={styles.countdownText}>{countdownValue}</Text>
          </Animated.View>
          <Text style={styles.countdownLabel}>Alerting your contacts...</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setCountdownActive(false);
              setCountdownValue(3);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
      ]}
    >
      {/* Header */}
      {isEmergencyActive && (
        <View style={styles.emergencyHeader}>
          <View style={styles.emergencyStatus}>
            <Ionicons name="warning" size={24} color="#FF0000" />
            <Text style={styles.emergencyStatusText}>
              SOS Active • {getEmergencyDuration()}
            </Text>
          </View>
        </View>
      )}

      {/* Main Content Container - Add flex structure */}
      <View style={{ flex: 1 }}>
        {/* Main SOS Button */}
        <View
          style={[
            styles.sosContainer,
            isEmergencyActive && styles.sosContainerActive,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.sosButton,
              isEmergencyActive ? styles.endSosButton : null,
              { backgroundColor: isEmergencyActive ? "#FF4444" : "#FF0000" },
            ]}
            onPress={isEmergencyActive ? handleEndEmergency : handleEmergencySOS}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isEmergencyActive ? "checkmark-circle" : "warning"}
              size={isEmergencyActive ? 40 : 60}
              color="white"
            />
            <Text style={styles.sosButtonText}>
              {isEmergencyActive ? "END SOS" : "EMERGENCY SOS"}
            </Text>
            <Text style={styles.sosButtonSubtext}>
              {isEmergencyActive
                ? "Tap to confirm safe"
                : "Hold 1s to prevent accidental taps"}
            </Text>
          </TouchableOpacity>

          {!isEmergencyActive && (
            <TouchableOpacity
              style={styles.callSecurityButton}
              onPress={() => {
                Alert.alert(
                  "Call Campus Security",
                  "Do you want to call campus security?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Call",
                      onPress: () => {
                        const phoneNumber = "+1-555-123-4567"; // Replace with actual campus security number
                        Linking.openURL(`tel:${phoneNumber}`);
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="call" size={24} color="white" />
              <Text style={styles.callSecurityText}>Call Campus Security</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Map View when SOS is active */}
        {isEmergencyActive && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {/* User location marker */}
              <Marker
                coordinate={userLocation}
                title="Your Location"
                description="SOS Active"
                pinColor="#FF0000"
              />

              {/* Location history breadcrumbs */}
              {locationHistory.length > 1 && (
                <Polyline
                  coordinates={locationHistory}
                  strokeColor="#FF0000"
                  strokeWidth={3}
                  lineDashPattern={[5, 5]}
                />
              )}
            </MapView>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      {isEmergencyActive && (
        <View
          style={[
            styles.bottomSheet,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
        >
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "status" && { backgroundColor: "#007AFF" },
              ]}
              onPress={() => setSelectedTab("status")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === "status" && { color: "white" },
                ]}
              >
                Status
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "people" && { backgroundColor: "#007AFF" },
              ]}
              onPress={() => setSelectedTab("people")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === "people" && { color: "white" },
                ]}
              >
                People
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "actions" && { backgroundColor: "#007AFF" },
              ]}
              onPress={() => setSelectedTab("actions")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === "actions" && { color: "white" },
                ]}
              >
                Actions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {selectedTab === "status" && (
              <View style={styles.statusTab}>
                <View style={styles.statusItem}>
                  <Ionicons name="location" size={24} color="#34C759" />
                  <Text
                    style={[
                      styles.statusText,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Live location ON
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Ionicons
                    name="mic"
                    size={24}
                    color={audioRecording ? "#34C759" : "#8E8E93"}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Audio recording {audioRecording ? "ON" : "OFF"}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      {
                        backgroundColor: audioRecording ? "#34C759" : "#8E8E93",
                      },
                    ]}
                    onPress={() => setAudioRecording(!audioRecording)}
                  >
                    <Text style={styles.toggleButtonText}>
                      {audioRecording ? "ON" : "OFF"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedTab === "people" && (
              <ScrollView
                style={styles.peopleTab}
                contentContainerStyle={styles.peopleTabContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {emergencyContacts.map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <View style={styles.contactInfo}>
                      <Text
                        style={[
                          styles.contactName,
                          { color: isDark ? "#ffffff" : "#000000" },
                        ]}
                      >
                        {contact.name}
                      </Text>
                      <Text
                        style={[
                          styles.contactPhone,
                          { color: isDark ? "#999999" : "#666666" },
                        ]}
                      >
                        {contact.phone}
                      </Text>
                    </View>
                    <View style={styles.contactStatus}>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(contact.status) },
                        ]}
                      >
                        <Text style={styles.statusBadgeText}>
                          {getStatusText(contact.status)}
                        </Text>
                      </View>
                      {contact.eta && (
                        <Text
                          style={[
                            styles.etaText,
                            { color: isDark ? "#999999" : "#666666" },
                          ]}
                        >
                          ETA: {contact.eta}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.contactCallButton,
                        { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                      ]}
                      onPress={() => {
                        Alert.alert(
                          `Call ${contact.name}`,
                          `Do you want to call ${contact.name}?`,
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Call",
                              onPress: () => {
                                Linking.openURL(`tel:${contact.phone}`);
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="call" size={20} color="#34C759" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            {selectedTab === "actions" && (
              <View style={styles.actionsTab}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShareLocation} // Use the new function
                >
                  <Ionicons name="share" size={24} color="#007AFF" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Share link
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    Alert.alert(
                      "Call Campus Security",
                      "Do you want to call campus security?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Call",
                          onPress: () => {
                            const phoneNumber = "+1-555-123-4567"; // Replace with actual campus security number
                            Linking.openURL(`tel:${phoneNumber}`);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="call" size={24} color="#34C759" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Call security
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble" size={24} color="#FF9500" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Message all
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Confirm End SOS
            </Text>
            <Text
              style={[
                styles.modalDescription,
                { color: isDark ? "#999999" : "#666666" },
              ]}
            >
              Enter your password to confirm you are safe and end the emergency
              session.
            </Text>
            <TextInput
              style={[
                styles.passwordInput,
                {
                  backgroundColor: isDark ? "#333333" : "#f0f0f0",
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
              placeholder="Enter password"
              placeholderTextColor={isDark ? "#999999" : "#666666"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmEndEmergency}
              >
                <Text style={styles.confirmButtonText}>End SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
