import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}users`;

// User login with email/password
const login = (email, password, deviceId) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (deviceId) {
    headers.DeviceId = deviceId;
  }

  const config = {
    method: 'POST',
    url: `${endpoint}/login`,
    data: { email, password },
    headers,
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

// Register user with email/password
const register = async ({firstName, lastName, email, password, passwordConfirm}) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/register`,
    data: { firstName, lastName, email, password, passwordConfirm },
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

// Search users by name
const search = async (query, pageIndex = 0, pageSize = 20) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${encodeURIComponent(query)}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

// Get all users with pagination
const getAll = async (pageIndex = 0, pageSize = 20) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    }
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

export {
  login,
  googleLogin,
  register,
  autoLogin,
  logout,
  getCurrent,
  getAll,
  search,
};
