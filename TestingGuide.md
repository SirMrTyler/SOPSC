# Testing Guide

This document explains how to run the application locally, execute any available tests, and verify that Google OAuth works correctly.

## Prerequisites

- Node.js 18+ with Yarn
- Expo CLI (`npm install -g expo-cli`)
- .NET 8 SDK
- SQL Server instance running locally

## Backend Setup

1. Copy `Backend/SOPSC.Api/appsettings.json` to `Backend/SOPSC.Api/appsettings.Development.json` and update the `ConnectionStrings:DefaultConnection` value for your SQL Server.
2. Set a JWT signing key before starting the API:

```bash
export JWT_KEY="<your-secret-key>"
```

3. Start the API:

```bash
cd Backend/SOPSC.Api
 dotnet build
 dotnet run
```

The API listens on `https://localhost:5001` by default.

## Frontend Setup

1. Navigate to the Expo project and install dependencies:

```bash
//--------------------- PACKAGE ---------------// //-- VERSION --//
cd Frontend/sopsc-mobile-app
yarn install
yarn add @babel/core                                : "^7.27.4",
yarn add @expo/config-plugins                       : "~10.0.0",
yarn add @react-native-google-signin/google-signin  : "^15.0.0",
yarn add @react-navigation/native                   : "^7.1.14",
yarn add @react-navigation/native-stack             : "^7.3.21",
yarn add @typescript-eslint/eslint-plugin           : "^8.35.1",
yarn add @typescript-eslint/parser                  : "^8.35.1",
yarn add axios                                      : "^1.10.0",
yarn add eslint                                     : "^9.30.1",
yarn add eslint-plugin-react                        : "^7.37.5",
yarn add expo                                       : "53.0.16",
yarn add expo-crypto                                : "^14.1.5",
yarn add expo-secure-store                          : "^14.2.3",
yarn add install                                    : "^0.13.0",
yarn add react                                      : "19.0.0",
yarn add react-native                               : "0.79.5",
yarn add react-native-gesture-handler               : "~2.24.0",
yarn add react-native-heroicons                     : "^4.0.0",
yarn add react-native-reanimated                    : "~3.17.4",
yarn add react-native-safe-area-context             : "5.4.0",
yarn add react-native-screens                       : "~4.11.1",
yarn add react-native-svg                           : "15.11.2",
yarn add react-native-vector-icons                  : "^10.2.0"

```

2. Ensure the environment variables are defined. Create a `.env.development` file in `Frontend/sopsc-mobile-app` with the following values:

```bash
EXPO_PUBLIC_API_URL=https://localhost:5001/api/
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=<your-google-oauth-client-id>
```

3. Start the Expo development server:

// For Frontend (bash 1 and bash 2) //

```bash 1
cd Frontend/sopsc-mobile-app
npx expo prebuild     // MUST PREBUILD BEFORE RUNNING
npx expo run:android  // For android
npx expo run:ios      // For ios
npx expo run          // For general
```

```bash 2
// Ideally you want to plug your phone in with debug on and install the framework 'scrcpy' to view your phone from your pc.
// You can also use the Expo Go app-can cause eas build issues sometimes-or an emulator to load the project.

cd Frontend/sopsc-mobile-app .. unless installed globally
ngrok http https://localhost:5001

// Then copy the https://abcd-efg-hij-k-lmn.ngrok-free.app Forwarding Address
// Paste that into `.env.development` as EXPO_PUBLIC_API_URL and add '/api/' after.
```

// For API //

1.  In SOPSC/Backend/SOPSC.Api/appsettings.json make sure your GoogleOAuth property is set. Example:
    "GoogleOAuth": {
    "WebClientId": "123456789123-456789abcdefgh123456789abcdefgh.apps.googleusercontent.com"
    },

2.  Press run https and configure address to use (I used localhost:5000 and 5001)

## Running Tests

Commands:

```bash
cd Frontend/sopsc-mobile-app
npx expo-doctor--verbose    // to diagnose any expo/dependency/build issues.
```

## Verifying Google OAuth

1. With both the backend and frontend running, open the app.
2. Tap **Sign In with Google** on the login screen.
3. Complete the Google sign-in flow. Upon success:
   - The Expo console should display the returned user information.
   - The backend logs will show `Token validated successfully!` confirming the JWT was issued.

If any errors occur, check that your Google client ID matches the one configured in the Google Developer Console and that the API URL in `.env.development` points to the running backend.
