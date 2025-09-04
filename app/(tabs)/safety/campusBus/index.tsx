import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import busData from './indexData.json';
import styles from '../../../styles/campusBusStyles'; // Add this import

export default function CampusBusScreen() {
  const [selectedBusId, setSelectedBusId] = useState<string>('bus3');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const { activeBuses, closestBusStop, buses, busStops } = busData;

  const handleBusSelect = (busId: string) => {
    setSelectedBusId(busId);
  };

  const getBusStatusColor = (status: string) => {
    switch (status) {
      case 'selected':
        return '#34C759';
      case 'active':
        return '#007AFF';
      default:
        return '#999999';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1c1c1e' : '#f8f8f8' }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
          <Text style={[styles.backButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
            Campus buses
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 37.7749,
              longitude: -122.4194,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Bus Stops */}
            {busStops.map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                }}
                title={stop.name}
              >
                <View style={styles.busStopMarker}>
                  <Ionicons name="location" size={24} color="#FF4444" />
                </View>
              </Marker>
            ))}

            {/* Bus Marker (example position) */}
            <Marker
              coordinate={{
                latitude: 37.7779,
                longitude: -122.4164,
              }}
              title="Campus Bus"
            >
              <View style={styles.busMarker}>
                <Text style={styles.busMarkerText}>🚌</Text>
              </View>
            </Marker>
          </MapView>

          {/* Map Label */}
          <View style={[styles.mapLabel, { backgroundColor: isDark ? 'rgba(28, 28, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
            <Text style={[styles.mapLabelText, { color: isDark ? '#ffffff' : '#000000' }]}>
              map
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: isDark ? '#1c1c1e' : '#f8f8f8' }]}>
          <Text style={[styles.statsText, { color: isDark ? '#ffffff' : '#000000' }]}>
            Active buses: {activeBuses}
          </Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: isDark ? '#1c1c1e' : '#f8f8f8' }]}>
          <Text style={[styles.statsText, { color: isDark ? '#ffffff' : '#000000' }]}>
            Closest bus stop: {closestBusStop.name}
          </Text>
        </View>

        {/* Bus List Section */}
        <View style={styles.busListHeader}>
          <Text style={[styles.busListTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            List of oncoming buses
          </Text>
        </View>

        <View style={styles.busList}>
          {buses.map((bus) => (
            <TouchableOpacity
              key={bus.id}
              style={[
                styles.busItem,
                { 
                  backgroundColor: isDark ? '#1c1c1e' : '#f8f8f8',
                  borderColor: selectedBusId === bus.id ? '#34C759' : 'transparent',
                  borderWidth: selectedBusId === bus.id ? 2 : 0,
                }
              ]}
              onPress={() => handleBusSelect(bus.id)}
            >
              {/* Bus Icon */}
              <View style={styles.busIconContainer}>
                <View style={[styles.busIcon, { backgroundColor: getBusStatusColor(bus.status) }]}>
                  <Text style={styles.busIconText}>🚌</Text>
                </View>
              </View>

              {/* Bus Info */}
              <View style={styles.busInfo}>
                <View style={styles.busHeader}>
                  <Text style={[styles.busName, { color: isDark ? '#ffffff' : '#000000' }]}>
                    {bus.name}
                  </Text>
                  <Text style={[styles.busCode, { color: isDark ? '#999999' : '#666666' }]}>
                    {bus.code}
                  </Text>
                </View>

                <View style={styles.busDetails}>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#FF4444" />
                    <Text style={[styles.locationText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      Location: {bus.location}
                    </Text>
                  </View>

                  <Text style={[styles.routeText, { color: isDark ? '#999999' : '#666666' }]}>
                    Route: {bus.route}
                  </Text>
                </View>
              </View>

              {/* ETA */}
              <View style={styles.etaContainer}>
                <Text style={[styles.etaText, { color: isDark ? '#ffffff' : '#000000' }]}>
                  {bus.eta}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
            onPress={() => Alert.alert('Feature', 'Track selected bus coming soon!')}
          >
            <Ionicons name="navigate" size={20} color="white" />
            <Text style={styles.actionButtonText}>Track Bus</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#34C759' }]}
            onPress={() => Alert.alert('Feature', 'Set reminder coming soon!')}
          >
            <Ionicons name="notifications" size={20} color="white" />
            <Text style={styles.actionButtonText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}