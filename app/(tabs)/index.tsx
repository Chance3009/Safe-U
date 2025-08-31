import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  useColorScheme,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  status: 'delivered' | 'watching' | 'on-way' | 'none';
  eta?: string;
}

interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export default function SOSScreen() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [emergencyStartTime, setEmergencyStartTime] = useState<Date | null>(null);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedTab, setSelectedTab] = useState<'status' | 'people' | 'actions'>('status');
  const [audioRecording, setAudioRecording] = useState(false);
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 37.78825,
    longitude: -122.4324,
    timestamp: new Date(),
  });
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);

  const isDark = useColorScheme() === 'dark';
  const countdownAnimation = useRef(new Animated.Value(1)).current;

  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Sarah Chen', phone: '+1 555-0101', status: 'watching' },
    { id: '2', name: 'Mike Johnson', phone: '+1 555-0102', status: 'on-way', eta: '4m' },
    { id: '3', name: 'Emma Davis', phone: '+1 555-0103', status: 'delivered' },
    { id: '4', name: 'Campus Security', phone: '+1 555-0000', status: 'watching' },
  ];

  const handleEmergencySOS = () => {
    setCountdownActive(true);
    setCountdownValue(3);

    // Start countdown animation
    Animated.timing(countdownAnimation, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const countdownInterval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdownActive(false);
          activateEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const activateEmergency = () => {
    setIsEmergencyActive(true);
    setEmergencyStartTime(new Date());
    setLocationHistory([userLocation]);

    // Start location tracking simulation
    const locationInterval = setInterval(() => {
      if (isEmergencyActive) {
        const newLocation = {
          ...userLocation,
          timestamp: new Date(),
        };
        setLocationHistory(prev => [...prev, newLocation]);
      } else {
        clearInterval(locationInterval);
      }
    }, 5000);

    Alert.alert(
      'Emergency SOS Activated',
      'Your emergency contacts have been notified and your location is being shared.',
      [{ text: 'OK' }]
    );
  };

  const handleEndEmergency = () => {
    setShowPasswordModal(true);
  };

  const confirmEndEmergency = () => {
    if (password === '1234') { // Simple password for demo
      setIsEmergencyActive(false);
      setEmergencyStartTime(null);
      setLocationHistory([]);
      setPassword('');
      setShowPasswordModal(false);
      setAudioRecording(false);

      Alert.alert(
        'SOS Ended',
        'Emergency session has been terminated. Your contacts have been notified that you are safe.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Incorrect Password', 'Please enter the correct password to end SOS.');
      setPassword('');
    }
  };

  const getEmergencyDuration = () => {
    if (!emergencyStartTime) return '00:00';
    const now = new Date();
    const diff = Math.floor((now.getTime() - emergencyStartTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#34C759';
      case 'watching': return '#FF9500';
      case 'on-way': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'watching': return 'Watching';
      case 'on-way': return 'On my way';
      default: return 'Pending';
    }
  };

  if (countdownActive) {
    return (
      <View style={[styles.container, { backgroundColor: '#FF0000' }]}>
        <View style={styles.countdownContainer}>
          <Animated.View style={[styles.countdownRing, { transform: [{ scale: countdownAnimation }] }]}>
            <Text style={styles.countdownText}>{countdownValue}</Text>
          </Animated.View>
          <Text style={styles.countdownLabel}>Alerting your contacts...</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setCountdownActive(false);
              setCountdownValue(3);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f5f5f5' }]}>
      {/* Header */}
      {isEmergencyActive && (
        <View style={styles.emergencyHeader}>
          <View style={styles.emergencyStatus}>
            <Ionicons name="warning" size={24} color="#FF0000" />
            <Text style={styles.emergencyStatusText}>
              SOS Active • {getEmergencyDuration()}
            </Text>
          </View>
        </View>
      )}

      {/* Main SOS Button - Changed to rectangular when active */}
      <View style={[
        styles.sosContainer,
        isEmergencyActive && styles.sosContainerActive
      ]}>
        <TouchableOpacity
          style={[
            styles.sosButton,
            isEmergencyActive ? styles.endSosButton : null,
            { backgroundColor: isEmergencyActive ? '#FF4444' : '#FF0000' }
          ]}
          onPress={isEmergencyActive ? handleEndEmergency : handleEmergencySOS}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isEmergencyActive ? "checkmark-circle" : "warning"}
            size={isEmergencyActive ? 40 : 60}
            color="white"
          />
          <Text style={styles.sosButtonText}>
            {isEmergencyActive ? 'END SOS' : 'EMERGENCY SOS'}
          </Text>
          <Text style={styles.sosButtonSubtext}>
            {isEmergencyActive ? 'Tap to confirm safe' : 'Hold 1s to prevent accidental'}
          </Text>
        </TouchableOpacity>

        {!isEmergencyActive && (
          <TouchableOpacity style={styles.callSecurityButton}>
            <Ionicons name="call" size={24} color="white" />
            <Text style={styles.callSecurityText}>Call Campus Security</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Map View when SOS is active - Adjusted position */}
      {isEmergencyActive && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* User location marker */}
            <Marker
              coordinate={userLocation}
              title="Your Location"
              description="SOS Active"
              pinColor="#FF0000"
            />

            {/* Location history breadcrumbs */}
            {locationHistory.length > 1 && (
              <Polyline
                coordinates={locationHistory}
                strokeColor="#FF0000"
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        </View>
      )}

      {/* Bottom Sheet with Tabs */}
      {isEmergencyActive && (
        <View style={[styles.bottomSheet, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' }]}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'status' && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setSelectedTab('status')}
            >
              <Text style={[
                styles.tabButtonText,
                selectedTab === 'status' && { color: 'white' }
              ]}>
                Status
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'people' && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setSelectedTab('people')}
            >
              <Text style={[
                styles.tabButtonText,
                selectedTab === 'people' && { color: 'white' }
              ]}>
                People
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === 'actions' && { backgroundColor: '#007AFF' }
              ]}
              onPress={() => setSelectedTab('actions')}
            >
              <Text style={[
                styles.tabButtonText,
                selectedTab === 'actions' && { color: 'white' }
              ]}>
                Actions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {selectedTab === 'status' && (
              <View style={styles.statusTab}>
                <View style={styles.statusItem}>
                  <Ionicons name="location" size={24} color="#34C759" />
                  <Text style={[styles.statusText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Live location ON
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Ionicons name="mic" size={24} color={audioRecording ? "#34C759" : "#8E8E93"} />
                  <Text style={[styles.statusText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Audio recording {audioRecording ? 'ON' : 'OFF'}
                  </Text>
                  <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: audioRecording ? '#34C759' : '#8E8E93' }]}
                    onPress={() => setAudioRecording(!audioRecording)}
                  >
                    <Text style={styles.toggleButtonText}>
                      {audioRecording ? 'ON' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedTab === 'people' && (
              <ScrollView 
                style={styles.peopleTab}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.peopleTabContent}
              >
                {emergencyContacts.map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <View style={styles.contactInfo}>
                      <Text style={[styles.contactName, { color: isDark ? '#ffffff' : '#000000' }]}>
                        {contact.name}
                      </Text>
                      <Text style={[styles.contactPhone, { color: isDark ? '#999999' : '#666666' }]}>
                        {contact.phone}
                      </Text>
                    </View>
                    <View style={styles.contactStatus}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(contact.status) }]}>
                        <Text style={styles.statusBadgeText}>
                          {getStatusText(contact.status)}
                        </Text>
                      </View>
                      {contact.eta && (
                        <Text style={[styles.etaText, { color: isDark ? '#999999' : '#666666' }]}>
                          ETA: {contact.eta}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {selectedTab === 'actions' && (
              <View style={styles.actionsTab}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share" size={24} color="#007AFF" />
                  <Text style={[styles.actionButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Share link
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call" size={24} color="#34C759" />
                  <Text style={[styles.actionButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Call security
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble" size={24} color="#FF9500" />
                  <Text style={[styles.actionButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    Message all
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Confirm End SOS
            </Text>
            <Text style={[styles.modalDescription, { color: isDark ? '#999999' : '#666666' }]}>
              Enter your password to confirm you are safe and end the emergency session.
            </Text>
            <TextInput
              style={[styles.passwordInput, {
                backgroundColor: isDark ? '#333333' : '#f0f0f0',
                color: isDark ? '#ffffff' : '#000000'
              }]}
              placeholder="Enter password"
              placeholderTextColor={isDark ? '#999999' : '#666666'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmEndEmergency}
              >
                <Text style={styles.confirmButtonText}>End SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emergencyHeader: {
    backgroundColor: '#FF0000',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  emergencyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emergencyStatusText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  sosContainerActive: {
    flex: 0, // Don't take up extra space when active
    paddingTop: 30, // Add space below app bar
    paddingBottom: 10,
  },
  sosButton: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sosButtonActive: {
    backgroundColor: '#FF4444',
  },
  endSosButton: {
    width: '100%',
    height: 120,
    borderRadius: 20, // Rounded rectangle corners
    maxWidth: 300,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  sosButtonSubtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  callSecurityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  callSecurityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  countdownRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: 'white',
    fontSize: 80,
    fontWeight: 'bold',
  },
  countdownLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20, // Adjusted from 120 to work with rectangular button
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  tabContent: {
    minHeight: 200,
    maxHeight: 300, // Set a max height to ensure scrolling works
  },
  statusTab: {
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  peopleTab: {
    flex: 1,
  },
  peopleTabContent: {
    paddingBottom: 20, // Add padding at the bottom for better scrolling
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  contactStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  etaText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionsTab: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  passwordInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
