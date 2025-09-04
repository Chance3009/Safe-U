import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import EventBus from "../utils/eventBus";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";

interface PlaceDetails {
  name: string;
  address: string;
  placeId: string;
  types: string[];
  phoneNumber?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
}

export default function MapPickerScreen() {
  const router = useRouter();
  const [typedLocation, setTypedLocation] = useState("");
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setHasLocationPermission(true);
        await getCurrentLocation();
      } else {
        setMapError("Location permission denied");
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setMapError("Failed to request location permission");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setSelectedCoord({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setSelectedPlace({
        name: "Current Location",
        address: `${location.coords.latitude.toFixed(
          6
        )}, ${location.coords.longitude.toFixed(6)}`,
        placeId: `current_${Date.now()}`,
        types: ["point_of_interest"],
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      setMapError("Failed to get current location");
    }
  };

  const openMapInBrowser = async () => {
    if (selectedCoord) {
      const url = `https://www.google.com/maps?q=${selectedCoord.latitude},${selectedCoord.longitude}`;
      await WebBrowser.openBrowserAsync(url);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedCoord) {
      const locationData = {
        coordinate: selectedCoord,
        place: selectedPlace,
        typedLocation: typedLocation,
      };

      EventBus.emit("locationSelected", locationData);
      router.back();
    } else {
      Alert.alert(
        "No Location Selected",
        "Please get your current location first."
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleManualLocation = () => {
    if (typedLocation.trim()) {
      // For demo purposes, use a default location
      // In a real app, you'd use a geocoding service
      const defaultLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
      };

      setSelectedCoord(defaultLocation);
      setSelectedPlace({
        name: typedLocation,
        address: `${defaultLocation.latitude.toFixed(
          6
        )}, ${defaultLocation.longitude.toFixed(6)}`,
        placeId: `manual_${Date.now()}`,
        types: ["point_of_interest"],
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (mapError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{mapError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={requestLocationPermission}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedCoord && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmLocation}
          disabled={!selectedCoord}
        >
          <Text
            style={[
              styles.confirmButtonText,
              !selectedCoord && styles.confirmButtonTextDisabled,
            ]}
          >
            Confirm
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.locationButtonText}>
              📍 Get Current Location
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Or Enter Location Manually</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter location name..."
            value={typedLocation}
            onChangeText={setTypedLocation}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.manualButton,
              !typedLocation.trim() && styles.manualButtonDisabled,
            ]}
            onPress={handleManualLocation}
            disabled={!typedLocation.trim()}
          >
            <Text
              style={[
                styles.manualButtonText,
                !typedLocation.trim() && styles.manualButtonTextDisabled,
              ]}
            >
              Use This Location
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Location Info */}
        {selectedCoord && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Location</Text>
            <View style={styles.locationInfo}>
              <Text style={styles.locationInfoText}>
                {selectedPlace?.name || "Selected Location"}
              </Text>
              <Text style={styles.coordinateText}>
                {selectedCoord.latitude.toFixed(6)},{" "}
                {selectedCoord.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity
                style={styles.mapButton}
                onPress={openMapInBrowser}
              >
                <Text style={styles.mapButtonText}>🗺️ View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructionText}>
            • Tap "Get Current Location" to use your GPS location{"\n"}• Or type
            a location name and tap "Use This Location"{"\n"}• Tap "View on Map"
            to see the location in your browser{"\n"}• Tap "Confirm" when you're
            ready to use this location
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonTextDisabled: {
    color: "#999",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  locationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
  },
  manualButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  manualButtonDisabled: {
    backgroundColor: "#ccc",
  },
  manualButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  manualButtonTextDisabled: {
    color: "#999",
  },
  locationInfo: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  locationInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  coordinateText: {
    fontSize: 14,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 12,
  },
  mapButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
