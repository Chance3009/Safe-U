import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  useColorScheme,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../components/styles/communityStyles";

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  image?: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  timestamp: string;
  category: "PSA" | "Safety" | "Facility" | "General" | "Escalated";
  escalationStatus: "pending" | "escalated" | "rejected" | "none";
  escalationThreshold: number;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export default function CommunityScreen() {
  const [selectedTab, setSelectedTab] = useState<
    "reports" | "friends" | "tips" | "resources" | "anti-harassment"
  >("reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "recent" | "popular" | "urgent" | "escalated"
  >("recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [selectedPostForEscalation, setSelectedPostForEscalation] =
    useState<CommunityPost | null>(null);

  const isDark = useColorScheme() === "dark";

  const [communityPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      author: "Muhd bin A",
      content:
        "PSA: There is a fallen tree in Jalan Universiti. Hope authorities can remove it as soon as possible.",
      image: "🌳",
      upvotes: 12000,
      downvotes: 0,
      comments: 1000,
      timestamp: "2 hours ago",
      category: "PSA",
      escalationStatus: "escalated",
      escalationThreshold: 10000,
      location: "Jalan Universiti, USM",
      coordinates: { latitude: 5.4164, longitude: 100.3327 },
    },
    {
      id: "2",
      author: "Sarah Chen",
      content:
        "Heads up: The library entrance is slippery due to recent rain. Please be careful when entering.",
      upvotes: 450,
      downvotes: 12,
      comments: 89,
      timestamp: "4 hours ago",
      category: "Safety",
      escalationStatus: "pending",
      escalationThreshold: 500,
      location: "Library, USM",
    },
    {
      id: "3",
      author: "Mike Johnson",
      content:
        "The vending machine near Engineering Building is out of order. Maintenance has been notified.",
      upvotes: 234,
      downvotes: 5,
      comments: 45,
      timestamp: "6 hours ago",
      category: "Facility",
      escalationStatus: "none",
      escalationThreshold: 1000,
      location: "Engineering Building, USM",
    },
    {
      id: "4",
      author: "Aisha Rahman",
      content:
        "URGENT: Suspicious person loitering around the Science Building parking lot. Multiple students have reported feeling unsafe.",
      upvotes: 890,
      downvotes: 2,
      comments: 156,
      timestamp: "1 hour ago",
      category: "Safety",
      escalationStatus: "pending",
      escalationThreshold: 500,
      location: "Science Building Parking, USM",
      coordinates: { latitude: 5.4164, longitude: 100.3327 },
    },
  ]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getEscalationStatusColor = (status: string) => {
    switch (status) {
      case "escalated":
        return "#34C759";
      case "pending":
        return "#FF9500";
      case "rejected":
        return "#FF4444";
      default:
        return "transparent";
    }
  };

  const getEscalationStatusText = (status: string) => {
    switch (status) {
      case "escalated":
        return "Escalated ✓";
      case "pending":
        return "Under Review";
      case "rejected":
        return "Rejected";
      default:
        return "";
    }
  };

  const handleMakePost = () => {
    Alert.alert("Create Post", "Choose post type:", [
      {
        text: "Community Post",
        onPress: () => console.log("Create community post"),
      },
      {
        text: "Report to Authorities",
        onPress: () => console.log("Create official report"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleUpvote = (postId: string) => {
    // TODO: Implement upvote logic
    console.log("Upvote post:", postId);
  };

  const handleDownvote = (postId: string) => {
    // TODO: Implement downvote logic
    console.log("Downvote post:", postId);
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment system
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log("Share post:", postId);
  };

  const handleEscalation = (post: CommunityPost) => {
    setSelectedPostForEscalation(post);
    setShowEscalationModal(true);
  };

  const handleNavigateToAlerts = () => {
    // TODO: Navigate to Alerts tab
    console.log("Navigate to Alerts");
  };

  const filteredPosts = communityPosts.filter((post) => {
    if (sortBy === "escalated") {
      return (
        post.escalationStatus === "escalated" ||
        post.escalationStatus === "pending"
      );
    }
    return true;
  });

  if (selectedTab === "reports") {
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}
          >
            Community Reports
          </Text>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={isDark ? "#999999" : "#666666"}
            />
            <TextInput
              style={[
                styles.searchInput,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
              placeholder="Find what others have been saying"
              placeholderTextColor={isDark ? "#999999" : "#666666"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            {/* Sort Dropdown */}
            <TouchableOpacity
              style={[
                styles.sortButton,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
              onPress={() => setShowSortDropdown(!showSortDropdown)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Text>
              <Ionicons
                name={showSortDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color={isDark ? "#999999" : "#666666"}
              />
            </TouchableOpacity>

            {/* Make a Post Button */}
            <TouchableOpacity
              style={[styles.makePostButton, { backgroundColor: "#007AFF" }]}
              onPress={handleMakePost}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.makePostButtonText}>Make a post</Text>
            </TouchableOpacity>
          </View>

          {/* Sort Dropdown Options */}
          {showSortDropdown && (
            <View
              style={[
                styles.sortDropdown,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              {["recent", "popular", "urgent", "escalated"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortOption,
                    sortBy === option && {
                      backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    },
                  ]}
                  onPress={() => {
                    setSortBy(option as any);
                    setShowSortDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      { color: isDark ? "#ffffff" : "#000000" },
                      sortBy === option && { fontWeight: "600" },
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                  {sortBy === option && (
                    <Ionicons name="checkmark" size={16} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Navigation to Alerts */}
        <TouchableOpacity
          style={[styles.alertsButton, { backgroundColor: "#FF4444" }]}
          onPress={handleNavigateToAlerts}
        >
          <Ionicons name="warning" size={24} color="white" />
          <Text style={styles.alertsButtonText}>View Official Alerts</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* Escalation Info */}
        <View
          style={[
            styles.escalationInfo,
            { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
          ]}
        >
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text
            style={[
              styles.escalationInfoText,
              { color: isDark ? "#999999" : "#666666" },
            ]}
          >
            Posts with high community support can escalate to official alerts.
            Look for the escalation status badge.
          </Text>
        </View>

        {/* Community Posts */}
        <View style={styles.postsContainer}>
          {filteredPosts.map((post) => (
            <View
              key={post.id}
              style={[
                styles.postCard,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.authorInfo}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>
                      {post.author.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.authorName,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      {post.author}
                    </Text>
                    <Text
                      style={[
                        styles.postTimestamp,
                        { color: isDark ? "#999999" : "#666666" },
                      ]}
                    >
                      {post.timestamp}
                    </Text>
                  </View>
                </View>
                <View style={styles.headerRight}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: getCategoryColor(post.category) },
                    ]}
                  >
                    <Text style={styles.categoryText}>{post.category}</Text>
                  </View>
                  {post.escalationStatus !== "none" && (
                    <View
                      style={[
                        styles.escalationBadge,
                        {
                          backgroundColor: getEscalationStatusColor(
                            post.escalationStatus
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.escalationBadgeText}>
                        {getEscalationStatusText(post.escalationStatus)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Post Content */}
              <Text
                style={[
                  styles.postContent,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {post.content}
              </Text>

              {/* Post Image (if exists) */}
              {post.image && (
                <View style={styles.postImageContainer}>
                  <Text style={styles.postImage}>{post.image}</Text>
                </View>
              )}

              {/* Location Info */}
              {post.location && (
                <View style={styles.locationInfo}>
                  <Ionicons
                    name="location"
                    size={16}
                    color={isDark ? "#999999" : "#666666"}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    {post.location}
                  </Text>
                </View>
              )}

              {/* Escalation Progress */}
              {post.escalationStatus === "pending" && (
                <View style={styles.escalationProgress}>
                  <Text
                    style={[
                      styles.escalationProgressText,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    Escalation Progress: {post.upvotes}/
                    {post.escalationThreshold} upvotes needed
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (post.upvotes / post.escalationThreshold) * 100,
                            100
                          )}%`,
                          backgroundColor: "#FF9500",
                        },
                      ]}
                    />
                  </View>
                </View>
              )}

              {/* Post Actions */}
              <View style={styles.postActions}>
                {/* Upvote/Downvote */}
                <View style={styles.voteContainer}>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleUpvote(post.id)}
                  >
                    <Ionicons name="arrow-up" size={20} color="#34C759" />
                    <Text style={[styles.voteCount, { color: "#34C759" }]}>
                      ↑{formatNumber(post.upvotes)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleDownvote(post.id)}
                  >
                    <Ionicons name="arrow-down" size={20} color="#FF3B30" />
                    <Text style={[styles.voteCount, { color: "#FF3B30" }]}>
                      ↓{formatNumber(post.downvotes)}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Comments */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleComment(post.id)}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color={isDark ? "#999999" : "#666666"}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    Comment {formatNumber(post.comments)}
                  </Text>
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleShare(post.id)}
                >
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={isDark ? "#999999" : "#666666"}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: isDark ? "#999999" : "#666666" },
                    ]}
                  >
                    Share →
                  </Text>
                </TouchableOpacity>

                {/* Escalation Button */}
                {post.escalationStatus === "pending" &&
                  post.upvotes >= post.escalationThreshold && (
                    <TouchableOpacity
                      style={[
                        styles.escalationButton,
                        { backgroundColor: "#FF9500" },
                      ]}
                      onPress={() => handleEscalation(post)}
                    >
                      <Ionicons
                        name="arrow-up-circle"
                        size={18}
                        color="white"
                      />
                      <Text style={styles.escalationButtonText}>
                        Escalate to Admin
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          ))}
        </View>

        {/* Escalation Modal */}
        <Modal
          visible={showEscalationModal && !!selectedPostForEscalation}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowEscalationModal(false);
            setSelectedPostForEscalation(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Escalate to Official Alert
              </Text>
              <Text
                style={[
                  styles.modalText,
                  { color: isDark ? "#999999" : "#666666" },
                ]}
              >
                This post has reached the escalation threshold and will be
                reviewed by campus administrators. If verified, it will become
                an official alert.
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#007AFF" }]}
                  onPress={() => {
                    setShowEscalationModal(false);
                    setSelectedPostForEscalation(null);
                    console.log(
                      "Escalate post:",
                      selectedPostForEscalation?.id
                    );
                  }}
                >
                  <Text style={styles.modalButtonText}>Confirm Escalation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#999999" }]}
                  onPress={() => {
                    setShowEscalationModal(false);
                    setSelectedPostForEscalation(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  // Other tabs remain the same
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}>
          Community
        </Text>
        <Text
          style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}
        >
          Connect with your safety network
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: "reports", label: "Reports", icon: "document-text" },
          { key: "friends", label: "Friends", icon: "people" },
          { key: "tips", label: "Safety Tips", icon: "shield-checkmark" },
          { key: "resources", label: "Resources", icon: "library" },
          {
            key: "anti-harassment",
            label: "Anti-Harassment",
            icon: "hand-left",
          },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              selectedTab === tab.key && { backgroundColor: "#007AFF" },
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={
                selectedTab === tab.key
                  ? "white"
                  : isDark
                  ? "#999999"
                  : "#666666"
              }
            />
            <Text
              style={[
                styles.tabButtonText,
                selectedTab === tab.key && { color: "white" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        <Text
          style={[
            styles.tabContentText,
            { color: isDark ? "#999999" : "#666666" },
          ]}
        >
          Select a tab to view content
        </Text>
      </View>
    </View>
  );
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "PSA":
      return "#FF9500";
    case "Safety":
      return "#FF4444";
    case "Facility":
      return "#007AFF";
    case "Escalated":
      return "#34C759";
    default:
      return "#34C759";
  }
};