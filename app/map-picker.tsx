import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import EventBus from "../utils/eventBus";
import * as Location from "expo-location";
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
  const [webViewReady, setWebViewReady] = useState(false);
  const [useTestMode, setUseTestMode] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setHasLocationPermission(true);
        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({});
        setSelectedCoord({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } else {
        setHasLocationPermission(false);
        Alert.alert(
          "Location Permission Required",
          "This app needs location access to show your current position on the map and allow you to pick locations.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settings",
              onPress: () =>
                Alert.alert(
                  "Settings",
                  "Please enable location permissions in your device settings."
                ),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setHasLocationPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapMessage = async (event: any) => {
    try {
      console.log("Received message from WebView:", event.nativeEvent.data);
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "locationSelected") {
        const { latitude, longitude, placeDetails } = data;
        setSelectedCoord({ latitude, longitude });

        if (placeDetails) {
          setSelectedPlace(placeDetails);
          setTypedLocation(placeDetails.name || placeDetails.address);
        } else {
          // Fallback to coordinates if no place details
          const coordString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setTypedLocation(coordString);
          setSelectedPlace(null);
        }
      } else if (data.type === "webViewReady") {
        setWebViewReady(true);
        console.log("WebView is ready");
      } else if (data.type === "apiKeyError") {
        setMapError("Google Maps API key error: " + data.message);
        setUseTestMode(true);
      }
    } catch (error) {
      console.error("Error handling map message:", error);
    }
  };

  const chooseLocation = () => {
    if (selectedPlace) {
      // Use the place name and details
      const locationToSend = {
        name: selectedPlace.name,
        address: selectedPlace.address,
        coordinates: selectedCoord,
        placeId: selectedPlace.placeId,
        types: selectedPlace.types,
      };
      EventBus.emit("locationPicked", locationToSend);
      router.back();
      return;
    }

    if (selectedCoord) {
      // Use coordinates if no place details
      const locationToSend = {
        name: typedLocation || "Selected Location",
        address: `${selectedCoord.latitude.toFixed(
          5
        )}, ${selectedCoord.longitude.toFixed(5)}`,
        coordinates: selectedCoord,
      };
      EventBus.emit("locationPicked", locationToSend);
      router.back();
      return;
    }

    if (!typedLocation.trim()) {
      Alert.alert(
        "Location required",
        "Please tap on the map or enter a location."
      );
      return;
    }

    EventBus.emit("locationPicked", { name: typedLocation.trim() });
    router.back();
  };

  const renderTestMap = () => {
    const testMapHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif; 
              background: #f0f0f0;
            }
            #map { 
              width: 100%; 
              height: 100vh; 
              background: linear-gradient(45deg, #e0e0e0, #f5f5f5);
              position: relative;
              overflow: hidden;
            }
            .test-instructions {
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              background: white;
              padding: 15px;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              z-index: 1000;
              text-align: center;
            }
            .test-map-grid {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: 
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
              background-size: 20px 20px;
            }
            .clickable-area {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 200px;
              height: 200px;
              background: rgba(0, 122, 255, 0.1);
              border: 2px dashed #007AFF;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #007AFF;
              font-weight: bold;
              text-align: center;
              transition: all 0.3s ease;
            }
            .clickable-area:hover {
              background: rgba(0, 122, 255, 0.2);
              transform: translate(-50%, -50%) scale(1.1);
            }
            .coordinates-display {
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 15px;
              border-radius: 10px;
              text-align: center;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="test-instructions">
            <h3>🧪 Test Mode - Simple Location Picker</h3>
            <p>Click anywhere on the map to select a location</p>
            <p><strong>Note:</strong> Google Maps API key needs to be fixed for full functionality</p>
          </div>
          
          <div id="map">
            <div class="test-map-grid"></div>
            <div class="clickable-area" onclick="selectLocation()">
              🎯<br>Click Here<br>to Select
            </div>
            <div class="coordinates-display" id="coordinates">
              No location selected yet
            </div>
          </div>
          
          <script>
            let selectedLocation = null;
            
            // Make the entire map clickable
            document.getElementById('map').addEventListener('click', function(event) {
              if (event.target.id !== 'map' && !event.target.classList.contains('clickable-area')) {
                return;
              }
              
              const rect = event.target.getBoundingClientRect();
              const x = event.clientX - rect.left;
              const y = event.clientY - rect.top;
              
              // Convert to approximate coordinates (this is just for testing)
              const lat = 5.4164 + (y - rect.height/2) * 0.001;
              const lng = 100.3327 + (x - rect.width/2) * 0.001;
              
              selectLocation(lat, lng);
            });
            
            function selectLocation(lat = null, lng = null) {
              if (lat === null || lng === null) {
                // Use default coordinates for demo
                lat = 5.4164;
                lng = 100.3327;
              }
              
              selectedLocation = { lat, lng };
              
              // Update display
              document.getElementById('coordinates').innerHTML = 
                \`Selected: \${lat.toFixed(6)}, \${lng.toFixed(6)}\`;
              
              // Send to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationSelected',
                latitude: lat,
                longitude: lng,
                placeDetails: {
                  name: 'Test Location',
                  address: \`Test Address at \${lat.toFixed(6)}, \${lng.toFixed(6)}\`,
                  placeId: 'test_place_id',
                  types: ['test_location']
                }
              }));
            }
            
            // Notify React Native that WebView is ready
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'webViewReady',
              message: 'Test map loaded successfully'
            }));
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: testMapHtml }}
          style={styles.map}
          onMessage={handleMapMessage}
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
            setMapError("Failed to load test map.");
          }}
          onLoadStart={() => {
            console.log("Test map load started");
            setMapError(null);
          }}
          onLoadEnd={() => {
            console.log("Test map load ended");
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.mapLoadingText}>Loading Test Map...</Text>
            </View>
          )}
        />
        {!webViewReady && (
          <View style={styles.webViewOverlay}>
            <Text style={styles.webViewOverlayText}>Loading Test Map...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderMap = () => {
    if (isLoading) {
      return (
        <View style={styles.mapPlaceholder}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      );
    }

    if (!hasLocationPermission) {
      return (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.errorText}>Location permission required</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (mapError) {
      return (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.errorText}>Map loading error</Text>
          <Text style={styles.errorSubtext}>{mapError}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={() => setMapError(null)}
            >
              <Text style={styles.permissionButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.permissionButton,
                { backgroundColor: "#34C759", marginLeft: 10 },
              ]}
              onPress={() => setUseTestMode(true)}
            >
              <Text style={styles.permissionButtonText}>Use Test Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // If in test mode, show test map
    if (useTestMode) {
      return renderTestMap();
    }

    // Create HTML for Google Maps with Places API integration
    const mapHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif; 
              background: #f0f0f0;
            }
            #map { 
              width: 100%; 
              height: 100vh; 
              background: #e0e0e0;
            }
            .map-controls {
              position: absolute;
              top: 10px;
              left: 10px;
              z-index: 1000;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 10px;
              max-width: 300px;
            }
            .instructions {
              font-size: 12px;
              color: #666;
              margin-bottom: 8px;
            }
            .debug-info {
              position: absolute;
              bottom: 10px;
              left: 10px;
              background: rgba(0,0,0,0.7);
              color: white;
              padding: 8px;
              border-radius: 4px;
              font-size: 11px;
              z-index: 1000;
            }
          </style>
        </head>
        <body>
          <div class="map-controls">
            <div class="instructions">
              <strong>📍 Tap anywhere on the map to select a location</strong><br>
              Loading Google Maps...
            </div>
          </div>
          <div id="map">
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #666;">
              Loading Google Maps...
            </div>
          </div>
          <div class="debug-info" id="debugInfo">Initializing...</div>
          
          <script>
            console.log('WebView script loaded');
            
            // Notify React Native that WebView is ready
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'webViewReady',
              message: 'WebView loaded successfully'
            }));

            let map;
            let marker;
            let placesService;
            let geocoder;
            let currentLocation = { 
              lat: ${selectedCoord?.latitude || 5.4164}, 
              lng: ${selectedCoord?.longitude || 100.3327} 
            };

            function updateDebugInfo(message) {
              const debugInfo = document.getElementById('debugInfo');
              if (debugInfo) {
                debugInfo.textContent = message;
              }
              console.log('Debug:', message);
            }

            function initMap() {
              updateDebugInfo('Initializing map...');
              
              try {
                map = new google.maps.Map(document.getElementById('map'), {
                  center: currentLocation,
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                updateDebugInfo('Map created successfully');

                // Initialize services
                placesService = new google.maps.places.PlacesService(map);
                geocoder = new google.maps.Geocoder();

                // Add current location marker
                marker = new google.maps.Marker({
                  position: currentLocation,
                  map: map,
                  title: 'Your Location',
                  icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  }
                });

                updateDebugInfo('Marker added');

                // Handle map clicks
                map.addListener('click', function(event) {
                  const clickedLocation = event.latLng;
                  updateDebugInfo('Location clicked: ' + clickedLocation.lat() + ', ' + clickedLocation.lng());
                  
                  // Remove previous marker
                  if (marker) {
                    marker.setMap(null);
                  }
                  
                  // Add new marker at clicked location
                  marker = new google.maps.Marker({
                    position: clickedLocation,
                    map: map,
                    title: 'Selected Location',
                    icon: {
                      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    }
                  });

                  // Get place details for the clicked location
                  getPlaceDetails(clickedLocation);
                });

                updateDebugInfo('Map ready - tap to select location');

                // Try to get user's current location
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    function(position) {
                      const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      };
                      currentLocation = pos;
                      map.setCenter(pos);
                      marker.setPosition(pos);
                      updateDebugInfo('Current location updated');
                    },
                    function() {
                      updateDebugInfo('Error getting current location');
                    }
                  );
                }
              } catch (error) {
                updateDebugInfo('Error initializing map: ' + error.message);
                console.error('Map initialization error:', error);
              }
            }

            function getPlaceDetails(location, placeId = null) {
              updateDebugInfo('Getting place details...');
              
              if (placeId) {
                // Get detailed place information
                const request = {
                  placeId: placeId,
                  fields: ['name', 'formatted_address', 'geometry', 'types', 'formatted_phone_number', 'website', 'rating', 'user_ratings_total']
                };
                
                placesService.getDetails(request, function(place, status) {
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    sendPlaceDetails(location, place);
                  } else {
                    // Fallback to reverse geocoding
                    reverseGeocode(location);
                  }
                });
              } else {
                // Use reverse geocoding for clicked locations
                reverseGeocode(location);
              }
            }

            function reverseGeocode(location) {
              geocoder.geocode({ location: location }, function(results, status) {
                if (status === 'OK' && results[0]) {
                  const result = results[0];
                  const placeDetails = {
                    name: result.formatted_address,
                    address: result.formatted_address,
                    placeId: result.place_id,
                    types: result.types || []
                  };
                  sendPlaceDetails(location, placeDetails);
                } else {
                  // Send coordinates only
                  sendPlaceDetails(location, null);
                }
              });
            }

            function sendPlaceDetails(location, placeDetails) {
              const data = {
                type: 'locationSelected',
                latitude: location.lat(),
                longitude: location.lng(),
                placeDetails: placeDetails
              };
              
              updateDebugInfo('Sending location data...');
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }

            // Handle Google Maps API load errors
            window.gm_authFailure = function() {
              updateDebugInfo('Google Maps API authentication failed');
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'apiKeyError',
                message: 'API key authentication failed'
              }));
            };

            // Set a timeout to check if Google Maps loads
            setTimeout(function() {
              if (!map) {
                updateDebugInfo('Google Maps failed to load - check API key');
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'apiKeyError',
                  message: 'Google Maps failed to load'
                }));
              }
            }, 10000);
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBN2Snf3Mszi0DGC7Syu6aAuxIQ_v_f3bA&libraries=places&callback=initMap">
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: mapHtml }}
          style={styles.map}
          onMessage={handleMapMessage}
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
            setMapError(
              "Failed to load map. Please check your internet connection."
            );
          }}
          onHttpError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView HTTP error: ", nativeEvent);
          }}
          onLoadStart={() => {
            console.log("WebView load started");
            setMapError(null);
          }}
          onLoadEnd={() => {
            console.log("WebView load ended");
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.mapLoadingText}>Loading Google Maps...</Text>
            </View>
          )}
        />
        {!webViewReady && (
          <View style={styles.webViewOverlay}>
            <Text style={styles.webViewOverlayText}>
              Loading Google Maps...
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pick a Location</Text>

      {renderMap()}

      {selectedPlace && (
        <View style={styles.placeContainer}>
          <Text style={styles.placeLabel}>Selected Place:</Text>
          <Text style={styles.placeName}>{selectedPlace.name}</Text>
          <Text style={styles.placeAddress}>{selectedPlace.address}</Text>
          {selectedPlace.types && selectedPlace.types.length > 0 && (
            <View style={styles.placeTypes}>
              {selectedPlace.types.slice(0, 3).map((type, index) => (
                <View key={index} style={styles.typeTag}>
                  <Text style={styles.typeText}>{type.replace(/_/g, " ")}</Text>
                </View>
              ))}
            </View>
          )}
          {selectedPlace.phoneNumber && (
            <Text style={styles.placeDetail}>
              📞 {selectedPlace.phoneNumber}
            </Text>
          )}
          {selectedPlace.website && (
            <Text style={styles.placeDetail}>🌐 {selectedPlace.website}</Text>
          )}
          {selectedPlace.rating && (
            <Text style={styles.placeDetail}>
              ⭐ {selectedPlace.rating}/5 ({selectedPlace.userRatingsTotal}{" "}
              reviews)
            </Text>
          )}
        </View>
      )}

      {selectedCoord && !selectedPlace && (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesLabel}>Selected Coordinates:</Text>
          <Text style={styles.coordinatesText}>
            {selectedCoord.latitude.toFixed(6)},{" "}
            {selectedCoord.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Or type a location manually"
        placeholderTextColor="#888"
        value={typedLocation}
        onChangeText={setTypedLocation}
      />

      <TouchableOpacity style={styles.submitButton} onPress={chooseLocation}>
        <Text style={styles.submitText}>Use this Location</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  mapContainer: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    position: "relative",
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    borderRadius: 12,
  },
  mapPlaceholder: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff3b30",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
  },
  addressContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
  },
  mapLoading: {
    width: Dimensions.get("window").width - 32,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mapLoadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  webViewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  webViewOverlayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  placeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  placeTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: "#007AFF",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  placeDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  coordinatesContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  coordinatesLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 14,
    color: "#333",
  },
  errorActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
