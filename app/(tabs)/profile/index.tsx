import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import styles from "../../../components/styles/profileStyles";
import profileData from "./profileData.json";
import {
  handleEditProfile,
  handleAddEmergencyContact,
  handleRemoveEmergencyContact,
  handleSettingPress,
  handleLogout,
} from "../../../controllers/profileController";

export default function ProfileScreen() {
  const [locationSharing, setLocationSharing] = useState(true);
  const [dataConsent, setDataConsent] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState("Alex Johnson");
  const [userEmail, setUserEmail] = useState("alex.johnson@university.edu");
  const [userPhone, setUserPhone] = useState("+1 555-0123");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { emergencyContacts, appSettings } = profileData;

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
            onPress={() =>
              handleEditProfile(isEditingProfile, setIsEditingProfile)
            }
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
                    { color: isDark ? "#ffffff" : "#000000" },
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
                    { color: isDark ? "#ffffff" : "#000000" },
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

