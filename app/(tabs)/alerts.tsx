import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polygon, Callout } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface AdminAlert {
    id: string;
    title: string;
    description: string;
    category: 'emergency' | 'announcement' | 'facility' | 'weather';
    severity: 'critical' | 'high' | 'medium' | 'low';
    timestamp: string;
    location: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    radius?: number; // For area-based alerts
    verifiedBy: string;
    expiresAt?: string;
}

export default function AlertsScreen() {
    const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 5.4164, // USM coordinates
        longitude: 100.3327,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const isDark = useColorScheme() === 'dark';

    const [adminAlerts] = useState<AdminAlert[]>([
        {
            id: '1',
            title: 'Exit Blocked',
            description: 'Construction ongoing at Science Building exit. Use alternative route via Engineering Building.',
            category: 'facility',
            severity: 'high',
            timestamp: '26/8/2025 4:50pm',
            location: 'Science Building, USM',
            coordinates: { latitude: 5.4164, longitude: 100.3327 },
            radius: 100,
            verifiedBy: 'Campus Security',
            expiresAt: '27/8/2025 6:00pm'
        },
        {
            id: '2',
            title: 'Heavy Rain Warning',
            description: 'Heavy rainfall expected. Campus pathways may be slippery. Use covered walkways.',
            category: 'weather',
            severity: 'medium',
            timestamp: '26/8/2025 4:45pm',
            location: 'Campus-wide',
            coordinates: { latitude: 5.4164, longitude: 100.3327 },
            verifiedBy: 'Meteorological Department',
            expiresAt: '27/8/2025 12:00pm'
        },
        {
            id: '3',
            title: 'Security Incident',
            description: 'Suspicious activity reported near Library. Security personnel deployed. Stay alert.',
            category: 'emergency',
            severity: 'critical',
            timestamp: '26/8/2025 4:30pm',
            location: 'Library Area, USM',
            coordinates: { latitude: 5.4174, longitude: 100.3337 },
            radius: 200,
            verifiedBy: 'Campus Security',
            expiresAt: '26/8/2025 8:00pm'
        },
        {
            id: '4',
            title: 'Bus Service Disruption',
            description: 'Campus bus service temporarily suspended due to road maintenance.',
            category: 'facility',
            severity: 'medium',
            timestamp: '26/8/2025 4:00pm',
            location: 'Main Bus Terminal',
            coordinates: { latitude: 5.4154, longitude: 100.3317 },
            verifiedBy: 'Transport Department',
            expiresAt: '27/8/2025 6:00am'
        }
    ]);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'emergency': return '#FF4444';
            case 'announcement': return '#FF9500';
            case 'facility': return '#007AFF';
            case 'weather': return '#FFD700';
            default: return '#34C759';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'emergency': return 'warning';
            case 'announcement': return 'megaphone';
            case 'facility': return 'construct';
            case 'weather': return 'rainy';
            default: return 'information-circle';
        }
    };

    const getSeverityText = (severity: string) => {
        return severity.charAt(0).toUpperCase() + severity.slice(1);
    };

    const handleAlertSelect = (alertId: string) => {
        setSelectedAlert(alertId === selectedAlert ? null : alertId);
        const alert = adminAlerts.find(a => a.id === alertId);
        if (alert) {
            setMapRegion({
                latitude: alert.coordinates.latitude,
                longitude: alert.coordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    };

    const handleMapPress = () => {
        setSelectedAlert(null);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f5f5f5' }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
                        Official Alerts
                    </Text>
                    <View style={styles.headerBadge}>
                        <Ionicons name="shield-checkmark" size={16} color="#34C759" />
                        <Text style={styles.headerBadgeText}>Admin Verified</Text>
                    </View>
                </View>
                <Text style={[styles.subtitle, { color: isDark ? '#999999' : '#666666' }]}>
                    Critical safety information from campus authorities
                </Text>
            </View>

            {/* Map View */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={setMapRegion}
                    onPress={handleMapPress}
                >
                    {/* Campus Buildings */}
                    <Marker
                        coordinate={{ latitude: 5.4164, longitude: 100.3327 }}
                        title="Science Building, USM"
                        description="Main Science Complex"
                        pinColor="#007AFF"
                    />
                    <Marker
                        coordinate={{ latitude: 5.4174, longitude: 100.3337 }}
                        title="Library, USM"
                        description="Central Library"
                        pinColor="#007AFF"
                    />
                    <Marker
                        coordinate={{ latitude: 5.4154, longitude: 100.3317 }}
                        title="Main Bus Terminal"
                        description="Campus Transportation Hub"
                        pinColor="#007AFF"
                    />

                    {/* Alert Markers */}
                    {adminAlerts.map((alert) => (
                        <Marker
                            key={alert.id}
                            coordinate={alert.coordinates}
                            title={alert.title}
                            description={alert.description}
                            pinColor={getCategoryColor(alert.category)}
                            onPress={() => handleAlertSelect(alert.id)}
                        >
                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{alert.title}</Text>
                                    <Text style={styles.calloutDescription}>{alert.description}</Text>
                                    <View style={[styles.calloutBadge, { backgroundColor: getCategoryColor(alert.category) }]}>
                                        <Text style={styles.calloutBadgeText}>
                                            {getCategoryIcon(alert.category)} {alert.category.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                    {/* Selected Alert Area */}
                    {selectedAlert && adminAlerts.find(a => a.id === selectedAlert)?.radius && (
                        <Marker
                            coordinate={adminAlerts.find(a => a.id === selectedAlert)!.coordinates}
                            title="Alert Area"
                            description="Affected area"
                        >
                            <View style={[styles.areaMarker, {
                                backgroundColor: getCategoryColor(adminAlerts.find(a => a.id === selectedAlert)!.category),
                                width: 20,
                                height: 20,
                                borderRadius: 10
                            }]} />
                        </Marker>
                    )}
                </MapView>

                {/* Map Legend */}
                <View style={[styles.mapLegend, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' }]}>
                    <Text style={[styles.legendTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                        Alert Categories
                    </Text>
                    <View style={styles.legendItems}>
                        {[
                            { category: 'emergency', label: 'Emergency' },
                            { category: 'announcement', label: 'Announcement' },
                            { category: 'facility', label: 'Facility' },
                            { category: 'weather', label: 'Weather' }
                        ].map((item) => (
                            <View key={item.category} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: getCategoryColor(item.category) }]} />
                                <Text style={[styles.legendText, { color: isDark ? '#999999' : '#666666' }]}>
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Alerts List */}
            <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
                <Text style={[styles.listTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Active Alerts ({adminAlerts.length})
                </Text>

                {adminAlerts.map((alert) => (
                    <TouchableOpacity
                        key={alert.id}
                        style={[
                            styles.alertCard,
                            { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' },
                            selectedAlert === alert.id && styles.selectedAlertCard
                        ]}
                        onPress={() => handleAlertSelect(alert.id)}
                    >
                        <View style={styles.alertHeader}>
                            <View style={styles.alertTitleRow}>
                                <Ionicons
                                    name={getCategoryIcon(alert.category) as any}
                                    size={24}
                                    color={getCategoryColor(alert.category)}
                                />
                                <Text
                                  style={[
                                    styles.alertTitle,
                                    {
                                      color:
                                        selectedAlert === alert.id
                                          ? '#000' // Always black when selected
                                          : isDark
                                          ? '#fff'
                                          : '#000',
                                    },
                                  ]}
                                >
                                  {alert.title}
                                </Text>
                            </View>
                            <View style={[styles.severityBadge, { backgroundColor: getCategoryColor(alert.category) }]}>
                                <Text style={styles.severityText}>
                                    {getSeverityText(alert.severity)}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.alertDescription, { color: isDark ? '#999999' : '#666666' }]}>
                            {alert.description}
                        </Text>

                        <View style={styles.alertDetails}>
                            <View style={styles.detailRow}>
                                <Ionicons name="time" size={16} color={isDark ? '#999999' : '#666666'} />
                                <Text style={[styles.detailText, { color: isDark ? '#999999' : '#666666' }]}>
                                    {alert.timestamp}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="location" size={16} color={isDark ? '#999999' : '#666666'} />
                                <Text style={[styles.detailText, { color: isDark ? '#999999' : '#666666' }]}>
                                    {alert.location}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Ionicons name="shield-checkmark" size={16} color={isDark ? '#999999' : '#666666'} />
                                <Text style={[styles.detailText, { color: isDark ? '#999999' : '#666666' }]}>
                                    Verified by {alert.verifiedBy}
                                </Text>
                            </View>

                            {alert.expiresAt && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="timer" size={16} color={isDark ? '#999999' : '#666666'} />
                                    <Text style={[styles.detailText, { color: isDark ? '#999999' : '#666666' }]}>
                                        Expires: {alert.expiresAt}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.alertActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: getCategoryColor(alert.category) }]}
                                onPress={() => handleAlertSelect(alert.id)}
                            >
                                <Ionicons name="map" size={16} color="white" />
                                <Text style={styles.actionButtonText}>View on Map</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#34C759' }]}
                                onPress={() => console.log('Get directions to', alert.location)}
                            >
                                <Ionicons name="navigate" size={16} color="white" />
                                <Text style={styles.actionButtonText}>Get Directions</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Info Section */}
                <View style={[styles.infoSection, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' }]}>
                    <Text style={[styles.infoTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                        About Official Alerts
                    </Text>
                    <Text style={[styles.infoText, { color: isDark ? '#999999' : '#666666' }]}>
                        These alerts are verified by campus authorities and contain critical safety information.
                        Community reports can escalate to official alerts if they receive sufficient community support
                        and are verified by administrators.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34C759',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    headerBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 22,
    },
    mapContainer: {
        height: height * 0.25,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    mapLegend: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    legendItems: {
        gap: 6,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 10,
    },
    alertsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    alertCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedAlertCard: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    alertTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    alertTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    severityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    alertDescription: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 16,
    },
    alertDetails: {
        gap: 8,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
    },
    alertActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    infoSection: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
    },
    calloutContainer: {
        width: 200,
        padding: 8,
    },
    calloutTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    calloutDescription: {
        fontSize: 12,
        marginBottom: 8,
    },
    calloutBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    calloutBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    areaMarker: {
        borderWidth: 2,
        borderColor: 'white',
    },
});
