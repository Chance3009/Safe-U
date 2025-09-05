import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Switch,
  Image,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import reportData from "./reportData.json";
import styles from "../../styles/reportStyles";
import EventBus from "../../../utils/eventBus";

interface ReportItem {
  id: string;
  title: string;
  category: string;
  status: "open" | "acknowledged" | "resolved";
  date: string;
  description: string;
  images: string[];
  videos: string[];
  isAnonymous: boolean;
  location?: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
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

export default function ReportScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [reportType, setReportType] = useState("security");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  // Location states
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationHighlight, setLocationHighlight] = useState(false);
  const highlightAnimation = useState(new Animated.Value(0))[0];

  // Report viewing and editing states
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVideos, setEditVideos] = useState<string[]>([]);
  const [editIsAnonymous, setEditIsAnonymous] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const categories = reportData.categories;

  // Listen for location data from map-picker
  useEffect(() => {
    const handleLocationPicked = (locationData: LocationData) => {
      setSelectedLocation(locationData);
      setShowLocationInput(true);
      setLocationHighlight(false);
    };

    const unsubscribe = EventBus.addListener(
      "locationPicked",
      handleLocationPicked
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Highlight animation for location buttons
  useEffect(() => {
    if (locationHighlight) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(highlightAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(highlightAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      highlightAnimation.setValue(0);
    }
  }, [locationHighlight, highlightAnimation]);

  const [reportStatuses, setReportStatuses] = useState<ReportItem[]>(
    reportData.reportStatuses.map((item: any) => ({
      ...item,
      description: item.description ?? "",
      images: item.images ?? [],
      videos: item.videos ?? [],
      isAnonymous: item.isAnonymous ?? false,
    }))
  );

  const handleVoiceReport = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate audio-to-text conversion
      const mockTranscription =
        "I witnessed a suspicious person loitering around the library entrance around 3 PM today. They were acting strangely and made me feel uncomfortable.";
      setReportDescription(mockTranscription);
      Alert.alert(
        "Recording Stopped",
        "Your voice report has been converted to text and added to the Detailed Description field."
      );
    } else {
      setIsRecording(true);
      Alert.alert(
        "Recording Started",
        "Hold the button and speak your report. Release when done."
      );
      // TODO: Implement actual voice recording
      setTimeout(() => {
        setIsRecording(false);
        Alert.alert(
          "Recording Complete",
          "Your voice report has been processed and converted to text."
        );
      }, 5000);
    }
  };

  const handleMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access to get your current location."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

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

          const locationData: LocationData = {
            name: placeName,
            address: readableAddress,
            coordinates: coords,
            placeId: `current_${Date.now()}`,
            types: ["point_of_interest"],
          };

          setSelectedLocation(locationData);
          setShowLocationInput(true);
          setLocationHighlight(false);
        }
      } catch (geocodeError) {
        console.error("Reverse geocoding error:", geocodeError);
        const locationData: LocationData = {
          name: "Current Location",
          address: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(
            6
          )}`,
          coordinates: coords,
          placeId: `current_${Date.now()}`,
          types: ["point_of_interest"],
        };

        setSelectedLocation(locationData);
        setShowLocationInput(true);
        setLocationHighlight(false);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        "Location Error",
        "Failed to get your current location. Please try again or use the map picker."
      );
    }
  };

  const handleMapPicker = () => {
    router.push("/map-picker");
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setShowLocationInput(false);
  };

  const handleCategorySelection = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "other") {
      setShowCustomCategoryInput(true);
    } else {
      setShowCustomCategoryInput(false);
      setCustomCategory("");
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
      setUploadedImages((prev) => [...prev, ...uris]);
    }
  };

  const pickVideoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow media access to upload videos."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      quality: 0.8,
      videoMaxDuration: 60, // 60 seconds max
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const videoUri = result.assets[0].uri;
      // Check if it's MP4 format
      if (videoUri.toLowerCase().includes(".mp4")) {
        setUploadedVideos((prev) => [...prev, videoUri]);
      } else {
        Alert.alert("Invalid Format", "Please select an MP4 video file.");
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setUploadedImages([]);
  };

  const clearAllVideos = () => {
    setUploadedVideos([]);
  };

  const handleSubmitReport = () => {
    const finalCategory =
      selectedCategory === "other" ? customCategory : selectedCategory;

    if (!reportTitle || !reportDescription || !finalCategory) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields: Report Title, Detailed Description, and Report Category."
      );
      return;
    }

    if (selectedCategory === "other" && !customCategory.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter a custom category name."
      );
      return;
    }

    if (!selectedLocation) {
      Alert.alert(
        "Location Required",
        "Please select a location for your report using 'My Location' or '2.5D Map' button.",
        [{ text: "OK", onPress: () => setLocationHighlight(true) }]
      );
      return;
    }

    // Create new report
    const newReport: ReportItem = {
      id: (reportStatuses.length + 1).toString(),
      title: reportTitle,
      category: finalCategory,
      status: "open",
      date: new Date().toISOString().split("T")[0],
      description: reportDescription,
      images: [...uploadedImages],
      videos: [...uploadedVideos],
      isAnonymous: isAnonymous,
      location: selectedLocation
        ? {
            name: selectedLocation.name,
            address: selectedLocation.address,
            coordinates: selectedLocation.coordinates,
          }
        : undefined,
    };

    // Add to reports list
    setReportStatuses((prev) => [newReport, ...prev]);

    Alert.alert(
      "Report Submitted",
      "Your report has been submitted successfully. Campus security will review it shortly.",
      [{ text: "OK" }]
    );

    // Reset form
    setReportTitle("");
    setReportDescription("");
    setSelectedCategory("");
    setCustomCategory("");
    setShowCustomCategoryInput(false);
    setUploadedImages([]);
    setUploadedVideos([]);
    setIsAnonymous(false);
    setSelectedLocation(null);
    setShowLocationInput(false);
    setLocationHighlight(false);
  };

  const viewReportDetails = (report: ReportItem) => {
    setSelectedReport(report);
    setShowReportModal(true);
    setIsEditing(false);
  };

  const editReport = (report: ReportItem) => {
    setSelectedReport(report);
    setEditTitle(report.title);
    setEditDescription(report.description);
    setEditCategory(report.category);
    setEditCustomCategory(report.category === "Other" ? report.category : "");
    setEditImages([...report.images]);
    setEditVideos([...report.videos]);
    setEditIsAnonymous(report.isAnonymous);
    setShowReportModal(true);
    setIsEditing(true);
  };

  const saveEditedReport = () => {
    if (!editTitle || !editDescription || !editCategory) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    if (selectedReport) {
      const updatedReport: ReportItem = {
        ...selectedReport,
        title: editTitle,
        description: editDescription,
        category: editCategory,
        images: editImages,
        videos: editVideos,
        isAnonymous: editIsAnonymous,
      };

      setReportStatuses((prev) =>
        prev.map((r) => (r.id === selectedReport.id ? updatedReport : r))
      );

      Alert.alert("Success", "Report updated successfully.");
      setShowReportModal(false);
      setSelectedReport(null);
      setIsEditing(false);
    }
  };

  const deleteReport = (reportId: string) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setReportStatuses((prev) => prev.filter((r) => r.id !== reportId));
            if (selectedReport?.id === reportId) {
              setShowReportModal(false);
              setSelectedReport(null);
            }
            Alert.alert("Success", "Report deleted successfully.");
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#FF4444";
      case "acknowledged":
        return "#FF9500";
      case "resolved":
        return "#34C759";
      default:
        return "#666666";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return "time";
      case "acknowledged":
        return "checkmark-circle";
      case "resolved":
        return "checkmark-done-circle";
      default:
        return "help-circle";
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#ffffff" },
      ]}
    >
      {/* Voice Report Section */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          Voice Report
        </Text>

        <TouchableOpacity
          style={[
            styles.voiceButton,
            { backgroundColor: isRecording ? "#FF4444" : "#007AFF" },
          ]}
          onPress={handleVoiceReport}
        >
          <Ionicons
            name={isRecording ? "stop-circle" : "mic"}
            size={40}
            color="white"
          />
          <Text style={styles.voiceButtonText}>
            {isRecording ? "Recording..." : "Hold to Record Report"}
          </Text>
          <Text style={styles.voiceButtonSubtext}>
            {isRecording
              ? "Release to stop recording"
              : "10-second hold-to-talk"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Manual Report Form */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          Manual Report
        </Text>

        {/* Category Selection */}
        <Text
          style={[styles.formLabel, { color: isDark ? "#ffffff" : "#000000" }]}
        >
          Report Category *
        </Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                selectedCategory === category.id && {
                  borderColor: category.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleCategorySelection(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={24}
                color={category.color}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Category Input */}
        {showCustomCategoryInput && (
          <View style={styles.customCategoryContainer}>
            <Text
              style={[
                styles.formLabel,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Custom Category Name *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: isDark ? "#333333" : "#f0f0f0",
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
              placeholder="Enter custom category name"
              placeholderTextColor={isDark ? "#999999" : "#666666"}
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          </View>
        )}

        {/* Report Title */}
        <Text
          style={[styles.formLabel, { color: isDark ? "#ffffff" : "#000000" }]}
        >
          Report Title *
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? "#333333" : "#f0f0f0",
              color: isDark ? "#ffffff" : "#000000",
            },
          ]}
          placeholder="Brief description of the incident"
          placeholderTextColor={isDark ? "#999999" : "#666666"}
          value={reportTitle}
          onChangeText={setReportTitle}
        />

        {/* Report Description */}
        <Text
          style={[styles.formLabel, { color: isDark ? "#ffffff" : "#000000" }]}
        >
          Detailed Description *
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: isDark ? "#333333" : "#f0f0f0",
              color: isDark ? "#ffffff" : "#000000",
            },
          ]}
          placeholder="Provide detailed information about what happened, when, where, and any other relevant details..."
          placeholderTextColor={isDark ? "#999999" : "#666666"}
          value={reportDescription}
          onChangeText={setReportDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <View style={styles.uploadedMediaContainer}>
            <Text
              style={[
                styles.formLabel,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Uploaded Images
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mediaScrollView}
            >
              {uploadedImages.map((uri, index) => (
                <View key={uri} style={styles.mediaItem}>
                  <Image source={{ uri }} style={styles.mediaThumbnail} />
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={clearAllImages}
            >
              <Ionicons name="trash" size={16} color="#FF3B30" />
              <Text style={[styles.clearAllButtonText, { color: "#FF3B30" }]}>
                Clear All Images
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Uploaded Videos */}
        {uploadedVideos.length > 0 && (
          <View style={styles.uploadedMediaContainer}>
            <Text
              style={[
                styles.formLabel,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Uploaded Videos
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mediaScrollView}
            >
              {uploadedVideos.map((uri, index) => (
                <View key={uri} style={styles.mediaItem}>
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="videocam" size={32} color="#FF9500" />
                    <Text style={styles.videoFileName}>
                      {uri.split("/").pop()?.split(".")[0] || "Video"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => removeVideo(index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={clearAllVideos}
            >
              <Ionicons name="trash" size={16} color="#FF3B30" />
              <Text style={[styles.clearAllButtonText, { color: "#FF3B30" }]}>
                Clear All Videos
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Location Input - Only shown after location is selected */}
        {showLocationInput && selectedLocation && (
          <View style={styles.locationInputContainer}>
            <Text
              style={[
                styles.formLabel,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Report Location *
            </Text>
            <View
              style={[
                styles.locationInput,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
              ]}
            >
              <View style={styles.locationInfo}>
                <Text
                  style={[
                    styles.locationName,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  {selectedLocation.name}
                </Text>
                <Text
                  style={[
                    styles.locationAddress,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {selectedLocation.address}
                </Text>
                <Text
                  style={[
                    styles.locationCoords,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {selectedLocation.coordinates.latitude.toFixed(6)},{" "}
                  {selectedLocation.coordinates.longitude.toFixed(6)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.clearLocationButton}
                onPress={clearLocation}
              >
                <Ionicons name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Anonymous Toggle */}
        <View style={styles.anonymousToggle}>
          <Text
            style={[
              styles.formLabel,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            Submit Anonymously
          </Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: "#767577", true: "#34C759" }}
            thumbColor={isAnonymous ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: "#34C759" }]}
          onPress={handleSubmitReport}
        >
          <Ionicons name="send" size={24} color="white" />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>

      {/* My Reports Section */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          My Reports
        </Text>

        <View style={styles.reportsList}>
          {reportStatuses.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={[
                styles.reportItem,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
              ]}
              onPress={() => viewReportDetails(report)}
            >
              <View style={styles.reportHeader}>
                <Text
                  style={[
                    styles.reportTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  {report.title}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(report.status) },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(report.status) as any}
                    size={16}
                    color="white"
                  />
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>

              <View style={styles.reportDetails}>
                <Text
                  style={[
                    styles.reportCategory,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {report.category}
                </Text>
                <Text
                  style={[
                    styles.reportDate,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {report.date}
                </Text>
              </View>

              {/* Action Buttons for Open Reports */}
              {report.status === "open" && (
                <View style={styles.reportActions}>
                  <TouchableOpacity onPress={() => editReport(report)}>
                    <Text
                      style={[styles.reportActionText, { color: "#FF9500" }]}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteReport(report.id)}>
                    <Text
                      style={[styles.reportActionText, { color: "#FF3B30" }]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Report Actions */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          Quick Actions
        </Text>

        <View style={styles.quickActionsGrid}>
          <View style={styles.quickActionButtonContainer}>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
              ]}
              onPress={pickImagesFromGallery}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text
                style={[
                  styles.quickActionText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Add Photo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionButtonContainer}>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
              ]}
              onPress={pickVideoFromGallery}
            >
              <Ionicons name="videocam" size={24} color="#FF9500" />
              <Text
                style={[
                  styles.quickActionText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Add Video
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.quickActionButtonContainer,
              locationHighlight && {
                transform: [
                  {
                    scale: highlightAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: highlightAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
                shadowRadius: 10,
                elevation: highlightAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                locationHighlight && {
                  borderColor: "#FFD700",
                  borderWidth: 2,
                },
              ]}
              onPress={handleMyLocation}
            >
              <Ionicons name="location" size={24} color="#34C759" />
              <Text
                style={[
                  styles.quickActionText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                My Location
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.quickActionButtonContainer,
              locationHighlight && {
                transform: [
                  {
                    scale: highlightAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
                shadowColor: "#FFD700",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: highlightAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
                shadowRadius: 10,
                elevation: highlightAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                locationHighlight && {
                  borderColor: "#FFD700",
                  borderWidth: 2,
                },
              ]}
              onPress={handleMapPicker}
            >
              <Ionicons name="map" size={24} color="#AF52DE" />
              <Text
                style={[
                  styles.quickActionText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                2.5D Map
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Report Details Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {isEditing ? "Edit Report" : "Report Details"}
              </Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowReportModal(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "#ffffff" : "#000000"}
                />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              // Edit Form
              <ScrollView style={styles.modalScrollView}>
                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Report Title *
                </Text>
                <TextInput
                  style={[
                    styles.modalTextInput,
                    {
                      backgroundColor: isDark ? "#333333" : "#f0f0f0",
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Report title"
                  placeholderTextColor={isDark ? "#999999" : "#666666"}
                />

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Description *
                </Text>
                <TextInput
                  style={[
                    styles.modalTextArea,
                    {
                      backgroundColor: isDark ? "#333333" : "#f0f0f0",
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Report description"
                  placeholderTextColor={isDark ? "#999999" : "#666666"}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Category
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {editCategory}
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Anonymous
                </Text>
                <Switch
                  value={editIsAnonymous}
                  onValueChange={setEditIsAnonymous}
                  trackColor={{ false: "#767577", true: "#34C759" }}
                  thumbColor={editIsAnonymous ? "#ffffff" : "#f4f3f4"}
                />

                {/* Images and Videos display */}
                {editImages.length > 0 && (
                  <View>
                    <Text
                      style={[
                        styles.modalLabel,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      Images ({editImages.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {editImages.map((uri, index) => (
                        <Image
                          key={index}
                          source={{ uri }}
                          style={styles.modalImage}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {editVideos.length > 0 && (
                  <View>
                    <Text
                      style={[
                        styles.modalLabel,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      Videos ({editVideos.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {editVideos.map((uri, index) => (
                        <View key={index} style={styles.modalVideoThumbnail}>
                          <Ionicons name="videocam" size={24} color="#FF9500" />
                          <Text style={styles.modalVideoText}>
                            Video {index + 1}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#999999" }]}
                    onPress={() => setShowReportModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#34C759" }]}
                    onPress={saveEditedReport}
                  >
                    <Text style={styles.modalButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              // View Details
              <ScrollView style={styles.modalScrollView}>
                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Title
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  {selectedReport?.title}
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Category
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {selectedReport?.category}
                </Text>
                <View></View>
                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Status
                </Text>
                <View
                  style={[
                    styles.modalStatusBadge,
                    {
                      backgroundColor: getStatusColor(
                        selectedReport?.status || "open"
                      ),
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      getStatusIcon(selectedReport?.status || "open") as any
                    }
                    size={16}
                    color="white"
                  />
                  <Text style={styles.modalStatusText}>
                    {selectedReport?.status}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Date
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {selectedReport?.date}
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Description
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  {selectedReport?.description}
                </Text>

                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Anonymous
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {selectedReport?.isAnonymous ? "Yes" : "No"}
                </Text>

                {/* Location Information */}
                {selectedReport?.location && (
                  <>
                    <Text
                      style={[
                        styles.modalLabel,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      Location
                    </Text>
                    <View
                      style={[
                        styles.modalLocationContainer,
                        { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalLocationName,
                          { color: isDark ? "#ffffff" : "#000000" },
                        ]}
                      >
                        {selectedReport.location.name}
                      </Text>
                      <Text
                        style={[
                          styles.modalLocationAddress,
                          { color: isDark ? "#999999" : "#666666" },
                        ]}
                      >
                        {selectedReport.location.address}
                      </Text>
                      <Text
                        style={[
                          styles.modalLocationCoords,
                          { color: isDark ? "#999999" : "#666666" },
                        ]}
                      >
                        {selectedReport.location.coordinates.latitude.toFixed(
                          6
                        )}
                        ,{" "}
                        {selectedReport.location.coordinates.longitude.toFixed(
                          6
                        )}
                      </Text>
                    </View>
                  </>
                )}

                {/* Images and Videos display */}
                {selectedReport?.images && selectedReport.images.length > 0 && (
                  <View>
                    <Text
                      style={[
                        styles.modalLabel,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      Images ({selectedReport.images.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {selectedReport.images.map((uri, index) => (
                        <Image
                          key={index}
                          source={{ uri }}
                          style={styles.modalImage}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {selectedReport?.videos && selectedReport.videos.length > 0 && (
                  <View>
                    <Text
                      style={[
                        styles.modalLabel,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      Videos ({selectedReport.videos.length})
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {selectedReport.videos.map((uri, index) => (
                        <View key={index} style={styles.modalVideoThumbnail}>
                          <Ionicons name="videocam" size={24} color="#FF9500" />
                          <Text style={styles.modalVideoText}>
                            Video {index + 1}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#007AFF" }]}
                    onPress={() => setShowReportModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
