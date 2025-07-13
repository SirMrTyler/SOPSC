const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
// const EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
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
  }
});
