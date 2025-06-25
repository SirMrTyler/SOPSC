import 'dotenv/config';
import appJson from './app.json';

export default ({ config = appJson }) => {
  config.extra = {
    ...(config.extra || {}),
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  };
  return config;
};
