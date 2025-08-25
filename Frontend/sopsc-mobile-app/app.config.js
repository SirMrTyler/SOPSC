const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const variant = process.env.APP_VARIANT || 'development';

// Load environment variables from .env and .env.{variant} if present
const baseEnv = path.resolve(__dirname, '.env');
const variantEnv = path.resolve(__dirname, `.env.${variant}`);
if (fs.existsSync(baseEnv)) {
  dotenv.config({ path: baseEnv });
}
if (fs.existsSync(variantEnv)) {
  dotenv.config({ path: variantEnv });
}

const IS_DEV = variant === 'development';
const IS_PREVIEW = variant === 'preview';

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
  plugins: [...(config.plugins || []), "expo-notifications"],
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
    googleServicesFile: "./firebase/GoogleService-Info.plist",
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
    googleServicesFile: "./firebase/google-services.json",
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
