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

    if (IS_DEV) {
        return 'com.sopsc.sopscmobileapp.dev';
    }

    if (IS_PREVIEW) {
        return 'com.sopsc.sopscmobileapp.preview';
    }

    return 'com.sopsc.sopscmobileapp';
}

const getAppName = () => {
  if (IS_DEV) {
    return 'com.sopsc.sopscmobileapp.dev';
  }

  if (IS_PREVIEW) {
    return 'com.sopsc.sopscmobileapp.preview';
  }

  return 'com.sopsc.sopscmobileapp';
};

// The parameter config is destructured to copy all existing properties from app.json
export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
  extra: {
    APP_VARIANT: variant,
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
    EXPO_PUBLIC_GOOGLE_CALENDAR_ID: process.env.EXPO_PUBLIC_GOOGLE_CALENDAR_ID,
    EXPO_PUBLIC_GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  }
});
