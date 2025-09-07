# Safe-U Campus Safety Platform

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

This platform consists of a mobile app for students and an admin console for safety administrators.

## Project Structure

```
Safe-U/
├── Mobile/           # React Native mobile app for students
│   ├── app/         # Expo Router screens
│   ├── components/  # Reusable components
│   ├── assets/      # Images, fonts, icons
│   └── package.json
│
└── AdminConsole/    # Web admin dashboard
    ├── src/         # React + TypeScript source
    ├── public/      # Static assets
    └── package.json
```

## Applications

### 📱 Mobile App (`/Mobile`)
React Native app for students with emergency features:
- SOS emergency system
- FriendWalk safe escort
- Incident reporting
- Campus navigation
- Safety alerts

```powershell
cd Mobile
npm install
npm start
```

### 💻 Admin Console (`/AdminConsole`)
Web dashboard for safety administrators:
- Live session monitoring
- Reports management
- Emergency broadcasts
- Content moderation
- System configuration

```powershell
cd AdminConsole
npm install
npm run dev
```

## Getting Started

1. **Clone the repository**
   ```powershell
   git clone https://github.com/Chance3009/Safe-U
   cd Safe-U
   ```

2. **Setup Mobile App**
   ```powershell
   cd Mobile
   npm install
   npx expo start
   ```

3. **Setup Admin Console**
   ```powershell
   cd AdminConsole
   npm install
   npm run dev
   ```

## Development

Each application has its own dependencies and can be developed independently:

- **Mobile**: Uses Expo development server
- **AdminConsole**: Uses Vite development server

See individual README files in each directory for detailed setup instructions.
