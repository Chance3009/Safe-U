import { useState, useEffect } from "react";
import WebView from "react-native-webview";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";

interface Bus {
  id: string;
  name: string;
  code: string;
  location: string;
  eta: string;
  status: string;
  route: string;
  latitude: number;
  longitude: number;
}

interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface ViewMapBusProps {
  buses: Bus[];
  busStops: BusStop[];
  selectedBusId?: string;
  mapHeight?: number;
  darkMode?: boolean;
  style?: any;
}

export default function ViewMapBus({
  buses = [],
  busStops = [],
  selectedBusId,
  mapHeight = 300,
  darkMode = false,
  style,
}: ViewMapBusProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.7749, // Default San Francisco coordinates
    longitude: -122.4194,
  });

  // Get user's current location
  const getCurrentLocation = async () => {
    // Uncomment below to enable real location fetching
    // try {
    //   const { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status === "granted") {
    //     const location = await Location.getCurrentPositionAsync({});
    //     setCurrentLocation({
    //       latitude: location.coords.latitude,
    //       longitude: location.coords.longitude,
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error getting location:", error);
    // }
    setCurrentLocation({
      latitude: 5.3552777,
      longitude: 100.299861,
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const generateMapHTML = () => {
    const busesData = JSON.stringify(buses);
    const busStopsData = JSON.stringify(busStops);
    const centerLat = busStops.length > 0 ? busStops[0].latitude : currentLocation.latitude;
    const centerLng = busStops.length > 0 ? busStops[0].longitude : currentLocation.longitude;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
          .bus-marker {
            border-radius: 50%;
            text-align: center;
            font-size: 16px;
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .bus-active { background-color: #007AFF; }
          .bus-selected { background-color: #34C759; }
          .bus-inactive { background-color: #999999; }
          .bus-stop-marker {
            background-color: #FF9500;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          let map = L.map('map').setView([${centerLat}, ${centerLng}], 14);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          const buses = ${busesData};
          const busStops = ${busStopsData};
          const selectedBusId = "${selectedBusId || ''}";

          // Add bus stop markers
          busStops.forEach(stop => {
            const busStopIcon = L.divIcon({
              className: 'bus-stop-marker',
              html: '<div style="width: 20px; height: 20px; background-color: #FF9500; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: bold;">🚏</div>',
              iconSize: [26, 26],
              iconAnchor: [13, 13],
              popupAnchor: [0, -13]
            });

            L.marker([stop.latitude, stop.longitude], { icon: busStopIcon })
              .addTo(map)
              .bindPopup(\`
                <div style="text-align: center;">
                  <strong>🚏 \${stop.name}</strong><br>
                  <small>Bus Stop</small>
                </div>
              \`);
          });

          // Add bus markers with dynamic locations
          buses.forEach((bus, index) => {
            // Generate realistic coordinates around bus stops for demo
            const baseLat = busStops[index % busStops.length]?.latitude || 37.7749;
            const baseLng = busStops[index % busStops.length]?.longitude || -122.4194;
            
            // Add small random offset to simulate bus movement
            const lat = baseLat + (Math.random() - 0.5) * 0.01;
            const lng = baseLng + (Math.random() - 0.5) * 0.01;

            let statusClass = 'bus-inactive';
            let statusColor = '#999999';
            
            // Check if this bus is selected FIRST, then check original status
            if (bus.id === selectedBusId) {
              statusClass = 'bus-selected';
              statusColor = '#34C759';
            } else if (bus.status === 'active') {
              statusClass = 'bus-active';
              statusColor = '#007AFF';
            }

            const busIcon = L.divIcon({
              className: 'bus-marker ' + statusClass,
              html: \`<div style="width: 40px; height: 40px; background-color: \${statusColor}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🚌</div>\`,
              iconSize: [46, 46],
              iconAnchor: [23, 23],
              popupAnchor: [0, -23]
            });

            L.marker([lat, lng], { icon: busIcon })
              .addTo(map)
              .bindPopup(\`
                <div style="text-align: center; min-width: 200px;">
                  <strong>🚌 \${bus.name}</strong><br>
                  <strong>Code:</strong> \${bus.code}<br>
                  <strong>Route:</strong> \${bus.route}<br>
                  <strong>ETA:</strong> \${bus.eta}<br>
                  <strong>Status:</strong> <span style="color: \${statusColor}; font-weight: bold;">\${bus.status.toUpperCase()}</span><br>
                  <small>\${bus.location}</small>
                </div>
              \`);
          });

          // Fit map to show all markers
          if (buses.length > 0 || busStops.length > 0) {
            const allPoints = [
              ...buses.map((bus, index) => {
                const baseLat = busStops[index % busStops.length]?.latitude || 37.7749;
                const baseLng = busStops[index % busStops.length]?.longitude || -122.4194;
                return [baseLat + (Math.random() - 0.5) * 0.01, baseLng + (Math.random() - 0.5) * 0.01];
              }),
              ...busStops.map(stop => [stop.latitude, stop.longitude])
            ];
            
            if (allPoints.length > 0) {
              const group = new L.featureGroup(allPoints.map(point => L.marker(point)));
              map.fitBounds(group.getBounds().pad(0.1));
            }
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
        source={{ html: generateMapHTML() }}
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
        
        {/* Bus Legend */}
        <View style={[styles.legend, { backgroundColor: darkMode ? "#1c1c1e" : "#ffffff" }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#34C759" }]} />
            <Text style={[styles.legendText, { color: darkMode ? "#ffffff" : "#000000" }]}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#007AFF" }]} />
            <Text style={[styles.legendText, { color: darkMode ? "#ffffff" : "#000000" }]}>Active</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF9500" }]} />
            <Text style={[styles.legendText, { color: darkMode ? "#ffffff" : "#000000" }]}>Stop</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: "relative",
    minHeight: 250, // Add minimum height
  },
  map: {
    flex: 1,
    minHeight: 250, // Add minimum height
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLocationButtonText: {
    fontSize: 24,
  },
  legend: {
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
  },
});