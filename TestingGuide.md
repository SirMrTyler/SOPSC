diff --git a//dev/null b/TestingGuide.md
index 0000000000000000000000000000000000000000..342932a2c967a5f2f9ae6f75f5bbc4ed0fdb5b14 100644
--- a//dev/null
+++ b/TestingGuide.md
@@ -0,0 +1,44 @@
+# Testing Guide

- +This document explains how to run the SOPSC application locally and verify the Google OAuth sign‑in flow.
- +## Prerequisites
- +- Node.js 18 or later and Yarn
  +- Expo CLI (`npm install -g expo-cli`)
  +- .NET 8 SDK
  +- SQL Server running locally (update connection string in `Backend/SOPSC.Api/appsettings.json` as needed)
- +## Backend Setup
- +1. Set a JWT signing key:
- ```bash

  ```
- export JWT_KEY="<your-secret>"
- ```
  +2. Navigate to the API project and start it:
  ```
- ```bash

  ```
- cd Backend/SOPSC.Api
- dotnet build
- dotnet run
- ```

  ```
- The API listens on `https://localhost:5001` by default.
- +## Frontend Setup
- +1. Navigate to the mobile app:
- ```bash

  ```
- cd Frontend/sopsc-mobile-app
- yarn install
- ```
  +2. Make sure the Google OAuth `webClientId` in `App.tsx` matches the client ID created in the Google Developer Console. Replace the placeholder if necessary.
  +3. Start the Expo development server:
  ```
- ```bash

  ```
- yarn start
- ```
  +4. Use the Expo Go app or an emulator to load the project. Tap **Sign In with Google** and follow the prompts.
  ```
- +## Expected Result
- +- After completing the Google login flow you should see the user information printed in the terminal running Expo.
  +- The backend console logs should show `Token validated successfully!` once JWT integration is completed.
-
