import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}schedule/categories`;

const getAll = async () => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'GET',
    url: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const add = async (payload) => {
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

export { getAll, add };