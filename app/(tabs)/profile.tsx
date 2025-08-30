import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";

export default function ProfileScreen() {
  const [locationSharing, setLocationSharing] = useState(true);
  const [dataConsent, setDataConsent] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("Alex Johnson");
  const [userEmail, setUserEmail] = useState("alex.johnson@university.edu");
  const [userPhone, setUserPhone] = useState("+1 555-0123");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const emergencyContacts = [
    {
      id: "1",
      name: "Mom",
      phone: "+1 555-0101",
      relationship: "Parent",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Dad",
      phone: "+1 555-0102",
      relationship: "Parent",
      isPrimary: false,
    },
    {
      id: "3",
      name: "Sarah (Best Friend)",
      phone: "+1 555-0103",
      relationship: "Friend",
      isPrimary: false,
    },
    {
      id: "4",
      name: "Mike (Roommate)",
      phone: "+1 555-0104",
      relationship: "Roommate",
      isPrimary: false,
    },
  ];

  const appSettings = [
    {
      id: "1",
      title: "Accessibility",
      icon: "accessibility",
      description: "Voice commands, haptic feedback",
    },
    {
      id: "2",
      title: "Language",
      icon: "language",
      description: "English (US)",
    },
    {
      id: "3",
      title: "About SafeU",
      icon: "information-circle",
      description: "Version 1.0.0",
    },
    {
      id: "4",
      title: "Help & Support",
      icon: "help-circle",
      description: "FAQ and contact support",
    },
    {
      id: "5",
      title: "Privacy Policy",
      icon: "shield-checkmark",
      description: "Data usage and privacy",
    },
    {
      id: "6",
      title: "Terms of Service",
      icon: "document-text",
      description: "App usage terms",
    },
  ];

  const handleEditProfile = () => {
    if (isEditingProfile) {
      // Save changes
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const handleAddEmergencyContact = () => {
    Alert.alert(
      "Add Emergency Contact",
      "Enter the contact information for your new emergency contact."
    );
  };

  const handleRemoveEmergencyContact = (contactId: string) => {
    Alert.alert(
      "Remove Contact",
      "Are you sure you want to remove this emergency contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Contact Removed",
              "Emergency contact has been removed."
            ),
        },
      ]
    );
  };

  const handleSettingPress = (setting: any) => {
    Alert.alert(setting.title, setting.description);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout? You will need to sign in again to use SafeU.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () =>
            Alert.alert("Logged Out", "You have been successfully logged out."),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#ffffff" },
      ]}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: "#007AFF" }]}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          {isEditingProfile ? (
            <View style={styles.editProfileForm}>
              <TextInput
                style={[
                  styles.profileInput,
                  {
                    backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    color: isDark ? "#ffffff" : "#000000",
                  },
                ]}
                value={userName}
                onChangeText={setUserName}
                placeholder="Full Name"
                placeholderTextColor={isDark ? "#999999" : "#666666"}
              />
              <TextInput
                style={[
                  styles.profileInput,
                  {
                    backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    color: isDark ? "#ffffff" : "#000000",
                  },
                ]}
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Email"
                placeholderTextColor={isDark ? "#999999" : "#666666"}
                keyboardType="email-address"
              />
              <TextInput
                style={[
                  styles.profileInput,
                  {
                    backgroundColor: isDark ? "#333333" : "#f0f0f0",
                    color: isDark ? "#ffffff" : "#000000",
                  },
                ]}
                value={userPhone}
                onChangeText={setUserPhone}
                placeholder="Phone"
                placeholderTextColor={isDark ? "#999999" : "#666666"}
                keyboardType="phone-pad"
              />
            </View>
          ) : (
            <>
              <Text
                style={[
                  styles.userName,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {userName}
              </Text>
              <Text
                style={[
                  styles.userEmail,
                  { color: isDark ? "#999999" : "#666666" },
                ]}
              >
                {userEmail}
              </Text>
              <Text
                style={[
                  styles.userPhone,
                  { color: isDark ? "#999999" : "#666666" },
                ]}
              >
                {userPhone}
              </Text>
            </>
          )}

          <TouchableOpacity
            style={[
              styles.editProfileButton,
              { backgroundColor: isEditingProfile ? "#34C759" : "#007AFF" },
            ]}
            onPress={handleEditProfile}
          >
            <Ionicons
              name={isEditingProfile ? "checkmark" : "create"}
              size={16}
              color="white"
            />
            <Text style={styles.editProfileButtonText}>
              {isEditingProfile ? "Save Profile" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy Settings */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          Privacy & Security
        </Text>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location" size={24} color="#34C759" />
              <View style={styles.settingText}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: "#000000" }, // Always black
                  ]}
                >
                  Location Sharing
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  Share location with emergency contacts
                </Text>
              </View>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: "#767577", true: "#34C759" }}
              thumbColor={locationSharing ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: "#000000" }, // Always black
                  ]}
                >
                  Data Consent
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  Allow data collection for safety features
                </Text>
              </View>
            </View>
            <Switch
              style={styles.switchContainer}
              value={dataConsent}
              onValueChange={setDataConsent}
              trackColor={{ false: "#767577", true: "#007AFF" }}
              thumbColor={dataConsent ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color="#FF9500" />
              <View style={styles.settingText}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Push Notifications
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  Receive safety alerts and updates
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#FF9500" }}
              thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon" size={24} color="#AF52DE" />
              <View style={styles.settingText}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                >
                  Dark Mode
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  Use dark theme for better visibility
                </Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#767577", true: "#AF52DE" }}
              thumbColor={darkModeEnabled ? "#ffffff" : "#f4f3f4"}
            />
          </View>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
          >
            Emergency Contacts
          </Text>
          <TouchableOpacity
            style={[styles.addContactButton, { backgroundColor: "#34C759" }]}
            onPress={handleAddEmergencyContact}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.contactsList}>
          {emergencyContacts.map((contact) => (
            <View
              key={contact.id}
              style={[
                styles.contactItem,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
              ]}
            >
              <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                  <Text
                    style={[
                      styles.contactName,
                      { color: isDark ? "#ffffff" : "#000000" },
                    ]}
                  >
                    {contact.name}
                  </Text>
                  {contact.isPrimary && (
                    <View
                      style={[
                        styles.primaryBadge,
                        { backgroundColor: "#FF4444" },
                      ]}
                    >
                      <Text style={styles.primaryText}>Primary</Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.contactPhone,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {contact.phone}
                </Text>

                <Text
                  style={[
                    styles.contactRelationship,
                    { color: isDark ? "#999999" : "#666666" },
                  ]}
                >
                  {contact.relationship}
                </Text>
              </View>

              <View style={styles.contactActions}>
                <TouchableOpacity style={styles.contactActionButton}>
                  <Ionicons name="call" size={20} color="#34C759" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.contactActionButton}
                  onPress={() => handleRemoveEmergencyContact(contact.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
        >
          App Settings
        </Text>

        <View style={styles.settingsGrid}>
          {appSettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              style={[
                styles.settingGridItem,
                { backgroundColor: isDark ? "#333333" : "#f0f0f0" },
              ]}
              onPress={() => handleSettingPress(setting)}
            >
              <Ionicons name={setting.icon as any} size={24} color="#007AFF" />
              <Text
                style={[
                  styles.settingGridTitle,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {setting.title}
              </Text>
              <Text
                style={[
                  styles.settingGridDescription,
                  { color: isDark ? "#999999" : "#666666" },
                ]}
              >
                {setting.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: "#FF4444" }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  userPhone: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  editProfileForm: {
    width: "100%",
    marginBottom: 15,
  },
  profileInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  editProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  addContactButton: {
    padding: 8,
    borderRadius: 20,
  },
  settingsList: {
    gap: 15,
  },
  settingItem: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    // padding: 15,
    // backgroundColor: "#f0f0f0",
    // borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  switchContainer: {
    flex: 1, // 1 part for the switch
    alignItems: "flex-end", // push switch to right edge
    justifyContent: "center",
  },
  settingInfo: {
    // flexDirection: "row",
    // alignItems: "center",
    // gap: 15,
    flex: 8, // 8 parts for icon + text
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  contactsList: {
    gap: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    gap: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  contactPhone: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactRelationship: {
    fontSize: 12,
    fontStyle: "italic",
  },
  contactActions: {
    flexDirection: "row",
    gap: 10,
  },
  contactActionButton: {
    padding: 8,
  },
  settingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  settingGridItem: {
    width: "48%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  settingGridTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  settingGridDescription: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    opacity: 0.8,
  },
  logoutSection: {
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    gap: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
