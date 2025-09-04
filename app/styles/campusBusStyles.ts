import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  busInfo: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  busInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  busInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  mapLabel: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapLabelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  busStopMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  busMarker: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  busMarkerText: {
    fontSize: 20,
  },
  statsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 16,
    fontWeight: "500",
  },
  busListHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  busListTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  busList: {
    gap: 12,
  },
  busItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  busIconContainer: {
    marginRight: 16,
  },
  busIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  busIconText: {
    fontSize: 24,
  },
  busInfo: {
    flex: 1,
    marginRight: 12,
  },
  busHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  busName: {
    fontSize: 16,
    fontWeight: "600",
  },
  busCode: {
    fontSize: 14,
    fontWeight: "500",
  },
  busDetails: {
    gap: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  routeText: {
    fontSize: 12,
  },
  etaContainer: {
    alignItems: "center",
  },
  etaText: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
