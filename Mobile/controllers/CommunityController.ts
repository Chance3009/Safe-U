import React from 'react';
import { Alert } from "react-native";

export interface CommunityPost {
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

export type SortType = "recent" | "popular" | "urgent" | "escalated";

// Utility functions
export const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const getEscalationStatusColor = (status: string): string => {
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

export const getEscalationStatusText = (status: string): string => {
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

export const getCategoryColor = (category: string): string => {
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

// Interactive functions
export const handleMakePost = (): void => {
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

export const handleUpvote = (postId: string): void => {
  console.log("Upvote post:", postId);
};

export const handleDownvote = (postId: string): void => {
  console.log("Downvote post:", postId);
};

export const handleComment = (postId: string): void => {
  console.log("Comment on post:", postId);
};

export const handleShare = (postId: string): void => {
  console.log("Share post:", postId);
};

export const handleEscalation = (
  post: CommunityPost,
  setSelectedPostForEscalation: React.Dispatch<React.SetStateAction<CommunityPost | null>>,
  setShowEscalationModal: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setSelectedPostForEscalation(post);
  setShowEscalationModal(true);
};

export const handleNavigateToAlerts = (): void => {
  console.log("Navigate to Alerts");
};

export const filterPosts = (posts: CommunityPost[], sortBy: SortType): CommunityPost[] => {
  return posts.filter((post) => {
    if (sortBy === "escalated") {
      return (
        post.escalationStatus === "escalated" ||
        post.escalationStatus === "pending"
      );
    }
    return true;
  });
};

export default function CommunityController() {
  // This is never used, just to satisfy Expo Router
  return null;
}