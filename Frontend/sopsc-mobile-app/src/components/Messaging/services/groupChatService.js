/**
 * File: groupChatService.js
 * Purpose: Provides API wrappers for group chat operations.
 * Notes: Each call attaches auth token and device identifier headers.
 */
import axios from 'axios';
import * as helper from '../../serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}groupchats`;

/**
 * Fetches all group chat summaries for the current user.
 */
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

/**
 * Retrieves messages for a specific group chat.
 * @param id Group chat identifier
 * @param pageIndex Requested page index
 * @param pageSize Number of messages per page
 */
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

/**
 * Creates a new group chat with the provided name and member list.
 * @param name Display name of the group
 * @param userIds Array of user identifiers to include
 */
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

/**
 * Sends a message to an existing group chat.
 * @param id Group chat identifier
 * @param messageContent Text of the message to send
 */
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

/**
 * Adds new members to an existing group chat.
 * @param id Group chat identifier
 * @param userIds Array of user identifiers to add
 */
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

/**
 * Retrieves member details for a given group chat.
 * @param id Group chat identifier
 */
const getMembers = async (id) => {
    const token = await helper.getToken();
    const deviceId = await helper.getDeviceId();
    const config = {
        method: 'GET',
        url: `${endpoint}/${id}/members`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            DeviceId: deviceId,
        },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getAll, getMessages, create, sendMessage, addMembers, getMembers };