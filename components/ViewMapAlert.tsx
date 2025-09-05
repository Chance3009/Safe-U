import { useState, useEffect } from "react";
import WebView from "react-native-webview";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";

interface AdminAlert {
  id: string;
  title: string;
  description: string;
  category: "emergency" | "announcement" | "facility" | "weather";
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius?: number;
  verifiedBy: string;
  expiresAt?: string;
}

interface ViewMapAlertProps {
  alerts: AdminAlert[];
  selectedAlertId?: string;
  mapHeight?: number;
  darkMode?: boolean;
  style?: any;
}

export default function ViewMapAlert({
  alerts = [],
  selectedAlertId,
  mapHeight = 300,
  darkMode = false,
  style,
}: ViewMapAlertProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 5.4164, // USM coordinates
    longitude: 100.3327,
  });

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency":
        return "#FF4444";
      case "announcement":
        return "#FF9500";
      case "facility":
        return "#007AFF";
      case "weather":
        return "#FFD700";
      default:
        return "#34C759";
    }
  };

  const getSeverityOpacity = (severity: string) => {
    switch (severity) {
      case "critical":
        return 1.0;
      case "high":
        return 0.8;
      case "medium":
        return 0.6;
      case "low":
        return 0.4;
      default:
        return 0.6;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "emergency":
        return "⚠️";
      case "announcement":
        return "📢";
      case "facility":
        return "🔧";
      case "weather":
        return "🌧️";
      default:
        return "ℹ️";
    }
  };

  const generateMapHTML = () => {
    const alertsData = JSON.stringify(alerts);
    const centerLat = alerts.length > 0 ? alerts[0].coordinates.latitude : currentLocation.latitude;
    const centerLng = alerts.length > 0 ? alerts[0].coordinates.longitude : currentLocation.longitude;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
          .alert-marker {
            border-radius: 50%;
            text-align: center;
            font-size: 18px;
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          }
          .alert-selected { 
            border-color: #000000;
            border-width: 4px;
            transform: scale(1.2);
          }
          .pulsing {
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 20px rgba(255, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          let map = L.map('map').setView([${centerLat}, ${centerLng}], 16);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          const alerts = ${alertsData};
          const selectedAlertId = "${selectedAlertId || ''}";

          // Function to get category color
          function getCategoryColor(category) {
            switch (category) {
              case "emergency": return "#FF4444";
              case "announcement": return "#FF9500";
              case "facility": return "#007AFF";
              case "weather": return "#FFD700";
              default: return "#34C759";
            }
          }

          // Function to get category icon
          function getCategoryIcon(category) {
            switch (category) {
              case "emergency": return "⚠️";
              case "announcement": return "📢";
              case "facility": return "🔧";
              case "weather": return "🌧️";
              default: return "ℹ️";
            }
          }

          // Function to get severity opacity
          function getSeverityOpacity(severity) {
            switch (severity) {
              case "critical": return 1.0;
              case "high": return 0.8;
              case "medium": return 0.6;
              case "low": return 0.4;
              default: return 0.6;
            }
          }

          // Add alert markers
          alerts.forEach(alert => {
            const categoryColor = getCategoryColor(alert.category);
            const categoryIcon = getCategoryIcon(alert.category);
            const opacity = getSeverityOpacity(alert.severity);
            const isSelected = alert.id === selectedAlertId;
            const isCritical = alert.severity === 'critical';

            // Create alert area circle if radius is provided
            if (alert.radius) {
              L.circle([alert.coordinates.latitude, alert.coordinates.longitude], {
                color: categoryColor,
                fillColor: categoryColor,
                fillOpacity: 0.2,
                radius: alert.radius,
                weight: 2
              }).addTo(map);
            }

            // Create alert marker
            const alertIcon = L.divIcon({
              className: \`alert-marker \${isSelected ? 'alert-selected' : ''} \${isCritical ? 'pulsing' : ''}\`,
              html: \`<div style="
                width: \${isSelected ? 50 : 40}px; 
                height: \${isSelected ? 50 : 40}px; 
                background-color: \${categoryColor}; 
                border: \${isSelected ? '4px' : '3px'} solid white; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: \${isSelected ? '22px' : '18px'}; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                opacity: \${opacity};
              ">\${categoryIcon}</div>\`,
              iconSize: [isSelected ? 50 : 40, isSelected ? 50 : 40],
              iconAnchor: [isSelected ? 25 : 20, isSelected ? 25 : 20],
              popupAnchor: [0, isSelected ? -25 : -20]
            });

            L.marker([alert.coordinates.latitude, alert.coordinates.longitude], { icon: alertIcon })
              .addTo(map)
              .bindPopup(\`
                <div style="text-align: center; min-width: 250px; padding: 8px;">
                  <div style="margin-bottom: 12px;">
                    <span style="font-size: 24px;">\${categoryIcon}</span>
                    <strong style="display: block; margin-top: 4px; font-size: 16px;">\${alert.title}</strong>
                  </div>
                  
                  <div style="margin-bottom: 12px;">
                    <span style="
                      background-color: \${categoryColor}; 
                      color: white; 
                      padding: 4px 8px; 
                      border-radius: 12px; 
                      font-size: 10px; 
                      font-weight: bold;
                      text-transform: uppercase;
                    ">\${alert.severity}</span>
                  </div>
                  
                  <div style="text-align: left; margin-bottom: 12px;">
                    <p style="margin: 4px 0; font-size: 14px;">\${alert.description}</p>
                  </div>
                  
                  <div style="text-align: left; font-size: 12px; color: #666;">
                    <div style="margin: 2px 0;"><strong>📍 Location:</strong> \${alert.location}</div>
                    <div style="margin: 2px 0;"><strong>🕒 Time:</strong> \${alert.timestamp}</div>
                    <div style="margin: 2px 0;"><strong>✅ Verified by:</strong> \${alert.verifiedBy}</div>
                    \${alert.expiresAt ? \`<div style="margin: 2px 0;"><strong>⏰ Expires:</strong> \${alert.expiresAt}</div>\` : ''}
                    \${alert.radius ? \`<div style="margin: 2px 0;"><strong>📏 Radius:</strong> \${alert.radius}m</div>\` : ''}
                  </div>
                </div>
              \`);
          });

          // Fit map to show all alerts
          if (alerts.length > 0) {
            const allPoints = alerts.map(alert => [alert.coordinates.latitude, alert.coordinates.longitude]);
            
            if (allPoints.length === 1) {
              // If only one alert, center on it with high zoom
              map.setView([allPoints[0][0], allPoints[0][1]], 17);
            } else if (allPoints.length > 1) {
              // If multiple alerts, fit bounds but with less padding
              const group = new L.featureGroup(allPoints.map(point => L.marker(point)));
              map.fitBounds(group.getBounds().pad(0.05));
              
              // Ensure minimum zoom level
              if (map.getZoom() < 15) {
                map.setZoom(15);
              }
            }
          }

          // Handle map clicks to send location data back to React Native
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
        source={{ html: generateMapHTML() }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "locationSelected") {
              console.log("Location selected:", data.latitude, data.longitude);
            }
          } catch (error) {
            console.error("Error parsing map message:", error);
          }
        }}
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
        
        {/* Alert Legend */}
        <View style={[styles.legend, { backgroundColor: darkMode ? "#1c1c1e" : "#ffffff" }]}>
          <Text style={[styles.legendTitle, { color: darkMode ? "#ffffff" : "#000000" }]}>
            Alert Types
          </Text>
          <View style={styles.legendItems}>
            {[
              { category: "emergency", label: "Emergency", icon: "⚠️" },
              { category: "facility", label: "Facility", icon: "🔧" },
              { category: "weather", label: "Weather", icon: "🌧️" },
              { category: "announcement", label: "News", icon: "📢" },
            ].map((item) => (
              <View key={item.category} style={styles.legendItem}>
                <Text style={styles.legendIcon}>{item.icon}</Text>
                <View style={[styles.legendDot, { backgroundColor: getCategoryColor(item.category) }]} />
                <Text style={[styles.legendText, { color: darkMode ? "#ffffff" : "#000000" }]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Severity Legend */}
          <Text style={[styles.legendTitle, { color: darkMode ? "#ffffff" : "#000000", marginTop: 12 }]}>
            Severity
          </Text>
          <View style={styles.legendItems}>
            {[
              { severity: "critical", label: "Critical", opacity: 1.0 },
              { severity: "high", label: "High", opacity: 0.8 },
              { severity: "medium", label: "Medium", opacity: 0.6 },
              { severity: "low", label: "Low", opacity: 0.4 },
            ].map((item) => (
              <View key={item.severity} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#FF4444", opacity: item.opacity }]} />
                <Text style={[styles.legendText, { color: darkMode ? "#ffffff" : "#000000" }]}>
                  {item.label}
                </Text>
              </View>
            ))}
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
    maxWidth: 150,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendIcon: {
    fontSize: 12,
    width: 16,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: "500",
    flex: 1,
  },
});