import axios from 'axios';
import * as helper from './serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}groupchats`;

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

const getMessages = async (id, pageIndex = 0, pageSize = 20) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'GET',
        url: `${endpoint}/${id}/messages?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const create = async (name, userIds) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'POST',
        url: endpoint,
        data: { name, userIds },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const sendMessage = async (id, messageContent) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'POST',
        url: `${endpoint}/${id}/messages`,
        data: { messageContent },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addMembers = async (id, userIds) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'POST',
        url: `${endpoint}/${id}/members`,
        data: { userIds },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getAll, getMessages, create, sendMessage, addMembers };