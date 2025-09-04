import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  safetyCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchContainer: {
    flex: 1, // 1 part for the switch
    alignItems: "flex-end", // push switch to right edge
    justifyContent: "center",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Setup Screen Styles
  setupHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  setupContent: {
    flex: 1,
    paddingTop: 16,
  },
  locationInputs: {
    gap: 16,
    marginBottom: 20,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    gap: 12,
  },
  locationInputContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  routeInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeInfoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  intervalPicker: {
    marginBottom: 20,
  },
  intervalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  intervalOptions: {
    flexDirection: "row",
    gap: 12,
  },
  intervalOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  intervalOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  friendsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  friendChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
    minWidth: 120,
  },
  friendAvatar: {
    fontSize: 20,
  },
  friendChipName: {
    fontSize: 14,
    fontWeight: "500",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mapPreview: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapPreviewMap: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPreviewText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  // Location Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  locationPickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationOptions: {
    padding: 20,
  },
  locationSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 16,
  },
  locationOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Waiting Screen Styles
  waitingHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  waitingContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  inviteStatus: {
    alignItems: "center",
    marginBottom: 40,
  },
  inviteStatusText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
  shareSection: {
    marginBottom: 40,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  startWalkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  startWalkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  // Active Walk Screen Styles
  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#34C759",
  },
  activeHeaderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  activeMapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  activeMap: {
    flex: 1,
  },
  activeControls: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  timerChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
  },
  controlButtons: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  headerTitleRow: {
    marginBottom: 8,
  },
  scrollContent: {
    flex: 1,
    width: "100%",
  },
});

export default styles;
