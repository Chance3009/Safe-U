import { Alert } from "react-native";
import React from 'react';

// Define interfaces
export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isSelected: boolean;
}

// Functions
export const handleStartFriendWalk = (
  fromLocation: Location,
  toLocation: Location,
  selectedFriends: string[],
  setCurrentScreen: (screen: "home" | "setup" | "waiting" | "active") => void,
  setRouteCoordinates: (routes: Location[]) => void
): void => {
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

export const handleStartWalk = (
  setCurrentScreen: (screen: "home" | "setup" | "waiting" | "active") => void,
  setIsFriendWalkActive: (active: boolean) => void,
  setNextCheckIn: (seconds: number) => void,
  checkInInterval: number
): void => {
  setCurrentScreen("active");
  setIsFriendWalkActive(true);
  setNextCheckIn(checkInInterval * 60);
};

export const handleEndFriendWalk = (
  setIsFriendWalkActive: (active: boolean) => void,
  setCurrentScreen: (screen: "home" | "setup" | "waiting" | "active") => void,
  setSelectedFriends: (friends: string[]) => void,
  setRouteCoordinates: (routes: Location[]) => void,
  checkInTimer: React.MutableRefObject<ReturnType<typeof setInterval> | null>
): void => {
  setIsFriendWalkActive(false);
  setCurrentScreen("home");
  setSelectedFriends([]);
  setRouteCoordinates([]);
  if (checkInTimer.current) {
    clearInterval(checkInTimer.current);
  }
};

export const handleCheckIn = (
  setNextCheckIn: (seconds: number) => void,
  checkInInterval: number
): void => {
  setNextCheckIn(checkInInterval * 60);
  Alert.alert(
    "Check-in Sent",
    "Your friends have been notified that you are safe."
  );
};

export const toggleFriendSelection = (
  friendId: string,
  setSelectedFriends: (callback: (prev: string[]) => string[]) => void
): void => {
  setSelectedFriends((prev) =>
    prev.includes(friendId)
      ? prev.filter((id) => id !== friendId)
      : [...prev, friendId]
  );
};

export const selectLocation = (
  location: Location,
  locationPickerType: "from" | "to",
  setFromLocation: (location: Location) => void,
  setToLocation: (location: Location) => void,
  setShowLocationPicker: (show: boolean) => void
): void => {
  if (locationPickerType === "from") {
    setFromLocation(location);
  } else {
    setToLocation(location);
  }
  setShowLocationPicker(false);
};

export const openLocationPicker = (
  type: "from" | "to",
  setLocationPickerType: (type: "from" | "to") => void,
  setShowLocationPicker: (show: boolean) => void
): void => {
  setLocationPickerType(type);
  setShowLocationPicker(true);
};

export const getETA = (
  fromLocation: Location,
  toLocation: Location
): string => {
  // Simple ETA calculation (demo)
  const distance = Math.sqrt(
    Math.pow(toLocation.latitude - fromLocation.latitude, 2) +
    Math.pow(toLocation.longitude - fromLocation.longitude, 2)
  );
  return Math.round(distance * 1000) + " min";
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function SafetyController() {
  // This is never used, just to satisfy Expo Router
  return null;
}