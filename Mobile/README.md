# Safe-U - Campus Safety Mobile App

**By: ViCoders**  
**Track 2: Campus Management**

## Problem Statement

**The Problem:** In panic situations, students face three critical challenges:
- **Hesitation** - Don't know how to react in emergency situations
- **Unseen** - Help exists, but has wait times and accessibility windows  
- **Slow Help** - Help exists, but response times are delayed

**Our Solution:** A panic-proof mobile platform that enables students to be seen in real-time, avoid danger, and guide responders straight to them within seconds.

## Overview

A comprehensive campus safety ecosystem that connects individuals, peers, and campus security through one integrated platform. With SOS alerts, friend walk, incident reporting, and safety resources, it enables prevention, rapid response, and community resilience.

## 🚨 Features

### 1. Emergency SOS System ✅
- **One-tap SOS button** - Large, prominent emergency button with countdown
- **Emergency session management** - Password-protected sessions with live tracking
- **Quick actions** - Call security, share location, record audio
- **Emergency contacts** - Contact management and notification system
- **Location tracking** - Real-time GPS tracking during emergencies

### 2. Safety Navigation ✅
- **Campus bus tracking** - Real-time bus schedules and routes
- **Safe haven identification** - Map of safe points and security locations
- **Navigation assistance** - Route guidance to safe locations
- **Interactive campus map** - Visual representation of safety resources

### 3. Incident Reporting ✅
- **Voice reporting** - Audio recording for incident reports
- **Manual forms** - Text and media uploads with location data
- **Category selection** - Security, harassment, facility, suspicious activity
- **Anonymous options** - Submit reports without revealing identity
- **Report tracking** - Monitor status from submission to resolution

### 4. Community Safety Features ✅
- **Safety tips and resources** - Community-driven safety information
- **Safety events** - Campus safety events and workshops
- **Educational content** - Safety knowledge and best practices
- **Resource directory** - Quick access to campus security and support services

### 5. Alert & Notification System ✅
- **Emergency alerts** - Campus-wide safety notifications
- **Personal notifications** - Custom alert preferences
- **Safety bulletins** - Official campus security updates
- **Real-time updates** - Live information about ongoing incidents

### 6. User Profile & Settings ✅
- **Emergency contacts management** - Add/edit trusted contacts
- **Privacy settings** - Control data sharing and visibility
- **App preferences** - Customize notifications and accessibility
- **Dark/light theme** - Visual comfort for different environments

## 🛠️ Technical Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router with tab-based navigation
- **Icons**: Expo Vector Icons (Ionicons)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: React Native StyleSheet with dark/light theme support
- **Platform**: Cross-platform (iOS, Android, Web)

## 📱 App Structure

```
Safe-U Mobile App
├── SOS Tab (Primary)
│   ├── Emergency SOS Button
│   ├── Emergency Session Management
│   ├── Quick Actions (Call, Share, Record)
│   └── Live Location Tracking
├── Safety Tab
│   ├── Campus Bus Tracking
│   ├── Safe Haven Locations
│   ├── Navigation & Routes
│   └── FriendWalk (Basic Implementation)
├── Community Tab
│   ├── Safety Tips & Resources
│   ├── Safety Events
│   ├── Educational Content
│   └── Resource Directory
├── Alerts Tab
│   ├── Emergency Alerts
│   ├── Safety Bulletins
│   ├── Personal Notifications
│   └── Alert History
└── Profile Tab
    ├── User Profile
    ├── Emergency Contacts
    ├── Privacy Settings
    └── App Preferences
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd Safe-U/Mobile
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the development server**
   ```powershell
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

### Development Commands

```powershell
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Run tests
npm test
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=your_api_url_here
API_KEY=your_api_key_here

# Emergency Services
CAMPUS_SECURITY_PHONE=555-0123
EMERGENCY_PHONE=911

# Feature Flags
ENABLE_VOICE_RECOGNITION=true
ENABLE_LOCATION_TRACKING=true
ENABLE_PUSH_NOTIFICATIONS=true
```

### App Configuration
Update `app.json` for app-specific settings:

```json
{
  "expo": {
    "name": "SafeU",
    "slug": "safeu",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "permissions": [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "RECORD_AUDIO",
      "CAMERA",
      "NOTIFICATIONS"
    ]
  }
}
```

## 📱 Features in Detail

### Emergency SOS System
The SOS system is the core feature of SafeU, providing immediate emergency response:

1. **Activation**: Tap the large SOS button or use voice command "Help me"
2. **Session Start**: Begins emergency tracking, location sharing, and recording
3. **Contact Notification**: Immediately alerts all emergency contacts
4. **Security Alert**: Notifies campus security with incident details
5. **Live Tracking**: Continuous location updates until session ends
6. **Session End**: Password-protected confirmation of safety

### FriendWalk System
A unique peer-to-peer safety escort system:

1. **Route Setup**: Define start and destination locations
2. **Friend Selection**: Choose trusted contacts to escort you
3. **Real-time Tracking**: Share live location with selected friends
4. **Check-ins**: Periodic safety confirmations during journey
5. **Route Monitoring**: Alerts if you deviate from planned route
6. **Safe Arrival**: Automatic notification when you reach destination

### Incident Reporting
Comprehensive reporting system for safety concerns:

1. **Voice Reports**: 10-second hold-to-talk with AI processing
2. **Manual Forms**: Detailed incident documentation with media
3. **Location Pinning**: Automatic location capture for reports
4. **Category Classification**: Organized reporting by incident type
5. **Anonymous Options**: Submit reports without revealing identity
6. **Status Tracking**: Monitor progress from submission to resolution

## 🎨 Design Principles

### Accessibility First
- **Voice commands** for all major functions
- **Haptic feedback** for different alert types
- **High-contrast modes** for emergency situations
- **Large touch targets** for emergency functions
- **Text-to-speech** for alerts and instructions

### User Experience
- **One-handed operation** for emergency functions
- **Intuitive navigation** with clear visual hierarchy
- **Consistent design language** across all screens
- **Responsive feedback** for all user interactions
- **Dark/light theme** support for different environments

### Safety Focus
- **Emergency-first design** - SOS always accessible
- **Quick access** to critical safety features
- **Clear visual indicators** for different alert levels
- **Redundant safety measures** for critical functions
- **Privacy controls** for sensitive information

## 🔒 Security & Privacy

### Data Protection
- **End-to-end encryption** for sensitive communications
- **User consent management** for all data sharing
- **Anonymous reporting options** for community safety
- **Data retention policies** with user control
- **Secure authentication** with biometric options

### Privacy Controls
- **Location sharing** - User-controlled with emergency override
- **Data consent** - Granular permissions for different features
- **Anonymous mode** - Submit reports without revealing identity
- **Contact management** - User-defined emergency contact lists
- **Notification preferences** - Customizable alert settings

## 🚧 Future Enhancements

### Planned Features
- **Enhanced FriendWalk system** with complete route tracking
- **Real-time chat** with emergency contacts during SOS
- **Offline mode** for core safety features
- **Integration with campus security systems**
- **Multi-language support** for international students
- **Improved accessibility features** for users with disabilities

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow React Native best practices
2. **Testing**: Write tests for new features
3. **Documentation**: Update README for new features
4. **Accessibility**: Ensure all features are accessible
5. **Security**: Follow security best practices

### Feature Requests
- Submit issues for bugs or feature requests
- Discuss major changes in pull requests
- Follow the established design patterns
- Test thoroughly before submitting


## 🙏 Acknowledgments

- **Expo Team** for the excellent development platform
- **React Native Community** for the robust mobile framework
- **Campus Safety Experts** for domain knowledge and feedback
- **Open Source Contributors** for the libraries and tools used

---

**SafeU - Making Campus Safety Accessible to Everyone** 🛡️
