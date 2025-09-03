import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { useRouter } from "expo-router";
import EventBus from "../utils/eventBus";
import * as Location from "expo-location";

export default function MapPickerScreen() {
  const router = useRouter();
  const [typedLocation, setTypedLocation] = useState("");
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const reverseGeocodeResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocodeResult.length > 0) {
        const address = reverseGeocodeResult[0];
        const addressParts = [
          address.street,
          address.district,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean);

        return addressParts.join(", ");
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });

    // Get human-readable address
    const address = await getAddressFromCoordinates(latitude, longitude);
    if (address) {
      setSelectedAddress(address);
      setTypedLocation(address);
    } else {
      // Fallback to coordinates if geocoding fails
      const coordString = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      setSelectedAddress(coordString);
      setTypedLocation(coordString);
    }
  };

  const chooseLocation = () => {
    if (selectedCoord) {
      // Use the human-readable address if available, otherwise use coordinates
      const locationToSend =
        selectedAddress ||
        `${selectedCoord.latitude.toFixed(
          5
        )}, ${selectedCoord.longitude.toFixed(5)}`;
      EventBus.emit("locationPicked", locationToSend);
      router.back();
      return;
    }
    if (!typedLocation.trim()) {
      Alert.alert(
        "Location required",
        "Please tap on map or enter a location."
      );
      return;
    }
    EventBus.emit("locationPicked", typedLocation.trim());
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a Location</Text>
      <MapView
        style={{
          width: Dimensions.get("window").width - 32,
          height: 300,
          borderRadius: 12,
        }}
        initialRegion={{
          latitude: 5.4164,
          longitude: 100.3327,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {selectedCoord && <Marker coordinate={selectedCoord} />}
      </MapView>

      {selectedAddress && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Selected Address:</Text>
          <Text style={styles.addressText}>{selectedAddress}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
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
  submitText: { color: "#fff", fontWeight: "700" },
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
});
