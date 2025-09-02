import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  useColorScheme,
  Alert,
  Modal,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CommentItem {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  images?: string[];
  upvotes: number;
  downvotes: number;
  comments: number;
  timestamp: string;
  category: "PSA" | "Safety" | "Facility" | "General" | "Escalated";
  escalationStatus: "pending" | "escalated" | "rejected" | "none" | "resolved";
  escalationThreshold: number;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  commentsList?: CommentItem[];
}

interface SafetyCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  image: string;
}

import { useRouter } from "expo-router";
import EventBus from "../../utils/eventBus";

export default function CommunityScreen() {
  const router = useRouter();
  const currentUserName = "You";
  const [selectedTab, setSelectedTab] = useState<
    "reports" | "safety-knowledge"
  >("reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "recent" | "popular" | "escalated" | "resolved"
  >("recent");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [selectedPostForEscalation, setSelectedPostForEscalation] =
    useState<CommunityPost | null>(null);

  const isDark = useColorScheme() === "dark";

  // Safety knowledge categories
  const safetyCategories: SafetyCategory[] = [
    {
      id: "harassment",
      title: "Harassment Prevention",
      description:
        "Learn how to identify, prevent, and respond to harassment situations",
      icon: "shield-checkmark",
      color: "#FF4444",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
    {
      id: "walking-alone",
      title: "Walking Alone at Night",
      description:
        "Essential safety tips for walking alone, especially during nighttime",
      icon: "moon",
      color: "#FF9500",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    },
    {
      id: "drowning",
      title: "Water Safety & Drowning Prevention",
      description:
        "Stay safe around water with these crucial safety guidelines",
      icon: "water",
      color: "#007AFF",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      id: "theft",
      title: "Theft Prevention",
      description:
        "Protect yourself and your belongings from theft and pickpocketing",
      icon: "lock-closed",
      color: "#34C759",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },
    {
      id: "cyber-safety",
      title: "Cyber Safety",
      description: "Stay safe online and protect your digital identity",
      icon: "laptop",
      color: "#AF52DE",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    },
    {
      id: "emergency",
      title: "Emergency Response",
      description:
        "Know what to do in emergency situations and how to get help",
      icon: "medical",
      color: "#FF3B30",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
  ];

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: "1",
      author: "Muhd bin A",
      content:
        "PSA: There is a fallen tree in Jalan Universiti. Hope authorities can remove it as soon as possible.",
      images: [],
      upvotes: 12000,
      downvotes: 0,
      comments: 1000,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
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
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
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
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
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
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      category: "Safety",
      escalationStatus: "pending",
      escalationThreshold: 500,
      location: "Science Building Parking, USM",
      coordinates: { latitude: 5.4164, longitude: 100.3327 },
    },
    {
      id: "5",
      author: "David Lee",
      content:
        "The cafeteria has been cleaned and sanitized. All safety protocols are now in place.",
      upvotes: 156,
      downvotes: 3,
      comments: 23,
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      category: "General",
      escalationStatus: "resolved",
      escalationThreshold: 1000,
      location: "Cafeteria, USM",
    },
  ]);

  // Listen for new posts from the create-post screen
  React.useEffect(() => {
    const unsubscribe = EventBus.addListener(
      "postCreated",
      (newPost: CommunityPost) => {
        setCommunityPosts((prev) => [newPost, ...prev]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Track per-user vote state per post
  const [userVotes, setUserVotes] = useState<
    Record<string, "up" | "down" | undefined>
  >({});
  // Track comment input text per post
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {}
  );
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [deleteConfirmPost, setDeleteConfirmPost] =
    useState<CommunityPost | null>(null);

  // Track current image index for each post's carousel
  const [postImageIndices, setPostImageIndices] = useState<
    Record<string, number>
  >({});

  // Create PanResponder for swipe gestures
  const createCarouselPanResponder = (postId: string, images: string[]) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Only respond to horizontal swipes, ignore vertical scrolling
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderGrant: () => {
        // Optional: Add visual feedback when gesture starts
      },
      onPanResponderMove: (evt, gestureState) => {
        // Optional: Add visual feedback during gesture
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;
        const threshold = 30; // Lower threshold for more responsive swipes
        const velocityThreshold = 0.5; // Minimum velocity for quick swipes

        if (Math.abs(dx) > threshold || Math.abs(vx) > velocityThreshold) {
          const currentIndex = postImageIndices[postId] || 0;
          let newIndex = currentIndex;

          if (dx > 0 || vx > velocityThreshold) {
            // Swipe right - go to previous image
            newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
          } else {
            // Swipe left - go to next image
            newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
          }

          setPostImageIndices((prev) => ({ ...prev, [postId]: newIndex }));
        }
      },
    });
  };

  // Create PanResponder for full-screen image viewer
  const createFullScreenPanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Only respond to horizontal swipes, ignore vertical scrolling
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;
        const threshold = 30; // Lower threshold for more responsive swipes
        const velocityThreshold = 0.5; // Minimum velocity for quick swipes

        if (Math.abs(dx) > threshold || Math.abs(vx) > velocityThreshold) {
          if (dx > 0 || vx > velocityThreshold) {
            // Swipe right - go to previous image
            if (viewerStartIndex > 0) {
              setViewerStartIndex(viewerStartIndex - 1);
            }
          } else {
            // Swipe left - go to next image
            if (viewerStartIndex < viewerImages.length - 1) {
              setViewerStartIndex(viewerStartIndex + 1);
            }
          }
        }
      },
    });
  };

  // Function to format timestamp to relative time or date
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMs = now.getTime() - postTime.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Show relative time for posts within 7 days
    if (diffInDays < 7) {
      if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60)
          return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        if (diffInHours < 24)
          return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      }
    }

    // Show normal date format for posts older than 7 days
    const day = postTime.getDate().toString().padStart(2, "0");
    const month = (postTime.getMonth() + 1).toString().padStart(2, "0");
    const year = postTime.getFullYear();
    return `${day}-${month}-${year}`;
  };

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
      case "resolved":
        return "#007AFF"; // iOS system blue
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
      case "resolved":
        return "Resolved"; // iOS system blue
      default:
        return "";
    }
  };

  const handleMakePost = () => {
    Alert.alert("Create Post", "Choose post type:", [
      {
        text: "Community Post",
        onPress: () => router.push("/create-post"),
      },
      {
        text: "Report to Authorities",
        onPress: () => router.push("/(tabs)/report"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleUpvote = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const current = userVotes[postId];
        if (current === "up") {
          // undo upvote
          setUserVotes((u) => ({ ...u, [postId]: undefined }));
          return { ...p, upvotes: Math.max(0, p.upvotes - 1) };
        }
        if (current === "down") {
          // switch from down to up
          setUserVotes((u) => ({ ...u, [postId]: "up" }));
          return {
            ...p,
            upvotes: p.upvotes + 1,
            downvotes: Math.max(0, p.downvotes - 1),
          };
        }
        // new upvote
        setUserVotes((u) => ({ ...u, [postId]: "up" }));
        return { ...p, upvotes: p.upvotes + 1 };
      })
    );
  };

  const handleDownvote = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const current = userVotes[postId];
        if (current === "down") {
          // undo downvote
          setUserVotes((u) => ({ ...u, [postId]: undefined }));
          return { ...p, downvotes: Math.max(0, p.downvotes - 1) };
        }
        if (current === "up") {
          // switch from up to down
          setUserVotes((u) => ({ ...u, [postId]: "down" }));
          return {
            ...p,
            downvotes: p.downvotes + 1,
            upvotes: Math.max(0, p.upvotes - 1),
          };
        }
        // new downvote
        setUserVotes((u) => ({ ...u, [postId]: "down" }));
        return { ...p, downvotes: p.downvotes + 1 };
      })
    );
  };

  const handleComment = (postId: string) => {
    const text = commentDrafts[postId]?.trim();
    if (!text) return;
    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: "Alex Johnson",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments + 1,
              commentsList: [newComment, ...(p.commentsList ?? [])],
            }
          : p
      )
    );
    setCommentDrafts((d) => ({ ...d, [postId]: "" }));
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

  const handleDeletePost = (post: CommunityPost) => {
    setDeleteConfirmPost(post);
  };

  const confirmDeletePost = () => {
    if (deleteConfirmPost) {
      setCommunityPosts((prev) =>
        prev.filter((p) => p.id !== deleteConfirmPost.id)
      );
      setDeleteConfirmPost(null);
    }
  };

  // Get unique categories from posts
  const categories = [
    "all",
    ...Array.from(new Set(communityPosts.map((post) => post.category))),
  ];

  // Filter and sort posts based on selected options
  const getFilteredAndSortedPosts = () => {
    let filtered = communityPosts;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.upvotes - a.upvotes);
      case "escalated":
        return filtered.filter((post) => post.escalationStatus === "escalated");
      case "resolved":
        return filtered.filter((post) => post.escalationStatus === "resolved");
      case "recent":
      default:
        return filtered.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }
  };

  const filteredPosts = getFilteredAndSortedPosts();

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
          {/* Back Button - Only show when not on reports tab */}
          {selectedTab !== "reports" && (
            <TouchableOpacity
              style={styles.backToReportsButton}
              onPress={() => setSelectedTab("reports")}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={isDark ? "#007AFF" : "#007AFF"}
              />
              <Text
                style={[
                  styles.backToReportsText,
                  { color: isDark ? "#007AFF" : "#007AFF" },
                ]}
              >
                Back to Reports
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}
          >
            Community Reports
          </Text>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: "reports", label: "Reports", icon: "document-text" },
              {
                key: "safety-knowledge",
                label: "Safety Knowledge",
                icon: "information-circle",
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
                  color={selectedTab === tab.key ? "white" : "#666666"}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: selectedTab === tab.key ? "white" : "#666666" },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
            {/* Filters Row */}
            <View style={styles.filterContainer}>
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

              {/* Category Filter */}
              <TouchableOpacity
                style={[
                  styles.categoryFilterButton,
                  { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
                ]}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text
                  style={[
                    styles.categoryFilterButtonText,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Category:{" "}
                  {selectedCategory.charAt(0).toUpperCase() +
                    selectedCategory.slice(1)}
                </Text>
                <Ionicons
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={isDark ? "#999999" : "#666666"}
                />
              </TouchableOpacity>
            </View>

            {/* Make Post Button Row - Centered */}
            <View style={styles.makePostContainer}>
              <TouchableOpacity
                style={[styles.makePostButton, { backgroundColor: "#007AFF" }]}
                onPress={handleMakePost}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.makePostButtonText}>Make a post</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sort Dropdown Options */}
          {showSortDropdown && (
            <View
              style={[
                styles.sortDropdown,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              {["recent", "popular", "escalated", "resolved"].map((option) => (
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

          {/* Category Filter Options */}
          {showCategoryDropdown && (
            <View
              style={[
                styles.categoryFilterDropdown,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryFilterOption,
                    selectedCategory === category && {
                      backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    },
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryFilterOptionText,
                      { color: isDark ? "#ffffff" : "#000000" },
                      selectedCategory === category && { fontWeight: "600" },
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  {selectedCategory === category && (
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
                { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
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
                      {formatRelativeTime(post.timestamp)}
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
              {!!post.images?.length && (
                <View style={styles.postImageContainer}>
                  {(() => {
                    const imgs = post.images as string[];
                    return (
                      <View
                        style={styles.imageCarousel}
                        {...createCarouselPanResponder(post.id, imgs)
                          .panHandlers}
                      >
                        {/* Main Image */}
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            setViewerImages(imgs);
                            setViewerStartIndex(postImageIndices[post.id] || 0);
                            setViewerVisible(true);
                          }}
                        >
                          <Image
                            source={{
                              uri: imgs[postImageIndices[post.id] || 0],
                            }}
                            style={styles.mainImage}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>

                        {/* Navigation Arrows and Image Counter */}
                        {imgs.length > 1 && (
                          <>
                            {/* Left Arrow */}
                            <TouchableOpacity
                              style={[
                                styles.carouselArrow,
                                styles.carouselArrowLeft,
                              ]}
                              onPress={() => {
                                const currentIndex =
                                  postImageIndices[post.id] || 0;
                                const newIndex =
                                  currentIndex > 0
                                    ? currentIndex - 1
                                    : imgs.length - 1;
                                setPostImageIndices((prev) => ({
                                  ...prev,
                                  [post.id]: newIndex,
                                }));
                              }}
                            >
                              <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#fff"
                              />
                            </TouchableOpacity>

                            {/* Right Arrow */}
                            <TouchableOpacity
                              style={[
                                styles.carouselArrow,
                                styles.carouselArrowRight,
                              ]}
                              onPress={() => {
                                const currentIndex =
                                  postImageIndices[post.id] || 0;
                                const newIndex =
                                  currentIndex < imgs.length - 1
                                    ? currentIndex + 1
                                    : 0;
                                setPostImageIndices((prev) => ({
                                  ...prev,
                                  [post.id]: newIndex,
                                }));
                              }}
                            >
                              <Ionicons
                                name="chevron-forward"
                                size={24}
                                color="#fff"
                              />
                            </TouchableOpacity>

                            {/* Image Counter */}
                            <View style={styles.carouselCounter}>
                              <Text style={styles.carouselCounterText}>
                                {(postImageIndices[post.id] || 0) + 1} /{" "}
                                {imgs.length}
                              </Text>
                            </View>
                          </>
                        )}
                      </View>
                    );
                  })()}
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
                    style={[
                      styles.voteButton,
                      userVotes[post.id] === "up" && {
                        backgroundColor: isDark ? "#12351b" : "#e8f7ee",
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      },
                    ]}
                    onPress={() => handleUpvote(post.id)}
                  >
                    <Ionicons
                      name={
                        userVotes[post.id] === "up"
                          ? "arrow-up-circle"
                          : "arrow-up"
                      }
                      size={20}
                      color="#34C759"
                    />
                    <Text style={[styles.voteCount, { color: "#34C759" }]}>
                      {formatNumber(post.upvotes)}{" "}
                      {/* Removed the "↑" arrow symbol */}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.voteButton,
                      userVotes[post.id] === "down" && {
                        backgroundColor: isDark ? "#3b1512" : "#fde7e6",
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      },
                    ]}
                    onPress={() => handleDownvote(post.id)}
                  >
                    <Ionicons
                      name={
                        userVotes[post.id] === "down"
                          ? "arrow-down-circle"
                          : "arrow-down"
                      }
                      size={20}
                      color="#FF3B30"
                    />
                    <Text style={[styles.voteCount, { color: "#FF3B30" }]}>
                      {formatNumber(post.downvotes)}{" "}
                      {/* Removed the "↓" arrow symbol */}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Comments toggle */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    setExpandedComments((e) => ({
                      ...e,
                      [post.id]: !e[post.id],
                    }))
                  }
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

                {/* Delete (only for own posts) */}
                {post.author === currentUserName && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeletePost(post)}
                  >
                    <Ionicons name="trash" size={18} color="#FF3B30" />
                    <Text style={[styles.actionText, { color: "#FF3B30" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}

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

              {/* Comments Input (only when expanded) */}
              {expandedComments[post.id] && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <TextInput
                    placeholder="Add a comment..."
                    placeholderTextColor={isDark ? "#777" : "#999"}
                    value={commentDrafts[post.id] ?? ""}
                    onChangeText={(t) =>
                      setCommentDrafts((d) => ({ ...d, [post.id]: t }))
                    }
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: isDark ? "#333" : "#ddd",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      color: isDark ? "#fff" : "#000",
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => handleComment(post.id)}
                    style={{
                      backgroundColor: "#007AFF",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {expandedComments[post.id] && (
                <View style={{ marginTop: 10, gap: 10 }}>
                  {(post.commentsList ?? []).map((c) => (
                    <View
                      key={c.id}
                      style={{
                        borderWidth: 1,
                        borderColor: isDark ? "#333" : "#eee",
                        borderRadius: 10,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "700",
                          color: isDark ? "#fff" : "#000",
                        }}
                      >
                        {c.author}
                      </Text>
                      <Text
                        style={{
                          color: isDark ? "#ccc" : "#333",
                          marginTop: 4,
                        }}
                      >
                        {c.content}
                      </Text>
                      <Text
                        style={{
                          color: isDark ? "#777" : "#777",
                          fontSize: 12,
                          marginTop: 6,
                        }}
                      >
                        {formatRelativeTime(c.timestamp)}
                      </Text>
                    </View>
                  ))}
                  {!(post.commentsList ?? []).length && (
                    <Text style={{ color: isDark ? "#aaa" : "#666" }}>
                      No comments yet.
                    </Text>
                  )}
                </View>
              )}
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
        {/* Delete confirmation modal */}
        {deleteConfirmPost && (
          <Modal visible transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: isDark ? "#1c1c1e" : "#fff" },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDark ? "#fff" : "#000" },
                  ]}
                >
                  Delete Post
                </Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: isDark ? "#ccc" : "#666" },
                  ]}
                >
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setDeleteConfirmPost(null)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonDelete]}
                    onPress={confirmDeletePost}
                  >
                    <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Full-screen image viewer with carousel */}
        {viewerVisible && (
          <Modal visible transparent animationType="fade">
            <View style={styles.fullScreenModalOverlay}>
              <View style={styles.imageViewerContainer}>
                {/* Navigation arrows */}
                {viewerStartIndex > 0 && (
                  <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowLeft]}
                    onPress={() => setViewerStartIndex(viewerStartIndex - 1)}
                  >
                    <Ionicons name="chevron-back" size={30} color="#fff" />
                  </TouchableOpacity>
                )}

                {viewerStartIndex < viewerImages.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowRight]}
                    onPress={() => setViewerStartIndex(viewerStartIndex + 1)}
                  >
                    <Ionicons name="chevron-forward" size={30} color="#fff" />
                  </TouchableOpacity>
                )}

                {/* Image counter */}
                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {viewerStartIndex + 1} / {viewerImages.length}
                  </Text>
                </View>

                {/* Close button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setViewerVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>

                {/* Main image */}
                <View
                  style={styles.fullScreenImageContainer}
                  {...createFullScreenPanResponder().panHandlers}
                >
                  <Image
                    source={{ uri: viewerImages[viewerStartIndex] }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Thumbnail strip */}
                {viewerImages.length > 1 && (
                  <View style={styles.thumbnailStrip}>
                    {viewerImages.map((uri, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setViewerStartIndex(idx)}
                        style={[
                          styles.thumbnail,
                          idx === viewerStartIndex && styles.thumbnailActive,
                        ]}
                      >
                        <Image
                          source={{ uri }}
                          style={styles.thumbnailImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    );
  }

  // Safety Knowledge Tab
  if (selectedTab === "safety-knowledge") {
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}
          >
            Safety Knowledge
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}
          >
            Learn essential safety tips and guidelines
          </Text>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: "reports", label: "Reports", icon: "document-text" },

              {
                key: "safety-knowledge",
                label: "Safety Knowledge",
                icon: "information-circle",
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
                    { color: selectedTab === tab.key ? "white" : "#666666" },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safety Categories Grid */}
        <View style={styles.safetyCategoriesContainer}>
          {safetyCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.safetyCategoryCard,
                { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/safety-knowledge-detail",
                  params: { category: category.id },
                })
              }
            >
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryContent}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color="white"
                  />
                </View>
                <Text
                  style={[
                    styles.categoryTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  {category.title}
                </Text>
                <Text
                  style={[
                    styles.categoryDescription,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {category.description}
                </Text>
                <View style={styles.categoryArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? "#999999" : "#666666"}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Safety Tips */}
        <View
          style={[
            styles.quickTipsContainer,
            { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
          ]}
        >
          <Text
            style={[
              styles.quickTipsTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            Quick Safety Tips
          </Text>
          <View style={styles.quickTipsList}>
            <View style={styles.quickTip}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text
                style={[
                  styles.quickTipText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Always stay aware of your surroundings
              </Text>
            </View>
            <View style={styles.quickTip}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text
                style={[
                  styles.quickTipText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Trust your instincts - if something feels wrong, it probably is
              </Text>
            </View>
            <View style={styles.quickTip}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
              <Text
                style={[
                  styles.quickTipText,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                Keep emergency contacts easily accessible
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  actionBar: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
  },
  makePostContainer: {
    alignItems: "center",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryFilterButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  makePostButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  makePostButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  sortDropdown: {
    position: "absolute",
    top: 120,
    left: 16,
    width: 180,
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sortOptionText: {
    fontSize: 16,
  },
  categoryFilterDropdown: {
    position: "absolute",
    top: 120,
    left: 200,
    width: 180,
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  categoryFilterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  categoryFilterOptionText: {
    fontSize: 16,
  },
  alertsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  alertsButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: 12,
  },
  escalationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  escalationInfoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  postsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  postCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  postTimestamp: {
    fontSize: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  escalationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  escalationBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  postImageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  postImage: {
    fontSize: 80,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  escalationProgress: {
    marginBottom: 16,
  },
  escalationProgressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 15,
    flexWrap: "wrap",
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  voteCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  escalationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  escalationButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
    flexWrap: "wrap",
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  tabContentText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  fullScreenModalOverlay: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",

    justifyContent: "center", // centers vertically
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    flexWrap: "wrap",
    textAlign: "center", // center text inside button
    width: "100%", // make text stretch full width
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButtonCancel: {
    backgroundColor: "#999999",
  },
  modalButtonDelete: {
    backgroundColor: "#FF3B30",
  },

  navArrow: {
    position: "absolute",
    top: "50%",
    padding: 20,
    zIndex: 10,
  },
  navArrowLeft: {
    left: 10,
  },
  navArrowRight: {
    right: 10,
  },
  imageCounter: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  fullScreenImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  thumbnailStrip: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    borderColor: "#007AFF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    width: "100%",
    height: "100%",
  },
  imageCarousel: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  carouselArrow: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  carouselArrowLeft: {
    left: 10,
  },
  carouselArrowRight: {
    right: 10,
  },
  carouselCounter: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -50 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  carouselCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // Safety Knowledge Styles
  safetyCategoriesContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  safetyCategoryCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryImage: {
    width: "100%",
    height: 120,
  },
  categoryContent: {
    padding: 16,
    position: "relative",
  },
  categoryIcon: {
    position: "absolute",
    top: -20,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginRight: 60,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    marginRight: 40,
  },
  categoryArrow: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  quickTipsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickTipsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  quickTipsList: {
    gap: 12,
  },
  quickTip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quickTipText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  // Back Button Styles
  backToReportsButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    gap: 6,
  },
  backToReportsText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
