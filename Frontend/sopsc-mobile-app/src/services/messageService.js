import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}messages`;

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

const getConversation = async (otherUserId, pageIndex = 0, pageSize = 20) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'GET',
        url: `${endpoint}/${otherUserId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getAll, getConversation };