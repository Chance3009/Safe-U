import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  useColorScheme,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";

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

export default function SafetyScreen() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "setup" | "waiting" | "active"
  >("home");
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
  const [safetyCheckInEnabled, setSafetyCheckInEnabled] = useState(false);
  const [checkInInterval, setCheckInInterval] = useState(5);
  const [nextCheckIn, setNextCheckIn] = useState(300); // 5 minutes in seconds
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationPickerType, setLocationPickerType] = useState<"from" | "to">(
    "from"
  );
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);

  const isDark = useColorScheme() === "dark";
  const checkInTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [friends] = useState<Friend[]>([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "👩‍🦰",
      isOnline: true,
      isSelected: false,
    },
    {
      id: "2",
      name: "Mike Johnson",
      avatar: "👨‍🦱",
      isOnline: true,
      isSelected: false,
    },
    {
      id: "3",
      name: "Emma Davis",
      avatar: "👩‍🦳",
      isOnline: false,
      isSelected: false,
    },
    {
      id: "4",
      name: "Alex Kim",
      avatar: "👨‍🦲",
      isOnline: true,
      isSelected: false,
    },
    {
      id: "5",
      name: "Jordan Lee",
      avatar: "👩‍🦱",
      isOnline: false,
      isSelected: false,
    },
  ]);

  const [recentLocations] = useState<Location[]>([
    { latitude: 37.78825, longitude: -122.4324, name: "Library" },
    { latitude: 37.78925, longitude: -122.4334, name: "Student Center" },
    { latitude: 37.78725, longitude: -122.4314, name: "Dorm Building A" },
    { latitude: 37.79025, longitude: -122.4344, name: "Science Building" },
  ]);

  const [safePoints] = useState<Location[]>([
    { latitude: 37.78875, longitude: -122.4329, name: "Guard Post 1" },
    { latitude: 37.78975, longitude: -122.4339, name: "24hr Lab" },
    { latitude: 37.78775, longitude: -122.4319, name: "Well-lit Path" },
  ]);

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
    setCurrentScreen("home");
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

  // Safety Home Screen
  if (currentScreen === "home") {
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}
          >
            Safety & Navigation
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}
          >
            Stay safe with friends and smart routing
          </Text>
        </View>

        {/* Safety Cards */}
        <View style={styles.cardsContainer}>
          {/* FriendWalk Card */}
          <TouchableOpacity
            style={[
              styles.safetyCard,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
            onPress={() => setCurrentScreen("setup")}
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
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
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

  // FriendWalk Setup Screen
  if (currentScreen === "setup") {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <View style={styles.setupHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen("home")}
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
                      { color: isDark ? "#ffffff" : "#000000" },
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
                      { color: isDark ? "#ffffff" : "#000000" },
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
                    { color: isDark ? "#ffffff" : "#000000" },
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
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  safetyCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchContainer: {
    flex: 1, // 1 part for the switch
    alignItems: "flex-end", // push switch to right edge
    justifyContent: "center",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Setup Screen Styles
  setupHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  setupContent: {
    flex: 1,
    paddingTop: 16,
  },
  locationInputs: {
    gap: 16,
    marginBottom: 20,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    gap: 12,
  },
  locationInputContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  routeInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeInfoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  intervalPicker: {
    marginBottom: 20,
  },
  intervalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  intervalOptions: {
    flexDirection: "row",
    gap: 12,
  },
  intervalOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  intervalOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  friendsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  friendChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
    minWidth: 120,
  },
  friendAvatar: {
    fontSize: 20,
  },
  friendChipName: {
    fontSize: 14,
    fontWeight: "500",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mapPreview: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapPreviewMap: {
    flex: 1,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  // Location Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  locationPickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationOptions: {
    padding: 20,
  },
  locationSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 16,
  },
  locationOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Waiting Screen Styles
  waitingHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  waitingContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  inviteStatus: {
    alignItems: "center",
    marginBottom: 40,
  },
  inviteStatusText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
  shareSection: {
    marginBottom: 40,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  startWalkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  startWalkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  // Active Walk Screen Styles
  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#34C759",
  },
  activeHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  activeMapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  activeMap: {
    flex: 1,
  },
  activeControls: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  timerChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
  },
  controlButtons: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
