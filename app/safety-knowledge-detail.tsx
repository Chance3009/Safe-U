import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

interface SafetyDetail {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  heroImage: any; // Can be string (URL) or require() statement
  keyPoints: string[];
  detailedContent: {
    section: string;
    content: string;
    image?: any; // Can be string (URL) or require() statement
  }[];
  videoUrl?: string;
}

const safetyDetails: Record<string, SafetyDetail> = {
  harassment: {
    id: "harassment",
    title: "Harassment Prevention",
    description:
      "Learn how to identify, prevent, and respond to harassment situations",
    icon: "shield-checkmark",
    color: "#FF4444",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    keyPoints: [
      "Trust your instincts - if something feels wrong, it probably is",
      "Stay in well-lit, populated areas",
      "Keep your phone easily accessible",
      "Use assertive body language and voice",
      "Document incidents with details and timestamps",
      "Know your rights and campus policies",
    ],
    detailedContent: [
      {
        section: "Recognizing Harassment",
        content:
          "Harassment can take many forms including verbal, physical, digital, and sexual harassment. It may involve unwanted comments, gestures, following, or contact that creates an intimidating, hostile, or offensive environment.",
        image: require("../assets/images/harassment-recognizing.webp"),
      },
      {
        section: "Immediate Response",
        content:
          "If you're being harassed, stay calm and assess the situation. Move to a safe location if possible. Use assertive communication to clearly state your boundaries. Don't engage in arguments or physical confrontation.",
        image: require("../assets/images/harassment-response.webp"),
      },
      {
        section: "Getting Help",
        content:
          "Contact campus security, local police, or trusted friends immediately. Report the incident to appropriate authorities and document everything. Seek support from counseling services or victim advocacy groups.",
        image: require("../assets/images/harassment-help.webp"),
      },
    ],
  },
  "walking-alone": {
    id: "walking-alone",
    title: "Walking Alone at Night",
    description:
      "Essential safety tips for walking alone, especially during nighttime",
    icon: "moon",
    color: "#FF9500",
    heroImage: require("../assets/images/walking-alone-hero.webp"),
    keyPoints: [
      "Plan your route in advance",
      "Stay in well-lit areas",
      "Avoid shortcuts through isolated areas",
      "Keep your phone charged and accessible",
      "Walk with confidence and purpose",
      "Trust your instincts about people and situations",
    ],
    detailedContent: [
      {
        section: "Route Planning",
        content:
          "Before heading out, plan your route to avoid isolated areas, construction zones, or poorly lit streets. Choose main roads with regular traffic and pedestrian activity. Let someone know your expected arrival time.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      },
      {
        section: "Personal Safety Measures",
        content:
          "Walk with confidence - keep your head up and maintain good posture. Avoid wearing headphones that might reduce awareness. Carry a personal safety device if desired. Stay alert to your surroundings.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
      {
        section: "Emergency Preparedness",
        content:
          "Keep emergency contacts on speed dial. Know the locations of safe places along your route (police stations, stores, restaurants). If you feel threatened, head toward these safe zones immediately.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
    ],
  },
  drowning: {
    id: "drowning",
    title: "Water Safety & Drowning Prevention",
    description: "Stay safe around water with these crucial safety guidelines",
    icon: "water",
    color: "#007AFF",
    heroImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    keyPoints: [
      "Never swim alone",
      "Learn to swim and basic water rescue",
      "Check water conditions before entering",
      "Wear appropriate safety gear",
      "Supervise children at all times",
      "Know emergency procedures",
    ],
    detailedContent: [
      {
        section: "Swimming Safety",
        content:
          "Always swim with a buddy, even if you're an experienced swimmer. Check water conditions including depth, currents, and temperature. Never dive into unknown water. Respect posted warnings and lifeguard instructions.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
      {
        section: "Emergency Response",
        content:
          "If someone is in trouble, call for help immediately. Don't attempt a rescue unless you're trained. Use reaching or throwing assists rather than going into the water. Learn CPR and basic first aid.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      },
      {
        section: "Prevention Strategies",
        content:
          "Install barriers around pools and hot tubs. Teach children water safety from an early age. Use life jackets when boating or in deep water. Avoid alcohol when swimming or boating.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
    ],
  },
  theft: {
    id: "theft",
    title: "Theft Prevention",
    description:
      "Protect yourself and your belongings from theft and pickpocketing",
    icon: "lock-closed",
    color: "#34C759",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    keyPoints: [
      "Keep valuables out of sight",
      "Use secure bags with zippers",
      "Be aware of your surroundings",
      "Don't leave items unattended",
      "Use hotel safes when traveling",
      "Report theft immediately",
    ],
    detailedContent: [
      {
        section: "Personal Belongings",
        content:
          "Keep your phone, wallet, and keys in secure, zippered pockets or bags. Don't carry large amounts of cash. Use cross-body bags that are harder to snatch. Keep important documents in a secure location.",
        image:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      },
      {
        section: "Public Transportation",
        content:
          "Be extra vigilant on buses, trains, and in crowded areas. Keep your bag in front of you and close to your body. Don't display expensive items like phones or jewelry. Stay alert at stops and stations.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      },
      {
        section: "Home Security",
        content:
          "Lock doors and windows when leaving. Use security systems if available. Don't advertise when you're away on social media. Keep valuables in a safe or secure location. Consider insurance for valuable items.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
    ],
  },
  "cyber-safety": {
    id: "cyber-safety",
    title: "Cyber Safety",
    description: "Stay safe online and protect your digital identity",
    icon: "laptop",
    color: "#AF52DE",
    heroImage: require("../assets/images/cyber-safety-hero.webp"),
    keyPoints: [
      "Use strong, unique passwords",
      "Enable two-factor authentication",
      "Be cautious with personal information",
      "Keep software updated",
      "Use secure networks",
      "Think before clicking links",
    ],
    detailedContent: [
      {
        section: "Password Security",
        content:
          "Use strong passwords with a mix of letters, numbers, and symbols. Never reuse passwords across accounts. Consider using a password manager. Enable two-factor authentication wherever possible.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
      {
        section: "Social Media Safety",
        content:
          "Be careful about what you share online. Don't post personal information like your address or travel plans. Review privacy settings regularly. Be cautious about accepting friend requests from strangers.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      },
      {
        section: "Phishing Awareness",
        content:
          "Don't click on suspicious links or download attachments from unknown sources. Be wary of urgent requests for personal information. Verify the sender's email address. When in doubt, contact the organization directly.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
    ],
  },
  emergency: {
    id: "emergency",
    title: "Emergency Response",
    description: "Know what to do in emergency situations and how to get help",
    icon: "medical",
    color: "#FF3B30",
    heroImage: require("../assets/images/emergency-response-hero.webp"),
    keyPoints: [
      "Know emergency numbers",
      "Stay calm and assess the situation",
      "Call for help immediately",
      "Follow emergency protocols",
      "Have an emergency plan",
      "Keep emergency supplies ready",
    ],
    detailedContent: [
      {
        section: "Emergency Numbers",
        content:
          "Memorize important emergency numbers: 911 for general emergencies, campus security number, local police, and poison control. Program these into your phone for quick access. Know your location when calling.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      },
      {
        section: "First Aid Basics",
        content:
          "Learn basic first aid including CPR, treating cuts and burns, and recognizing signs of serious conditions. Take a first aid course if possible. Keep a first aid kit in your home and car.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      },
      {
        section: "Emergency Planning",
        content:
          "Create an emergency plan with your family or roommates. Know evacuation routes and meeting points. Keep emergency supplies including water, food, flashlight, and first aid. Practice your plan regularly.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
    ],
  },
};

export default function SafetyKnowledgeDetailScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";

  const safetyDetail = safetyDetails[category as string];

  if (!safetyDetail) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
        ]}
      >
        <Text
          style={[styles.errorText, { color: isDark ? "#ffffff" : "#000000" }]}
        >
          Category not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#f5f5f5" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity> */}
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}>
          {safetyDetail.title}
        </Text>
      </View>

      {/* Hero Image */}
      <Image
        source={
          typeof safetyDetail.heroImage === "string"
            ? { uri: safetyDetail.heroImage }
            : safetyDetail.heroImage
        }
        style={styles.heroImage}
        resizeMode="cover"
      />

      {/* Category Icon */}
      <View
        style={[styles.categoryIcon, { backgroundColor: safetyDetail.color }]}
      >
        <Ionicons name={safetyDetail.icon as any} size={32} color="white" />
      </View>

      {/* Description */}
      <View
        style={[
          styles.descriptionContainer,
          { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
        ]}
      >
        <Text
          style={[
            styles.description,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          {safetyDetail.description}
        </Text>
      </View>

      {/* Key Points */}
      <View
        style={[
          styles.keyPointsContainer,
          { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
        ]}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          Key Safety Points
        </Text>
        {safetyDetail.keyPoints.map((point, index) => (
          <View key={index} style={styles.keyPoint}>
            <View
              style={[
                styles.keyPointIcon,
                { backgroundColor: safetyDetail.color },
              ]}
            >
              <Text style={styles.keyPointNumber}>{index + 1}</Text>
            </View>
            <Text
              style={[
                styles.keyPointText,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              {point}
            </Text>
          </View>
        ))}
      </View>

      {/* Detailed Content */}
      <View style={styles.detailedContentContainer}>
        {safetyDetail.detailedContent.map((section, index) => (
          <View
            key={index}
            style={[
              styles.sectionCard,
              { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              {section.section}
            </Text>
            {section.image && (
              <Image
                source={
                  typeof section.image === "string"
                    ? { uri: section.image }
                    : section.image
                }
                style={styles.sectionImage}
                resizeMode="cover"
              />
            )}
            <Text
              style={[
                styles.sectionContent,
                { color: isDark ? "#cccccc" : "#333333" },
              ]}
            >
              {section.content}
            </Text>
          </View>
        ))}
      </View>

      {/* Call to Action */}
      <View
        style={[
          styles.ctaContainer,
          { backgroundColor: isDark ? "#1c1e21" : "#ffffff" },
        ]}
      >
        <Text
          style={[styles.ctaTitle, { color: isDark ? "#ffffff" : "#000000" }]}
        >
          Need Immediate Help?
        </Text>
        <Text
          style={[styles.ctaText, { color: isDark ? "#cccccc" : "#666666" }]}
        >
          If you're in an emergency situation, call 911 or campus security
          immediately.
        </Text>
        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: "#FF3B30" }]}
          onPress={() => {
            // In a real app, this would dial emergency numbers
            console.log("Emergency button pressed");
          }}
        >
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.emergencyButtonText}>Emergency Contact</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 26,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  categoryIcon: {
    position: "absolute",
    top: 220,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  descriptionContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  keyPointsContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  keyPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  keyPointIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  keyPointNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  keyPointText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  detailedContentContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  ctaContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  emergencyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
});
