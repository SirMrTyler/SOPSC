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

const getConversation = async (chatId, pageIndex = 0, pageSize = 20) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'GET',
        url: `${endpoint}/${chatId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const send = async (chatId, messageContent, recipientId) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'POST',
        url: endpoint,
        data: { chatId, recipientId, messageContent },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteMessages = async (messageIds) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'DELETE',
        url: endpoint,
        data: { messageIds },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteConversation = async (chatId) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'DELETE',
        url: `${endpoint}/conversation/${chatId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const updateReadStatus = async (messageId, isRead) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'PUT',
        url: `${endpoint}/${messageId}/read?isRead=${isRead}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getAll, getConversation, send, deleteMessages, deleteConversation, updateReadStatus };