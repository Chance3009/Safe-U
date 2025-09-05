import { useState } from "react";
import WebView from "react-native-webview";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";

interface LocationType {
  latitude: number;
  longitude: number;
  name?: string;
}

interface ViewMapProps {
  fromLocation?: LocationType;
  toLocation?: LocationType;
  routeCoordinates?: LocationType[];
  safePoints?: LocationType[];
  style?: any;
  darkMode?: boolean;
  mapHeight?: number;
}

export default function ViewMap({
  fromLocation,
  toLocation,
  routeCoordinates,
  safePoints,
  style,
  darkMode,
  mapHeight = 300,
}: ViewMapProps) {
  // Provide fallback/defaults for all props
  const defaultFrom = fromLocation || {
    latitude: 37.78825,
    longitude: -122.4324,
    name: "Start",
  };
  const defaultTo = toLocation || {
    latitude: 37.78925,
    longitude: -122.4334,
    name: "End",
  };
  const defaultRoute = routeCoordinates || [defaultFrom, defaultTo];
  const defaultSafePoints = safePoints || [];

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: defaultFrom.latitude,
    longitude: defaultFrom.longitude,
  });

  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const generateMapHTML = (
    centerLat: number,
    centerLng: number,
    selectedCoord?: { latitude: number; longitude: number } | null
  ) => {
    const routePoints = JSON.stringify(defaultRoute);
    const safePointsArr = JSON.stringify(defaultSafePoints);
    const from = JSON.stringify(defaultFrom);
    const to = JSON.stringify(defaultTo);

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
          let map = L.map('map').setView([${centerLat}, ${centerLng}], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // From marker
          const from = ${from};
          L.marker([from.latitude, from.longitude], {title: from.name || "Start"}).addTo(map)
            .bindPopup("Start: " + (from.name || ""));

          // To marker
          const to = ${to};
          L.marker([to.latitude, to.longitude], {title: to.name || "End"}).addTo(map)
            .bindPopup("End: " + (to.name || ""));

          // Route points (excluding from/to)
          const routePoints = ${routePoints};
          for (let i = 1; i < routePoints.length - 1; i++) {
            const pt = routePoints[i];
            L.marker([pt.latitude, pt.longitude], {icon: L.icon({iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [24,24]})})
              .addTo(map)
              .bindPopup("Route Point: " + (pt.name || ""));
          }

          // Safe points
          const safePoints = ${safePointsArr};
          for (let i = 0; i < safePoints.length; i++) {
            const pt = safePoints[i];
            L.marker([pt.latitude, pt.longitude], {icon: L.icon({iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190411.png', iconSize: [24,24]})})
              .addTo(map)
              .bindPopup("Safe Point: " + (pt.name || ""));
          }
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
            currentLocation?.latitude || defaultFrom.latitude,
            currentLocation?.longitude || defaultFrom.longitude,
            selectedCoord
          ),
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "locationSelected") {
              // handleMapLocationSelect(data.latitude, data.longitude);
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
          onPress={() => {}} // You can implement getCurrentLocation if needed
        >
          <Text style={styles.currentLocationButtonText}>📍</Text>
        </TouchableOpacity>
      </View>
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
});