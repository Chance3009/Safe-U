import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import safeHaven from "./safeHavenData.json"
import styles from "../../../styles/safeHavenStyles";

// Types for TypeScript
export interface SafeHaven {
  id: number;
  name: string;
  type: string;
  description: string;
  distance: string;
  estimatedTime: string;
  coordinates: { latitude: number; longitude: number };
  phone: string;
  features: string[];
  isOpen: boolean;
}

interface EmergencyContact {
  name: string;
  number: string;
  type: string;
}

// Mock data for safe havens - in a real app, this would come from your backend
const safeHavens: SafeHaven[] = safeHaven.safehavens;

const emergencyContacts: EmergencyContact[] = safeHaven.emergencyContacts;

export default function SafeHavenScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const handleNavigateToHaven = (haven: SafeHaven) => {
    // Navigate to the navigation screen with the selected haven
    router.push(`./safeHaven/navigation?havenId=${haven.id.toString()}`);
  };

  const handleCall = (phoneNumber: string) => {
    Alert.alert(
      "Make Emergency Call",
      `Call ${phoneNumber}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ]
    );
  };

  const handleEmergencyCall = (contact: EmergencyContact) => {
    Alert.alert(
      "Emergency Call",
      `Call ${contact.name} at ${contact.number}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call Now",
          style: "destructive",
          onPress: () => {
            Linking.openURL(`tel:${contact.number}`);
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Security":
        return "shield-checkmark";
      case "Religious":
        return "star";
      case "Residential":
        return "home";
      case "Law Enforcement":
        return "car";
      case "Academic":
        return "library";
      default:
        return "location";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Security":
        return "#FF6B6B";
      case "Religious":
        return "#4ECDC4";
      case "Residential":
        return "#45B7D1";
      case "Law Enforcement":
        return "#96CEB4";
      case "Academic":
        return "#FFEAA7";
      default:
        return "#DDA0DD";
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? "#000000" : "#f5f5f5" }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#ffffff" : "#000000" }]}>
          Safe Havens
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? "#999999" : "#666666" }]}>
          Find nearby safe locations and emergency contacts on campus
        </Text>
      </View>

      {/* Emergency Contacts Section */}
      <View style={[styles.section, { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
          Emergency Contacts
        </Text>
        <Text style={[styles.sectionDescription, { color: isDark ? "#999999" : "#666666" }]}>
          Quick access to emergency numbers and support services
        </Text>
        
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity
            key={index}
            style={styles.emergencyContact}
            onPress={() => handleEmergencyCall(contact)}
          >
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: isDark ? "#ffffff" : "#000000" }]}>
                {contact.name}
              </Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
              <Text style={styles.contactType}>{contact.type}</Text>
            </View>
            <Ionicons name="call" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Safe Havens List */}
      <View style={[styles.section, { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
          Nearby Safe Locations
        </Text>
        <Text style={[styles.sectionDescription, { color: isDark ? "#999999" : "#666666" }]}>
          Tap on any location to get directions and contact information
        </Text>

        {safeHavens.map((haven) => (
          <TouchableOpacity
            key={haven.id}
            style={[styles.havenCard, { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" }]}
            onPress={() => handleNavigateToHaven(haven)}
          >
            <View style={styles.havenHeader}>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(haven.type) }]}>
                <Ionicons name={getTypeIcon(haven.type)} size={16} color="white" />
                <Text style={styles.typeText}>{haven.type}</Text>
              </View>
              <View style={styles.distanceInfo}>
                <Text style={styles.distanceText}>{haven.distance}</Text>
                <Text style={styles.timeText}>{haven.estimatedTime}</Text>
              </View>
            </View>

            <Text style={[styles.havenName, { color: isDark ? "#ffffff" : "#000000" }]}>
              {haven.name}
            </Text>
            
            <Text style={[styles.havenDescription, { color: isDark ? "#999999" : "#666666" }]}>
              {haven.description}
            </Text>

            <View style={styles.featuresContainer}>
              {haven.features.map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.havenActions}>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => handleNavigateToHaven(haven)}
              >
                <Ionicons name="navigate" size={20} color="white" />
                <Text style={styles.navigateButtonText}>Navigate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(haven.phone)}
              >
                <Ionicons name="call" size={20} color="white" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Tips */}
      <View style={[styles.section, { backgroundColor: isDark ? "#1c1c1e" : "#ffffff" }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
          Safety Tips
        </Text>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
          <Text style={[styles.tipText, { color: isDark ? "#ffffff" : "#000000" }]}>
            Always let someone know where you're going and when you expect to return
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
          <Text style={[styles.tipText, { color: isDark ? "#ffffff" : "#000000" }]}>
            Stay in well-lit areas and avoid walking alone at night
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
          <Text style={[styles.tipText, { color: isDark ? "#ffffff" : "#000000" }]}>
            Trust your instincts - if something feels wrong, seek help immediately
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

