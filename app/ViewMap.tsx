import { useState } from "react";
import WebView from "react-native-webview";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Location from "expo-location";

export default function ViewMap({mapHeight=300}: {mapHeight: number}) {
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

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 3.1385,
    longitude: 101.6865,
  });

  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  const [mapError, setMapError] = useState<string | null>(null);

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
          let selectedLocation = ${selectedCoord ? JSON.stringify(selectedCoord) : "null"
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

  {/* Interactive Map */ }
  return (
    <View style={[styles.mapContainer, { height: mapHeight }]}>
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
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: "relative",
    // height will be set dynamically via inline style
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
})