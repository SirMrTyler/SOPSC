import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import * as helper from './serviceHelpers';

let connection: HubConnection | null = null;

const startConnection = async (): Promise<HubConnection> => {
  if (connection) {
    return connection;
  }
  const token = await helper.getToken();
  connection = new HubConnectionBuilder()
    .withUrl(`${process.env.EXPO_PUBLIC_API_URL}hubs/messages`, {
      accessTokenFactory: () => token || ''
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
  await connection.start();
  return connection;
};

export const connectToMessagesHub = async (onMessage: (msg: any) => void) => {
  const conn = await startConnection();
  conn.on('ReceiveMessage', onMessage);
};

export const stopMessagesHub = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};
