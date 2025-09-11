import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { setPendingUrl } from '../navigation/intentQueue';

type TapData = {
  url?: string;
  conversationId?: string | number;
};

const stashDeepLink = (
  response: Notifications.NotificationResponse | null,
): void => {
  if (!response) return;

  const data =
    (response.notification.request.content.data as TapData) || {};

  if (typeof data.url === 'string') {
    setPendingUrl(data.url);
  } else if (data.conversationId !== undefined && data.conversationId !== null) {
    const chatUrl = Linking.createURL(`chat/${data.conversationId}`);
    setPendingUrl(chatUrl);
  }
};

export const installNotificationTapHandling = (): Notifications.Subscription => {
  Notifications.getLastNotificationResponseAsync().then(stashDeepLink);
  return Notifications.addNotificationResponseReceivedListener(stashDeepLink);
};