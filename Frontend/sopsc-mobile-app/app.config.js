const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const variant = process.env.APP_VARIANT || 'development';
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV =
    variant === 'development' || variant === 'development' ? 'development' : 'production';
}
// Load environment variables from .env and .env.{variant} if present
const baseEnv = path.resolve(__dirname, '.env');
const variantEnv = path.resolve(__dirname, `.env.${variant}`);
if (fs.existsSync(baseEnv)) {
  dotenv.config({ path: baseEnv });
}
if (fs.existsSync(variantEnv)) {
  // Setting override to true ensures .env.{variant} overrides .env
  dotenv.config({ path: variantEnv, override: true });
}

const IS_DEV = variant === 'development';
const IS_PREVIEW = variant === 'preview';

const getGoogleServiceFileAndroid = () => {
  if (IS_DEV) return "./config/google-services.dev.json";
  return "./firebase/google-services.json";
}

const getUniqueIdentifier = () => {

    if (IS_DEV) return 'com.sirmrtyler.sopscmobileapp.dev';
    if (IS_PREVIEW) return 'com.sirmrtyler.sopscmobileapp.preview';
    
    return 'com.sirmrtyler.sopscmobileapp';
}

const getAppName = () => {
  if (IS_DEV) return 'SOPSC Mobile App (Dev)';
  if (IS_PREVIEW) return 'SOPSC Mobile App (Preview)';

  return 'SOPSC Mobile App';
};

console.log("📦 Package name for this build:", getUniqueIdentifier());

// The parameter config is destructured to copy all existing properties from app.json
export default ({ config }) => ({
  ...config,
  name: getAppName(),

  icon: "./assets/images/app-icon-1024.png",
  // Plugins: notifications, RN Firebase app
  plugins: [
    ...(config.plugins || []),
    "@react-native-firebase/app",
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification_icon_96.png",
        defaultChannel: "default",
      },
    ],
  ],
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
    googleServicesFile: "./firebase/GoogleService-Info.plist",
    icon: "./assets/images/app-icon-1024.png",
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    googleServicesFile: getGoogleServiceFileAndroid(),
  },
  extra: {
    // Originally You Didn't Have This //
    ...(config.extra || {}),
    eas: {
      ...(config.extra?.eas || {}),
      projectId: "a905a038-d584-4e7e-a7f9-cd2091702dc1",
    },
    //---------------------------------//
    APP_VARIANT: variant,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_GOOGLE_CALENDAR_ID: process.env.EXPO_PUBLIC_GOOGLE_CALENDAR_ID,
    EXPO_PUBLIC_GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  },
});
