import axios from 'axios';
import * as helper from '../../serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}messages`;

export interface SendMessageRequest {
  conversationId: string;
  text: string;
  recipientUserIds: number[];
  senderName: string;
}

export const sendMessage = async ({
  conversationId,
  text,
  recipientUserIds,
  senderName,
}: SendMessageRequest): Promise<any> => {
  const token = await helper.getToken();
  const deviceId = await helper.getDeviceId();
  const config = {
    method: 'POST',
    url: endpoint,
    data: { conversationId, text, recipientUserIds, senderName },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      DeviceId: deviceId,
    },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export default { sendMessage };