import { useState, useEffect } from "react";
import WebView from "react-native-webview";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";

interface ViewMapSosProps {
  mapHeight?: number;
  darkMode?: boolean;
  style?: any;
}

export default function ViewMapSos({
  mapHeight = 300,
  darkMode = false,
  style,
}: ViewMapSosProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.78825, // Default fallback location
    longitude: -122.4324,
  });

  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationError(null);
    } catch (error) {
      console.error("Error getting location:", error);
      setLocationError("Failed to get location");
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const generateMapHTML = (centerLat: number, centerLng: number) => {
    const userLocation = JSON.stringify({
      latitude: centerLat,
      longitude: centerLng,
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
          .leaflet-control-attribution { display: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          // Initialize map
          let map = L.map('map').setView([${centerLat}, ${centerLng}], 16);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
          }).addTo(map);

          // Current location marker (pulsing red dot for emergency)
          const userLoc = ${userLocation};
          
          // Create pulsing emergency marker
          const emergencyIcon = L.divIcon({
            className: 'emergency-marker',
            html: \`
              <div style="
                width: 30px;
                height: 30px;
                background-color: #FF0000;
                border: 4px solid #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.3);
                animation: pulse 2s infinite;
              "></div>
              <style>
                @keyframes pulse {
                  0% { box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.3); }
                  50% { box-shadow: 0 0 0 15px rgba(255, 0, 0, 0.1); }
                  100% { box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.3); }
                }
              </style>
            \`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          });

          // Add emergency location marker
          L.marker([userLoc.latitude, userLoc.longitude], {
            icon: emergencyIcon
          }).addTo(map).bindPopup("🚨 Your Current Location (Emergency Active)").openPopup();

          // Add accuracy circle (optional)
          L.circle([userLoc.latitude, userLoc.longitude], {
            color: '#FF0000',
            fillColor: '#FF0000',
            fillOpacity: 0.1,
            radius: 50 // 50 meter accuracy circle
          }).addTo(map);

          // Handle map clicks to update location
          map.on('click', function(e) {
            const data = {
              type: 'locationSelected',
              latitude: e.latlng.lat,
              longitude: e.latlng.lng
            };
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }
          });
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={[styles.mapContainer, { height: mapHeight }, style]}>
      <WebView
        style={styles.map}
        source={{
          html: generateMapHTML(
            currentLocation.latitude,
            currentLocation.longitude
          ),
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "locationSelected") {
              // Update current location if user taps the map
              setCurrentLocation({
                latitude: data.latitude,
                longitude: data.longitude,
              });
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
          style={[
            styles.currentLocationButton,
            { backgroundColor: darkMode ? "#333333" : "#ffffff" }
          ]}
          onPress={getCurrentLocation}
        >
          <Text style={styles.currentLocationButtonText}>📍</Text>
        </TouchableOpacity>
        
        {/* Emergency Status Indicator */}
        <View style={styles.emergencyIndicator}>
          <View style={styles.pulsingDot} />
          <Text style={styles.emergencyText}>LIVE</Text>
        </View>
      </View>

      {/* Location Error Message */}
      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 12,
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
  emergencyIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF0000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  emergencyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  errorContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
  },
});