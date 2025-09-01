import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRouter } from "expo-router";

import profileData from "./safetyData.json";
import styles from "../../../components/styles/safetyStyles";
interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isSelected: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export default function FriendWalkScreen() {
  const [currentScreen, setCurrentScreen] = useState<"setup" | "waiting" | "active">("setup");
  const router = useRouter();
  const [fromLocation, setFromLocation] = useState<Location>({
    latitude: 37.78825,
    longitude: -122.4324,
    name: "Current Location",
  });
  const [toLocation, setToLocation] = useState<Location>({
    latitude: 37.78925,
    longitude: -122.4334,
    name: "Destination",
  });
  const [isFriendWalkActive, setIsFriendWalkActive] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const [checkInInterval, setCheckInInterval] = useState(5);
  const [nextCheckIn, setNextCheckIn] = useState(300); // 5 minutes in seconds
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerType, setLocationPickerType] = useState<"from" | "to">("from");
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);

  const isDark = useColorScheme() === "dark";
  const checkInTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [friends] = useState<Friend[]>(profileData.friends);

  const [recentLocations] = useState<Location[]>(profileData.recentLocations);

  const [safePoints] = useState<Location[]>(profileData.safePoints);

  useEffect(() => {
    if (isFriendWalkActive && currentScreen === "active") {
      checkInTimer.current = setInterval(() => {
        setNextCheckIn((prev) => {
          if (prev <= 1) {
            // Missed check-in alert
            Alert.alert(
              "Missed Check-in",
              "Alert sent to " +
              selectedFriends
                .map((id) => friends.find((f) => f.id === id)?.name)
                .join(", "),
              [
                {
                  text: "Check-in Now",
                  onPress: () => setNextCheckIn(checkInInterval * 60),
                },
              ]
            );
            return checkInInterval * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (checkInTimer.current) {
        clearInterval(checkInTimer.current);
      }
    };
  }, [
    isFriendWalkActive,
    currentScreen,
    selectedFriends,
    friends,
    checkInInterval,
  ]);

  const handleStartFriendWalk = () => {
    if (
      fromLocation.name !== "Current Location" &&
      toLocation.name !== "Destination" &&
      selectedFriends.length > 0
    ) {
      setCurrentScreen("waiting");
      // Simulate route calculation
      setRouteCoordinates([
        fromLocation,
        { latitude: 37.78875, longitude: -122.4329, name: "Route Point 1" },
        { latitude: 37.78925, longitude: -122.4334, name: "Route Point 2" },
        toLocation,
      ]);
    } else {
      Alert.alert(
        "Missing Information",
        "Please select both locations and at least one friend."
      );
    }
  };

  const handleStartWalk = () => {
    setCurrentScreen("active");
    setIsFriendWalkActive(true);
    setNextCheckIn(checkInInterval * 60);
  };

  const handleEndFriendWalk = () => {
    setIsFriendWalkActive(false);
    router.back();
    setSelectedFriends([]);
    setRouteCoordinates([]);
    if (checkInTimer.current) {
      clearInterval(checkInTimer.current);
    }
  };

  const handleCheckIn = () => {
    setNextCheckIn(checkInInterval * 60);
    Alert.alert(
      "Check-in Sent",
      "Your friends have been notified that you are safe."
    );
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const selectLocation = (location: Location) => {
    if (locationPickerType === "from") {
      setFromLocation(location);
    } else {
      setToLocation(location);
    }
    setShowLocationPicker(false);
  };

  const openLocationPicker = (type: "from" | "to") => {
    setLocationPickerType(type);
    setShowLocationPicker(true);
  };

  const getETA = () => {
    // Simple ETA calculation (demo)
    const distance = Math.sqrt(
      Math.pow(toLocation.latitude - fromLocation.latitude, 2) +
      Math.pow(toLocation.longitude - fromLocation.longitude, 2)
    );
    return Math.round(distance * 1000) + " min";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // FriendWalk Setup Screen
  if (currentScreen === "setup") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <View style={[
          styles.setupHeader,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" }
        ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#ffffff" : "#000000"}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.setupTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            FriendWalk Setup
          </Text>
        </View>

        <ScrollView style={styles.setupContent}>
          {/* Location Inputs */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Route Details
            </Text>

            <View style={styles.locationInputs}>
              <TouchableOpacity
                style={styles.locationInput}
                onPress={() => openLocationPicker("from")}
              >
                <Ionicons name="location" size={20} color="#007AFF" />
                <View style={styles.locationInputContent}>
                  <Text
                    style={[
                      styles.locationLabel,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    From
                  </Text>
                  <Text
                    style={[
                      styles.locationValue,
                      { color: isDark ? "#000000" : "#fffffff" },
                    ]}
                  >
                    {fromLocation.name}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#999999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.locationInput}
                onPress={() => openLocationPicker("to")}
              >
                <Ionicons name="location" size={20} color="#34C759" />
                <View style={styles.locationInputContent}>
                  <Text
                    style={[
                      styles.locationLabel,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    To
                  </Text>
                  <Text
                    style={[
                      styles.locationValue,
                      { color: isDark ? "#000000" : "#ffffff" },
                    ]}
                  >
                    {toLocation.name}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#999999" />
              </TouchableOpacity>
            </View>

            {/* ETA and Check-in Interval */}
            <View style={styles.routeInfo}>
              <View style={styles.routeInfoItem}>
                <Ionicons name="time" size={20} color="#FF9500" />
                <Text
                  style={[
                    styles.routeInfoText,
                    {
                      color:
                        isDark ? "#ffffff" : "#000000"
                    },
                  ]}
                >
                  ETA: {getETA()}
                </Text>
              </View>
              <View style={styles.routeInfoItem}>
                <Ionicons name="timer" size={20} color="#007AFF" />
                <Text
                  style={[
                    styles.routeInfoText,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Check-in: {checkInInterval} min
                </Text>
              </View>
            </View>

            {/* Check-in Interval Picker */}
            <View style={styles.intervalPicker}>
              <Text
                style={[
                  styles.intervalLabel,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Check-in Interval:
              </Text>
              <View style={styles.intervalOptions}>
                {[5, 10, 15].map((interval) => (
                  <TouchableOpacity
                    key={interval}
                    style={[
                      styles.intervalOption,
                      {
                        backgroundColor:
                          checkInInterval === interval
                            ? "#007AFF"
                            : isDark
                              ? "#333333"
                              : "#f0f0f0",
                        borderColor:
                          checkInInterval === interval
                            ? "#007AFF"
                            : "transparent",
                      },
                    ]}
                    onPress={() => setCheckInInterval(interval)}
                  >
                    <Text
                      style={[
                        styles.intervalOptionText,
                        {
                          color:
                            checkInInterval === interval
                              ? "white"
                              : isDark
                                ? "#ffffff"
                                : "#000000",
                        },
                      ]}
                    >
                      {interval} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Friends Selection */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Choose Friends
            </Text>
            <Text
              style={[
                styles.sectionDescription,
                { color: isDark ? "#999999" : "#666666" },
              ]}
            >
              Select trusted contacts to escort you
            </Text>

            <View style={styles.friendsGrid}>
              {friends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.friendChip,
                    {
                      backgroundColor: selectedFriends.includes(friend.id)
                        ? "#007AFF"
                        : isDark
                          ? "#333333"
                          : "#f0f0f0",
                      borderColor: friend.isOnline ? "#34C759" : "#FF3B30",
                    },
                  ]}
                  onPress={() => toggleFriendSelection(friend.id)}
                >
                  <Text style={styles.friendAvatar}>{friend.avatar}</Text>
                  <Text
                    style={[
                      styles.friendChipName,
                      {
                        color: selectedFriends.includes(friend.id)
                          ? "#ffffff"
                          : isDark
                            ? "#ffffff"
                            : "#000000",
                      },
                    ]}
                  >
                    {friend.name}
                  </Text>
                  <View
                    style={[
                      styles.onlineIndicator,
                      {
                        backgroundColor: friend.isOnline
                          ? "#34C759"
                          : "#FF3B30",
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Map Preview */}
          <View
            style={[
              styles.section,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Route Preview
            </Text>
            <View style={styles.mapPreview}>
              <MapView
                style={styles.mapPreviewMap}
                initialRegion={{
                  latitude: (fromLocation.latitude + toLocation.latitude) / 2,
                  longitude:
                    (fromLocation.longitude + toLocation.longitude) / 2,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={fromLocation}
                  title="From"
                  pinColor="#007AFF"
                />
                <Marker coordinate={toLocation} title="To" pinColor="#34C759" />
                {routeCoordinates.length > 1 && (
                  <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#007AFF"
                    strokeWidth={3}
                    lineDashPattern={[5, 5]}
                  />
                )}
              </MapView>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: "#34C759" }]}
            onPress={handleStartFriendWalk}
          >
            <Ionicons name="play-circle" size={24} color="white" />
            <Text style={styles.startButtonText}>Start FriendWalk</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Location Picker Modal */}
        <Modal
          visible={showLocationPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.locationPickerModal,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Select{" "}
                  {locationPickerType === "from" ? "Starting" : "Destination"}{" "}
                  Location
                </Text>
                <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? "#ffffff" : "#000000"}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.locationOptions}>
                <Text
                  style={[
                    styles.locationSectionTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Recent Locations
                </Text>
                {recentLocations.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.locationOption}
                    onPress={() => selectLocation(location)}
                  >
                    <Ionicons name="time" size={20} color="#FF9500" />
                    <Text
                      style={[
                        styles.locationOptionText,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}

                <Text
                  style={[
                    styles.locationSectionTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Safe Points
                </Text>
                {safePoints.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.locationOption}
                    onPress={() => selectLocation(location)}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={20}
                      color="#34C759"
                    />
                    <Text
                      style={[
                        styles.locationOptionText,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Invite/Waiting Screen
  if (currentScreen === "waiting") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <View style={styles.waitingHeader}>
          <Text
            style={[
              styles.waitingTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            Invites Sent
          </Text>
          <Text
            style={[
              styles.waitingSubtitle,
              { color: isDark ? "#999999" : "#666666" },
            ]}
          >
            Waiting for friends to respond...
          </Text>
        </View>

        <View style={styles.waitingContent}>
          <View style={styles.inviteStatus}>
            <Ionicons name="people" size={64} color="#007AFF" />
            <Text
              style={[
                styles.inviteStatusText,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Invites sent to:{" "}
              {selectedFriends
                .map((id) => friends.find((f) => f.id === id)?.name)
                .join(", ")}
            </Text>
          </View>

          <View style={styles.shareSection}>
            <Text
              style={[
                styles.shareTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Share with others
            </Text>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share" size={24} color="#007AFF" />
              <Text style={styles.shareButtonText}>Share deep-link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="qr-code" size={24} color="#34C759" />
              <Text style={styles.shareButtonText}>Copy/QR</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.startWalkButton, { backgroundColor: "#34C759" }]}
            onPress={handleStartWalk}
          >
            <Ionicons name="play-circle" size={24} color="white" />
            <Text style={styles.startWalkButtonText}>Start Walk Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Walk Active Screen
  if (currentScreen === "active") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <View style={styles.activeHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleEndFriendWalk}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.activeHeaderText}>FriendWalk Active</Text>
        </View>

        {/* Map with Route */}
        <View style={styles.activeMapContainer}>
          <MapView
            style={styles.activeMap}
            initialRegion={{
              latitude: (fromLocation.latitude + toLocation.latitude) / 2,
              longitude: (fromLocation.longitude + toLocation.longitude) / 2,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={fromLocation} title="From" pinColor="#007AFF" />
            <Marker coordinate={toLocation} title="To" pinColor="#34C759" />
            {routeCoordinates.length > 1 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#007AFF"
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        </View>

        {/* Timer and Controls */}
        <View
          style={[
            styles.activeControls,
            { backgroundColor: isDark ? "#1c1e1f" : "#ffffff" },
          ]}
        >
          <View style={styles.timerChip}>
            <Ionicons name="timer" size={20} color="#FF9500" />
            <Text style={styles.timerText}>
              Next check-in in {formatTime(nextCheckIn)}
            </Text>
          </View>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleCheckIn}
            >
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              <Text style={styles.controlButtonText}>Check-in now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="pause-circle" size={24} color="#FF9500" />
              <Text style={styles.controlButtonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleEndFriendWalk}
            >
              <Ionicons name="stop-circle" size={24} color="#FF3B30" />
              <Text style={styles.controlButtonText}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return null;
}