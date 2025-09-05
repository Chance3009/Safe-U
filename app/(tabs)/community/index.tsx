import React, { useState } from "react";
import { Alert } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  useColorScheme,
  Modal,
  PanResponder,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../styles/communityStyles";
import communityData from "./communityData.json";
import eventsData from "./eventsData.json";

const imageMap = {
  "event1.webp": require("../../../assets/images/event1.webp"),
  "event2.webp": require("../../../assets/images/event2.webp"),
  "event3.webp": require("../../../assets/images/event3.webp"),
  "event4.webp": require("../../../assets/images/event4.webp"),
  "event5.webp": require("../../../assets/images/event5.webp"),
};

const getImageSource = (image: string) => {
  if (typeof image === "string" && image.startsWith("http")) return { uri: image };
  if (typeof image === "string") return imageMap[image as keyof typeof imageMap] || null;
  return null;
};
import { categories as safetyCategoriesData } from "./SafetyCategory";

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
  category: "PSA" | "Safety" | "Facility" | "General" | "Escalated" | string;
  escalationStatus:
    | "pending"
    | "escalated"
    | "rejected"
    | "none"
    | "resolved"
    | string;
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

interface Event {
  id: string;
  title: string;
  image: ImageSourcePropType;
  date: string;
  time: string;
  venue: string;
  description: string;
}

import { useRouter } from "expo-router";
import EventBus from "../../../utils/eventBus";

export default function CommunityScreen() {
  const router = useRouter();
  const currentUserName = "You";
  const [selectedTab, setSelectedTab] = useState<
    "reports" | "safety-knowledge" | "events"
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
  const safetyCategories: SafetyCategory[] = safetyCategoriesData;

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(
    communityData.communityPosts
  );

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

  // Event modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

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
    router.push("/(tabs)/alerts");
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
              {
                key: "events",
                label: "Events",
                icon: "calendar",
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
                { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
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
            { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
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
              {
                key: "events",
                label: "Events",
                icon: "calendar",
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
                source={
                  typeof category.image === "string"
                    ? { uri: category.image } // remote
                    : category.image // local
                }
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

  // Events Tab
  if (selectedTab === "events") {
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
            Events
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}
          >
            Discover upcoming safety and wellness events
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
              {
                key: "events",
                label: "Events",
                icon: "calendar",
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

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {eventsData.map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventCard,
                { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
              ]}
            >
              {/* Event Image */}
              <Image
                source={getImageSource(event.image)}
                style={styles.eventImage}
                resizeMode="cover"
              />

              {/* Event Content */}
              <View style={styles.eventContent}>
                <Text
                  style={[
                    styles.eventTitle,
                    { color: "#000000" },
                  ]}
                >
                  {event.title}
                </Text>

                {/* Event Details */}
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={isDark ? "#999999" : "#666666"}
                    />
                    <Text
                      style={[
                        styles.eventDetailText,
                        { color: isDark ? "#999999" : "#666666" },
                      ]}
                    >
                      {event.date}
                    </Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Ionicons
                      name="time"
                      size={16}
                      color={isDark ? "#999999" : "#666666"}
                    />
                    <Text
                      style={[
                        styles.eventDetailText,
                        { color: isDark ? "#999999" : "#666666" },
                      ]}
                    >
                      {event.time}
                    </Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={isDark ? "#999999" : "#666666"}
                    />
                    <Text
                      style={[
                        styles.eventDetailText,
                        { color: isDark ? "#999999" : "#666666" },
                      ]}
                    >
                      {event.venue}
                    </Text>
                  </View>
                </View>

                {/* View More Button */}
                <TouchableOpacity
                  style={styles.viewMoreButton}
                  onPress={() => {
                    setSelectedEvent({
                      ...event,
                      image: getImageSource(event.image)
                    });
                    setShowEventModal(true);
                  }}
                >
                  <Text style={styles.viewMoreButtonText}>View more</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Event Detail Modal */}
        <Modal
          visible={showEventModal && !!selectedEvent}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.eventModalContent,
                { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" },
              ]}
            >
              {selectedEvent && (
                <>
                <View style={styles.modalHeader}>
                <Text
                    style={[
                      styles.modalTitle,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    Event Details
                  </Text>
                  {/* Close Button */}
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDark ? "#ffffff" : "#000000"}
                    />
                  </TouchableOpacity>
                </View>
                  

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Event Image */}
                    <Image
                      source={selectedEvent.image}
                      style={styles.modalEventImage}
                      resizeMode="cover"
                    />

                    {/* Event Title */}
                    <Text
                      style={[
                        styles.modalEventTitle,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      {selectedEvent.title}
                    </Text>

                    {/* Event Details */}
                    <View style={styles.modalEventDetails}>
                      <View style={styles.modalEventDetailRow}>
                        <Ionicons
                          name="calendar"
                          size={18}
                          color={isDark ? "#999999" : "#666666"}
                        />
                        <Text
                          style={[
                            styles.modalEventDetailText,
                            { color: isDark ? "#999999" : "#666666" },
                          ]}
                        >
                          {selectedEvent.date}
                        </Text>
                      </View>

                      <View style={styles.modalEventDetailRow}>
                        <Ionicons
                          name="time"
                          size={18}
                          color={isDark ? "#999999" : "#666666"}
                        />
                        <Text
                          style={[
                            styles.modalEventDetailText,
                            { color: isDark ? "#999999" : "#666666" },
                          ]}
                        >
                          {selectedEvent.time}
                        </Text>
                      </View>

                      <View style={styles.modalEventDetailRow}>
                        <Ionicons
                          name="location"
                          size={18}
                          color={isDark ? "#999999" : "#666666"}
                        />
                        <Text
                          style={[
                            styles.modalEventDetailText,
                            { color: isDark ? "#999999" : "#666666" },
                          ]}
                        >
                          {selectedEvent.venue}
                        </Text>
                      </View>
                    </View>

                    {/* Event Description */}
                    <Text
                      style={[
                        styles.modalEventDescription,
                        { color: isDark ? "#ffffff" : "#000000" },
                      ]}
                    >
                      {selectedEvent.description}
                    </Text>
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Modal>
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

