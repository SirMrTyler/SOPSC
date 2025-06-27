import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}users`;

// User login with email/password
const login = (email, password) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/login`,
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

// Google Sign-In login
const googleLogin = (idToken) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/google`,
    data: { idToken },
    headers: { 'Content-Type': 'application/json' },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

// Auto-login with deviceId
const autoLogin = (deviceId) => {
  const config = {
    method: 'GET',
    url: `${endpoint}/auto-login`,
    headers: {
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getCurrent = (token, deviceId) => {
  const config = {
    method: 'GET',
    url: `${endpoint}/current`,
    headers: {
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

// Logout user
const logout = (token, deviceId) => {
  const config = {
    method: 'GET',
    url: `${endpoint}/logout`,
    headers: {
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export {
  login,
  googleLogin,
  autoLogin,
  logout,
  getCurrent,
};
