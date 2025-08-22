import { useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = (user: any) => {
  useEffect(() => {
    if (!user) return;

    async function register() {
      if (!Device.isDevice) return;

      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const expoToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "a905a038-d584-4e7e-a7f9-cd2091702dc1",
        })
      ).data;
      console.log("Expo token:", expoToken);

      const deviceToken = await Notifications.getDevicePushTokenAsync();
      console.log("Device token:", deviceToken);
      // TODO: send tokens to backend
    }

    register();
  }, [user]);
};