import React, { useState, useEffect, useRef } from "react";
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
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import EventBus from "../utils/eventBus";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";

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

interface LocationData {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  placeId?: string;
  types?: string[];
}

const { width, height } = Dimensions.get("window");

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
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coords);
      setSelectedCoord(coords);

      // Get reverse geocoding for better place name
      try {
        const reverseGeocodeResult = await Location.reverseGeocodeAsync(coords);
        if (reverseGeocodeResult.length > 0) {
          const address = reverseGeocodeResult[0];
          const addressParts = [
            address.street,
            address.district,
            address.city,
            address.region,
            address.country,
          ].filter(Boolean);

          const readableAddress = addressParts.join(", ");
          let placeName = "Current Location";

          if (address.name) {
            placeName = address.name;
          } else if (address.street) {
            placeName = address.street;
          } else if (address.district) {
            placeName = address.district;
          } else if (address.city) {
            placeName = address.city;
          }

          setSelectedPlace({
            name: placeName,
            address: readableAddress,
            placeId: `current_${Date.now()}`,
            types: ["point_of_interest"],
          });
        } else {
          setSelectedPlace({
            name: "Current Location",
            address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
              6
            )}`,
            placeId: `current_${Date.now()}`,
            types: ["point_of_interest"],
          });
        }
      } catch (geocodeError) {
        console.error("Reverse geocoding error:", geocodeError);
        setSelectedPlace({
          name: "Current Location",
          address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
            6
          )}`,
          placeId: `current_${Date.now()}`,
          types: ["point_of_interest"],
        });
      }

      // Update current location for grid display
      setCurrentLocation(coords);
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

  const handleMapLocationSelect = async (
    latitude: number,
    longitude: number
  ) => {
    const coords = { latitude, longitude };
    setSelectedCoord(coords);

    // Get reverse geocoding for the selected location
    try {
      const reverseGeocodeResult = await Location.reverseGeocodeAsync(coords);
      if (reverseGeocodeResult.length > 0) {
        const address = reverseGeocodeResult[0];
        const addressParts = [
          address.street,
          address.district,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean);

        const readableAddress = addressParts.join(", ");
        let placeName = "Selected Location";

        if (address.name) {
          placeName = address.name;
        } else if (address.street) {
          placeName = address.street;
        } else if (address.district) {
          placeName = address.district;
        } else if (address.city) {
          placeName = address.city;
        }

        setSelectedPlace({
          name: placeName,
          address: readableAddress,
          placeId: `selected_${Date.now()}`,
          types: ["point_of_interest"],
        });
      } else {
        setSelectedPlace({
          name: "Selected Location",
          address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
            6
          )}`,
          placeId: `selected_${Date.now()}`,
          types: ["point_of_interest"],
        });
      }
    } catch (geocodeError) {
      console.error("Reverse geocoding error:", geocodeError);
      setSelectedPlace({
        name: "Selected Location",
        address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
          6
        )}`,
        placeId: `selected_${Date.now()}`,
        types: ["point_of_interest"],
      });
    }
  };

  const generateMapHTML = (
    centerLat: number,
    centerLng: number,
    selectedCoord?: { latitude: number; longitude: number } | null
  ) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          let map;
          let marker;
          let selectedLocation = ${
            selectedCoord ? JSON.stringify(selectedCoord) : "null"
          };

          // Initialize map
          map = L.map('map').setView([${centerLat}, ${centerLng}], 15);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add click listener to map
          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // Remove existing marker
            if (marker) {
              map.removeLayer(marker);
            }
            
            // Add new marker
            marker = L.marker([lat, lng], {
              draggable: true
            }).addTo(map);

            // Send location to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'locationSelected',
              latitude: lat,
              longitude: lng
            }));
          });

          // Add marker for selected location if exists
          if (selectedLocation) {
            marker = L.marker([selectedLocation.latitude, selectedLocation.longitude], {
              draggable: true
            }).addTo(map);
            
            // Center map on selected location
            map.setView([selectedLocation.latitude, selectedLocation.longitude], 15);
          }

          // Add marker drag listener
          if (marker) {
            marker.on('dragend', function(e) {
              const lat = e.target.getLatLng().lat;
              const lng = e.target.getLatLng().lng;
              
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationSelected',
                latitude: lat,
                longitude: lng
              }));
            });
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleConfirmLocation = () => {
    if (selectedCoord && selectedPlace) {
      const locationData: LocationData = {
        name: selectedPlace.name,
        address: selectedPlace.address,
        coordinates: selectedCoord,
        placeId: selectedPlace.placeId,
        types: selectedPlace.types,
      };

      EventBus.emit("locationPicked", locationData);
      router.back();
    } else {
      Alert.alert(
        "No Location Selected",
        "Please tap on the map or get your current location first."
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleManualLocation = async () => {
    if (typedLocation.trim()) {
      try {
        // Use forward geocoding to get coordinates from location name
        const geocodeResult = await Location.geocodeAsync(typedLocation);
        if (geocodeResult.length > 0) {
          const coords = {
            latitude: geocodeResult[0].latitude,
            longitude: geocodeResult[0].longitude,
          };

          setSelectedCoord(coords);
          setSelectedPlace({
            name: typedLocation,
            address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
              6
            )}`,
            placeId: `manual_${Date.now()}`,
            types: ["point_of_interest"],
          });

          // Update current location for grid display
          setCurrentLocation(coords);
        } else {
          Alert.alert(
            "Location Not Found",
            "Could not find the specified location. Please try a different search term."
          );
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        Alert.alert(
          "Error",
          "Failed to search for location. Please try again."
        );
      }
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

      {/* Interactive Map */}
      <View style={styles.mapContainer}>
        <WebView
          style={styles.map}
          source={{
            html: generateMapHTML(
              currentLocation?.latitude || 37.7749,
              currentLocation?.longitude || -122.4194,
              selectedCoord
            ),
          }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "locationSelected") {
                handleMapLocationSelect(data.latitude, data.longitude);
              }
            } catch (error) {
              console.error("Error parsing map message:", error);
            }
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />

        {/* Map Overlay Controls */}
        <View style={styles.mapOverlay}>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.currentLocationButtonText}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a location..."
          value={typedLocation}
          onChangeText={setTypedLocation}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            !typedLocation.trim() && styles.searchButtonDisabled,
          ]}
          onPress={handleManualLocation}
          disabled={!typedLocation.trim()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Location Info */}
      {selectedCoord && (
        <View style={styles.locationInfoSection}>
          <Text style={styles.locationInfoTitle}>Selected Location</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationInfoText}>
              {selectedPlace?.name || "Selected Location"}
            </Text>
            <Text style={styles.coordinateText}>
              {selectedCoord.latitude.toFixed(6)},{" "}
              {selectedCoord.longitude.toFixed(6)}
            </Text>
            {selectedPlace?.address && (
              <Text style={styles.addressText}>{selectedPlace.address}</Text>
            )}
            <TouchableOpacity
              style={styles.mapButton}
              onPress={openMapInBrowser}
            >
              <Text style={styles.mapButtonText}>🗺️ View on Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsSection}>
        <Text style={styles.instructionsTitle}>How to use:</Text>
        <Text style={styles.instructionText}>
          • Tap anywhere on the map to select a location{"\n"}• Drag the marker
          to fine-tune your selection{"\n"}• Use the search bar to find specific
          places{"\n"}• Tap the 📍 button to go to your current location{"\n"}•
          Tap "Confirm" when you're ready to use this location
        </Text>
      </View>
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
    zIndex: 1000,
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
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1000,
  },
  currentLocationButton: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLocationButtonText: {
    fontSize: 24,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  locationInfoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  locationInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  locationInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  locationInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  coordinateText: {
    fontSize: 12,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  mapButton: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  instructionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
});
