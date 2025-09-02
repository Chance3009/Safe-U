import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import safeHavenData from "./safeHavenData.json";

import styles from "../../../styles/navigationStyles";
import { SafeHaven } from "./index";

// Mock data for safe havens - in a real app, this would come from your backend
const safeHavens: SafeHaven[] = safeHavenData.safehavens;

export default function NavigationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const params = useLocalSearchParams();
  const havenId = parseInt(params.havenId as string);

  const [selectedHaven, setSelectedHaven] = useState<SafeHaven | null>(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 3.1385,
    longitude: 101.6865,
  });
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [distance, setDistance] = useState<string>("");

  useEffect(() => {
    // Find the selected haven based on the ID from params
    const haven = safeHavens.find(h => h.id === havenId);
    if (haven) {
      setSelectedHaven(haven);
      // Calculate route (in a real app, this would use Google Directions API)
      calculateRoute(haven);
    }
  }, [havenId]);

  const calculateRoute = (destination: SafeHaven) => {
    // Mock route calculation - in a real app, this would use Google Directions API
    const mockRoute = [
      userLocation,
      { latitude: 3.1388, longitude: 101.6867 },
      { latitude: 3.1390, longitude: 101.6869 },
      destination.coordinates,
    ];
    
    setRouteCoordinates(mockRoute);
    setEstimatedTime(destination.estimatedTime);
    setDistance(destination.distance);
  };

  const handleCallEmergency = () => {
    if (selectedHaven) {
      Alert.alert(
        "Emergency Call",
        `Call ${selectedHaven.name} at ${selectedHaven.phone}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Call Now",
            style: "destructive",
            onPress: () => {
              Linking.openURL(`tel:${selectedHaven.phone}`);
            },
          },
        ]
      );
    }
  };

  const handleOpenInMaps = () => {
    if (selectedHaven) {
      const { latitude, longitude } = selectedHaven.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const handleBackToSafeHaven = () => {
    router.back();
  };

  if (!selectedHaven) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? "#000000" : "#f5f5f5" }]}>
        <Text style={[styles.errorText, { color: isDark ? "#ffffff" : "#000000" }]}>
          Safe haven not found
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToSafeHaven}>
          <Text style={styles.backButtonText}>Back to Safe Havens</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToSafeHaven}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#000000"} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
            {selectedHaven.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? "#999999" : "#666666" }]}>
            {selectedHaven.type} • {distance} • {estimatedTime}
          </Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (userLocation.latitude + selectedHaven.coordinates.latitude) / 2,
            longitude: (userLocation.longitude + selectedHaven.coordinates.longitude) / 2,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="You are here"
            pinColor="#007AFF"
          />

          {/* Destination Marker */}
          <Marker
            coordinate={selectedHaven.coordinates}
            title={selectedHaven.name}
            description={selectedHaven.description}
            pinColor="#FF6B6B"
          />

          {/* Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#4ECDC4"
              strokeWidth={4}
              lineDashPattern={[1]}
            />
          )}
        </MapView>
      </View>

      {/* Navigation Info */}
      <View style={[styles.navigationInfo, { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" }]}>
        <View style={styles.routeInfo}>
          <View style={styles.routeItem}>
            <Ionicons name="time" size={20} color="#4ECDC4" />
            <Text style={[styles.routeText, { color: isDark ? "#ffffff" : "#000000" }]}>
              {estimatedTime}
            </Text>
          </View>
          <View style={styles.routeItem}>
            <Ionicons name="location" size={20} color="#FF6B6B" />
            <Text style={[styles.routeText, { color: isDark ? "#ffffff" : "#000000" }]}>
              {distance}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleCallEmergency}>
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.emergencyButtonText}>Emergency Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapsButton} onPress={handleOpenInMaps}>
            <Ionicons name="open-outline" size={20} color="white" />
            <Text style={styles.mapsButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Instructions */}
        <View style={styles.safetyInstructions}>
          <Text style={[styles.instructionsTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
            Safety Instructions
          </Text>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={[styles.instructionText, { color: isDark ? "#999999" : "#666666" }]}>
              Stay on well-lit paths and avoid shortcuts
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={[styles.instructionText, { color: isDark ? "#999999" : "#666666" }]}>
              Keep your phone visible and accessible
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={[styles.instructionText, { color: isDark ? "#999999" : "#666666" }]}>
              If you feel unsafe, call emergency services immediately
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

