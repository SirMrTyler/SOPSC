import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}reports`;

const getReports = async (pageIndex = 0, pageSize = 10) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getById = async (id) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: `${endpoint}/${id}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addReport = async (payload) => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'POST',
    url: endpoint,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getReports, getById, addReport };
