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
    latitude: 5.3552777,
    longitude:  100.299861,
    name: "Start",
  };
  const defaultTo = toLocation || {
    latitude: 5.355278,
    longitude: 100.297472,
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
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
          .leaflet-routing-container { display: none; } /* Hide routing instructions */
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
        <script>
          let map = L.map('map').setView([${centerLat}, ${centerLng}], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // From and To locations
          const from = ${from};
          const to = ${to};

          // Add START marker (green)
          L.marker([from.latitude, from.longitude], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(map).bindPopup("🚀 Start: " + (from.name || ""));

          // Add END marker (red)
          L.marker([to.latitude, to.longitude], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          }).addTo(map).bindPopup("🏁 End: " + (to.name || ""));

          // Create ROAD-FOLLOWING route with Leaflet Routing Machine
          L.Routing.control({
            waypoints: [
              L.latLng(from.latitude, from.longitude),
              L.latLng(to.latitude, to.longitude)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            createMarker: function() { return null; }, // Don't create default markers
            lineOptions: {
              styles: [
                {
                  color: '#34C759',
                  weight: 6,
                  opacity: 0.8
                }
              ]
            },
            show: false, // Hide turn-by-turn directions
            collapsible: false
          }).addTo(map);

          // Safe points with orange markers
          const safePoints = ${safePointsArr};
          for (let i = 0; i < safePoints.length; i++) {
            const pt = safePoints[i];
            L.marker([pt.latitude, pt.longitude], {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [20, 32],
                iconAnchor: [10, 32],
                popupAnchor: [1, -24],
                shadowSize: [32, 32]
              })
            })
            .addTo(map)
            .bindPopup("🛡️ Safe Point: " + (pt.name || ""));
          }

          // Route points (intermediate waypoints)
          const routePoints = ${routePoints};
          for (let i = 1; i < routePoints.length - 1; i++) {
            const pt = routePoints[i];
            L.marker([pt.latitude, pt.longitude], {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [15, 24],
                iconAnchor: [7, 24],
                popupAnchor: [1, -18],
                shadowSize: [24, 24]
              })
            })
            .addTo(map)
            .bindPopup("📍 Waypoint: " + (pt.name || ""));
          }

          // Auto-fit bounds after a short delay to allow routing to complete
          setTimeout(() => {
            const group = new L.featureGroup([
              L.marker([from.latitude, from.longitude]),
              L.marker([to.latitude, to.longitude])
            ]);
            map.fitBounds(group.getBounds().pad(0.2));
          }, 1000);
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