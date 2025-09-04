# Expo Go Setup Guide

This project has been configured to work with **Expo Go** without requiring Android Studio or custom development builds.

## Changes Made for Expo Go Compatibility

### 1. Removed Incompatible Packages

- ❌ `react-native-maps` - Requires custom native code
- ❌ `react-native-webview` - Requires custom native code
- ❌ `expo-maps` - Not available in Expo Go

### 2. Replaced with Expo Go Compatible Alternatives

- ✅ `expo-location` - For GPS location access
- ✅ `expo-web-browser` - For opening external maps
- ✅ `expo-linking` - For deep linking

### 3. Updated Components

#### Map Picker (`app/map-picker.tsx`)

- Replaced complex WebView map with simple location picker
- Uses `expo-location` to get current GPS location
- Uses `expo-web-browser` to open Google Maps in browser
- Provides manual location entry option

#### Campus Bus Tracker (`app/(tabs)/safety/campusBus/index.tsx`)

- Replaced `react-native-maps` with informative placeholder
- Shows bus information without requiring map functionality
- Maintains all other functionality

#### Safe Haven Navigation (`app/(tabs)/safety/safeHaven/navigation.tsx`)

- Already had maps commented out
- Works with Expo Go

### 4. Configuration Updates

- ✅ `app.json` - Removed Google Maps API keys
- ✅ `android/gradle.properties` - Set to use JSC engine
- ✅ `package.json` - Updated scripts for Expo Go

## How to Run

1. **Install Expo Go** on your mobile device from:

   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server:**

   ```bash
   npx expo start
   ```

3. **Scan the QR code** with:
   - **iOS**: Use the built-in Camera app
   - **Android**: Use the Expo Go app

## Features Available in Expo Go

✅ **Working Features:**

- SOS Emergency system
- Community posts and reports
- Safety knowledge base
- Profile management
- Location-based features (GPS)
- Push notifications
- Audio recording
- Image picker
- Haptic feedback

⚠️ **Limited Features:**

- Map views show placeholders instead of interactive maps
- External maps open in browser instead of in-app
- Some advanced native features may be limited

## Upgrading to Full App

To get full map functionality and other native features, you can create a development build:

```bash
npx expo install expo-dev-client
npx expo run:android  # or npx expo run:ios
```

This will create a custom development build that includes all native modules.
