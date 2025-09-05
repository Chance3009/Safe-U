import { StyleSheet } from "react-native";

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

export default styles;