import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import EventBus from "../utils/eventBus";
import * as ImagePicker from "expo-image-picker";

const CATEGORIES = [
  "Safety Alerts",
  "Facility Issues",
  "PSA & Safety Tips",
  "General"
] as const;

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

export default function CreatePostScreen() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [locationText, setLocationText] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  React.useEffect(() => {
    const unsub = EventBus.addListener(
      "locationPicked",
      (loc: LocationData | string) => {
        if (typeof loc === "string") {
          // Handle legacy string format
          setLocationText(loc);
          setLocationData(null);
        } else {
          // Handle new object format from map-picker
          setLocationText(loc.name);
          setLocationData(loc);
        }
      }
    );
    return () => unsub();
  }, []);

  const onUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow location access in settings."
        );
        return;
      }

      // Show loading state
      Alert.alert(
        "Getting location",
        "Please wait while we get your current location..."
      );

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = loc.coords;

      // Use reverse geocoding to get human-readable address
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

          const readableAddress = addressParts.join(", ");

          // Try to get a more specific place name
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

          setLocationText(placeName);

          // Store location data with coordinates
          setLocationData({
            name: placeName,
            address: readableAddress,
            coordinates: { latitude, longitude },
          });

          // Confirm location was set
          Alert.alert(
            "Location set",
            `Your current location has been set to: ${placeName}`
          );
        } else {
          // Fallback to coordinates if reverse geocoding fails
          const locationString = `${latitude.toFixed(5)}, ${longitude.toFixed(
            5
          )}`;
          setLocationText("Current Location");

          // Store location data with coordinates
          setLocationData({
            name: "Current Location",
            address: locationString,
            coordinates: { latitude, longitude },
          });

          Alert.alert(
            "Location set",
            `Your current location has been set to: ${locationString}`
          );
        }
      } catch (geocodeError) {
        console.error("Reverse geocoding error:", geocodeError);
        // Fallback to coordinates if reverse geocoding fails
        const locationString = `${latitude.toFixed(5)}, ${longitude.toFixed(
          5
        )}`;
        setLocationText("Current Location");

        // Store location data with coordinates
        setLocationData({
          name: "Current Location",
          address: locationString,
          coordinates: { latitude, longitude },
        });

        Alert.alert(
          "Location set",
          `Your current location has been set to: ${locationString}`
        );
      }
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert(
        "Location Error",
        "Failed to get your current location. Please try again or enter location manually."
      );
    }
  };

  const pickImagesFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow media access to upload images."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 0,
    });
    if (!result.canceled) {
      const uris = result.assets?.map((a) => a.uri) ?? [];
      setGalleryImages((prev) => [...prev, ...uris]);
    }
  };

  const onSubmit = () => {
    if (!content.trim()) {
      Alert.alert("Missing field", "Content is required.");
      return;
    }
    if (!category) {
      Alert.alert("Missing field", "Please select a tag (category).");
      return;
    }
    if (!locationText.trim()) {
      Alert.alert("Missing field", "Location is required.");
      return;
    }

    const images = imageUrls
      .split(/\n|,/) // supports comma or newline separated URLs
      .map((s) => s.trim())
      .filter((s) => !!s);
    const allImages = [...galleryImages, ...images];

    const newPost = {
      id: Date.now().toString(),
      author: "You",
      content: content.trim(),
      images: allImages,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      category: category as any,
      escalationStatus: "none" as const,
      escalationThreshold: 500,
      location: locationText.trim(),
      locationData: locationData, // Include coordinates and place details
    };

    EventBus.emit("postCreated", newPost);
    Alert.alert("Success", "Your post has been created.");
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.title}>Create Community Post</Text>

      <Text style={styles.label}>Content (required)</Text>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Write your post content..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={6}
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Tag / Category (required)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipSelected]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={[
                styles.chipText,
                category === c && styles.chipTextSelected,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Image URLs (optional)</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Paste one or more image URLs (comma or newline separated)"
          placeholderTextColor="#888"
          value={imageUrls}
          onChangeText={setImageUrls}
          multiline
        />
        {!!imageUrls.trim() && (
          <TouchableOpacity
            style={{
              backgroundColor: "#FF3B30",
              borderRadius: 8,
              padding: 8,
            }}
            onPress={() => setImageUrls("")}
          >
            <Ionicons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={pickImagesFromGallery}
        >
          <Ionicons name="image" size={16} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        {!!galleryImages.length && (
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { backgroundColor: "#FF3B30", borderColor: "#FF3B30" },
            ]}
            onPress={() => setGalleryImages([])}
          >
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={[styles.secondaryButtonText, { color: "#fff" }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!!galleryImages.length && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {galleryImages.map((uri, index) => (
            <View key={uri} style={{ position: "relative" }}>
              <Image
                source={{ uri }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 10,
                  marginRight: 8,
                }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: -5,
                  right: 5,
                  backgroundColor: "#FF3B30",
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setGalleryImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Text style={styles.label}>Location (required)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a location or address"
        placeholderTextColor="#888"
        value={locationText}
        onChangeText={setLocationText}
      />
      {locationData && locationData.coordinates && (
        <View style={styles.coordinatesDisplay}>
          <Text style={styles.coordinatesLabel}>📍 Coordinates:</Text>
          <Text style={styles.coordinatesText}>
            {locationData.coordinates.latitude.toFixed(6)},{" "}
            {locationData.coordinates.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onUseCurrentLocation}
        >
          <Ionicons name="navigate" size={16} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Use Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/map-picker")}
        >
          <Ionicons name="map" size={16} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Pick on Map</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Submit Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: { color: "#333", fontWeight: "600" },
  chipTextSelected: { color: "#fff" },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryButtonText: { color: "#007AFF", fontWeight: "600" },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "700" },
  coordinatesDisplay: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  coordinatesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 2,
  },
  coordinatesText: {
    fontSize: 11,
    color: "#666",
    fontFamily: "monospace",
  },
});
