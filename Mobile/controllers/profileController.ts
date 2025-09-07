import { Alert } from "react-native";

// Handles toggling edit mode and saving profile changes
export function handleEditProfile(isEditingProfile: boolean, setIsEditingProfile: (v: boolean) => void) {
  if (isEditingProfile) {
    Alert.alert("Profile Updated", "Your profile has been updated successfully.");
  }
  setIsEditingProfile(!isEditingProfile);
}

// Handles adding a new emergency contact
export function handleAddEmergencyContact() {
  Alert.alert(
    "Add Emergency Contact",
    "Enter the contact information for your new emergency contact."
  );
}

// Handles removing an emergency contact
export function handleRemoveEmergencyContact(contactId: string) {
  Alert.alert(
    "Remove Contact",
    "Are you sure you want to remove this emergency contact?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () =>
          Alert.alert("Contact Removed", "Emergency contact has been removed."),
      },
    ]
  );
}

// Handles pressing an app setting
export function handleSettingPress(setting: any) {
  Alert.alert(setting.title, setting.description);
}

// Handles logout logic
export function handleLogout() {
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
}