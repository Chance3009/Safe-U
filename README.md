# SafeU - Campus Safety App v1.4.0

A comprehensive campus safety mobile application built with React Native and Expo that provides emergency response, safe navigation, incident reporting, and community safety features.

## 🚨 Features

### 1. Emergency SOS System
- **One-tap SOS button** - Large, prominent emergency button accessible from anywhere
- **Voice activation** - "Help me" phrase detection for hands-free operation
- **Session management** - Password-protected emergency sessions with live tracking
- **Quick actions** - Call security, share location, record audio/video
- **Emergency contacts** - Immediate notification to trusted friends and family

### 2. FriendWalk (Safe Escort)
- **Route planning** - Set from → to locations with safety preferences
- **Friend selection** - Choose trusted contacts to escort you
- **Real-time tracking** - Live location sharing and check-ins
- **Route deviation alerts** - Notifications if you stray from planned route
- **Timer management** - Automatic alerts for missed check-ins

### 3. Incident Reporting
- **Voice reporting** - Hold-to-talk incident reporting with AI processing
- **Manual forms** - Text, image, and video uploads with location pinning
- **Category selection** - Security, harassment, facility, suspicious activity
- **Anonymous options** - Submit reports without revealing identity
- **Status tracking** - Monitor report progress from submission to resolution

### 4. Safety Navigation
- **AI-powered routing** - Safe route optimization based on real-time data
- **Campus bus tracking** - Real-time schedules and "last bus" alerts
- **Safe point identification** - Guard posts, 24-hour facilities, well-lit areas
- **Route alternatives** - Dynamic suggestions for safer paths

### 5. Community Safety Network
- **Friends network** - Manage trusted contacts and safety circles
- **Community tips** - Vote on helpful safety information
- **Safety resources** - Quick access to campus security and support services
- **Anti-harassment tools** - Specialized support and educational content

### 6. Alert System
- **Emergency broadcasts** - Geo-targeted alerts to users in affected areas
- **Personal notifications** - Friend check-ins, route deviations, safety reminders
- **Safety bulletins** - Official campus security updates and procedures
- **Weather alerts** - Environmental safety information and warnings

## 🛠️ Technical Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router with tab-based navigation
- **Icons**: Expo Vector Icons (Ionicons)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: React Native StyleSheet with dark/light theme support
- **Platform**: Cross-platform (iOS, Android, Web)

## 📱 App Structure

```
SafeU App
├── SOS Tab (Primary)
│   ├── Emergency SOS Button
│   ├── Quick Actions
│   └── Emergency Contacts
├── Safety Tab
│   ├── FriendWalk System
│   ├── Safety Navigation
│   └── Safety Check-ins
├── Report Tab
│   ├── Voice Reporting
│   ├── Manual Forms
│   └── Report Status
├── Community Tab
│   ├── Friends Network
│   ├── Safety Tips
│   ├── Resources
│   └── Anti-Harassment Tools
├── Alerts Tab
│   ├── Emergency Alerts
│   ├── Personal Notifications
│   ├── Safety Bulletins
│   └── Weather Information
└── Profile Tab
    ├── User Profile
    ├── Privacy Settings
    ├── Emergency Contacts
    └── App Settings
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safeu
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Make sure you have the specified Node version**
   ```bash
   nvm use
   # if you don't have the same version, please install the exact same version
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

### Development Commands

```bash
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

### Phase 2 Features
- **AI-powered threat detection** using device sensors
- **Predictive safety analytics** based on historical data
- **Integration with campus IoT devices** (smart lighting, cameras)
- **Advanced biometric verification** for emergency situations
- **Blockchain-based incident verification** for community reports

### Phase 3 Features
- **AR safety overlay** for real-time environmental information
- **Drone integration** for emergency response
- **Smart campus integration** with building management systems
- **International campus support** with multi-language features

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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team** for the excellent development platform
- **React Native Community** for the robust mobile framework
- **Campus Safety Experts** for domain knowledge and feedback
- **Open Source Contributors** for the libraries and tools used

## 📞 Support

For support, questions, or feature requests:

- **Email**: support@safeu.app
- **Documentation**: [docs.safeu.app](https://docs.safeu.app)
- **Issues**: [GitHub Issues](https://github.com/safeu/app/issues)
- **Discord**: [SafeU Community](https://discord.gg/safeu)

---

**SafeU - Making Campus Safety Accessible to Everyone** 🛡️
