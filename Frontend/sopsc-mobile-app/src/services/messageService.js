import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}messages}`;

const getAll = () => {
  const config = {
    method: 'GET',
    url: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${helper.getToken()}`,
      DeviceId: helper.getDeviceId(),
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

export { getAll };