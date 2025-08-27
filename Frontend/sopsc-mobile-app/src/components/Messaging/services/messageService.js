/**
 * File: messageService.js
 * Purpose: Wraps HTTP requests for individual message operations.
 * Notes: Relies on service helper for token and device id headers.
 */
import axios from 'axios';
import * as helper from '../../serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}messages`;

/**
 * Retrieves all conversations for the authenticated user.
 * @returns Promise resolving to a list of conversations
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
 * Fetches a single conversation's messages with pagination.
 * @param chatId Conversation identifier
 * @param pageIndex Page index to retrieve
 * @param pageSize Number of messages per page
 */
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

/**
 * Sends a new direct message.
 * @param chatId Conversation identifier
 * @param messageContent Message text
 * @param recipientId Recipient user id
 */
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

/**
 * Deletes a set of messages by id.
 * @param messageIds Array of message ids to remove
 */
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

/**
 * Removes an entire conversation thread.
 * @param chatId Conversation identifier
 */
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

/**
 * Updates the read status for a single message.
 * @param messageId Message identifier
 * @param isRead Desired read state
 */
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