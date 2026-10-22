# CivicAI Mobile Application (React Native + Expo)

Smarter Cities. Better Lives.

The CivicAI Mobile app runs on React Native with Expo, built for iOS and Android. It directly consumes the same production backend server (`/api/complaints`, `/api/upload`, `/api/gemini/analyze-complaint`, `/api/notifications`, `/api/realtime/events`) as the web application and PWA, establishing a single source of truth across all platforms.

## Prerequisites
- Node.js 18+ and npm
- Expo CLI or Expo Go app on iOS / Android device
- Or Android Studio / Xcode for local simulator execution

## Setup & Running

```bash
cd mobile

# 1. Install dependencies
npm install

# 2. Start the Expo development server
npx expo start
```

- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator
- Or scan the displayed QR code with the **Expo Go** app on your physical smartphone

## Unified Backend Connection
In `mobile/App.tsx`, the server URL is configurable at the top banner. By default, it connects to the CivicAI server URL. For local testing with an emulator, set `serverUrl` to:
- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`
- Physical Device on LAN: `http://<YOUR_LOCAL_IP>:3000`

## Features
- **Citizen Experience**: Instant issue capture, camera/photo selection, Gemini AI vision damage assessment, address geolocation, live tracking.
- **Field Worker Experience**: Assigned task view, status updates (Start Work, Submit Completion Proof), camera evidence uploads.
- **Officer Quick Review**: Complaint overview, triage, and real-time status synchronization.
