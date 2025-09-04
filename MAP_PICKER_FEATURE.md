# Map Picker Feature Documentation

## Overview

The Map Picker feature allows users to select a location when creating community posts. It provides multiple ways to select a location and automatically retrieves building names and coordinates.

## Features

### 1. Interactive Map Interface

- **Real Map Display**: Uses OpenStreetMap with Leaflet.js for a full interactive map experience
- **Tap to Select**: Users can tap anywhere on the map to place a marker and select that location
- **Draggable Markers**: Markers can be dragged to fine-tune the exact location selection
- **Zoom and Pan**: Full map controls including zoom, pan, and map type switching
- **Expo Go Compatible**: Uses WebView with web-based mapping, no native dependencies required

### 2. Current Location Detection

- **GPS Integration**: Uses Expo Location API to get the user's current GPS coordinates
- **Permission Handling**: Automatically requests location permissions
- **Reverse Geocoding**: Converts GPS coordinates to human-readable addresses
- **Building Name Detection**: Attempts to identify specific building names from the location data

### 3. Search Functionality

- **Text Search**: Users can type a location name and search for it
- **Forward Geocoding**: Converts location names to coordinates using Expo Location API
- **Auto-navigation**: Automatically centers the grid on searched locations

### 4. Location Information Display

- **Building Name**: Shows the most specific name available (building > street > district > city)
- **Full Address**: Displays complete address information
- **Coordinates**: Shows precise latitude and longitude
- **Google Maps Integration**: "View on Google Maps" button opens the location in the browser

## Technical Implementation

### Components

- **MapPickerScreen**: Main component located at `app/map-picker.tsx`
- **Grid System**: 3x3 touchable grid for location selection
- **Search Interface**: Text input with search functionality
- **Location Display**: Shows selected location information

### Data Flow

1. User opens map picker from Create Post screen
2. System requests location permissions
3. User can:
   - Tap grid cells to select locations
   - Use "Get Current Location" button
   - Search for specific locations
4. Selected location triggers reverse geocoding
5. Location data is sent back to Create Post screen via EventBus
6. Create Post screen displays the selected location

### Event System

- **Event Name**: `locationPicked`
- **Data Format**: `LocationData` object with name, address, coordinates, placeId, and types
- **Integration**: Seamlessly integrates with existing Create Post functionality

## Usage Instructions

### For Users

1. **From Create Post Screen**: Tap "Pick on Map" button
2. **Select Location**:
   - Tap anywhere on the map to place a marker and select that location
   - Drag the marker to fine-tune your selection
   - Use "Get Current Location" for GPS location
   - Search for specific places using the search bar
3. **Review Selection**: Check the location information displayed
4. **Confirm**: Tap "Confirm" to use the selected location
5. **Cancel**: Tap "Cancel" to return without selecting

### For Developers

- The map picker is fully compatible with Expo Go
- No additional native dependencies required
- Uses only Expo Location API for geocoding
- Grid-based approach ensures compatibility across all platforms

## Location Data Structure

```typescript
interface LocationData {
  name: string; // Building name or location identifier
  address: string; // Full address string
  coordinates: {
    // GPS coordinates
    latitude: number;
    longitude: number;
  };
  placeId?: string; // Unique identifier for the location
  types?: string[]; // Location type categories
}
```

## Error Handling

- **Permission Denied**: Shows retry option with clear error message
- **Geocoding Failures**: Falls back to coordinate display
- **Network Issues**: Graceful degradation with user feedback
- **Invalid Searches**: Clear error messages for failed searches

## Future Enhancements

- **Map Integration**: Could be enhanced with actual map display when compatible libraries are available
- **Favorites**: Save frequently used locations
- **Recent Locations**: Quick access to recently selected locations
- **Campus Integration**: Special handling for campus-specific locations
