import type { ManagerOptions, SocketOptions } from 'socket.io-client';

/**
 * Returns socket.io-client options with ngrok headers to bypass browser warning.
 * Optionally includes userId in the query string.
 */
export function getSocketOptions(userId?: string): Partial<ManagerOptions & SocketOptions> {
  const headers = { 'ngrok-skip-browser-warning': 'true' };
  const options: Partial<ManagerOptions & SocketOptions> = {
    extraHeaders: headers,
    transportOptions: { polling: { extraHeaders: headers } },
  };
  if (userId) {
    options.query = { userId };
  }
  return options;
}
