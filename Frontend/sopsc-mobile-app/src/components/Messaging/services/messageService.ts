import axios from 'axios';
import * as helper from '../../serviceHelpers';

const endpoint = `${process.env.EXPO_PUBLIC_API_URL}messages`;

export interface SendMessageRequest {
  chatId: number;
  recipientId: number;
  messageContent: string;
}

export const sendMessage = async ({
  chatId,
  recipientId,
  messageContent,
}: SendMessageRequest): Promise<any> => {
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

export default { sendMessage };